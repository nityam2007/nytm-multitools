const RUNTIME_PUBLIC_PATH = "server/chunks/ssr/[turbopack]_runtime.js";
const RELATIVE_ROOT_PATH = "..";
const ASSET_PREFIX = "/_next/";
/**
 * This file contains runtime types and functions that are shared between all
 * TurboPack ECMAScript runtimes.
 *
 * It will be prepended to the runtime code of each runtime.
 */ /* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="./runtime-types.d.ts" />
const REEXPORTED_OBJECTS = new WeakMap();
/**
 * Constructs the `__turbopack_context__` object for a module.
 */ function Context(module, exports) {
    this.m = module;
    // We need to store this here instead of accessing it from the module object to:
    // 1. Make it available to factories directly, since we rewrite `this` to
    //    `__turbopack_context__.e` in CJS modules.
    // 2. Support async modules which rewrite `module.exports` to a promise, so we
    //    can still access the original exports object from functions like
    //    `esmExport`
    // Ideally we could find a new approach for async modules and drop this property altogether.
    this.e = exports;
}
const contextPrototype = Context.prototype;
const hasOwnProperty = Object.prototype.hasOwnProperty;
const toStringTag = typeof Symbol !== 'undefined' && Symbol.toStringTag;
function defineProp(obj, name, options) {
    if (!hasOwnProperty.call(obj, name)) Object.defineProperty(obj, name, options);
}
function getOverwrittenModule(moduleCache, id) {
    let module = moduleCache[id];
    if (!module) {
        // This is invoked when a module is merged into another module, thus it wasn't invoked via
        // instantiateModule and the cache entry wasn't created yet.
        module = createModuleObject(id);
        moduleCache[id] = module;
    }
    return module;
}
/**
 * Creates the module object. Only done here to ensure all module objects have the same shape.
 */ function createModuleObject(id) {
    return {
        exports: {},
        error: undefined,
        id,
        namespaceObject: undefined
    };
}
const BindingTag_Value = 0;
/**
 * Adds the getters to the exports object.
 */ function esm(exports, bindings) {
    defineProp(exports, '__esModule', {
        value: true
    });
    if (toStringTag) defineProp(exports, toStringTag, {
        value: 'Module'
    });
    let i = 0;
    while(i < bindings.length){
        const propName = bindings[i++];
        const tagOrFunction = bindings[i++];
        if (typeof tagOrFunction === 'number') {
            if (tagOrFunction === BindingTag_Value) {
                defineProp(exports, propName, {
                    value: bindings[i++],
                    enumerable: true,
                    writable: false
                });
            } else {
                throw new Error(`unexpected tag: ${tagOrFunction}`);
            }
        } else {
            const getterFn = tagOrFunction;
            if (typeof bindings[i] === 'function') {
                const setterFn = bindings[i++];
                defineProp(exports, propName, {
                    get: getterFn,
                    set: setterFn,
                    enumerable: true
                });
            } else {
                defineProp(exports, propName, {
                    get: getterFn,
                    enumerable: true
                });
            }
        }
    }
    Object.seal(exports);
}
/**
 * Makes the module an ESM with exports
 */ function esmExport(bindings, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    module.namespaceObject = exports;
    esm(exports, bindings);
}
contextPrototype.s = esmExport;
function ensureDynamicExports(module, exports) {
    let reexportedObjects = REEXPORTED_OBJECTS.get(module);
    if (!reexportedObjects) {
        REEXPORTED_OBJECTS.set(module, reexportedObjects = []);
        module.exports = module.namespaceObject = new Proxy(exports, {
            get (target, prop) {
                if (hasOwnProperty.call(target, prop) || prop === 'default' || prop === '__esModule') {
                    return Reflect.get(target, prop);
                }
                for (const obj of reexportedObjects){
                    const value = Reflect.get(obj, prop);
                    if (value !== undefined) return value;
                }
                return undefined;
            },
            ownKeys (target) {
                const keys = Reflect.ownKeys(target);
                for (const obj of reexportedObjects){
                    for (const key of Reflect.ownKeys(obj)){
                        if (key !== 'default' && !keys.includes(key)) keys.push(key);
                    }
                }
                return keys;
            }
        });
    }
    return reexportedObjects;
}
/**
 * Dynamically exports properties from an object
 */ function dynamicExport(object, id) {
    let module;
    let exports;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
        exports = module.exports;
    } else {
        module = this.m;
        exports = this.e;
    }
    const reexportedObjects = ensureDynamicExports(module, exports);
    if (typeof object === 'object' && object !== null) {
        reexportedObjects.push(object);
    }
}
contextPrototype.j = dynamicExport;
function exportValue(value, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = value;
}
contextPrototype.v = exportValue;
function exportNamespace(namespace, id) {
    let module;
    if (id != null) {
        module = getOverwrittenModule(this.c, id);
    } else {
        module = this.m;
    }
    module.exports = module.namespaceObject = namespace;
}
contextPrototype.n = exportNamespace;
function createGetter(obj, key) {
    return ()=>obj[key];
}
/**
 * @returns prototype of the object
 */ const getProto = Object.getPrototypeOf ? (obj)=>Object.getPrototypeOf(obj) : (obj)=>obj.__proto__;
