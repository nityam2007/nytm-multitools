/**
 * Runs qpdf jobs. The wasm binary is fetched and compiled once; every job
 * then gets its own fresh instance (instantiating a precompiled
 * `WebAssembly.Module` costs ~1 ms). Fresh instances matter for
 * correctness, not just isolation: qpdf keeps global state across
 * `callMain` calls — e.g. its logger refuses to redirect stdout once
 * stdout has been used — so a long-lived instance eventually breaks.
 * They also make jobs safely concurrent.
 *
 * stdout/stderr are captured at the byte level via FS.init so that
 * commands emitting binary output (e.g. --show-attachment) round-trip
 * losslessly.
 */
export class QpdfRunner {
    compiled;
    createModule;
    constructor(compiled, createModule) {
        this.compiled = compiled;
        this.createModule = createModule;
    }
    static async create(options = {}) {
        const { default: createQpdfModule } = await import('./wasm/qpdf.js');
        // A caller-provided module skips fetch + compile — mandatory on
        // platforms that forbid runtime wasm compilation (Cloudflare Workers).
        const compiled = options.wasmModule ??
            (await WebAssembly.compile(await loadWasmBytes(resolveWasmUrl(options.wasmUrl))));
        return new QpdfRunner(compiled, createQpdfModule);
    }
    /**
     * Run one or more qpdf invocations against a fresh instance, with
     * `inputs` staged as numbered files in a MEMFS working directory.
     */
    async run(inputs, job) {
        const stagedInputs = await Promise.all(inputs.map(toBytes));
        const stdoutBytes = [];
        const stderrBytes = [];
        // moduleArg doubles as the Module object, so by the time preRun fires
        // (the documented place to call FS.init) its FS property is populated.
        const moduleArg = {
            preRun: [
                () => {
                    moduleArg.FS.init(null, (byte) => {
                        if (byte !== null)
                            stdoutBytes.push(byte);
                    }, (byte) => {
                        if (byte !== null)
                            stderrBytes.push(byte);
                    });
                },
            ],
            instantiateWasm: (imports, onSuccess) => {
                WebAssembly.instantiate(this.compiled, imports).then((instance) => onSuccess(instance, this.compiled));
                return {};
            },
        };
        const module = await withNodeDetectionDisabledInWorkers(() => this.createModule(moduleArg));
        const dir = '/job';
        module.FS.mkdir(dir);
        const inputPaths = stagedInputs.map((bytes, i) => {
            const path = `${dir}/in${i}.pdf`;
            module.FS.writeFile(path, bytes);
            return path;
        });
        const exec = (args) => {
            stdoutBytes.length = 0;
            stderrBytes.length = 0;
            let exitCode;
            try {
                exitCode = module.callMain(args);
            }
            catch (e) {
                // qpdf may terminate via exit(); Emscripten surfaces that as an
                // ExitStatus throw when EXIT_RUNTIME=0.
                if (isExitStatus(e)) {
                    exitCode = e.status;
                }
                else {
                    throw e;
                }
            }
            const stdout = new Uint8Array(stdoutBytes);
            return {
                exitCode: exitCode ?? 0,
                stdout,
                stdoutText: decoder.decode(stdout),
                stderr: decoder.decode(new Uint8Array(stderrBytes)),
            };
        };
        // The instance (and its MEMFS) is discarded afterwards, so no cleanup.
        return job({ dir, inputPaths, exec, fs: module.FS });
    }
}
const decoder = new TextDecoder();
/**
 * `navigator.userAgent` is `'Cloudflare-Workers'` in the Workers runtime,
 * regardless of the `nodejs_compat` compatibility flag — unlike
 * `process`, which `nodejs_compat` polyfills.
 */
const isCloudflareWorkers = typeof navigator !== 'undefined' && navigator.userAgent === 'Cloudflare-Workers';
/**
 * qpdf's Emscripten-generated wasm glue picks its code path by checking
 * `globalThis.process?.versions?.node`. Cloudflare Workers' `nodejs_compat`
 * flag polyfills `process` (including `versions.node`) for compatibility
 * with npm packages that expect it — which makes the glue's environment
 * check misidentify the Workers runtime as real Node.js. That path calls
 * `createRequire(import.meta.url)`, which throws in a bundled Worker
 * because there's no real `file:` URL to resolve.
 *
 * Real Node.js has no `navigator`, so this only ever hides `process`
 * inside the Workers runtime — never in an actual Node.js process.
 */
async function withNodeDetectionDisabledInWorkers(fn) {
    const globals = globalThis;
    if (!isCloudflareWorkers || typeof globals.process === 'undefined')
        return fn();
    const realProcess = globals.process;
    delete globals.process;
    try {
        return await fn();
    }
    finally {
        globals.process = realProcess;
    }
}
function resolveWasmUrl(wasmUrl) {
    if (wasmUrl === undefined)
        return new URL('./wasm/qpdf.wasm', import.meta.url);
    if (wasmUrl instanceof URL)
        return wasmUrl;
    // Resolve strings against the page when in a browser, else this module.
    const base = typeof location !== 'undefined' && typeof location.href === 'string'
        ? location.href
        : import.meta.url;
    return new URL(wasmUrl, base);
}
async function loadWasmBytes(url) {
    if (url.protocol === 'file:') {
        // Computed specifier so browser bundlers neither resolve nor include
        // the Node-only module; this branch can only execute under Node.
        const { readFile } = (await import('node' + ':fs/promises'));
        return new Uint8Array(await readFile(url));
    }
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch qpdf.wasm from ${url}: HTTP ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
}
function isExitStatus(e) {
    return (typeof e === 'object' &&
        e !== null &&
        e.name === 'ExitStatus' &&
        typeof e.status === 'number');
}
export async function toBytes(input) {
    if (input instanceof Uint8Array)
        return input;
    if (input instanceof ArrayBuffer)
        return new Uint8Array(input);
    if (typeof Blob !== 'undefined' && input instanceof Blob) {
        return new Uint8Array(await input.arrayBuffer());
    }
    throw new TypeError('Unsupported PDF input: expected Uint8Array, ArrayBuffer, or Blob');
}
