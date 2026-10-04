# Legal drafts

The website footer links to four public console policy drafts:

- Terms: `https://console.mifune.dev/legal/terms`
- Privacy: `https://console.mifune.dev/legal/privacy`
- Refunds: `https://console.mifune.dev/legal/refunds`
- Acceptable use: `https://console.mifune.dev/legal/acceptable-use`

Each link shows `DRAFT`. These unfinished policies are not binding terms.
Public access does not establish legal approval or an effective date.
The console owns the policy content. The website does not copy that content.

## Navigation

The footer names the navigation landmark `Legal drafts`.
Each native link opens in the same tab.
The links use the existing footer keyboard focus styles and minimum touch target height.
The list wraps at narrow viewport widths.

## Deployed origin

The links use `OFFERING_URLS.cloud` from `src/config/offerings.ts`.
That origin is `https://console.mifune.dev`, including in local website builds.
A local website build does not publish the console draft routes.
Until the console deploys those routes, the deployed origin can return missing pages.
The advisor must verify each destination before deployment acceptance.
For local browser review, the advisor routes that origin to the local console review server.
The source URLs remain unchanged during local review.

## Regression check

Run the regression check in the website sandbox worktree with Node.js 22.18.0 or later:

```bash
node --test scripts/legal-footer.test.mjs
```

The tests check draft labels, destinations, origin reuse, navigation structure, and footer styles.
The advisor owns desktop, mobile, and keyboard browser evidence.
This change leaves the existing Google Analytics integration unchanged.