/** Prototypes that are not expanded for exports */ const LEAF_PROTOTYPES = [
    null,
    getProto({}),
    getProto([]),
    getProto(getProto)
];
/**
 * @param raw
 * @param ns
 * @param allowExportDefault
 *   * `false`: will have the raw module as default export
 *   * `true`: will have the default property as default export
 */ function interopEsm(raw, ns, allowExportDefault) {
    const bindings = [];
    let defaultLocation = -1;
    for(let current = raw; (typeof current === 'object' || typeof current === 'function') && !LEAF_PROTOTYPES.includes(current); current = getProto(current)){
        for (const key of Object.getOwnPropertyNames(current)){
            bindings.push(key, createGetter(raw, key));
            if (defaultLocation === -1 && key === 'default') {
                defaultLocation = bindings.length - 1;
            }
        }
    }
    // this is not really correct
    // we should set the `default` getter if the imported module is a `.cjs file`
    if (!(allowExportDefault && defaultLocation >= 0)) {
        // Replace the binding with one for the namespace itself in order to preserve iteration order.
        if (defaultLocation >= 0) {
            // Replace the getter with the value
            bindings.splice(defaultLocation, 1, BindingTag_Value, raw);
        } else {
            bindings.push('default', BindingTag_Value, raw);
        }
    }
    esm(ns, bindings);
    return ns;
}
function createNS(raw) {
    if (typeof raw === 'function') {
        return function(...args) {
            return raw.apply(this, args);
        };
    } else {
        return Object.create(null);
    }
}
function esmImport(id) {
    const module = getOrInstantiateModuleFromParent(id, this.m);
    // any ES module has to have `module.namespaceObject` defined.
    if (module.namespaceObject) return module.namespaceObject;
    // only ESM can be an async module, so we don't need to worry about exports being a promise here.
    const raw = module.exports;
    return module.namespaceObject = interopEsm(raw, createNS(raw), raw && raw.__esModule);
}
contextPrototype.i = esmImport;
function asyncLoader(moduleId) {
    const loader = this.r(moduleId);
    return loader(esmImport.bind(this));
}
contextPrototype.A = asyncLoader;
// Add a simple runtime require so that environments without one can still pass
// `typeof require` CommonJS checks so that exports are correctly registered.
const runtimeRequire = // @ts-ignore
typeof require === 'function' ? require : function require1() {
    throw new Error('Unexpected use of runtime require');
};
contextPrototype.t = runtimeRequire;
function commonJsRequire(id) {
    return getOrInstantiateModuleFromParent(id, this.m).exports;
}
contextPrototype.r = commonJsRequire;
/**
 * `require.context` and require/import expression runtime.
 */ function moduleContext(map) {
    function moduleContext(id) {
        if (hasOwnProperty.call(map, id)) {
            return map[id].module();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    }
    moduleContext.keys = ()=>{
        return Object.keys(map);
    };
    moduleContext.resolve = (id)=>{
        if (hasOwnProperty.call(map, id)) {
            return map[id].id();
        }
        const e = new Error(`Cannot find module '${id}'`);
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    };
    moduleContext.import = async (id)=>{
        return await moduleContext(id);
    };
    return moduleContext;
}
contextPrototype.f = moduleContext;
/**
 * Returns the path of a chunk defined by its data.
 */ function getChunkPath(chunkData) {
    return typeof chunkData === 'string' ? chunkData : chunkData.path;
}
function isPromise(maybePromise) {
    return maybePromise != null && typeof maybePromise === 'object' && 'then' in maybePromise && typeof maybePromise.then === 'function';
}
function isAsyncModuleExt(obj) {
    return turbopackQueues in obj;
}
function createPromise() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej)=>{
        reject = rej;
        resolve = res;
    });
    return {
        promise,
        resolve: resolve,
        reject: reject
    };
}
// Load the CompressedmoduleFactories of a chunk into the `moduleFactories` Map.
// The CompressedModuleFactories format is
// - 1 or more module ids
// - a module factory function
// So walking this is a little complex but the flat structure is also fast to
// traverse, we can use `typeof` operators to distinguish the two cases.
function installCompressedModuleFactories(chunkModules, offset, moduleFactories, newModuleId) {
    let i = offset;
    while(i < chunkModules.length){
        let moduleId = chunkModules[i];
        let end = i + 1;
        // Find our factory function
        while(end < chunkModules.length && typeof chunkModules[end] !== 'function'){
            end++;
        }
        if (end === chunkModules.length) {
            throw new Error('malformed chunk format, expected a factory function');
        }
        // Each chunk item has a 'primary id' and optional additional ids. If the primary id is already
        // present we know all the additional ids are also present, so we don't need to check.
        if (!moduleFactories.has(moduleId)) {
            const moduleFactoryFn = chunkModules[end];
            applyModuleFactoryName(moduleFactoryFn);
            newModuleId?.(moduleId);
            for(; i < end; i++){
                moduleId = chunkModules[i];
                moduleFactories.set(moduleId, moduleFactoryFn);
            }
        }
        i = end + 1; // end is pointing at the last factory advance to the next id or the end of the array.
    }
}
// everything below is adapted from webpack
// https://github.com/webpack/webpack/blob/6be4065ade1e252c1d8dcba4af0f43e32af1bdc1/lib/runtime/AsyncModuleRuntimeModule.js#L13
const turbopackQueues = Symbol('turbopack queues');
const turbopackExports = Symbol('turbopack exports');
const turbopackError = Symbol('turbopack error');
function resolveQueue(queue) {
    if (queue && queue.status !== 1) {
        queue.status = 1;
        queue.forEach((fn)=>fn.queueCount--);
        queue.forEach((fn)=>fn.queueCount-- ? fn.queueCount++ : fn());
    }
}
function wrapDeps(deps) {
    return deps.map((dep)=>{
        if (dep !== null && typeof dep === 'object') {
            if (isAsyncModuleExt(dep)) return dep;
            if (isPromise(dep)) {
                const queue = Object.assign([], {
                    status: 0
                });
                const obj = {
                    [turbopackExports]: {},
                    [turbopackQueues]: (fn)=>fn(queue)
                };
                dep.then((res)=>{
                    obj[turbopackExports] = res;
                    resolveQueue(queue);
                }, (err)=>{
                    obj[turbopackError] = err;
                    resolveQueue(queue);
                });
                return obj;
            }
        }
        return {
            [turbopackExports]: dep,
            [turbopackQueues]: ()=>{}
        };
    });
}
function asyncModule(body, hasAwait) {
    const module = this.m;
    const queue = hasAwait ? Object.assign([], {
        status: -1
    }) : undefined;
    const depQueues = new Set();
    const { resolve, reject, promise: rawPromise } = createPromise();
    const promise = Object.assign(rawPromise, {
        [turbopackExports]: module.exports,
        [turbopackQueues]: (fn)=>{
            queue && fn(queue);
            depQueues.forEach(fn);
            promise['catch'](()=>{});
        }
    });
    const attributes = {
        get () {
            return promise;
        },
        set (v) {
            // Calling `esmExport` leads to this.
            if (v !== promise) {
                promise[turbopackExports] = v;
            }
        }
    };
    Object.defineProperty(module, 'exports', attributes);
    Object.defineProperty(module, 'namespaceObject', attributes);
    function handleAsyncDependencies(deps) {
        const currentDeps = wrapDeps(deps);
        const getResult = ()=>currentDeps.map((d)=>{
                if (d[turbopackError]) throw d[turbopackError];
                return d[turbopackExports];
            });
        const { promise, resolve } = createPromise();
        const fn = Object.assign(()=>resolve(getResult), {
            queueCount: 0
        });
        function fnQueue(q) {
            if (q !== queue && !depQueues.has(q)) {
                depQueues.add(q);
                if (q && q.status === 0) {
                    fn.queueCount++;
                    q.push(fn);
                }
            }
        }
        currentDeps.map((dep)=>dep[turbopackQueues](fnQueue));
        return fn.queueCount ? promise : getResult();
    }
    function asyncResult(err) {
        if (err) {
            reject(promise[turbopackError] = err);
        } else {
            resolve(promise[turbopackExports]);
        }
        resolveQueue(queue);
    }
    body(handleAsyncDependencies, asyncResult);
    if (queue && queue.status === -1) {
        queue.status = 0;
    }
}
contextPrototype.a = asyncModule;
/**
 * A pseudo "fake" URL object to resolve to its relative path.
 *
 * When UrlRewriteBehavior is set to relative, calls to the `new URL()` will construct url without base using this
 * runtime function to generate context-agnostic urls between different rendering context, i.e ssr / client to avoid
 * hydration mismatch.
 *
 * This is based on webpack's existing implementation:
 * https://github.com/webpack/webpack/blob/87660921808566ef3b8796f8df61bd79fc026108/lib/runtime/RelativeUrlRuntimeModule.js
 */ const relativeURL = function relativeURL(inputUrl) {
    const realUrl = new URL(inputUrl, 'x:/');
    const values = {};
    for(const key in realUrl)values[key] = realUrl[key];
    values.href = inputUrl;
    values.pathname = inputUrl.replace(/[?#].*/, '');
    values.origin = values.protocol = '';
    values.toString = values.toJSON = (..._args)=>inputUrl;
    for(const key in values)Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        value: values[key]
    });
};
relativeURL.prototype = URL.prototype;
contextPrototype.U = relativeURL;
/**
 * Utility function to ensure all variants of an enum are handled.
 */ function invariant(never, computeMessage) {
    throw new Error(`Invariant: ${computeMessage(never)}`);
}
/**
 * A stub function to make `require` available but non-functional in ESM.
 */ function requireStub(_moduleId) {
    throw new Error('dynamic usage of require is not supported');
}
contextPrototype.z = requireStub;
// Make `globalThis` available to the module in a way that cannot be shadowed by a local variable.
contextPrototype.g = globalThis;
function applyModuleFactoryName(factory) {
    // Give the module factory a nice name to improve stack traces.
    Object.defineProperty(factory, 'name', {
        value: 'module evaluation'
    });
}
/// <reference path="../shared/runtime-utils.ts" />
/// A 'base' utilities to support runtime can have externals.
/// Currently this is for node.js / edge runtime both.
/// If a fn requires node.js specific behavior, it should be placed in `node-external-utils` instead.
async function externalImport(id) {
    let raw;
    try {
        switch (id) {
  case "next/dist/compiled/@vercel/og/index.node.js":
    raw = await import("next/dist/compiled/@vercel/og/index.edge.js");
    break;
  default:
    raw = await import(id);
};
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (raw && raw.__esModule && raw.default && 'default' in raw.default) {
        return interopEsm(raw.default, createNS(raw), true);
    }
    return raw;
}
contextPrototype.y = externalImport;
function externalRequire(id, thunk, esm = false) {
    let raw;
    try {
        raw = thunk();
    } catch (err) {
        // TODO(alexkirsz) This can happen when a client-side module tries to load
        // an external module we don't provide a shim for (e.g. querystring, url).
        // For now, we fail semi-silently, but in the future this should be a
        // compilation error.
        throw new Error(`Failed to load external module ${id}: ${err}`);
    }
    if (!esm || raw.__esModule) {
        return raw;
    }
    return interopEsm(raw, createNS(raw), true);
}
externalRequire.resolve = (id, options)=>{
    return require.resolve(id, options);
};
contextPrototype.x = externalRequire;
/* eslint-disable @typescript-eslint/no-unused-vars */ const path = require('path');
const relativePathToRuntimeRoot = path.relative(RUNTIME_PUBLIC_PATH, '.');
// Compute the relative path to the `distDir`.
const relativePathToDistRoot = path.join(relativePathToRuntimeRoot, RELATIVE_ROOT_PATH);
const RUNTIME_ROOT = path.resolve(__filename, relativePathToRuntimeRoot);
// Compute the absolute path to the root, by stripping distDir from the absolute path to this file.
const ABSOLUTE_ROOT = path.resolve(__filename, relativePathToDistRoot);
/**
 * Returns an absolute path to the given module path.
 * Module path should be relative, either path to a file or a directory.
 *
 * This fn allows to calculate an absolute path for some global static values, such as
 * `__dirname` or `import.meta.url` that Turbopack will not embeds in compile time.
 * See ImportMetaBinding::code_generation for the usage.
 */ function resolveAbsolutePath(modulePath) {
    if (modulePath) {
        return path.join(ABSOLUTE_ROOT, modulePath);
    }
    return ABSOLUTE_ROOT;
}
Context.prototype.P = resolveAbsolutePath;
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
function readWebAssemblyAsResponse(path) {
    const { createReadStream } = require('fs');
    const { Readable } = require('stream');
    const stream = createReadStream(path);
    // @ts-ignore unfortunately there's a slight type mismatch with the stream.
    return new Response(Readable.toWeb(stream), {
        headers: {
            'content-type': 'application/wasm'
        }
    });
}
async function compileWebAssemblyFromPath(path) {
    const response = readWebAssemblyAsResponse(path);
    return await WebAssembly.compileStreaming(response);
}
async function instantiateWebAssemblyFromPath(path, importsObj) {
    const response = readWebAssemblyAsResponse(path);
    const { instance } = await WebAssembly.instantiateStreaming(response, importsObj);
    return instance.exports;
}
/* eslint-disable @typescript-eslint/no-unused-vars */ /// <reference path="../shared/runtime-utils.ts" />
/// <reference path="../shared-node/base-externals-utils.ts" />
/// <reference path="../shared-node/node-externals-utils.ts" />
/// <reference path="../shared-node/node-wasm-utils.ts" />
var SourceType = /*#__PURE__*/ function(SourceType) {
    /**
   * The module was instantiated because it was included in an evaluated chunk's
   * runtime.
   * SourceData is a ChunkPath.
   */ SourceType[SourceType["Runtime"] = 0] = "Runtime";
    /**
   * The module was instantiated because a parent module imported it.
   * SourceData is a ModuleId.
   */ SourceType[SourceType["Parent"] = 1] = "Parent";
    return SourceType;
}(SourceType || {});
process.env.TURBOPACK = '1';
const nodeContextPrototype = Context.prototype;
const url = require('url');
const moduleFactories = new Map();
nodeContextPrototype.M = moduleFactories;
const moduleCache = Object.create(null);
nodeContextPrototype.c = moduleCache;
/**
 * Returns an absolute path to the given module's id.
 */ function resolvePathFromModule(moduleId) {
    const exported = this.r(moduleId);
    const exportedPath = exported?.default ?? exported;
    if (typeof exportedPath !== 'string') {
        return exported;
    }
    const strippedAssetPrefix = exportedPath.slice(ASSET_PREFIX.length);
    const resolved = path.resolve(RUNTIME_ROOT, strippedAssetPrefix);
    return url.pathToFileURL(resolved).href;
}
nodeContextPrototype.R = resolvePathFromModule;
function loadRuntimeChunk(sourcePath, chunkData) {
    if (typeof chunkData === 'string') {
        loadRuntimeChunkPath(sourcePath, chunkData);
    } else {
        loadRuntimeChunkPath(sourcePath, chunkData.path);
    }
}
const loadedChunks = new Set();
const unsupportedLoadChunk = Promise.resolve(undefined);
const loadedChunk = Promise.resolve(undefined);
const chunkCache = new Map();
function clearChunkCache() {
    chunkCache.clear();
}
function loadRuntimeChunkPath(sourcePath, chunkPath) {
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return;
    }
    if (loadedChunks.has(chunkPath)) {
        return;
    }
    try {
        const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
        const chunkModules = requireChunk(chunkPath);
        installCompressedModuleFactories(chunkModules, 0, moduleFactories);
        loadedChunks.add(chunkPath);
    } catch (e) {
        let errorMessage = `Failed to load chunk ${chunkPath}`;
        if (sourcePath) {
            errorMessage += ` from runtime for chunk ${sourcePath}`;
        }
        throw new Error(errorMessage, {
            cause: e
        });
    }
}
function loadChunkAsync(chunkData) {
    const chunkPath = typeof chunkData === 'string' ? chunkData : chunkData.path;
    if (!isJs(chunkPath)) {
        // We only support loading JS chunks in Node.js.
        // This branch can be hit when trying to load a CSS chunk.
        return unsupportedLoadChunk;
    }
    let entry = chunkCache.get(chunkPath);
    if (entry === undefined) {
        try {
            // resolve to an absolute path to simplify `require` handling
            const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
            // TODO: consider switching to `import()` to enable concurrent chunk loading and async file io
            // However this is incompatible with hot reloading (since `import` doesn't use the require cache)
            const chunkModules = requireChunk(chunkPath);
            installCompressedModuleFactories(chunkModules, 0, moduleFactories);
            entry = loadedChunk;
        } catch (e) {
            const errorMessage = `Failed to load chunk ${chunkPath} from module ${this.m.id}`;
            // Cache the failure promise, future requests will also get this same rejection
            entry = Promise.reject(new Error(errorMessage, {
                cause: e
            }));
        }
        chunkCache.set(chunkPath, entry);
    }
    // TODO: Return an instrumented Promise that React can use instead of relying on referential equality.
    return entry;
}
contextPrototype.l = loadChunkAsync;
function loadChunkAsyncByUrl(chunkUrl) {
    const path1 = url.fileURLToPath(new URL(chunkUrl, RUNTIME_ROOT));
    return loadChunkAsync.call(this, path1);
}
contextPrototype.L = loadChunkAsyncByUrl;
function loadWebAssembly(chunkPath, _edgeModule, imports) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return instantiateWebAssemblyFromPath(resolved, imports);
}
contextPrototype.w = loadWebAssembly;
function loadWebAssemblyModule(chunkPath, _edgeModule) {
    const resolved = path.resolve(RUNTIME_ROOT, chunkPath);
    return compileWebAssemblyFromPath(resolved);
}
contextPrototype.u = loadWebAssemblyModule;
function getWorkerBlobURL(_chunks) {
    throw new Error('Worker blobs are not implemented yet for Node.js');
}
nodeContextPrototype.b = getWorkerBlobURL;
function instantiateModule(id, sourceType, sourceData) {
    const moduleFactory = moduleFactories.get(id);
    if (typeof moduleFactory !== 'function') {
        // This can happen if modules incorrectly handle HMR disposes/updates,
        // e.g. when they keep a `setTimeout` around which still executes old code
        // and contains e.g. a `require("something")` call.
        let instantiationReason;
        switch(sourceType){
            case 0:
                instantiationReason = `as a runtime entry of chunk ${sourceData}`;
                break;
            case 1:
                instantiationReason = `because it was required from module ${sourceData}`;
                break;
            default:
                invariant(sourceType, (sourceType)=>`Unknown source type: ${sourceType}`);
        }
        throw new Error(`Module ${id} was instantiated ${instantiationReason}, but the module factory is not available.`);
    }
    const module1 = createModuleObject(id);
    const exports = module1.exports;
    moduleCache[id] = module1;
    const context = new Context(module1, exports);
    // NOTE(alexkirsz) This can fail when the module encounters a runtime error.
    try {
        moduleFactory(context, module1, exports);
    } catch (error) {
        module1.error = error;
        throw error;
    }
    module1.loaded = true;
    if (module1.namespaceObject && module1.exports !== module1.namespaceObject) {
        // in case of a circular dependency: cjs1 -> esm2 -> cjs1
        interopEsm(module1.exports, module1.namespaceObject);
    }
    return module1;
}
/**
 * Retrieves a module from the cache, or instantiate it if it is not cached.
 */ // @ts-ignore
