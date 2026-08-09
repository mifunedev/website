# Environment variables

This is the canonical environment-variable reference for the Mifune website.
The tracked template is `.example.env` and keeps current site dependencies
active first, with optional integrations commented at the bottom.

Copy it to `.env.local` for local development or configure the same values in
the deployment provider's secret store:

```bash
cp .example.env .env.local
```

Never commit `.env.local` or real credentials.

## Required configuration

| Variable | Configuration |
|---|---|
| `AIRTABLE_API_KEY` | Airtable personal access token used by the contact form. The current route writes to the `Contacts` table in the configured base. |
| `BREVO_API_KEY` | Brevo API key used by the newsletter subscription route. |
| `NEXT_PUBLIC_NODE_ENV` | Current public runtime mode; keep `production` for deployed builds. |
| `NEXT_PUBLIC_SITE_URL` | Canonical public origin used for metadata and absolute links. Use `https://mifune.dev` in production. |

Create the Airtable token with write access to the website's Contacts table.
Create the Brevo key in the Brevo API console with permission to manage
contacts. These credentials are server-side only; do not expose them through
`NEXT_PUBLIC_*` variables.

## Optional configuration

These variables have safe defaults or enable nonessential integrations. Keep
them commented unless the feature is configured:

```dotenv
# NEXT_PUBLIC_GA_ID=
# NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
# YOUTUBE_CHANNEL_ID=
```

`NEXT_PUBLIC_GA_ID` enables Google Analytics in production. The Google site
verification value enables Search Console verification. `YOUTUBE_CHANNEL_ID`
enables the optional YouTube feed; without it, the site simply shows no feed.
