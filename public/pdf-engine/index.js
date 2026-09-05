import { QpdfRunner, toBytes } from './runner.js';
import { PdfError, PdfPasswordError } from './errors.js';
export { PdfError, PdfPasswordError } from './errors.js';
export { imagesToPdf } from './images.js';
/**
 * A PDF toolkit backed by qpdf compiled to WebAssembly. All operations run
 * locally (browser, worker, or Node) — documents never leave the device.
 *
 * Create one with {@link createPdfToolkit} and reuse it; instantiation loads
 * and compiles the wasm binary once.
 */
export class PdfToolkit {
    runner;
    constructor(runner) {
        this.runner = runner;
    }
    /** @internal — use {@link createPdfToolkit}. */
    static async create(options = {}) {
        return new PdfToolkit(await QpdfRunner.create(options));
    }
    /**
     * Decrypt an encrypted PDF, producing a copy with no password and no
     * usage restrictions.
     */
    unlock(pdf, options) {
        return this.transform(pdf, [passwordArg(options.password), '--decrypt']);
    }
    /**
     * Alias of {@link unlock}: removes the password and all restrictions.
     */
    removePassword(pdf, options) {
        return this.unlock(pdf, options);
    }
    /**
     * Encrypt a PDF with a password (AES-256 by default) and optional
     * usage restrictions.
     */
    lock(pdf, options) {
        return this.transform(pdf, encryptArgs(options));
    }
    /**
     * Change the password of an encrypted PDF (decrypts with the current
     * password and re-encrypts with the new one in a single pass).
     */
    changePassword(pdf, options) {
        const lockOptions = {
            userPassword: options.newPassword,
            ownerPassword: options.newOwnerPassword ?? options.newPassword,
            ...(options.keyLength !== undefined && { keyLength: options.keyLength }),
            ...(options.permissions !== undefined && { permissions: options.permissions }),
        };
        return this.transform(pdf, [
            passwordArg(options.currentPassword),
            ...encryptArgs(lockOptions),
        ]);
    }
    /**
     * Merge multiple PDFs (or page selections from them) into one document,
     * in the order given.
     */
    async merge(sources) {
        if (sources.length === 0) {
            throw new TypeError('merge() needs at least one source document');
        }
        const normalized = sources.map(normalizeSource);
        return this.runner.run(normalized.map((s) => s.data), ({ dir, inputPaths, exec, fs }) => {
            const args = ['--empty', '--pages'];
            normalized.forEach((source, i) => {
                args.push(inputPaths[i]);
                if (source.password !== undefined)
                    args.push(`--password=${source.password}`);
                args.push(source.pages !== undefined ? pagesArg(source.pages) : '1-z');
            });
            const out = `${dir}/out.pdf`;
            args.push('--', out);
            assertOk(exec(args));
            return fs.readFile(out);
        });
    }
    /**
     * Split a PDF into multiple documents of `pagesPerFile` pages each
     * (default 1 — one document per page). Returns the parts in order.
     */
    async split(pdf, options = {}) {
        const per = options.pagesPerFile ?? 1;
        if (!Number.isInteger(per) || per < 1) {
            throw new TypeError(`pagesPerFile must be a positive integer, got ${per}`);
        }
        return this.runner.run([pdf], ({ dir, inputPaths, exec, fs }) => {
            const args = [];
            if (options.password !== undefined)
                args.push(passwordArg(options.password));
            args.push(`--split-pages=${per}`, inputPaths[0], `${dir}/part-%d.pdf`);
            assertOk(exec(args));
            const parts = fs
                .readdir(dir)
                .filter((name) => name.startsWith('part-'))
                .sort((a, b) => partNumber(a) - partNumber(b));
            return parts.map((name) => fs.readFile(`${dir}/${name}`));
        });
    }
    /**
     * Extract a page selection into a new document.
     */
    extractPages(pdf, options) {
        const args = [];
        if (options.password !== undefined)
            args.push(passwordArg(options.password));
        args.push('--pages', '.', pagesArg(options.pages), '--');
        return this.transform(pdf, args);
    }
    /**
     * Rotate pages. Relative to the current rotation by default; pass
     * `absolute: true` to set the exact rotation instead.
     */
    async rotate(pdf, options) {
        const { angle, absolute = false, pages, password } = options;
        if (absolute && angle < 0) {
            throw new TypeError('absolute rotation must use a non-negative angle (90, 180, or 270)');
        }
        const prefix = absolute ? '' : angle < 0 ? '-' : '+';
        const spec = `${prefix}${Math.abs(angle)}${pages !== undefined ? `:${pagesArg(pages)}` : ''}`;
        const args = [];
        if (password !== undefined)
            args.push(passwordArg(password));
        args.push(`--rotate=${spec}`);
        return this.transform(pdf, args);
    }
    /** Number of pages in the document. */
    async pageCount(pdf, options = {}) {
        return this.runner.run([pdf], ({ inputPaths, exec }) => {
            const args = [];
            if (options.password !== undefined)
                args.push(passwordArg(options.password));
            args.push('--show-npages', inputPaths[0]);
            const result = exec(args);
            assertOk(result);
            return Number.parseInt(result.stdoutText.trim(), 10);
        });
    }
    /** Whether the document is encrypted (locked). */
    async isEncrypted(pdf) {
        return this.runner.run([pdf], ({ inputPaths, exec }) => {
            const result = exec(['--is-encrypted', inputPaths[0]]);
            // qpdf exit codes here: 0 = encrypted, 2 = not encrypted.
            if (result.exitCode === 0)
                return true;
            if (result.exitCode === 2)
                return false;
            throw toPdfError(result);
        });
    }
    /**
     * Whether opening the document requires a password. `false` for
     * unencrypted files and for files encrypted with an empty user password.
     */
    async requiresPassword(pdf) {
        return this.runner.run([pdf], ({ inputPaths, exec }) => {
            const result = exec(['--requires-password', inputPaths[0]]);
            // 0 = password required, 2 = not encrypted,
            // 3 = encrypted but opens without a password.
            if (result.exitCode === 0)
                return true;
            if (result.exitCode === 2 || result.exitCode === 3)
                return false;
            throw toPdfError(result);
        });
    }
    /**
     * Shrink a PDF by recompressing streams and packing objects into
     * object streams. Lossless — image data is not resampled.
     */
    compress(pdf, options = {}) {
        const { password, compressionLevel = 9, objectStreams = true, linearize = false } = options;
        if (!Number.isInteger(compressionLevel) || compressionLevel < 1 || compressionLevel > 9) {
            throw new TypeError(`compressionLevel must be 1-9, got ${compressionLevel}`);
        }
        const args = [];
        if (password !== undefined)
            args.push(passwordArg(password));
        args.push('--compress-streams=y', '--recompress-flate', `--compression-level=${compressionLevel}`, `--object-streams=${objectStreams ? 'generate' : 'preserve'}`);
        if (linearize)
            args.push('--linearize');
        return this.transform(pdf, args);
    }
    /**
     * Linearize for "fast web view": browsers can render the first page
     * while the rest of the file is still downloading.
     */
    linearize(pdf, options = {}) {
        const args = [];
        if (options.password !== undefined)
            args.push(passwordArg(options.password));
        args.push('--linearize');
        return this.transform(pdf, args);
    }
    /**
     * Rewrite a damaged PDF. qpdf reconstructs the cross-reference table
     * and repairs recoverable structural problems; unrecoverable files
     * reject with `PdfError`.
     */
    repair(pdf, options = {}) {
        const args = [];
        if (options.password !== undefined)
            args.push(passwordArg(options.password));
        return this.transform(pdf, args);
    }
    /**
     * Stamp pages of one PDF onto another — watermarks, letterheads,
     * "CONFIDENTIAL" overlays. By default stamp page N goes onto document
     * page N until the stamp runs out; pass `repeat` to tile stamp pages
     * across the rest (e.g. `repeat: 1` for a single-page watermark).
     */
    async watermark(pdf, stamp, options = {}) {
        const { mode = 'overlay', password, stampPassword, to, from, repeat } = options;
        return this.runner.run([pdf, stamp], ({ dir, inputPaths, exec, fs }) => {
            const args = [];
            if (password !== undefined)
                args.push(passwordArg(password));
            args.push(`--${mode}`, inputPaths[1]);
            if (stampPassword !== undefined)
                args.push(`--password=${stampPassword}`);
            if (to !== undefined)
                args.push(`--to=${pagesArg(to)}`);
            if (from !== undefined)
                args.push(`--from=${pagesArg(from)}`);
            if (repeat !== undefined)
                args.push(`--repeat=${pagesArg(repeat)}`);
            const out = `${dir}/out.pdf`;
            args.push('--', inputPaths[0], out);
            assertOk(exec(args));
            return fs.readFile(out);
        });
    }
    /**
     * Remove a page selection, keeping everything else.
     */
    deletePages(pdf, options) {
        // qpdf's exclusion syntax: groups prefixed with x subtract from the
        // preceding group, so "1-z,x3,x5-6" is "all pages except 3 and 5-6".
        const exclusions = pagesArg(options.pages)
            .split(',')
            .map((group) => `x${group}`)
            .join(',');
        const extractOptions = {
            pages: `1-z,${exclusions}`,
            ...(options.password !== undefined && { password: options.password }),
        };
        return this.extractPages(pdf, extractOptions);
    }
    /** Reverse the page order. */
    reversePages(pdf, options = {}) {
        return this.extractPages(pdf, { pages: 'z-1', ...options });
    }
    /**
     * Interleave pages from multiple documents — page 1 of each, then
     * page 2 of each, and so on (or groups of `groupSize` pages). Useful
     * for combining separately scanned fronts and backs.
     */
    async collate(sources, options = {}) {
        const groupSize = options.groupSize ?? 1;
        if (!Number.isInteger(groupSize) || groupSize < 1) {
            throw new TypeError(`groupSize must be a positive integer, got ${groupSize}`);
        }
        if (sources.length < 2) {
            throw new TypeError('collate() needs at least two source documents');
        }
        const normalized = sources.map(normalizeSource);
        return this.runner.run(normalized.map((s) => s.data), ({ dir, inputPaths, exec, fs }) => {
            const args = ['--empty', `--collate=${groupSize}`, '--pages'];
            normalized.forEach((source, i) => {
                args.push(inputPaths[i]);
                if (source.password !== undefined)
                    args.push(`--password=${source.password}`);
                args.push(source.pages !== undefined ? pagesArg(source.pages) : '1-z');
            });
            const out = `${dir}/out.pdf`;
            args.push('--', out);
            assertOk(exec(args));
            return fs.readFile(out);
        });
    }
    /**
     * Flatten annotations and form fields into the page content, freezing
     * their appearance — useful before printing, splitting, or sharing.
     */
    flatten(pdf, options = {}) {
        const args = [];
        if (options.password !== undefined)
            args.push(passwordArg(options.password));
        args.push('--generate-appearances', `--flatten-annotations=${options.annotations ?? 'all'}`);
        return this.transform(pdf, args);
    }
    /** Attach a file to the PDF (embedded-files table). */
    async addAttachment(pdf, options) {
        const { data, name, mimeType, description, password } = options;
        return this.runner.run([pdf], async ({ dir, inputPaths, exec, fs }) => {
            const attachmentPath = `${dir}/${sanitizeName(name)}`;
            fs.writeFile(attachmentPath, await toBytes(data));
            const args = [];
            if (password !== undefined)
                args.push(passwordArg(password));
            args.push('--add-attachment', attachmentPath, `--key=${name}`, `--filename=${name}`);
            if (mimeType !== undefined)
                args.push(`--mimetype=${mimeType}`);
            if (description !== undefined)
                args.push(`--description=${description}`);
            const out = `${dir}/out.pdf`;
            args.push('--', inputPaths[0], out);
            assertOk(exec(args));
            return fs.readFile(out);
        });
    }
    /** Remove an attachment by name. */
    removeAttachment(pdf, options) {
        const args = [];
        if (options.password !== undefined)
            args.push(passwordArg(options.password));
        args.push(`--remove-attachment=${options.name}`);
        return this.transform(pdf, args);
    }
    /** Extract an attachment's content. */
    async getAttachment(pdf, options) {
        return this.runner.run([pdf], ({ inputPaths, exec }) => {
            const args = [];
            if (options.password !== undefined)
                args.push(passwordArg(options.password));
            args.push(`--show-attachment=${options.name}`, inputPaths[0]);
            const result = exec(args);
            assertOk(result);
            return result.stdout;
        });
    }
    /** List the PDF's attachments. */
    async listAttachments(pdf, options = {}) {
        const info = await this.getInfo(pdf, options);
        return info.attachments;
    }
    /**
     * Inspect a document: PDF version, page count, encryption details
     * (scheme, matched passwords, permissions), and attachments.
     */
    async getInfo(pdf, options = {}) {
        return this.runner.run([pdf], ({ inputPaths, exec, fs }) => {
            const passwordArgs = options.password !== undefined ? [passwordArg(options.password)] : [];
            // Single invocation: qpdf's --json mode redirects informational
            // output to stderr for the rest of the instance's life, so a
            // follow-up --show-npages would print to the wrong stream.
            const jsonResult = exec([
                ...passwordArgs,
                '--json',
                '--json-key=encrypt',
                '--json-key=attachments',
                '--json-key=pages',
                inputPaths[0],
            ]);
            assertOk(jsonResult);
            const json = JSON.parse(jsonResult.stdoutText);
            // The header is authoritative enough here: qpdf validated the file
            // in the --json run above, and header-vs-catalog /Version
            // mismatches are vanishingly rare.
            const header = new TextDecoder('latin1').decode(fs.readFile(inputPaths[0]).slice(0, 1024));
            const pdfVersion = /%PDF-(\d+\.\d+)/.exec(header)?.[1] ?? 'unknown';
            const attachments = Object.entries(json.attachments ?? {}).map(([name, a]) => ({
                name,
                ...(a.preferredname !== undefined && { filename: a.preferredname }),
                ...(a.description !== undefined && { description: a.description }),
            }));
            const encrypt = json.encrypt;
            const info = {
                pdfVersion,
                pageCount: json.pages?.length ?? 0,
                encrypted: encrypt?.encrypted ?? false,
                attachments,
            };
            if (encrypt?.encrypted) {
                const c = encrypt.capabilities ?? {};
                info.encryption = {
                    bits: encrypt.parameters?.bits ?? 0,
                    method: encrypt.parameters?.method ?? 'unknown',
                    userPasswordMatched: encrypt.userpasswordmatched ?? false,
                    ownerPasswordMatched: encrypt.ownerpasswordmatched ?? false,
                    permissions: {
                        accessibility: c.accessibility ?? false,
                        extract: c.extract ?? false,
                        print: (c.printhigh ?? c.printlow) ?? false,
                        modify: c.modify ?? false,
                        annotate: c.modifyannotations ?? false,
                        fillForms: c.modifyforms ?? false,
                        assemble: c.modifyassembly ?? false,
                    },
                };
            }
            return info;
        });
    }
    /**
     * Escape hatch: run qpdf with arbitrary CLI arguments. Input documents
     * are staged as `in0.pdf`, `in1.pdf`, … in the working directory; write
     * your output to `out.pdf`. Placeholders `$in0`, `$in1`, …, `$out` in
     * `args` are replaced with the real paths.
     */
    async raw(inputs, args) {
        return this.runner.run(inputs, ({ dir, inputPaths, exec, fs }) => {
            const out = `${dir}/out.pdf`;
            const resolved = args.map((a) => a.replace(/\$out/g, out).replace(/\$in(\d+)/g, (_, i) => {
                const path = inputPaths[Number(i)];
                if (path === undefined)
                    throw new TypeError(`no input for placeholder $in${i}`);
                return path;
            }));
            assertOk(exec(resolved));
            return fs.readFile(out);
        });
    }
    /** Run a single-input → single-output qpdf transform. */
    async transform(pdf, extraArgs) {
        return this.runner.run([pdf], ({ dir, inputPaths, exec, fs }) => {
            const out = `${dir}/out.pdf`;
            assertOk(exec([...extraArgs, inputPaths[0], out]));
            return fs.readFile(out);
        });
    }
}
/**
 * Load the qpdf WebAssembly module and return a ready-to-use toolkit.
 * Loads ~2 MB of wasm on first call; reuse the returned instance.
 */
