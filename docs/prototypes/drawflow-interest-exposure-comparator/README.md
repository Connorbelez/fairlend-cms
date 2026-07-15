# DrawFlow Interest Exposure Comparator prototype

Static, dependency-free product prototype derived from `docs/drawflow-interest-exposure-comparator-prd.md`.

## Run locally

```bash
python3 -m http.server 4173 --directory docs/prototypes/drawflow-interest-exposure-comparator
```

Open `http://localhost:4173/`.

## Test

```bash
node docs/prototypes/drawflow-interest-exposure-comparator/test.cjs
node --check docs/prototypes/drawflow-interest-exposure-comparator/app.js
```

The source uses only relative assets so it can be published beneath a Convex prototype-library path.
