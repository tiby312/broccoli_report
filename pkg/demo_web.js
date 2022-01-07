
let wasm;

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

function getObject(idx) { return heap[idx]; }

let heap_next = heap.length;

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}

let stack_pointer = 32;

function addBorrowedObject(obj) {
    if (stack_pointer == 1) throw new Error('out of js stack');
    heap[--stack_pointer] = obj;
    return stack_pointer;
}
function __wbg_adapter_26(arg0, arg1, arg2) {
    try {
        wasm._dyn_core__ops__function__FnMut___A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h81650b11512cb2e4(arg0, arg1, addBorrowedObject(arg2));
    } finally {
        heap[stack_pointer++] = undefined;
    }
}

function __wbg_adapter_29(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h63e81483ab7ba94a(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_32(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h7f9d7659a11fa04f(arg0, arg1);
}

/**
* @returns {Promise<void>}
*/
export function main_entry() {
    var ret = wasm.main_entry();
    return takeObject(ret);
}

/**
* @returns {Promise<void>}
*/
export function worker_entry() {
    var ret = wasm.worker_entry();
    return takeObject(ret);
}

let cachegetUint32Memory0 = null;
function getUint32Memory0() {
    if (cachegetUint32Memory0 === null || cachegetUint32Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint32Memory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachegetUint32Memory0;
}

function getArrayJsValueFromWasm0(ptr, len) {
    const mem = getUint32Memory0();
    const slice = mem.subarray(ptr / 4, ptr / 4 + len);
    const result = [];
    for (let i = 0; i < slice.length; i++) {
        result.push(takeObject(slice[i]));
    }
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachegetFloat32Memory0 = null;
function getFloat32Memory0() {
    if (cachegetFloat32Memory0 === null || cachegetFloat32Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat32Memory0 = new Float32Array(wasm.memory.buffer);
    }
    return cachegetFloat32Memory0;
}

function getArrayF32FromWasm0(ptr, len) {
    return getFloat32Memory0().subarray(ptr / 4, ptr / 4 + len);
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        wasm.__wbindgen_exn_store(addHeapObject(e));
    }
}
function __wbg_adapter_191(arg0, arg1, arg2, arg3) {
    wasm.wasm_bindgen__convert__closures__invoke2_mut__h22dce2fd5276ee39(arg0, arg1, addHeapObject(arg2), addHeapObject(arg3));
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = new URL('demo_web_bg.wasm', import.meta.url);
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_is_null = function(arg0) {
        var ret = getObject(arg0) === null;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbg_static_accessor_performance_6af0fd026a9110d2 = function() {
        var ret = performance;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_Window_2b37b61fe0cb894b = function(arg0) {
        var ret = getObject(arg0).Window;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbg_WorkerGlobalScope_da7fa0bf3cb27800 = function(arg0) {
        var ret = getObject(arg0).WorkerGlobalScope;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_log_06b7ffc63a0f8bee = function(arg0, arg1) {
        var v0 = getArrayJsValueFromWasm0(arg0, arg1).slice();
        wasm.__wbindgen_free(arg0, arg1 * 4);
        console.log(...v0);
    };
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_56ad96bfac3f5531 = function(arg0) {
        var ret = getObject(arg0) instanceof WebGL2RenderingContext;
        return ret;
    };
    imports.wbg.__wbg_bufferData_794d61d3c392fafd = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
    };
    imports.wbg.__wbg_uniform4fv_be3d8deff512cf95 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).uniform4fv(getObject(arg1), getArrayF32FromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniformMatrix3fv_ac980fa6b58112de = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).uniformMatrix3fv(getObject(arg1), arg2 !== 0, getArrayF32FromWasm0(arg3, arg4));
    };
    imports.wbg.__wbg_attachShader_7faccaa7b5ac28a6 = function(arg0, arg1, arg2) {
        getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
    };
    imports.wbg.__wbg_bindBuffer_4ece833dd10cac2f = function(arg0, arg1, arg2) {
        getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
    };
    imports.wbg.__wbg_blendFunc_b254bb91838df1dd = function(arg0, arg1, arg2) {
        getObject(arg0).blendFunc(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_clear_4ce66c813d66e77d = function(arg0, arg1) {
        getObject(arg0).clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clearColor_71f96fd72a7646a6 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_compileShader_dd66d66a5a6481f3 = function(arg0, arg1) {
        getObject(arg0).compileShader(getObject(arg1));
    };
    imports.wbg.__wbg_createBuffer_5c5caa16032a81b7 = function(arg0) {
        var ret = getObject(arg0).createBuffer();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createProgram_32d01a55e144b9fc = function(arg0) {
        var ret = getObject(arg0).createProgram();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createShader_6e8eed55567fe1a6 = function(arg0, arg1) {
        var ret = getObject(arg0).createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_deleteBuffer_de80b51d8166fddb = function(arg0, arg1) {
        getObject(arg0).deleteBuffer(getObject(arg1));
    };
    imports.wbg.__wbg_deleteProgram_3ec3c43f2cddde7f = function(arg0, arg1) {
        getObject(arg0).deleteProgram(getObject(arg1));
    };
    imports.wbg.__wbg_deleteShader_b4e32582cfe4e771 = function(arg0, arg1) {
        getObject(arg0).deleteShader(getObject(arg1));
    };
    imports.wbg.__wbg_disable_b05e075ae54fa448 = function(arg0, arg1) {
        getObject(arg0).disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_5db2f4e6291f7fb2 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_enable_766e546395da5a5d = function(arg0, arg1) {
        getObject(arg0).enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_91da8d3cbe0c2bbd = function(arg0, arg1) {
        getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_flush_c475bcd21b0e7ba9 = function(arg0) {
        getObject(arg0).flush();
    };
    imports.wbg.__wbg_getAttribLocation_5d304d390c7273f5 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getAttribLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getProgramInfoLog_18c849a5fa54e7b1 = function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getProgramParameter_80edd3cfbcf7cf1d = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getShaderInfoLog_ba1de20c14b6fb63 = function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getShaderParameter_264d9ab5c13ece4d = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getUniformLocation_77b2d89291f84289 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_linkProgram_b84796e37364e5c9 = function(arg0, arg1) {
        getObject(arg0).linkProgram(getObject(arg1));
    };
    imports.wbg.__wbg_shaderSource_18f45f93c05a8311 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_uniform1f_a7858af9d2384350 = function(arg0, arg1, arg2) {
        getObject(arg0).uniform1f(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_uniform2f_f8d8e7662e0e0eb6 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).uniform2f(getObject(arg1), arg2, arg3);
    };
    imports.wbg.__wbg_useProgram_c2fdf4a953d1128a = function(arg0, arg1) {
        getObject(arg0).useProgram(getObject(arg1));
    };
    imports.wbg.__wbg_vertexAttribPointer_76d558694fe81cd7 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_instanceof_Window_c4b70662a0d2c5ec = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_1c64944725c0d81d = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_clearTimeout_2c1ba0016d8bca41 = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_setTimeout_df66d951b1726b78 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_DedicatedWorkerGlobalScope_5c9a9280cbb0fe4f = function(arg0) {
        var ret = getObject(arg0) instanceof DedicatedWorkerGlobalScope;
        return ret;
    };
    imports.wbg.__wbg_postMessage_9aec76b55a01771d = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).postMessage(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_25d964a0dde6717e = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLCanvasElement;
        return ret;
    };
    imports.wbg.__wbg_transferControlToOffscreen_c0716f2d95575662 = function() { return handleError(function (arg0) {
        var ret = getObject(arg0).transferControlToOffscreen();
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_now_559193109055ebad = function(arg0) {
        var ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_top_3946f8347860b55c = function(arg0) {
        var ret = getObject(arg0).top;
        return ret;
    };
    imports.wbg.__wbg_left_31cce57341292712 = function(arg0) {
        var ret = getObject(arg0).left;
        return ret;
    };
    imports.wbg.__wbg_addEventListener_09e11fbf8b4b719b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    }, arguments) };
    imports.wbg.__wbg_removeEventListener_24d5a7c12c3f3c39 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), arg4 !== 0);
    }, arguments) };
    imports.wbg.__wbg_width_d55d3698a2514ec1 = function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_height_df08a93b45ce76ec = function(arg0) {
        var ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_instanceof_OffscreenCanvas_8eea6d8fac5cd458 = function(arg0) {
        var ret = getObject(arg0) instanceof OffscreenCanvas;
        return ret;
    };
    imports.wbg.__wbg_getContext_34a19de9629b2e94 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_instanceof_MouseEvent_7cb2c66c3440bfb0 = function(arg0) {
        var ret = getObject(arg0) instanceof MouseEvent;
        return ret;
    };
    imports.wbg.__wbg_clientX_97ff0f5c7b19e687 = function(arg0) {
        var ret = getObject(arg0).clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_cacd4a7e44b9719b = function(arg0) {
        var ret = getObject(arg0).clientY;
        return ret;
    };
    imports.wbg.__wbg_newwithoptions_238c70ce5ac7cee4 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = new Worker(getStringFromWasm0(arg0, arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_postMessage_19f6e3c6d1114464 = function() { return handleError(function (arg0, arg1) {
        getObject(arg0).postMessage(getObject(arg1));
    }, arguments) };
    imports.wbg.__wbg_postMessage_c5ce28e76bee82d0 = function() { return handleError(function (arg0, arg1, arg2) {
        getObject(arg0).postMessage(getObject(arg1), getObject(arg2));
    }, arguments) };
    imports.wbg.__wbg_getElementById_f3e94458ce77f0d0 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getAttribute_bb1d602e925e860a = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg1).getAttribute(getStringFromWasm0(arg2, arg3));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getBoundingClientRect_2fba0402ea2a6ec4 = function(arg0) {
        var ret = getObject(arg0).getBoundingClientRect();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_instanceof_HtmlElement_df66c8b4a687aa43 = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLElement;
        return ret;
    };
    imports.wbg.__wbg_clearTimeout_c1f246d6874c0679 = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_setTimeout_5314850184d61a44 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_instanceof_MessageEvent_38cc16e9af008907 = function(arg0) {
        var ret = getObject(arg0) instanceof MessageEvent;
        return ret;
    };
    imports.wbg.__wbg_data_9e55e7d79ab13ef1 = function(arg0) {
        var ret = getObject(arg0).data;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_67189fe0b323d288 = function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_new_949bbc1147195c4e = function() {
        var ret = new Array();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newnoargs_be86524d73f67598 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_888d259a5fefc347 = function() { return handleError(function (arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_new_0b83d3df67ecb33e = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_75ee2b96c288e6bc = function(arg0) {
        var ret = new Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_set_1820441f7fb79aad = function(arg0, arg1, arg2) {
        getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
    };
    imports.wbg.__wbg_isArray_eb7ad55f2da67dde = function(arg0) {
        var ret = Array.isArray(getObject(arg0));
        return ret;
    };
    imports.wbg.__wbg_call_346669c262382ad7 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = getObject(arg0).call(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_is_0f5efc7977a2c50b = function(arg0, arg1) {
        var ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_new_b1d61b5687f5e73a = function(arg0, arg1) {
        try {
            var state0 = {a: arg0, b: arg1};
            var cb0 = (arg0, arg1) => {
                const a = state0.a;
                state0.a = 0;
                try {
                    return __wbg_adapter_191(a, state0.b, arg0, arg1);
                } finally {
                    state0.a = a;
                }
            };
            var ret = new Promise(cb0);
            return addHeapObject(ret);
        } finally {
            state0.a = state0.b = 0;
        }
    };
    imports.wbg.__wbg_resolve_d23068002f584f22 = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_2fcac196782070cc = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_c6fbdfc2918d5e58 = function() { return handleError(function () {
        var ret = self.self;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_window_baec038b5ab35c54 = function() { return handleError(function () {
        var ret = window.window;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_globalThis_3f735a5746d41fbd = function() { return handleError(function () {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_global_1bc0b39582740e95 = function() { return handleError(function () {
        var ret = global.global;
        return addHeapObject(ret);
    }, arguments) };
    imports.wbg.__wbg_set_82a4e8a85e31ac42 = function() { return handleError(function (arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_random_a582babfa4489c72 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_closure_wrapper289 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 27, __wbg_adapter_26);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper575 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 121, __wbg_adapter_29);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper726 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 166, __wbg_adapter_32);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }



    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

