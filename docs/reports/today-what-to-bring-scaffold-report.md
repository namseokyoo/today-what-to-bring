# Today What To Bring — Gate 4 Scaffold Report

Generated: 2026-06-07 17:26:23 KST

## Gate

Gate 4 — Scaffolding Gate

## Route

- Core role: commander/verifier, with direct evidence/report finalization after the delegated builder run timed out.
- Initial executor route: Hermes subagent builder, because the local `codex` CLI was unavailable.
- Outcome note: the subagent timed out, but the expected scaffold files had been created. Core then verified the actual filesystem state and ran the required checks directly.

## Scaffold Location

- Product repo: `/Volumes/external/project/SidequestLab/projects/today-what-to-bring`
- App source: `app/`
- Temporary scaffold parent used: `/tmp/today-what-to-bring-scaffold`

## Created App Files

Tracked source/config candidates under `app/`:

```text
app/.granite/app.json
app/README.md
app/eslint.config.js
app/granite.config.ts
app/index.html
app/package-lock.json
app/package.json
app/public/appsintoss-logo.png
app/src/App.css
app/src/App.tsx
app/src/index.css
app/src/main.tsx
app/src/vite-env.d.ts
app/tsconfig.app.json
app/tsconfig.json
app/tsconfig.node.json
app/vite.config.ts
```

Ignored generated/runtime outputs observed after verification:

```text
app/node_modules/
app/dist/
app/today-what-to-bring.ait
```

Root docs and Lab metadata were not overwritten by scaffold creation.

## Config Verification

`app/granite.config.ts`:

```ts
appName: "today-what-to-bring"
brand.displayName: "오늘 뭐 챙기지?"
permissions: []
outdir: "dist"
```

`app/.granite/app.json`:

```json
{
  "appName": "today-what-to-bring",
  "permissions": []
}
```

## Package Scripts

`app/package.json` scripts:

```json
{
  "dev": "granite dev",
  "build": "ait build",
  "deploy": "ait deploy",
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

## Verification Commands

Environment:

```text
node v26.0.0
npm 11.12.1
```

Commands run from `app/`:

```bash
npm install
npm run build
npm run dev
curl http://localhost:5173/
npm run lint
npm audit --audit-level=critical --json
```

## Results

### Install

`npm install` completed successfully.

Notable warnings:

- peer dependency override warnings from `@apps-in-toss/plugin-compat` dependency tree
- deprecated transitive package warnings
- npm audit summary: 26 vulnerabilities total — 5 low, 3 moderate, 17 high, 1 critical

No install failure occurred.

### Build

`npm run build` completed successfully.

Observed build evidence:

```text
vite v6.4.3 building for production...
✓ 30 modules transformed.
✓ built in 861ms
Built for RN 0.84.0
Built for RN 0.72.6
AIT build completed (today-what-to-bring.ait)
deploymentId: 019ea12e-b992-747a-ac16-752ffb522ae5
```

### Dev Server Smoke

`npm run dev` started a server on port 5173.

Smoke check:

```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 549
```

The dev server process was stopped after the smoke check.

### Lint

`npm run lint` completed successfully with exit code 0.

### Audit

`npm audit --audit-level=critical --json` exited non-zero because the official scaffold dependency tree currently includes vulnerabilities:

```json
{
  "low": 5,
  "moderate": 3,
  "high": 17,
  "critical": 1,
  "total": 26
}
```

This is recorded as a Gate 4 risk, not automatically fixed in this gate, because `npm audit fix --force` may introduce breaking dependency changes to the official Apps in Toss scaffold.

## Gate 4 Decision

Status: PASS with dependency-risk note.

Gate 4 success criteria satisfied:

- `app/` Apps in Toss scaffold exists.
- `app/granite.config.ts` exists.
- `appName` is `today-what-to-bring`.
- `displayName` is `오늘 뭐 챙기지?`.
- React + TypeScript + Vite structure exists.
- `npm install` succeeded.
- `npm run build` succeeded.
- dev server returned HTTP 200.
- `npm run lint` succeeded.
- generated install/build outputs are ignored by `.gitignore`.

## Risks / Follow-up

1. Dependency audit has one critical and multiple high vulnerabilities in scaffold transitive dependencies.
   - Recommended handling: create a separate dependency hardening gate after confirming Apps in Toss compatibility, not inside this scaffold gate.
2. The initial delegated builder run timed out after scaffold creation.
   - Core verified the actual result and reran install/build/dev/lint checks directly.
3. No app feature implementation was performed in this gate.

## Next Gate

Gate 5 — Domain Model Gate.
