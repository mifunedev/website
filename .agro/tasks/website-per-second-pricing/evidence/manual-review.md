# Manual review evidence

This file lists the evidence for US-002 to US-008 of the per-second pricing task. The head commit under review is `6170ef4`. All paths are relative to `.agro/tasks/website-per-second-pricing/evidence/`.

## Capture method

- The worker served the production build of `6170ef4` with `npx next start -p 3101` in the tmux session `d2-website-3101`. The worker did not rebuild `.next`.
- The worker captured `after/` from `http://localhost:3101`.
- The worker captured `before/` from `https://mifune.dev`. The live site serves `master`, the state before PR #101.
- The agent-browser session `d2-us008` took each screenshot. The desktop viewport is 1280x720. The mobile viewport is 414x896.
- Each screenshot shows the viewport only. The capture script scrolls the named section to the top of the viewport before the screenshot.
- On both sites, the calculator screenshot shows one added 4 GB node. The FAQ screenshot shows the open question "How does billing work?".

## Screenshot index

Each view has a `-desktop.png` file and a `-mobile.png` file in `before/` and in `after/`.

| View | File stem |
|---|---|
| Home page, top | `home` |
| Home page, Console offering bullets | `home-console-offering` |
| `/pricing`, top | `pricing-top` |
| `/pricing`, storage and disk billing fact | `pricing-disk-fact` |
| `/pricing`, pause billing fact | `pricing-pause-fact` |
| `/pricing`, rate table | `pricing-rates` |
| `/pricing`, calculator with one 4 GB node | `pricing-calculator` |
| `/pricing`, FAQ with the billing answer open | `pricing-faq` |
| `/blog/run-agro-on-mifune-console`, free-tier terms | `blog-console-guide-free-tier` |
| `/blog/run-agro-on-mifune-console`, billing paragraph | `blog-console-guide-billing` |

The live site has no storage and disk billing fact. The `before/pricing-disk-fact` files show the "Whole running hours" fact in the same position.

`after/llm-txt-desktop.png` shows the served `/llm.txt` at `6170ef4`. The advisor took this full-page screenshot.

## Live comparison values

The worker observed these values on `https://mifune.dev` on 2026-11-17:

- The pricing page states "Pay by the hour your node runs".
- The billing fact states "Only whole running UTC hours meter".
- The free tier states "up to three n4 nodes that share 24 running hours each UTC month".
- The FAQ states that each workspace stays for 60 days after a pause.
- The 4 GB rate is `$0.0450` an hour. The rate table shows one price for each size, with no storage price.
- The pause fact states the quoted text `Only running time is billed.` The page states no paused price and no free paused days.
- The page and `/llm.txt` do not contain `0.16` as a price. The only `0.16` match is the CSS value `tracking-[0.16em]`.
- The Console guide states "payments are off" and "whole running UTC hours".

The local build at `6170ef4` shows these values:

- The pause fact and the FAQ billing answer state 3 free paused days per UTC calendar month.
- The same two texts state `$0.14` per GB-month, `$2.80` a month for n2, and `$3.50` a month for n4 to n64.
- The calculator with one 4 GB node shows compute `$0.0450/hr`, storage `$0.0090` for each started hour, and a total of `$0.0540` for a full running hour.

## Advisor gate results at 6170ef4

The advisor ran these gates. The worker did not run the gates again.

| Command | Result |
|---|---|
| `npx tsc --noEmit` | exit 0 |
| `npm run lint` | exit 0, no warnings |
| `npm run build` | exit 0. The prebuild `llm.txt` step left no tracked change. |
| `GET /pricing`, `/`, `/blog/run-agro-on-mifune-console`, `/llm.txt` | each HTTP 200 |
| `FAQPage` JSON-LD on `/pricing` | present, with the calendar-month rule and `3.50` |

The worker also requested the four pages from the served build. Each page returned HTTP 200. The worker parsed the `FAQPage` JSON-LD of the served `/pricing`. The JSON-LD contains `calendar month`, `3.50`, and `0.14`. The JSON-LD does not contain `0.16`.

## US-002 Update the pricing data