export function createPdfToolkit(options = {}) {
    return PdfToolkit.create(options);
}
function normalizeSource(s) {
    return typeof s === 'object' && s !== null && 'data' in s ? s : { data: s };
}
/** MEMFS staging name for an attachment; the real name goes in --key/--filename. */
function sanitizeName(name) {
    return name.replace(/[^\w.-]/g, '_') || 'attachment';
}
function partNumber(name) {
    return Number.parseInt(name.replace(/^part-/, ''), 10);
}
function passwordArg(password) {
    return `--password=${password}`;
}
function pagesArg(pages) {
    if (typeof pages === 'number')
        return String(pages);
    if (typeof pages === 'string')
        return pages;
    return pages.map(String).join(',');
}
function encryptArgs(options) {
    const { userPassword, ownerPassword = userPassword, keyLength = 256, permissions = {}, } = options;
    const args = [];
    // qpdf (correctly) refuses to write RC4 files unless explicitly allowed.
    if (keyLength === 40)
        args.push('--allow-weak-crypto');
    args.push('--encrypt', `--user-password=${userPassword}`, `--owner-password=${ownerPassword}`, `--bits=${keyLength}`);
    if (keyLength === 128)
        args.push('--use-aes=y');
    const { print, modify, extract, accessibility } = permissions;
    if (keyLength === 40) {
        // The legacy scheme only has y/n switches.
        if (print !== undefined)
            args.push(`--print=${print === 'none' ? 'n' : 'y'}`);
        if (modify !== undefined)
            args.push(`--modify=${modify === 'none' ? 'n' : 'y'}`);
        if (extract !== undefined)
            args.push(`--extract=${extract ? 'y' : 'n'}`);
    }
    else {
        if (print !== undefined)
            args.push(`--print=${print}`);
        if (modify !== undefined)
            args.push(`--modify=${modify}`);
        if (extract !== undefined)
            args.push(`--extract=${extract ? 'y' : 'n'}`);
        if (accessibility !== undefined)
            args.push(`--accessibility=${accessibility ? 'y' : 'n'}`);
    }
    args.push('--');
    return args;
}
/** Exit code 0 is success; 3 is success with warnings. Anything else throws. */
function assertOk(result) {
    if (result.exitCode === 0 || result.exitCode === 3)
        return;
    throw toPdfError(result);
}
function toPdfError(result) {
    const stderr = result.stderr.trim();
    const message = stderr.split('\n').at(-1) ?? `qpdf failed with exit code ${result.exitCode}`;
    if (/invalid password|password.*(required|incorrect)/i.test(stderr)) {
        return new PdfPasswordError(message, result.exitCode, stderr);
    }
    return new PdfError(message, result.exitCode, stderr);
}
