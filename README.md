# echarts-dashboard-implementation
⚠️ Issue: TS1203 – Export assignment cannot be used when targeting ECMAScript modules

❌ Error Message

```bash
TS1203: Export assignment cannot be used when targeting ECMAScript modules.
node_modules/echarts/index.d.ts: export = echarts;

```

🔍 What Caused This?

Angular 21 uses native ECMAScript Modules (ESM) with strict module resolution (moduleResolution: "bundler").

However, the ECharts type definitions still contain this legacy CommonJS syntax:
```ts
export = echarts;

```
This syntax is not allowed when TypeScript is targeting ESM, so the Angular/Vite compiler throws TS1203.

✅ How It Was Resolved

We instructed TypeScript to skip type-checking .d.ts files inside node_modules by adding this to tsconfig.json:
```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}

```