| Criterion | Evidence | Result |
|---|---|---|
| Compute price of each plan | `src/config/cloud-pricing.ts` | n2 `0.023`, n4 `0.045`, n8 `0.08`, n16 `0.21`, n32 `0.42`, n64 `0.54`. Pass. |
| Storage price of each plan | `src/config/cloud-pricing.ts` | n2 `0.008`, n4 to n64 `0.009`. Pass. |
| Full-hour price is compute plus storage | `fullHourUsd` in `src/config/cloud-pricing.ts`, `after/pricing-rates-*.png`, `after/llm-txt-desktop.png` | The served `/llm.txt` lists `0.0310`, `0.0540`, `0.0890`, `0.2190`, `0.4290`, `0.5490`. Pass. |
| `MINIMUM_BILLED_SECONDS` equals `60` | `src/config/cloud-pricing.ts` | Pass. |
| Paused storage price and free paused days | `src/config/cloud-pricing.ts` | `PAUSED_DISK_USD_PER_GB_MONTH = 0.14`, `FREE_PAUSED_DAYS = 3`. Pass. |
| Free-tier values | `src/config/cloud-pricing.ts` | Two nodes of spec n2 or n4, `24` hours, `14` days. Pass. |
| Lint and build | Advisor gate results | Both exit 0. Pass. |

## US-003 Update the pricing page and the calculator

| Criterion | Evidence | Result |
|---|---|---|
| No "Whole running hours" text | `after/pricing-disk-fact-*.png`, `grep` on `src` | No match. `before/pricing-disk-fact-*.png` shows the old text. Pass. |
| Per-second compute fact with the 60-second minimum | `after/pricing-disk-fact-*.png` | The "Per-second compute" fact is in the billing section. Pass. |
| Storage bills for each started clock hour | `after/pricing-disk-fact-*.png` | The "Storage by the started hour" fact is visible. Pass. |
| Rate table shows compute, storage, and full-hour total | `after/pricing-rates-*.png` | Pass. `before/pricing-rates-*.png` shows one hourly price for each size. |
| Calculator shows compute, storage, and total | `after/pricing-calculator-*.png` | `$0.0450/hr` compute, `$0.0090` storage, `$0.0540` total. Pass. |
| Prepaid credit fact | `after/pricing-pause-fact-desktop.png` | The "Prepaid credit" fact states `$25`, `$50`, `$100`, automatic top-up, the low-balance email, and the 24-hour grace window. Pass. |
| Free-tier values in `cloud-pricing.ts` | `src/config/cloud-pricing.ts` | Pass. |
| Pause fact states free paused days and paused price | `after/annotated/pricing-pause-fact-annotated-*.png` | Pass. |
| Free-tier card and CTA strip | `after/pricing-top-*.png`, `curl` of the served `/pricing` | The screenshot shows the CTA strip. The served HTML holds the free-tier card text. Both texts state two free n2 or n4 nodes, 24 hours each UTC month, no card, and 14 days. Pass. |
| Calculator summary has no "whole" | `grep -ci whole src/components/pricing/FleetCalculator.tsx` | Output `0`. Pass. |
| Browser check | All `after/pricing-*.png` files | Pass. |
| Lint and build | Advisor gate results | Pass. |

## US-004 Update the FAQ and its JSON-LD

| Criterion | Evidence | Result |
|---|---|---|
| Billing answer states per-second billing | `after/pricing-faq-*.png` | Pass. `before/pricing-faq-*.png` shows "Only whole running UTC hours meter". |
| Rates answer uses `cloudNodePlans` | `src/data/faqs.ts` | The answer reads each price from `cloudNodePlans`. Pass. |
| Rates answer states the units | `src/data/faqs.ts` | Pass. |
| Card answer | `src/data/faqs.ts` | Pass. |
| Free-hours answer states 14 days and no "60 days" | `grep` on `src` | No "60 days" match. Pass. |
| New question "How does prepaid credit work?" | `src/data/faqs.ts`, `after/annotated/pricing-faq-billing-annotated-desktop.png` | The question is in the FAQ list. Pass. |
| `FAQPage` JSON-LD holds each changed answer | JSON-LD parse of the served `/pricing` | Pass. |
| Browser check | `after/pricing-faq-*.png` | Pass. |
| Lint and build | Advisor gate results | Pass. |

