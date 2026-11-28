# Deployment & Domains

This marketing site is a Next.js app hosted on **Vercel** and served
through **Cloudflare** (DNS + proxy / orange-cloud). Vercel builds the
`master` branch and serves the production deployment.

## Live domains

| Domain            | Behavior                                                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `mifune.dev`      | primary domain, served by Vercel                                                                                                                               |
| `www.mifune.dev`  | Vercel redirects to `https://mifune.dev/`                                                                                                                      |
| `mifune.io`       | redirects to `https://mifune.dev/`                                                                                                                             |
| `agro.mifune.dev` | redirect-only host on the Vercel website project: `308` to the matching `https://mifune.dev` page; HTTP `200` for `/install.sh`, `/get-agro.sh`, `/agro.js`, `/oh.js` |

## DNS pattern (Cloudflare → Vercel)

Each domain's Cloudflare DNS record points at Vercel and is **Proxied**
(orange cloud). When you add a domain, **mirror the record of a known-good
sibling** (e.g. `mifune.dev`). Vercel's standard targets:

- Apex (`example.com`): `A → 76.76.21.21`
- Subdomain (`www`): `CNAME → cname.vercel-dns.com`

Then add the domain in the Vercel project: **Settings → Domains**. Vercel
issues the TLS certificate after DNS resolves.

### `agro.mifune.dev` cutover

The operator runs this cutover (US-011). The host rules live in
`src/config/agro-redirects.ts` and apply only when the `Host` header is
`agro.mifune.dev`.

1. Add `agro.mifune.dev` to the Vercel website project: **Settings → Domains**.
2. In Cloudflare, change the `agro` record from the agro-web GitHub Pages
   target to `CNAME → cname.vercel-dns.com`, **Proxied**, like the `www`
   record.
3. Verify:

   ```sh
   curl -sI https://agro.mifune.dev/docs/agro | grep -iE '^(HTTP|location)'
   # expect 308 and location: https://mifune.dev/docs/agro/intro
   curl -s -o /dev/null -w '%{http_code}\n' https://agro.mifune.dev/install.sh
   # expect 200
   ```

Keep the `agro` DNS record for 12 months after the agro-web repository is
archived.

> **SSL/TLS mode must be Full (or Full strict)** in the Cloudflare zone — **not
> Flexible**. Flexible in front of Vercel causes redirect loops.

A proxied record that points at a dead origin returns Cloudflare **Error
1016 (Origin DNS error)** for the whole site. Check the record target first
when one domain fails and its siblings work.

## Verify

```sh
# Served by Vercel? — expect x-vercel-id and x-vercel-cache
curl -sI https://mifune.dev/ | grep -iE 'x-vercel-id|x-vercel-cache'

# DNS — Cloudflare's resolver reflects changes instantly (public resolvers may lag)
dig @1.1.1.1 mifune.dev
```

## Note: deprecated cloudflared tunnel

An earlier hosting path used a `mifune-web` Cloudflare Tunnel
(`~/.cloudflared/config.yml`, ingress `mifune.dev → localhost:3000`). It is
**no longer the web origin** — Vercel is. Do not point the public web
domains at the tunnel; doing so yields a `502` (tunnel reached, origin not
running) instead of a working site.
