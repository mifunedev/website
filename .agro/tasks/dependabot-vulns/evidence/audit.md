# npm audit evidence

Source: `npm audit --json | jq .metadata.vulnerabilities`.

## Severity counts

| Severity | Before (`ed19ed1`) | After |
|---|---|---|
| critical | 3 | 0 |
| high | 30 | 8 |
| moderate | 21 | 9 |
| low | 2 | 2 |
| total | 56 | 19 |

## Overrides

- `next > postcss: ^8.5.23`. `next@15.5.28` pins `postcss@8.4.31`. That version has four postcss advisories (fixed in 8.5.23). No 15.x release of `next` carries the fix. Next.js 16 is out of scope. The lockfile resolves `postcss@8.5.31`.
- `serialize-javascript: ^7.0.5`. `@ducanh2912/next-pwa@10.2.9` (latest) pins `workbox-build@7.1.1`. That release uses `@rollup/plugin-terser@0.4.4`, which requires `serialize-javascript@^6.0.1`. Every 6.x release is vulnerable (GHSA-5c6j-r48x-rmvq, GHSA-qj8w-gfj5-8c6v). No `next-pwa` release carries the fix. The lockfile resolves `serialize-javascript@7.1.2`.

## Remaining high findings

All eight remaining high findings come from one advisory: `braces` GHSA-vfj7-8cjw-p6xm (range `<=3.0.3`).

- `braces@3.0.3` is the latest release. No patched release exists. An override cannot fix it.
- `micromatch`, `fast-glob`, `chokidar`, `tailwindcss`, `@next/eslint-plugin-next`, `eslint-config-next`, and `@ducanh2912/next-pwa` are flagged only because they depend on `braces`.
- The npm suggestions are `tailwindcss@4` (a major migration) and downgrades of `eslint-config-next` and `next-pwa`. These are out of scope.
- `braces` runs at build and lint time on repository-controlled glob patterns. It does not receive user input at runtime.

No critical finding remains.