function getOrInstantiateModuleFromParent(id, sourceModule) {
    const module1 = moduleCache[id];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateModule(id, 1, sourceModule.id);
}
/**
 * Instantiates a runtime module.
 */ function instantiateRuntimeModule(chunkPath, moduleId) {
    return instantiateModule(moduleId, 0, chunkPath);
}
/**
 * Retrieves a module from the cache, or instantiate it as a runtime module if it is not cached.
 */ // @ts-ignore TypeScript doesn't separate this module space from the browser runtime
function getOrInstantiateRuntimeModule(chunkPath, moduleId) {
    const module1 = moduleCache[moduleId];
    if (module1) {
        if (module1.error) {
            throw module1.error;
        }
        return module1;
    }
    return instantiateRuntimeModule(chunkPath, moduleId);
}
const regexJsUrl = /\.js(?:\?[^#]*)?(?:#.*)?$/;
/**
 * Checks if a given path/URL ends with .js, optionally followed by ?query or #fragment.
 */ function isJs(chunkUrlOrPath) {
    return regexJsUrl.test(chunkUrlOrPath);
}
module.exports = (sourcePath)=>({
        m: (id)=>getOrInstantiateRuntimeModule(sourcePath, id),
        c: (chunkData)=>loadRuntimeChunk(sourcePath, chunkData)
    });


//# sourceMappingURL=%5Bturbopack%5D_runtime.js.map

  function requireChunk(chunkPath) {
    switch(chunkPath) {
      case "server/chunks/ssr/[root-of-the-server]__296a25b5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__296a25b5._.js");
      case "server/chunks/ssr/[root-of-the-server]__3bf2b1c8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3bf2b1c8._.js");
      case "server/chunks/ssr/[root-of-the-server]__87c0b5b5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__87c0b5b5._.js");
      case "server/chunks/ssr/[root-of-the-server]__bec2389a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bec2389a._.js");
      case "server/chunks/ssr/[root-of-the-server]__c6386d4f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c6386d4f._.js");
      case "server/chunks/ssr/[turbopack]_runtime.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[turbopack]_runtime.js");
      case "server/chunks/ssr/_d25179f9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d25179f9._.js");
      case "server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__not-found_page_actions_554ec2bf.js");
      case "server/chunks/ssr/app_b9b1292a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_b9b1292a._.js");
      case "server/chunks/ssr/assets_icons_index_tsx_606bb882._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/assets_icons_index_tsx_606bb882._.js");
      case "server/chunks/ssr/assets_icons_index_tsx_6a88d321._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/assets_icons_index_tsx_6a88d321._.js");
      case "server/chunks/ssr/components_51fcb922._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/components_51fcb922._.js");
      case "server/chunks/ssr/lib_tools-config_ts_1eb6dc07._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/lib_tools-config_ts_1eb6dc07._.js");
      case "server/chunks/ssr/node_modules_next_cf02c53c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_cf02c53c._.js");
      case "server/chunks/ssr/node_modules_next_dist_737608e4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_737608e4._.js");
      case "server/chunks/ssr/node_modules_next_dist_7e618b84._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_7e618b84._.js");
      case "server/chunks/ssr/node_modules_next_dist_c0f08538._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_c0f08538._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_9774470f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_9774470f._.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_45780354.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_forbidden_45780354.js");
      case "server/chunks/ssr/node_modules_next_dist_dfaf6e5f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_dfaf6e5f._.js");
      case "server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_b8e1111a.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_esm_build_templates_app-page_b8e1111a.js");
      case "server/chunks/ssr/[root-of-the-server]__b9356576._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b9356576._.js");
      case "server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app__global-error_page_actions_75761787.js");
      case "server/chunks/ssr/node_modules_next_dist_f21d913a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_f21d913a._.js");
      case "server/chunks/ssr/[root-of-the-server]__822d008b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__822d008b._.js");
      case "server/chunks/ssr/[root-of-the-server]__a457c799._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a457c799._.js");
      case "server/chunks/ssr/[root-of-the-server]__a470ac6b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a470ac6b._.js");
      case "server/chunks/ssr/[root-of-the-server]__e40ab277._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e40ab277._.js");
      case "server/chunks/ssr/_5ce776b5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5ce776b5._.js");
      case "server/chunks/ssr/_next-internal_server_app_about_page_actions_6fff35e4.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_about_page_actions_6fff35e4.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_ece394eb.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_global-error_ece394eb.js");
      case "server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_dist_client_components_builtin_unauthorized_15817684.js");
      case "server/chunks/ssr/[root-of-the-server]__2b5a9764._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2b5a9764._.js");
      case "server/chunks/ssr/_4c8123b7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_4c8123b7._.js");
      case "server/chunks/ssr/_next-internal_server_app_contact_page_actions_44e32ac3.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_contact_page_actions_44e32ac3.js");
      case "server/chunks/ssr/app_contact_page_tsx_92a0d050._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_contact_page_tsx_92a0d050._.js");
      case "server/chunks/[root-of-the-server]__8f5ebbc3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__8f5ebbc3._.js");
      case "server/chunks/[root-of-the-server]__a6d89067._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__a6d89067._.js");
      case "server/chunks/[turbopack]_runtime.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[turbopack]_runtime.js");
      case "server/chunks/_next-internal_server_app_favicon_ico_route_actions_353150a5.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_favicon_ico_route_actions_353150a5.js");
      case "server/chunks/node_modules_next_0700e68e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/node_modules_next_0700e68e._.js");
      case "server/chunks/node_modules_next_dist_esm_build_templates_app-route_d6a474cc.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/node_modules_next_dist_esm_build_templates_app-route_d6a474cc.js");
      case "server/chunks/[root-of-the-server]__1b03765f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__1b03765f._.js");
      case "server/chunks/_next-internal_server_app_feed_xml_route_actions_4a74572e.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_feed_xml_route_actions_4a74572e.js");
      case "server/chunks/lib_tools-config_ts_05ecabda._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/lib_tools-config_ts_05ecabda._.js");
      case "server/chunks/ssr/[root-of-the-server]__3143e0aa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3143e0aa._.js");
      case "server/chunks/ssr/_85a2a391._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_85a2a391._.js");
      case "server/chunks/ssr/_99c02173._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_99c02173._.js");
      case "server/chunks/ssr/_b04a2623._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b04a2623._.js");
      case "server/chunks/ssr/app_nytm-ctrl-x9k7_layout_tsx_1dd8d189._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_nytm-ctrl-x9k7_layout_tsx_1dd8d189._.js");
      case "server/chunks/ssr/app_nytm-ctrl-x9k7_layout_tsx_778a0559._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_nytm-ctrl-x9k7_layout_tsx_778a0559._.js");
      case "server/chunks/ssr/lib_auth_ts_340a637c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/lib_auth_ts_340a637c._.js");
      case "server/chunks/ssr/node_modules_next_efb10309._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_efb10309._.js");
      case "server/chunks/ssr/[root-of-the-server]__84d017b5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__84d017b5._.js");
      case "server/chunks/ssr/_b615e0c7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b615e0c7._.js");
      case "server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_ads_page_actions_efb3263e.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_ads_page_actions_efb3263e.js");
      case "server/chunks/ssr/app_nytm-ctrl-x9k7_ads_page_tsx_55965f64._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_nytm-ctrl-x9k7_ads_page_tsx_55965f64._.js");
      case "server/chunks/ssr/lib_ads-config_ts_7576d2a4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/lib_ads-config_ts_7576d2a4._.js");
      case "server/chunks/ssr/[root-of-the-server]__6aacd7fa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6aacd7fa._.js");
      case "server/chunks/ssr/_e8fd0c6d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e8fd0c6d._.js");
      case "server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_analytics_page_actions_79e7e0ca.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_analytics_page_actions_79e7e0ca.js");
      case "server/chunks/ssr/app_nytm-ctrl-x9k7_analytics_analytics-dashboard_tsx_5b57fc7a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_nytm-ctrl-x9k7_analytics_analytics-dashboard_tsx_5b57fc7a._.js");
      case "server/chunks/ssr/node_modules_next_4e8de401._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/node_modules_next_4e8de401._.js");
      case "server/chunks/ssr/[root-of-the-server]__a6a2bb4b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a6a2bb4b._.js");
      case "server/chunks/ssr/_a02b7693._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a02b7693._.js");
      case "server/chunks/ssr/_a9516870._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a9516870._.js");
      case "server/chunks/ssr/_f3d35507._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f3d35507._.js");
      case "server/chunks/ssr/[root-of-the-server]__c13de9d0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c13de9d0._.js");
      case "server/chunks/ssr/_2c2a852d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2c2a852d._.js");
      case "server/chunks/ssr/_7a0393eb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7a0393eb._.js");
      case "server/chunks/ssr/_f907dac6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f907dac6._.js");
      case "server/chunks/ssr/[root-of-the-server]__abf7cd75._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__abf7cd75._.js");
      case "server/chunks/ssr/_b9e14241._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b9e14241._.js");
      case "server/chunks/ssr/_c4aadc3f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c4aadc3f._.js");
      case "server/chunks/ssr/_e815fea3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e815fea3._.js");
      case "server/chunks/ssr/[root-of-the-server]__1e4e3f93._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1e4e3f93._.js");
      case "server/chunks/ssr/_1a1042a8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1a1042a8._.js");
      case "server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_tools_page_actions_161c5c0c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_nytm-ctrl-x9k7_tools_page_actions_161c5c0c.js");
      case "server/chunks/ssr/app_nytm-ctrl-x9k7_tools_page_tsx_4c0b27dc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_nytm-ctrl-x9k7_tools_page_tsx_4c0b27dc._.js");
      case "server/chunks/ssr/[root-of-the-server]__5ea3dff5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5ea3dff5._.js");
      case "server/chunks/ssr/_27f38564._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_27f38564._.js");
      case "server/chunks/ssr/_fb8d60a7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fb8d60a7._.js");
      case "server/chunks/ssr/_next-internal_server_app_page_actions_39d4fc33.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_page_actions_39d4fc33.js");
      case "server/chunks/ssr/components_InteractiveGrid_tsx_d1a19da5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/components_InteractiveGrid_tsx_d1a19da5._.js");
      case "server/chunks/ssr/[root-of-the-server]__9b392679._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9b392679._.js");
      case "server/chunks/ssr/_bb28d496._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bb28d496._.js");
      case "server/chunks/ssr/_next-internal_server_app_pricing_page_actions_61c195a2.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_pricing_page_actions_61c195a2.js");
      case "server/chunks/ssr/app_pricing_page_tsx_b3828a56._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_pricing_page_tsx_b3828a56._.js");
      case "server/chunks/ssr/[root-of-the-server]__59463192._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__59463192._.js");
      case "server/chunks/ssr/_190bd073._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_190bd073._.js");
      case "server/chunks/ssr/_next-internal_server_app_privacy_page_actions_78bfea85.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_privacy_page_actions_78bfea85.js");
      case "server/chunks/[root-of-the-server]__f82cec3b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__f82cec3b._.js");
      case "server/chunks/_next-internal_server_app_robots_txt_route_actions_9118e90f.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_robots_txt_route_actions_9118e90f.js");
      case "server/chunks/[root-of-the-server]__9961bc33._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/[root-of-the-server]__9961bc33._.js");
      case "server/chunks/_next-internal_server_app_sitemap_xml_route_actions_12658ace.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/_next-internal_server_app_sitemap_xml_route_actions_12658ace.js");
      case "server/chunks/ssr/[root-of-the-server]__e1844d7b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e1844d7b._.js");
      case "server/chunks/ssr/_6b06d5f5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6b06d5f5._.js");
      case "server/chunks/ssr/_next-internal_server_app_terms_page_actions_3b82705a.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_terms_page_actions_3b82705a.js");
      case "server/chunks/ssr/[root-of-the-server]__2385cb37._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2385cb37._.js");
      case "server/chunks/ssr/_15f29477._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_15f29477._.js");
      case "server/chunks/ssr/_b7b7b87d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b7b7b87d._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_add-prefix-suffix_page_actions_5fa27518.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_add-prefix-suffix_page_actions_5fa27518.js");
      case "server/chunks/ssr/[root-of-the-server]__ba778c50._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ba778c50._.js");
      case "server/chunks/ssr/_58954b83._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_58954b83._.js");
      case "server/chunks/ssr/_ae7f14ec._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ae7f14ec._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_aes-decrypt_page_actions_ffed6ce6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_aes-decrypt_page_actions_ffed6ce6.js");
      case "server/chunks/ssr/[root-of-the-server]__828b52fd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__828b52fd._.js");
      case "server/chunks/ssr/_d3384817._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d3384817._.js");
      case "server/chunks/ssr/_e640889b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e640889b._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_aes-encrypt_page_actions_932c7af5.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_aes-encrypt_page_actions_932c7af5.js");
      case "server/chunks/ssr/[root-of-the-server]__1973f3fa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1973f3fa._.js");
      case "server/chunks/ssr/_665b4e9c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_665b4e9c._.js");
      case "server/chunks/ssr/_c8e02f59._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c8e02f59._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_age-calculator_page_actions_28b68e97.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_age-calculator_page_actions_28b68e97.js");
      case "server/chunks/ssr/[root-of-the-server]__4d71cb6f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__4d71cb6f._.js");
      case "server/chunks/ssr/_ac4dc27f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ac4dc27f._.js");
      case "server/chunks/ssr/_af92b992._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_af92b992._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_ascii-table_page_actions_8a5078eb.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_ascii-table_page_actions_8a5078eb.js");
      case "server/chunks/ssr/[root-of-the-server]__bc48f755._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bc48f755._.js");
      case "server/chunks/ssr/_1d518225._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1d518225._.js");
      case "server/chunks/ssr/_b4457665._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b4457665._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_aspect-ratio_page_actions_973b6f92.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_aspect-ratio_page_actions_973b6f92.js");
      case "server/chunks/ssr/[root-of-the-server]__5bdf4866._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5bdf4866._.js");
      case "server/chunks/ssr/_3a2e1889._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3a2e1889._.js");
      case "server/chunks/ssr/_50e8acda._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_50e8acda._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_barcode-generator_page_actions_9210e1d6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_barcode-generator_page_actions_9210e1d6.js");
      case "server/chunks/ssr/[root-of-the-server]__5e15c89c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5e15c89c._.js");
      case "server/chunks/ssr/[root-of-the-server]__ad1e0216._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ad1e0216._.js");
      case "server/chunks/ssr/_349e4b26._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_349e4b26._.js");
      case "server/chunks/ssr/_8dda18c8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8dda18c8._.js");
      case "server/chunks/ssr/_a1982c57._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a1982c57._.js");
      case "server/chunks/ssr/[root-of-the-server]__70a3c92d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__70a3c92d._.js");
      case "server/chunks/ssr/_03e890aa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_03e890aa._.js");
      case "server/chunks/ssr/_351c8d8f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_351c8d8f._.js");
      case "server/chunks/ssr/_b7d98839._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b7d98839._.js");
      case "server/chunks/ssr/[root-of-the-server]__f90147e8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f90147e8._.js");
      case "server/chunks/ssr/_0602fce0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0602fce0._.js");
      case "server/chunks/ssr/_6937d9cd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6937d9cd._.js");
      case "server/chunks/ssr/_c0a40591._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c0a40591._.js");
      case "server/chunks/ssr/[root-of-the-server]__51ec0aa2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__51ec0aa2._.js");
      case "server/chunks/ssr/_53bccffd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_53bccffd._.js");
      case "server/chunks/ssr/_5b59b51c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5b59b51c._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_bcrypt-hash_page_actions_b39f28ec.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_bcrypt-hash_page_actions_b39f28ec.js");
      case "server/chunks/ssr/[root-of-the-server]__e4ea1fde._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e4ea1fde._.js");
      case "server/chunks/ssr/_1cbf552f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1cbf552f._.js");
      case "server/chunks/ssr/_f99db11a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f99db11a._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_bcrypt-verify_page_actions_6dd33f28.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_bcrypt-verify_page_actions_6dd33f28.js");
      case "server/chunks/ssr/[root-of-the-server]__592c01b6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__592c01b6._.js");
      case "server/chunks/ssr/_2bd4c8cc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2bd4c8cc._.js");
      case "server/chunks/ssr/_447d8e43._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_447d8e43._.js");
      case "server/chunks/ssr/_5a0eceaf._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5a0eceaf._.js");
      case "server/chunks/ssr/_98aa3520._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_98aa3520._.js");
      case "server/chunks/ssr/[root-of-the-server]__494882fb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__494882fb._.js");
      case "server/chunks/ssr/_0802942f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0802942f._.js");
      case "server/chunks/ssr/_ad3f0f3f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ad3f0f3f._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_binary-to-text_page_actions_7cc1d1b8.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_binary-to-text_page_actions_7cc1d1b8.js");
      case "server/chunks/ssr/[root-of-the-server]__090bb66c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__090bb66c._.js");
      case "server/chunks/ssr/_10c6a94c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_10c6a94c._.js");
      case "server/chunks/ssr/_a4dea6df._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a4dea6df._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_bmi-calculator_page_actions_7b023ebd.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_bmi-calculator_page_actions_7b023ebd.js");
      case "server/chunks/ssr/[root-of-the-server]__5316d7a2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5316d7a2._.js");
      case "server/chunks/ssr/_2e950856._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2e950856._.js");
      case "server/chunks/ssr/_b69c8289._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b69c8289._.js");
      case "server/chunks/ssr/_e6824d9a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e6824d9a._.js");
      case "server/chunks/ssr/[root-of-the-server]__647bd662._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__647bd662._.js");
      case "server/chunks/ssr/_786c7e6d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_786c7e6d._.js");
      case "server/chunks/ssr/_c4c06da3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c4c06da3._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_character-counter_page_actions_013d7023.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_character-counter_page_actions_013d7023.js");
      case "server/chunks/ssr/[root-of-the-server]__bbe56710._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bbe56710._.js");
      case "server/chunks/ssr/_2bab31ac._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2bab31ac._.js");
      case "server/chunks/ssr/_2bd43b25._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2bd43b25._.js");
      case "server/chunks/ssr/_bdab5405._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bdab5405._.js");
      case "server/chunks/ssr/[root-of-the-server]__9032fdaa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9032fdaa._.js");
      case "server/chunks/ssr/_4dbe0784._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_4dbe0784._.js");
      case "server/chunks/ssr/_6e2865ef._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6e2865ef._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_color-converter_page_actions_98bf5050.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_color-converter_page_actions_98bf5050.js");
      case "server/chunks/ssr/[root-of-the-server]__b819af56._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b819af56._.js");
      case "server/chunks/ssr/_072df845._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_072df845._.js");
      case "server/chunks/ssr/_808bbd2c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_808bbd2c._.js");
      case "server/chunks/ssr/_8a676753._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8a676753._.js");
      case "server/chunks/ssr/[root-of-the-server]__7a692503._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__7a692503._.js");
      case "server/chunks/ssr/_ccd911f8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ccd911f8._.js");
      case "server/chunks/ssr/_e7a46848._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e7a46848._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_countdown-timer_page_actions_ba70f0fd.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_countdown-timer_page_actions_ba70f0fd.js");
      case "server/chunks/ssr/[root-of-the-server]__026cf49e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__026cf49e._.js");
      case "server/chunks/ssr/_48af9f5d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_48af9f5d._.js");
      case "server/chunks/ssr/_bf99962c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bf99962c._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_credit-card-generator_page_actions_0a6ae5cd.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_credit-card-generator_page_actions_0a6ae5cd.js");
      case "server/chunks/ssr/[root-of-the-server]__26df57b9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__26df57b9._.js");
      case "server/chunks/ssr/_62e57caa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_62e57caa._.js");
      case "server/chunks/ssr/_7916c97a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7916c97a._.js");
      case "server/chunks/ssr/_8b7e8461._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8b7e8461._.js");
      case "server/chunks/ssr/[root-of-the-server]__c00161c7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c00161c7._.js");
      case "server/chunks/ssr/_6a422a81._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6a422a81._.js");
      case "server/chunks/ssr/_82b695b2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_82b695b2._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_css-beautify_page_actions_0c5795ee.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_css-beautify_page_actions_0c5795ee.js");
      case "server/chunks/ssr/[root-of-the-server]__093df339._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__093df339._.js");
      case "server/chunks/ssr/_0f8b4d50._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0f8b4d50._.js");
      case "server/chunks/ssr/_cde20177._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_cde20177._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_css-minify_page_actions_abd605ba.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_css-minify_page_actions_abd605ba.js");
      case "server/chunks/ssr/[root-of-the-server]__5e370db0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5e370db0._.js");
      case "server/chunks/ssr/_8d0abf57._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8d0abf57._.js");
      case "server/chunks/ssr/_ba91daeb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ba91daeb._.js");
      case "server/chunks/ssr/_e1e27266._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e1e27266._.js");
      case "server/chunks/ssr/[root-of-the-server]__2b997e37._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2b997e37._.js");
      case "server/chunks/ssr/_780a0438._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_780a0438._.js");
      case "server/chunks/ssr/_ad2df6bb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ad2df6bb._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_date-calculator_page_actions_99adb34d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_date-calculator_page_actions_99adb34d.js");
      case "server/chunks/ssr/[root-of-the-server]__613ca18b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__613ca18b._.js");
      case "server/chunks/ssr/_4639cb36._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_4639cb36._.js");
      case "server/chunks/ssr/_b3776185._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b3776185._.js");
      case "server/chunks/ssr/_f1e719ec._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f1e719ec._.js");
      case "server/chunks/ssr/[root-of-the-server]__1c6747d2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__1c6747d2._.js");
      case "server/chunks/ssr/_a5becee4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a5becee4._.js");
      case "server/chunks/ssr/_bd224af2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bd224af2._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_emoji-picker_page_actions_3b583cd7.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_emoji-picker_page_actions_3b583cd7.js");
      case "server/chunks/ssr/[root-of-the-server]__de03107e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__de03107e._.js");
      case "server/chunks/ssr/_5a72ca50._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5a72ca50._.js");
      case "server/chunks/ssr/_c1bd03aa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c1bd03aa._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_epoch-converter_page_actions_e133c50e.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_epoch-converter_page_actions_e133c50e.js");
      case "server/chunks/ssr/[root-of-the-server]__b226d0bc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b226d0bc._.js");
      case "server/chunks/ssr/_c5afc95d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c5afc95d._.js");
      case "server/chunks/ssr/_dd9354f3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_dd9354f3._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_escape-unescape_page_actions_4779c264.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_escape-unescape_page_actions_4779c264.js");
      case "server/chunks/ssr/[root-of-the-server]__018a7f17._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__018a7f17._.js");
      case "server/chunks/ssr/_bb45e68d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bb45e68d._.js");
      case "server/chunks/ssr/_fc4db8d0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fc4db8d0._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_fake-data_page_actions_2b6e93e9.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_fake-data_page_actions_2b6e93e9.js");
      case "server/chunks/ssr/[root-of-the-server]__e6419aea._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e6419aea._.js");
      case "server/chunks/ssr/_67f11b18._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_67f11b18._.js");
      case "server/chunks/ssr/_d7462992._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d7462992._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_favicon-generator_page_actions_688f617d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_favicon-generator_page_actions_688f617d.js");
      case "server/chunks/ssr/[root-of-the-server]__186864b0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__186864b0._.js");
      case "server/chunks/ssr/_a78b397e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a78b397e._.js");
      case "server/chunks/ssr/_cd5e14c4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_cd5e14c4._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_file-hash_page_actions_d771586c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_file-hash_page_actions_d771586c.js");
      case "server/chunks/ssr/[root-of-the-server]__b7270d93._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b7270d93._.js");
      case "server/chunks/ssr/_5f64223f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5f64223f._.js");
      case "server/chunks/ssr/_cda43fcf._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_cda43fcf._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_find-replace_page_actions_bd3aec77.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_find-replace_page_actions_bd3aec77.js");
      case "server/chunks/ssr/[root-of-the-server]__db5f6b4a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__db5f6b4a._.js");
      case "server/chunks/ssr/_0e55b9a8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0e55b9a8._.js");
      case "server/chunks/ssr/_30631c33._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_30631c33._.js");
      case "server/chunks/ssr/_8c39437b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8c39437b._.js");
      case "server/chunks/ssr/[root-of-the-server]__af41fe9b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__af41fe9b._.js");
      case "server/chunks/ssr/_05b18e4d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_05b18e4d._.js");
      case "server/chunks/ssr/_8c01f1fe._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8c01f1fe._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_hash-identifier_page_actions_c6c2ae75.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_hash-identifier_page_actions_c6c2ae75.js");
      case "server/chunks/ssr/[root-of-the-server]__f19a8148._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f19a8148._.js");
      case "server/chunks/ssr/_10f3c2c6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_10f3c2c6._.js");
      case "server/chunks/ssr/_4f1212e2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_4f1212e2._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_hex-to-text_page_actions_7f641264.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_hex-to-text_page_actions_7f641264.js");
      case "server/chunks/ssr/[root-of-the-server]__9709bd1b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9709bd1b._.js");
      case "server/chunks/ssr/_416d565d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_416d565d._.js");
      case "server/chunks/ssr/_b064f877._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b064f877._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_html-beautify_page_actions_034ab91f.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_html-beautify_page_actions_034ab91f.js");
      case "server/chunks/ssr/[root-of-the-server]__250a0f39._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__250a0f39._.js");
      case "server/chunks/ssr/_6fbeb760._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6fbeb760._.js");
      case "server/chunks/ssr/_d37923c7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d37923c7._.js");
      case "server/chunks/ssr/_e01a4436._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e01a4436._.js");
      case "server/chunks/ssr/[root-of-the-server]__9c83bddc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9c83bddc._.js");
      case "server/chunks/ssr/_bbfe2173._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bbfe2173._.js");
      case "server/chunks/ssr/_d0214feb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d0214feb._.js");
      case "server/chunks/ssr/_ff8e08e6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ff8e08e6._.js");
      case "server/chunks/ssr/[root-of-the-server]__4d0a9ab1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__4d0a9ab1._.js");
      case "server/chunks/ssr/_22248661._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_22248661._.js");
      case "server/chunks/ssr/_e1aadf5b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e1aadf5b._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_html-entities_page_actions_39e4e771.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_html-entities_page_actions_39e4e771.js");
      case "server/chunks/ssr/[root-of-the-server]__92978ef3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__92978ef3._.js");
      case "server/chunks/ssr/_078a151b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_078a151b._.js");
      case "server/chunks/ssr/_a20d6498._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a20d6498._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_html-minify_page_actions_1b3d6ac0.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_html-minify_page_actions_1b3d6ac0.js");
      case "server/chunks/ssr/[root-of-the-server]__e5f5c63c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e5f5c63c._.js");
      case "server/chunks/ssr/_e0813589._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e0813589._.js");
      case "server/chunks/ssr/_f4d9e041._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f4d9e041._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_html-strip_page_actions_f766a8b8.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_html-strip_page_actions_f766a8b8.js");
      case "server/chunks/ssr/[root-of-the-server]__722be071._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__722be071._.js");
      case "server/chunks/ssr/_18a048e2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_18a048e2._.js");
      case "server/chunks/ssr/_1ad92986._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1ad92986._.js");
      case "server/chunks/ssr/_92792607._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_92792607._.js");
      case "server/chunks/ssr/[root-of-the-server]__511aa41c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__511aa41c._.js");
      case "server/chunks/ssr/_98c65c35._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_98c65c35._.js");
      case "server/chunks/ssr/_fe32aace._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fe32aace._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_iban-generator_page_actions_c6d537f4.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_iban-generator_page_actions_c6d537f4.js");
      case "server/chunks/ssr/[root-of-the-server]__c7308d07._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c7308d07._.js");
      case "server/chunks/ssr/_546deeb9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_546deeb9._.js");
      case "server/chunks/ssr/_673ddb9e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_673ddb9e._.js");
      case "server/chunks/ssr/_dbea1efb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_dbea1efb._.js");
      case "server/chunks/ssr/[root-of-the-server]__c87fc67d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c87fc67d._.js");
      case "server/chunks/ssr/_6e9b2567._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6e9b2567._.js");
      case "server/chunks/ssr/_fb5e510d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fb5e510d._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_image-convert_page_actions_0d6d8941.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_image-convert_page_actions_0d6d8941.js");
      case "server/chunks/ssr/[root-of-the-server]__de1027a4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__de1027a4._.js");
      case "server/chunks/ssr/_1c216dc6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1c216dc6._.js");
      case "server/chunks/ssr/_3e033345._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3e033345._.js");
      case "server/chunks/ssr/_ddacc281._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ddacc281._.js");
      case "server/chunks/ssr/[root-of-the-server]__d2cd5f2c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d2cd5f2c._.js");
      case "server/chunks/ssr/_272dcdd3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_272dcdd3._.js");
      case "server/chunks/ssr/_df84daae._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_df84daae._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_image-filters_page_actions_246a3daa.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_image-filters_page_actions_246a3daa.js");
      case "server/chunks/ssr/[root-of-the-server]__6f737fc8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6f737fc8._.js");
      case "server/chunks/ssr/_731dd0d7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_731dd0d7._.js");
      case "server/chunks/ssr/_aab98c85._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_aab98c85._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_image-flip_page_actions_4e41e1c4.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_image-flip_page_actions_4e41e1c4.js");
      case "server/chunks/ssr/[root-of-the-server]__d86771a0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d86771a0._.js");
      case "server/chunks/ssr/_31e21cc6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_31e21cc6._.js");
      case "server/chunks/ssr/_b453a0ab._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b453a0ab._.js");
      case "server/chunks/ssr/_efbda184._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_efbda184._.js");
      case "server/chunks/ssr/[root-of-the-server]__b1b8f860._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__b1b8f860._.js");
      case "server/chunks/ssr/_073055a3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_073055a3._.js");
      case "server/chunks/ssr/_67b73a80._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_67b73a80._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_image-rotate_page_actions_99d510fb.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_image-rotate_page_actions_99d510fb.js");
      case "server/chunks/ssr/[root-of-the-server]__314bc092._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__314bc092._.js");
      case "server/chunks/ssr/_2e7f30cb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2e7f30cb._.js");
      case "server/chunks/ssr/_49ff2ec0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_49ff2ec0._.js");
      case "server/chunks/ssr/_e24032bb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e24032bb._.js");
      case "server/chunks/ssr/[root-of-the-server]__d8c0ea5c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d8c0ea5c._.js");
      case "server/chunks/ssr/_45094604._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_45094604._.js");
      case "server/chunks/ssr/_538a7c0e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_538a7c0e._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_ip-generator_page_actions_ca312a59.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_ip-generator_page_actions_ca312a59.js");
      case "server/chunks/ssr/[root-of-the-server]__6193c37c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6193c37c._.js");
      case "server/chunks/ssr/_558d06c1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_558d06c1._.js");
      case "server/chunks/ssr/_72a6a9a7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_72a6a9a7._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_ip-lookup_page_actions_cd413215.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_ip-lookup_page_actions_cd413215.js");
      case "server/chunks/ssr/[root-of-the-server]__3e0eac4e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3e0eac4e._.js");
      case "server/chunks/ssr/_2f77db0b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2f77db0b._.js");
      case "server/chunks/ssr/_8af3b989._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8af3b989._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_js-beautify_page_actions_47b6d99c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_js-beautify_page_actions_47b6d99c.js");
      case "server/chunks/ssr/[root-of-the-server]__14213553._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__14213553._.js");
      case "server/chunks/ssr/_0e7a6a67._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0e7a6a67._.js");
      case "server/chunks/ssr/_745f376d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_745f376d._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_js-minify_page_actions_56b3bbf2.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_js-minify_page_actions_56b3bbf2.js");
      case "server/chunks/ssr/[root-of-the-server]__98b74dbb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__98b74dbb._.js");
      case "server/chunks/ssr/_009b95bb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_009b95bb._.js");
      case "server/chunks/ssr/_abdf3d99._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_abdf3d99._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_json-escape_page_actions_0d60219a.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_json-escape_page_actions_0d60219a.js");
      case "server/chunks/ssr/[root-of-the-server]__5948625e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5948625e._.js");
      case "server/chunks/ssr/_2aa5ab1e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2aa5ab1e._.js");
      case "server/chunks/ssr/_5e53d1a9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5e53d1a9._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_json-minify_page_actions_48557572.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_json-minify_page_actions_48557572.js");
      case "server/chunks/ssr/[root-of-the-server]__5fca64e8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5fca64e8._.js");
      case "server/chunks/ssr/_f872debd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f872debd._.js");
      case "server/chunks/ssr/_fe8e3c76._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fe8e3c76._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_json-path_page_actions_3457a2ce.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_json-path_page_actions_3457a2ce.js");
      case "server/chunks/ssr/[root-of-the-server]__cb496721._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__cb496721._.js");
      case "server/chunks/ssr/_1441df11._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1441df11._.js");
      case "server/chunks/ssr/_3da859dd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3da859dd._.js");
      case "server/chunks/ssr/_648c9135._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_648c9135._.js");
      case "server/chunks/ssr/[root-of-the-server]__ef055739._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ef055739._.js");
      case "server/chunks/ssr/_00817215._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_00817215._.js");
      case "server/chunks/ssr/_8a8509b9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8a8509b9._.js");
      case "server/chunks/ssr/_93685b81._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_93685b81._.js");
      case "server/chunks/ssr/[root-of-the-server]__42c3b51a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__42c3b51a._.js");
      case "server/chunks/ssr/_986d1513._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_986d1513._.js");
      case "server/chunks/ssr/_9b52d8f5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_9b52d8f5._.js");
      case "server/chunks/ssr/_a9138f9b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a9138f9b._.js");
      case "server/chunks/ssr/[root-of-the-server]__7412b14f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__7412b14f._.js");
      case "server/chunks/ssr/_1981642a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1981642a._.js");
      case "server/chunks/ssr/_b9a2dd18._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b9a2dd18._.js");
      case "server/chunks/ssr/_bca19b44._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bca19b44._.js");
      case "server/chunks/ssr/[root-of-the-server]__5b9c2f9c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5b9c2f9c._.js");
      case "server/chunks/ssr/_0e2c82ee._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0e2c82ee._.js");
      case "server/chunks/ssr/_452630eb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_452630eb._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_json-validator_page_actions_04923f35.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_json-validator_page_actions_04923f35.js");
      case "server/chunks/ssr/[root-of-the-server]__75ddcc5b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__75ddcc5b._.js");
      case "server/chunks/ssr/_51b802ae._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_51b802ae._.js");
      case "server/chunks/ssr/_d6e1dd5e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d6e1dd5e._.js");
      case "server/chunks/ssr/_fe7384f5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fe7384f5._.js");
      case "server/chunks/ssr/[root-of-the-server]__53e35c4d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__53e35c4d._.js");
      case "server/chunks/ssr/_1a8489e1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1a8489e1._.js");
      case "server/chunks/ssr/_3f9704f1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3f9704f1._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_jwt-generator_page_actions_fa601d68.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_jwt-generator_page_actions_fa601d68.js");
      case "server/chunks/ssr/[root-of-the-server]__70f35eb8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__70f35eb8._.js");
      case "server/chunks/ssr/_1e06cff9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1e06cff9._.js");
      case "server/chunks/ssr/_331ca968._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_331ca968._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_keyboard-tester_page_actions_26327733.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_keyboard-tester_page_actions_26327733.js");
      case "server/chunks/ssr/[root-of-the-server]__815d45e9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__815d45e9._.js");
      case "server/chunks/ssr/_289f5846._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_289f5846._.js");
      case "server/chunks/ssr/_ae3bc5bf._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ae3bc5bf._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_line-counter_page_actions_1b81810d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_line-counter_page_actions_1b81810d.js");
      case "server/chunks/ssr/[root-of-the-server]__301a7dfb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__301a7dfb._.js");
      case "server/chunks/ssr/_1180de42._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1180de42._.js");
      case "server/chunks/ssr/_8bf395f6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8bf395f6._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_loan-calculator_page_actions_5954d367.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_loan-calculator_page_actions_5954d367.js");
      case "server/chunks/ssr/[root-of-the-server]__3f8daeff._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3f8daeff._.js");
      case "server/chunks/ssr/_2d2f9777._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2d2f9777._.js");
      case "server/chunks/ssr/_335e9532._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_335e9532._.js");
      case "server/chunks/ssr/_5c777c94._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5c777c94._.js");
      case "server/chunks/ssr/[root-of-the-server]__24e01446._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__24e01446._.js");
      case "server/chunks/ssr/_54ab42df._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_54ab42df._.js");
      case "server/chunks/ssr/_a9ecac38._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a9ecac38._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_mac-address-generator_page_actions_1d7857a6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_mac-address-generator_page_actions_1d7857a6.js");
      case "server/chunks/ssr/[root-of-the-server]__36c2a01b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__36c2a01b._.js");
      case "server/chunks/ssr/_23478a45._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_23478a45._.js");
      case "server/chunks/ssr/_7f426dc7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7f426dc7._.js");
      case "server/chunks/ssr/_9ce3a953._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_9ce3a953._.js");
      case "server/chunks/ssr/[root-of-the-server]__617ee6a3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__617ee6a3._.js");
      case "server/chunks/ssr/_98722094._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_98722094._.js");
      case "server/chunks/ssr/_e3cb3da4._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e3cb3da4._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_markdown-preview_page_actions_f6447ca8.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_markdown-preview_page_actions_f6447ca8.js");
      case "server/chunks/ssr/[root-of-the-server]__3f01f338._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3f01f338._.js");
      case "server/chunks/ssr/_09f44529._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_09f44529._.js");
      case "server/chunks/ssr/_624315a1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_624315a1._.js");
      case "server/chunks/ssr/_df294792._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_df294792._.js");
      case "server/chunks/ssr/[root-of-the-server]__a841b50d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a841b50d._.js");
      case "server/chunks/ssr/_a83e7a65._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a83e7a65._.js");
      case "server/chunks/ssr/_d1bc1270._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d1bc1270._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_md5-hash_page_actions_19a405d0.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_md5-hash_page_actions_19a405d0.js");
      case "server/chunks/ssr/[root-of-the-server]__f77308ec._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f77308ec._.js");
      case "server/chunks/ssr/_054bbfcb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_054bbfcb._.js");
      case "server/chunks/ssr/_3dd9b80d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3dd9b80d._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_morse-code_page_actions_2f34b018.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_morse-code_page_actions_2f34b018.js");
      case "server/chunks/ssr/[root-of-the-server]__53548332._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__53548332._.js");
      case "server/chunks/ssr/_6e9072b7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6e9072b7._.js");
      case "server/chunks/ssr/_fa190ecd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fa190ecd._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_nato-alphabet_page_actions_be45fd8f.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_nato-alphabet_page_actions_be45fd8f.js");
      case "server/chunks/ssr/[root-of-the-server]__66a7fa1b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__66a7fa1b._.js");
      case "server/chunks/ssr/_0d56b18a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0d56b18a._.js");
      case "server/chunks/ssr/_670becc7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_670becc7._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_number-base_page_actions_eb1844b7.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_number-base_page_actions_eb1844b7.js");
      case "server/chunks/ssr/[root-of-the-server]__dc0f200d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__dc0f200d._.js");
      case "server/chunks/ssr/_4d137549._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_4d137549._.js");
      case "server/chunks/ssr/_d59ae870._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d59ae870._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_number-lines_page_actions_90bd77f6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_number-lines_page_actions_90bd77f6.js");
      case "server/chunks/ssr/[root-of-the-server]__c7a92f3c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c7a92f3c._.js");
      case "server/chunks/ssr/_6ed2ff14._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6ed2ff14._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_page_actions_3bc858b5.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_page_actions_3bc858b5.js");
      case "server/chunks/ssr/app_tools_page_tsx_0e6e920a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/app_tools_page_tsx_0e6e920a._.js");
      case "server/chunks/ssr/[root-of-the-server]__5779ebba._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5779ebba._.js");
      case "server/chunks/ssr/_6c4a2084._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6c4a2084._.js");
      case "server/chunks/ssr/_90b864ec._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_90b864ec._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_palette-generator_page_actions_de6412ff.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_palette-generator_page_actions_de6412ff.js");
      case "server/chunks/ssr/[root-of-the-server]__ae00d2c6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ae00d2c6._.js");
      case "server/chunks/ssr/_1040059f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1040059f._.js");
      case "server/chunks/ssr/_31c00c94._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_31c00c94._.js");
      case "server/chunks/ssr/_e1684393._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e1684393._.js");
      case "server/chunks/ssr/[root-of-the-server]__49152ccb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__49152ccb._.js");
      case "server/chunks/ssr/_92934cd8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_92934cd8._.js");
      case "server/chunks/ssr/_ed33ce4c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ed33ce4c._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_password-strength_page_actions_aa8f59c9.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_password-strength_page_actions_aa8f59c9.js");
      case "server/chunks/ssr/[root-of-the-server]__3b72dbfe._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3b72dbfe._.js");
      case "server/chunks/ssr/_7ff96bcc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7ff96bcc._.js");
      case "server/chunks/ssr/_b04bf8a8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b04bf8a8._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_percentage-calculator_page_actions_ad810eb0.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_percentage-calculator_page_actions_ad810eb0.js");
      case "server/chunks/ssr/[root-of-the-server]__bab13323._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bab13323._.js");
      case "server/chunks/ssr/_3363c73c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3363c73c._.js");
      case "server/chunks/ssr/_a480ab53._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a480ab53._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_placeholder-image_page_actions_92079df6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_placeholder-image_page_actions_92079df6.js");
      case "server/chunks/ssr/[root-of-the-server]__f7ff64ea._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f7ff64ea._.js");
      case "server/chunks/ssr/_56603673._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_56603673._.js");
      case "server/chunks/ssr/_b3a9c4ab._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b3a9c4ab._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_pomodoro-timer_page_actions_87c22cdc.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_pomodoro-timer_page_actions_87c22cdc.js");
      case "server/chunks/ssr/[root-of-the-server]__11b024e9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__11b024e9._.js");
      case "server/chunks/ssr/[root-of-the-server]__78576c9c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__78576c9c._.js");
      case "server/chunks/ssr/[root-of-the-server]__ebd8f86f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ebd8f86f._.js");
      case "server/chunks/ssr/_174554e6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_174554e6._.js");
      case "server/chunks/ssr/_ccd37585._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ccd37585._.js");
      case "server/chunks/ssr/[root-of-the-server]__8d3f50d1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__8d3f50d1._.js");
      case "server/chunks/ssr/_34e0e1ae._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_34e0e1ae._.js");
      case "server/chunks/ssr/_9205e7ff._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_9205e7ff._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_random-number_page_actions_9b15dfab.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_random-number_page_actions_9b15dfab.js");
      case "server/chunks/ssr/[root-of-the-server]__5c708ef3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5c708ef3._.js");
      case "server/chunks/ssr/_e7bf104e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e7bf104e._.js");
      case "server/chunks/ssr/_e7f760b2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_e7f760b2._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_random-string_page_actions_081298b4.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_random-string_page_actions_081298b4.js");
      case "server/chunks/ssr/[root-of-the-server]__ad66eecf._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ad66eecf._.js");
      case "server/chunks/ssr/_347043d3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_347043d3._.js");
      case "server/chunks/ssr/_61ebe24d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_61ebe24d._.js");
      case "server/chunks/ssr/_749ddef3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_749ddef3._.js");
      case "server/chunks/ssr/[root-of-the-server]__297a875d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__297a875d._.js");
      case "server/chunks/ssr/_38858f28._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_38858f28._.js");
      case "server/chunks/ssr/_d0dec983._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d0dec983._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_remove-duplicates_page_actions_885a43f7.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_remove-duplicates_page_actions_885a43f7.js");
      case "server/chunks/ssr/[root-of-the-server]__e2a69802._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e2a69802._.js");
      case "server/chunks/ssr/_66744fc5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_66744fc5._.js");
      case "server/chunks/ssr/_7685b559._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7685b559._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_remove-empty-lines_page_actions_12b8a0c9.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_remove-empty-lines_page_actions_12b8a0c9.js");
      case "server/chunks/ssr/[root-of-the-server]__10bc8f25._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__10bc8f25._.js");
      case "server/chunks/ssr/_c7ef479c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c7ef479c._.js");
      case "server/chunks/ssr/_c8d212d1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c8d212d1._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_roman-numerals_page_actions_ea491443.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_roman-numerals_page_actions_ea491443.js");
      case "server/chunks/ssr/[root-of-the-server]__a0fb1dea._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a0fb1dea._.js");
      case "server/chunks/ssr/_d3434288._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d3434288._.js");
      case "server/chunks/ssr/_f1a245bf._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f1a245bf._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_rsa-key-generator_page_actions_c9f598ce.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_rsa-key-generator_page_actions_c9f598ce.js");
      case "server/chunks/ssr/[root-of-the-server]__6471a768._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6471a768._.js");
      case "server/chunks/ssr/_693812cd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_693812cd._.js");
      case "server/chunks/ssr/_69f35660._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_69f35660._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_screen-resolution_page_actions_fffda378.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_screen-resolution_page_actions_fffda378.js");
      case "server/chunks/ssr/[root-of-the-server]__ca38efa3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__ca38efa3._.js");
      case "server/chunks/ssr/_60a3b46d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_60a3b46d._.js");
      case "server/chunks/ssr/_a9fce88d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a9fce88d._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_sha1-hash_page_actions_008fab3b.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_sha1-hash_page_actions_008fab3b.js");
      case "server/chunks/ssr/[root-of-the-server]__78a9bae5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__78a9bae5._.js");
      case "server/chunks/ssr/_24710c97._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_24710c97._.js");
      case "server/chunks/ssr/_827f6f02._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_827f6f02._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_sha256-hash_page_actions_6edb9c91.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_sha256-hash_page_actions_6edb9c91.js");
      case "server/chunks/ssr/[root-of-the-server]__d578bcda._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__d578bcda._.js");
      case "server/chunks/ssr/_2d708bf8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2d708bf8._.js");
      case "server/chunks/ssr/_c6c8a2c7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c6c8a2c7._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_sha512-hash_page_actions_9f6b4687.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_sha512-hash_page_actions_9f6b4687.js");
      case "server/chunks/ssr/[root-of-the-server]__14617509._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__14617509._.js");
      case "server/chunks/ssr/_2556ccca._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2556ccca._.js");
      case "server/chunks/ssr/_967d5fa5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_967d5fa5._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_slug-generator_page_actions_9bc4195d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_slug-generator_page_actions_9bc4195d.js");
      case "server/chunks/ssr/[root-of-the-server]__f041c4b7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f041c4b7._.js");
      case "server/chunks/ssr/_15a5d854._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_15a5d854._.js");
      case "server/chunks/ssr/_c641b992._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c641b992._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_sort-lines_page_actions_863f669c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_sort-lines_page_actions_863f669c.js");
      case "server/chunks/ssr/[root-of-the-server]__88ea6975._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__88ea6975._.js");
      case "server/chunks/ssr/_0d82df19._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0d82df19._.js");
      case "server/chunks/ssr/_2261ccb0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2261ccb0._.js");
      case "server/chunks/ssr/_507b9fa2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_507b9fa2._.js");
      case "server/chunks/ssr/[root-of-the-server]__14441289._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__14441289._.js");
      case "server/chunks/ssr/_2cbc87de._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2cbc87de._.js");
      case "server/chunks/ssr/_d8e721d3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d8e721d3._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_stopwatch_page_actions_08deca60.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_stopwatch_page_actions_08deca60.js");
      case "server/chunks/ssr/[root-of-the-server]__7dc0a408._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__7dc0a408._.js");
      case "server/chunks/ssr/_107841fe._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_107841fe._.js");
      case "server/chunks/ssr/_808aae73._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_808aae73._.js");
      case "server/chunks/ssr/_d19deef5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d19deef5._.js");
      case "server/chunks/ssr/[root-of-the-server]__5b136737._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5b136737._.js");
      case "server/chunks/ssr/_5b62bea0._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5b62bea0._.js");
      case "server/chunks/ssr/_a2bcd392._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a2bcd392._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_svg-to-png_page_actions_820a19b6.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_svg-to-png_page_actions_820a19b6.js");
      case "server/chunks/ssr/[root-of-the-server]__a6205610._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__a6205610._.js");
      case "server/chunks/ssr/_5ef87702._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5ef87702._.js");
      case "server/chunks/ssr/_861037aa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_861037aa._.js");
      case "server/chunks/ssr/_a0ff3cc7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a0ff3cc7._.js");
      case "server/chunks/ssr/[root-of-the-server]__9be99192._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9be99192._.js");
      case "server/chunks/ssr/_74dd850c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_74dd850c._.js");
      case "server/chunks/ssr/_ad10a234._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ad10a234._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-diff_page_actions_4d328c4d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-diff_page_actions_4d328c4d.js");
      case "server/chunks/ssr/[root-of-the-server]__16eec8cd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__16eec8cd._.js");
      case "server/chunks/ssr/_07ed37e1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_07ed37e1._.js");
      case "server/chunks/ssr/_0e352586._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0e352586._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-extract_page_actions_b8fe744d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-extract_page_actions_b8fe744d.js");
      case "server/chunks/ssr/[root-of-the-server]__485c11b3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__485c11b3._.js");
      case "server/chunks/ssr/_049256fa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_049256fa._.js");
      case "server/chunks/ssr/_0c22ede5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0c22ede5._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-join_page_actions_358d5fc2.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-join_page_actions_358d5fc2.js");
      case "server/chunks/ssr/[root-of-the-server]__957fb1f3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__957fb1f3._.js");
      case "server/chunks/ssr/_1885efa5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1885efa5._.js");
      case "server/chunks/ssr/_1fa5d911._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1fa5d911._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-repeat_page_actions_8405fcf4.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-repeat_page_actions_8405fcf4.js");
      case "server/chunks/ssr/[root-of-the-server]__cb7aa405._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__cb7aa405._.js");
      case "server/chunks/ssr/_2d9775d7._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2d9775d7._.js");
      case "server/chunks/ssr/_bf952f62._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bf952f62._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-reverse_page_actions_3480a146.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-reverse_page_actions_3480a146.js");
      case "server/chunks/ssr/[root-of-the-server]__bb7b9a53._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__bb7b9a53._.js");
      case "server/chunks/ssr/_7be8801b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_7be8801b._.js");
      case "server/chunks/ssr/_a4217615._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_a4217615._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-split_page_actions_f5ab8e04.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-split_page_actions_f5ab8e04.js");
      case "server/chunks/ssr/[root-of-the-server]__21e75767._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__21e75767._.js");
      case "server/chunks/ssr/_6c8312b6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6c8312b6._.js");
      case "server/chunks/ssr/_6fd83820._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_6fd83820._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-to-binary_page_actions_1b21842c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-to-binary_page_actions_1b21842c.js");
      case "server/chunks/ssr/[root-of-the-server]__866e4990._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__866e4990._.js");
      case "server/chunks/ssr/_5ed4655e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5ed4655e._.js");
      case "server/chunks/ssr/_d5453643._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_d5453643._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-to-hex_page_actions_65a8b6b8.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-to-hex_page_actions_65a8b6b8.js");
      case "server/chunks/ssr/[root-of-the-server]__5b2f644b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__5b2f644b._.js");
      case "server/chunks/ssr/_1caa63c6._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1caa63c6._.js");
      case "server/chunks/ssr/_cf8197b9._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_cf8197b9._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_text-trim_page_actions_969f1269.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_text-trim_page_actions_969f1269.js");
      case "server/chunks/ssr/[root-of-the-server]__6a990597._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__6a990597._.js");
      case "server/chunks/ssr/_24b8bb64._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_24b8bb64._.js");
      case "server/chunks/ssr/_5aef6194._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5aef6194._.js");
      case "server/chunks/ssr/_bcb63987._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bcb63987._.js");
      case "server/chunks/ssr/[root-of-the-server]__93bfd7de._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__93bfd7de._.js");
      case "server/chunks/ssr/_21ce090a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_21ce090a._.js");
      case "server/chunks/ssr/_f4ad1337._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_f4ad1337._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_timezone-converter_page_actions_da5cd405.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_timezone-converter_page_actions_da5cd405.js");
      case "server/chunks/ssr/[root-of-the-server]__c99ee8ff._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__c99ee8ff._.js");
      case "server/chunks/ssr/_3c6f56e3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_3c6f56e3._.js");
      case "server/chunks/ssr/_b53ab72e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_b53ab72e._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_tip-calculator_page_actions_e6a1ad8c.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_tip-calculator_page_actions_e6a1ad8c.js");
      case "server/chunks/ssr/[root-of-the-server]__f503476d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f503476d._.js");
      case "server/chunks/ssr/_0c016dee._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0c016dee._.js");
      case "server/chunks/ssr/_1f29cafb._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1f29cafb._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_unicode-converter_page_actions_875b18ff.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_unicode-converter_page_actions_875b18ff.js");
      case "server/chunks/ssr/[root-of-the-server]__39d6725d._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__39d6725d._.js");
      case "server/chunks/ssr/_47517fe5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_47517fe5._.js");
      case "server/chunks/ssr/_cab9726f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_cab9726f._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_unit-converter_page_actions_a0e98499.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_unit-converter_page_actions_a0e98499.js");
      case "server/chunks/ssr/[root-of-the-server]__99e27bf5._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__99e27bf5._.js");
      case "server/chunks/ssr/_59def38b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_59def38b._.js");
      case "server/chunks/ssr/_c0aa33ea._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c0aa33ea._.js");
      case "server/chunks/ssr/_fab38e8f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_fab38e8f._.js");
      case "server/chunks/ssr/[root-of-the-server]__2724c3e2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__2724c3e2._.js");
      case "server/chunks/ssr/_14aba774._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_14aba774._.js");
      case "server/chunks/ssr/_73b57102._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_73b57102._.js");
      case "server/chunks/ssr/_c667a84b._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c667a84b._.js");
      case "server/chunks/ssr/[root-of-the-server]__e6bff30a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__e6bff30a._.js");
      case "server/chunks/ssr/_0e8ac2aa._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_0e8ac2aa._.js");
      case "server/chunks/ssr/_5a2e44dc._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_5a2e44dc._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_url-parser_page_actions_55558f94.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_url-parser_page_actions_55558f94.js");
      case "server/chunks/ssr/[root-of-the-server]__49d333a1._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__49d333a1._.js");
      case "server/chunks/ssr/_283997a3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_283997a3._.js");
      case "server/chunks/ssr/_73f4041e._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_73f4041e._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_user-agent-parser_page_actions_f2ba0d7e.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_user-agent-parser_page_actions_f2ba0d7e.js");
      case "server/chunks/ssr/[root-of-the-server]__3137a15c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__3137a15c._.js");
      case "server/chunks/ssr/[root-of-the-server]__f555656a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__f555656a._.js");
      case "server/chunks/ssr/_ade3a733._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_ade3a733._.js");
      case "server/chunks/ssr/_c123c2dd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c123c2dd._.js");
      case "server/chunks/ssr/[root-of-the-server]__9a995544._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__9a995544._.js");
      case "server/chunks/ssr/_43cede75._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_43cede75._.js");
      case "server/chunks/ssr/_76c1a560._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_76c1a560._.js");
      case "server/chunks/ssr/_931601c8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_931601c8._.js");
      case "server/chunks/ssr/[root-of-the-server]__673ab969._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__673ab969._.js");
      case "server/chunks/ssr/_1928017a._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_1928017a._.js");
      case "server/chunks/ssr/_8c484988._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_8c484988._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_world-clock_page_actions_16929a4d.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_world-clock_page_actions_16929a4d.js");
      case "server/chunks/ssr/[root-of-the-server]__fc540a8f._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__fc540a8f._.js");
      case "server/chunks/ssr/_2eda488c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_2eda488c._.js");
      case "server/chunks/ssr/_93a5a7e3._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_93a5a7e3._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_xml-beautify_page_actions_8e8fb389.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_xml-beautify_page_actions_8e8fb389.js");
      case "server/chunks/ssr/[root-of-the-server]__421e3633._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__421e3633._.js");
      case "server/chunks/ssr/_970a3102._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_970a3102._.js");
      case "server/chunks/ssr/_c3f14a02._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_c3f14a02._.js");
      case "server/chunks/ssr/_next-internal_server_app_tools_xml-minify_page_actions_a78d10a1.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_next-internal_server_app_tools_xml-minify_page_actions_a78d10a1.js");
      case "server/chunks/ssr/[root-of-the-server]__4089a9b8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__4089a9b8._.js");
      case "server/chunks/ssr/_28557e92._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_28557e92._.js");
      case "server/chunks/ssr/_30fcb6a2._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_30fcb6a2._.js");
      case "server/chunks/ssr/_bd7bb958._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_bd7bb958._.js");
      case "server/chunks/ssr/[root-of-the-server]__995eb95c._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/[root-of-the-server]__995eb95c._.js");
      case "server/chunks/ssr/_72c3febd._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_72c3febd._.js");
      case "server/chunks/ssr/_841a4ae8._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_841a4ae8._.js");
      case "server/chunks/ssr/_91f78136._.js": return require("/home/nityam/Downloads/code/NYTM MULTITOOLS/.open-next/server-functions/default/.next/server/chunks/ssr/_91f78136._.js");
      default:
        throw new Error(`Not found ${chunkPath}`);
    }
  }
