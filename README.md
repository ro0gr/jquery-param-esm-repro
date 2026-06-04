# ESM Default Import Resolution Bug in `jquery-param`

This repository is a minimal reproduction of a packaging issue in `jquery-param` where default imports (e.g. `import param from 'jquery-param'`) resolve to `undefined` in browser-targeted bundlers or ESM loaders.

For full technical details and discussions, see the GitHub Issue:
👉 **[GitHub Issue #38](https://github.com/knowledgecode/jquery-param/issues/38)**

---

## Reproduction Steps

This reproduction runs in pure Node.js (v18+) without any external bundlers (Vite, Webpack, etc.).

```bash
# 1. Clone the repository
git clone https://github.com/ro0gr/jquery-param-esm-repro.git
cd jquery-param-esm-repro

# 2. Install dependencies
npm install

# 3. Run the reproduction script
npm start
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
```
