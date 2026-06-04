# ESM Default Import Resolution Bug in `jquery-param`

This repository is a minimal reproduction of a packaging bug in the `jquery-param` npm package. The bug causes default imports (e.g. `import param from 'jquery-param'`) to resolve to `undefined` in environments that prioritize the `"browser"` package resolution condition (such as Webpack 5, modern bundlers, or browser ESM loaders).

---

## 1. The Root Cause

Starting in version `1.2.5` (up to the current latest `1.2.8`), the author introduced:
1. `"type": "module"` in `package.json` to mark the package as a native ES Module.
2. An `"exports"` field to handle conditional resolution.

However, the exports mapping contains a semantic conflict:
```json
"exports": {
  ".": {
    "import": "./dist/esm/jquery-param.mjs",
    "require": "./dist/umd/jquery-param.js",
    "browser": "./jquery-param.min.js"
  }
}
```

*   **The Mismatch:** The target `"browser"` maps to `./jquery-param.min.js`. This file is compiled in **UMD (CommonJS/AMD/Global)** format and has **no ES export statements**.
*   **The Spec Conflict:** Because `"type": "module"` is configured at the package root, Node.js and Webpack 5 are mandated by spec to treat **all** `.js` files in the package (including the UMD file `jquery-param.min.js`) as ES Modules.
*   **The Failure:** When a bundler or loader resolves the `"browser"` condition and parses the UMD file as a strict ES Module, it finds no `export default` statement. The module resolves to an empty object (`[Module: null prototype] {}`), causing the default import to evaluate to `undefined`.

---

## 2. Last Working Version

*   **Last Working Version:** **`1.2.4`**
*   **Why it worked:** Version `1.2.4` (and older) did not specify `"type": "module"` or `"exports"`. In the absence of these flags, Node.js and bundlers resolve the package as a CommonJS module and correctly apply the default export interop wrapper.

---

## 3. Reproduction Steps

To run this minimal, pure Node.js reproduction (no bundlers or transpilers required):

```bash
git clone https://github.com/ro0gr/jquery-param-esm-repro && cd jquery-param-esm-repro

npm install && npm start
```

### Actual Output
```bash
--- jquery-param ESM Reproduction ---
Importing module: ./node_modules/jquery-param/jquery-param.min.js
Module Namespace keys: []
Module default export value: undefined

❌ SUCCESSFUL REPRODUCTION: default export is undefined.
Trying to call m.default({ a: 1 })...

🔥 Caught expected runtime error:
TypeError: m.default is not a function
    at file:///Users/RHR/art/tmp/jquery-param-esm-repro/index.js:18:13
```
