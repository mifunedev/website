# Deployment & Domains

This marketing site is a Next.js app hosted on **Netlify** and served
through **Cloudflare** (DNS + proxy / orange-cloud) on several apex domains.
Every domain proxies to the **same** Netlify deployment — only the per-domain
DNS/host mapping differs.

## Live domains

| Domain           | Host    | Notes                              |
| ---------------- | ------- | ---------------------------------- |
| `ruska.ai`       | Netlify | legacy brand domain, still live    |
| `mifune.sh`      | Netlify | Cloudflare-proxied                 |
| `mifune.io`      | Netlify | Cloudflare-proxied                 |
| `mifune.dev`     | Netlify | primary brand domain               |
| `www.mifune.dev` | Netlify | alias of the apex                  |

## DNS pattern (Cloudflare → Netlify)

Each domain's Cloudflare DNS record points at Netlify and is **Proxied**
(orange cloud). When adding a domain, **mirror the record of a known-good
sibling** (e.g. `mifune.sh`). Netlify's standard targets:

- Apex (`example.com`): `A → 75.2.60.5` **or** `CNAME → apex-loadbalancer.netlify.com` (proxied; Cloudflare flattens the CNAME at the apex)
- Subdomain (`www`): `CNAME → <your-site>.netlify.app` (proxied)

Then add the domain on the Netlify side: **Site configuration → Domain
management → Domains** → add the apex and `www` as aliases. Netlify
auto-provisions the TLS cert once DNS resolves.

> **SSL/TLS mode must be Full (or Full strict)** in the Cloudflare zone — **not
> Flexible**. Flexible in front of Netlify causes redirect loops.

## Incident: mifune.dev down (2026-06-24)

**Symptom:** `https://mifune.dev/` returned Cloudflare **Error 1016 (Origin
DNS error)** — the whole page failed to load; the most visible casualty was
the header logo. The identical code rendered fine on `ruska.ai`,
`mifune.sh`, and `mifune.io`.

**Root cause:** `mifune.dev`'s apex DNS was a proxied CNAME pointing at a
**dead origin** left over from before the Netlify migration. Cloudflare
could not resolve the origin → 1016 (apex `A` queries returned no record
because the unresolvable CNAME could not be flattened). The logo markup
(`src/components/nav/TopNavBar.tsx`, `src/sections/FooterSection.tsx`) was
never at fault — it uses a relative `/images/...` path that works on any
domain.

**Fix:** repoint `mifune.dev` + `www.mifune.dev` at Netlify, matching the
working sibling domains (DNS pattern above), and confirm the zone's SSL/TLS
mode is Full.

## Verify

```sh
# Served by Netlify? — expect x-nf-request-id and "Netlify Durable"
curl -sI https://mifune.dev/ | grep -iE 'x-nf-request-id|cache-status'

# DNS — Cloudflare's resolver reflects changes instantly (public resolvers may lag)
dig @1.1.1.1 mifune.dev
```

## Note: deprecated cloudflared tunnel

An earlier hosting path used a `mifune-web` Cloudflare Tunnel
(`~/.cloudflared/config.yml`, ingress `mifune.dev → localhost:3000`). It is
**no longer the web origin** — Netlify is. Do not point the public web
domains at the tunnel; doing so yields a `502` (tunnel reached, origin not
running) instead of a working site.