## US-005 Update the home page offering

| Criterion | Evidence | Result |
|---|---|---|
| Two free n2 or n4 nodes, 24 hours, no "up to three" | `after/home-console-offering-*.png` | The bullet states "Free: two n2 or n4 nodes that share 24 running hours a month". `before/home-console-offering-*.png` states "up to three n4 nodes". Pass. |
| Per-second billing from prepaid credit | `src/config/offerings.ts`, `after/home-console-offering-*.png` | The bullet states "compute per second, storage per started hour, from prepaid credit". Pass. |
| Browser check | `after/home-*.png` | Pass. |
| Lint and build | Advisor gate results | Pass. |

## US-006 Update the Console blog guide

| Criterion | Evidence | Result |
|---|---|---|
| Two free nodes, 24 hours, 14 days | `after/blog-console-guide-free-tier-*.png` | Pass. |
| No "three free nodes", no "60 days", no "archives the node's files" | `grep` on `posts/run-agro-on-mifune-console.md` | No match. `before/blog-console-guide-free-tier-*.png` shows the old text. Pass. |
| Billing section states per-second billing and links to `/pricing` | `after/blog-console-guide-billing-*.png` | Pass. |
| No "payments are off" sentence | `grep` on `posts/run-agro-on-mifune-console.md` | No match. Pass. |
| Browser check | `after/blog-console-guide-*.png` | Pass. |

## US-007 Mirror the changes in llm.txt

| Criterion | Evidence | Result |
|---|---|---|
| Generator states per-second compute, started-hour storage, and prepaid credit | `scripts/generate-llm-txt.mjs` line 84, `public/llm.txt` line 31 | Pass. |
| Generator states the minimum, the pause, and the free tier | `scripts/generate-llm-txt.mjs` lines 84 to 90, `public/llm.txt` lines 31 and 42 | The values come from `src/config/cloud-pricing.ts` imports. Pass. |
| `public/llm.txt` lists compute, storage, and full-hour total | `public/llm.txt` lines 35 to 40 | Pass. |
| No "whole running UTC hours", no "up to three n4 nodes", no "60 days" | `grep` on `public/llm.txt` | No match. Pass. |
| Build regenerates `public/llm.txt` with no diff | Advisor gate results | Pass. |

## US-008 Capture review evidence and get design quality sign-off

| Criterion | Evidence | Result |
|---|---|---|
| `before/` and `after/` hold desktop and mobile screenshots of `/`, `/pricing`, the FAQ, the calculator, and the Console guide | `before/`, `after/` | Each directory holds 20 screenshots. Pass. |
| Annotated journey of the pricing page and the FAQ | `after/annotated/` | Four annotated screenshots. The callouts are below. Pass. |
| This file lists each criterion with its evidence | This file | Pass. |
| `external` Design team sign-off names the evidence commit | None | Open. The design team must sign off. |

### Annotated journey

`after/annotated/pricing-pause-fact-annotated-desktop.png` and `after/annotated/pricing-pause-fact-annotated-mobile.png`:

```text
Callouts: 1 is the pause billing fact. 2 is the calendar-month rule. 3 is the 0.14 GB-month price. 4 is the 2.80 and 3.50 paused prices.
```

`after/annotated/pricing-faq-billing-annotated-desktop.png` and `after/annotated/pricing-faq-billing-annotated-mobile.png`:

```text
Callouts: 1 is the open billing question. 2 is the calendar-month rule. 3 is the 0.14 GB-month price. 4 is the 2.80 and 3.50 paused prices.
```

The browser adds a `span` around each annotated phrase before the screenshot. The span changes only the open page in the browser. The span does not change the source.

### Browser errors

`after/pricing-errors.json` holds the `agent-browser errors --json` output for the local `/pricing`. The worker opened the page, opened the billing question, and added one 4 GB node first. The `errors` array is empty.
