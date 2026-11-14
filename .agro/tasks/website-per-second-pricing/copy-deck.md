# Copy deck: website per-second pricing

Status: DRAFT, for design scope review.

This deck lists each surface in the Key Integration Points table of `prd.md`. Each item gives the location, the current text, and the new text. The current text is a byte-for-byte quote of the file at commit `4a0aff5`. The new text states only approved Console behavior.

Reader: the design team. The design team approves the scope before US-002 starts.

## Conventions

- JSX text that wraps over two lines or more in the source appears on one line in this deck. The deck changes no word of the quote.
- `unchanged` marks text that this plan keeps.
- `unchanged: E4-00` marks the pause fact that story E4-00 corrects in a separate PR. This plan keeps that text byte for byte.
- An angle-bracket placeholder, such as `<design approver>`, marks a value with no approved number. "Questions for review" lists each placeholder.
- A `${...}` expression in new text stays code. The rendered line under it shows the output with the new values.
- The copy uses "node" for a console node. No new text names a brain or a hand. No new text names an `agro hands` command.

## Source values

Each value comes from `mifunedev/agro-console` `.agro/tasks/per-second-prepaid-billing/prd.md` at commit `3c5ebd85`, unless the row names another source.

| Value | Approved value | Source |
|---|---|---|
| `n4` hourly price | `0.0700` USD | US-003, line 37; approval paragraph, line 302 |
| `n8` hourly price | `0.1100` USD | US-003, line 37 |
| `n16` hourly price | `0.2600` USD | US-003, line 37 |
| `n32` hourly price | `0.5200` USD | US-003, line 37 |
| `n64` hourly price | `0.6400` USD | US-003, line 37 |
| Billing unit | per second, `round(seconds * hourlyCustomerPriceUsd * 1_000_000 / 3600)` micro-USD | US-008, lines 93 and 98 |
| Per-run minimum | `300` seconds | US-008, line 99; US-001, line 17; line 302 |
| Hot paused disk price | `0.16` USD per GB-month, prorated per second | US-004, line 47; US-009, line 110 |
| Free paused days for a paid node | `14` | `platform.pause.freeDays`; supervisor answer (b), 2026-11-14 |
| Top-up amounts | `10`, `25`, `50`, `100` USD | US-007, line 84; line 302 |
| Automatic top-up | optional, at a threshold and an amount that the org sets | US-010, line 122 |
| Low-balance warning | email when the balance covers less than 24 hours of the current org spend rate | US-010, lines 123 and 124 |
| Low-balance email recipients | each org admin and each verified billing account manager | US-010, line 123 |
| Grace window | `24` hours after the balance goes negative | US-011, line 134 |
| Free nodes | `2`, live or paused | US-005, lines 53, 58, and 60; line 302 |
| Free node spec | `n4` | Not in the Console prd. Source: website `src/config/cloud-pricing.ts`, `FREE_TIER_NODE_SPEC`, line 57 |
| Shared free running time | `86400` seconds (24 hours) each month | US-005, line 59; line 302 |
| Paused free retention | `14` days | `platform.pause.freeRetentionDays`; supervisor answer (c), 2026-11-14 |
| Card for a paid node | a card-verified Stripe Checkout buys the credit | Summary, line 210; US-007, line 84 |

The website `prd.md` Open Questions paragraph restates the same prices, minimum, disk price, top-ups, warning, grace window, free node count, and retention. The two sources agree on each value that both state.

The rendered monthly estimates below use `HOURS_PER_MONTH` (`730`) and the new prices. The code computes these numbers. The deck shows them for review only.

| Spec | Hourly | 730 hours |
|---|---|---|
| `n4` | `$0.0700` | `$51.10` |
| `n8` | `$0.1100` | `$80.30` |
| `n16` | `$0.2600` | `$189.80` |
| `n32` | `$0.5200` | `$379.60` |
| `n64` | `$0.6400` | `$467.20` |

## 1. `src/config/cloud-pricing.ts`

This file holds values, not visible copy. Each page reads the values from this file.

| Location | Current | New |
|---|---|---|
| `cloudNodePlans[0].hourlyUsd` (`n4`), line 21 | `0.045` | `0.07` |
| `cloudNodePlans[1].hourlyUsd` (`n8`), line 29 | `0.1` | `0.11` |
| `cloudNodePlans[2].hourlyUsd` (`n16`), line 37 | `0.21` | `0.26` |
| `cloudNodePlans[3].hourlyUsd` (`n32`), line 45 | `0.45` | `0.52` |
| `cloudNodePlans[4].hourlyUsd` (`n64`), line 53 | `0.6` | `0.64` |
| `MINIMUM_BILLED_SECONDS`, new export | none | `300` |
| paused disk price per GB-month, new export | none | `0.16` |
| free paused days, new export | none | `14` |
| free node count, new export | none | `2` |
| free running hours each UTC month, new export | none | `24` |
| paused free retention days, new export | none | `14` |
| top-up amounts in USD, new export | none | `[10, 25, 50, 100]` |
| low-balance warning hours, new export | none | `24` |
| grace window hours, new export | none | `24` |

US-002 names only `MINIMUM_BILLED_SECONDS`. The implementer names the other exports.

`FREE_TIER_NODE_SPEC`, `formatHourlyUsd`, `HOURS_PER_MONTH`, and `monthlyHourPresets` stay unchanged. The labels `Always on`, `Weekdays, 12 h`, and `Weekdays, 8 h` stay unchanged.

## 2. `src/app/pricing/page.tsx`

### 2.1 Metadata description

Location: `description`, line 24.

Current:

```text
Mifune Console nodes are billed by the hour they run, on a dedicated VM. AI usage is not included — you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, with your own account. Or self-host the Apache-2.0 licensed project yourself.
```

New:

```text
Mifune Console nodes are billed per second they run, from prepaid credit, on a dedicated VM. AI usage is not included — you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, with your own account. Or self-host the Apache-2.0 licensed project yourself.
```

### 2.2 Hero heading

Location: `<h1>`, line 99.

Current:

```text
Pay by the hour your node runs.
```

New:

```text
Pay by the second your node runs.
```

### 2.3 Hero paragraph

Location: hero `<p>`, lines 102 to 107.

Current:

```text
A node is a dedicated cloud VM running your AGRO workspace, and you pay for the hours it runs. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, inside the workspace with your own account, and pay that provider directly. Mifune holds no model credential.
```

New:

```text
A node is a dedicated cloud VM running your AGRO workspace, and you pay from prepaid credit for each second it runs. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, inside the workspace with your own account, and pay that provider directly. Mifune holds no model credential.
```

### 2.4 Hero contact link

Location: hero link, line 126.

Current and new, `unchanged`:

```text
Running more than three nodes? Talk to us
```

"Questions for review" item 6 covers the paid node limit.

### 2.5 CTA strip

Location: the mono line under the hero buttons, lines 133 to 135.

Current:

```text
Free for personal accounts: up to three n4 nodes that share 24 running hours a month, no card · Limited free spots · Paid nodes need a card
```

New:

```text
Free for personal accounts: two n4 nodes that share 24 running hours each UTC month, no card, 14 days of paused retention · Limited free spots · Paid nodes run from prepaid credit
```

### 2.6 Free-tier card

Location: free-tier card `<p>`, lines 153 and 154. The eyebrow `Free tier`, the heading `Start your free workspace`, the button `Create free node`, and the note `Limited free spots.` stay unchanged.

Current:

```text
Personal accounts get up to three n4 nodes that share 24 running hours each UTC month. No credit card. No SSH key.
```

New:

```text
Personal accounts get two free n4 nodes that share 24 running hours each UTC month. No credit card. No SSH key. A paused free node keeps its workspace for 14 days.
```

### 2.7 Billing facts

Location: `billingFacts`, lines 45 to 66. The new list holds five facts in this order. The current list holds four.

Fact 1, `unchanged`:

```text
title: A dedicated VM
detail: One node is a dedicated virtual machine, not shared infrastructure. Its vCPU, memory, and disk are yours for as long as the node exists.
```

Fact 2, current, lines 52 to 54:

```text
title: Whole running hours
detail: Only whole running UTC hours meter. Any UTC hour in which your node was running counts as one full hour, at the rate for its size.
```

Fact 2, new. The value `300` comes from `MINIMUM_BILLED_SECONDS`:

```text
title: Per-second billing
detail: Each second your node runs meters at the rate for its size. Each run pays for at least 300 seconds.
```

Fact 3, new. The current list has no fact for credit:

```text
title: Prepaid credit
detail: Paid nodes run from prepaid credit. Add $10, $25, $50, or $100 at a time, or turn on automatic top-up. When your balance covers less than 24 hours of spend, your org admins get an email. A negative balance starts a 24-hour grace window. If no top-up arrives in that window, the Console pauses your running paid nodes.
```

Fact 4, `unchanged`:

```text
title: Queued and failed time is free
detail: Time spent queued, building, or on a build that failed is not billed. The meter starts when the node is running.
```

Fact 5, current, lines 62 to 64:

```text
title: Pause or destroy to stop paying
detail: Only running time is billed. Pause a node to stop billing and keep /home/sandbox, where your repositories live. Pause does not keep running processes, memory, or Docker volume data. Destroy a node to delete it for good.
```

Fact 5, new. The sentence `Pause does not keep running processes, memory, or Docker volume data.` and the clause `keep /home/sandbox, where your repositories live` are `unchanged: E4-00`:

```text
title: Pause or destroy to stop the running charge
detail: Pause a node to stop the running charge and keep /home/sandbox, where your repositories live. Pause does not keep running processes, memory, or Docker volume data. A paused paid node keeps its disk free for 14 days, then pays $0.16 per GB-month, billed per second. Destroy a node to delete it for good.
```

### 2.8 Other page text

These strings stay `unchanged`: `Billing mechanic`, `How billing works`, `Hourly rates`, `What a node costs`, `Choose a size when you create the node. Run more than one and each node meters on its own.`, the self-hosted section, and the FAQ section heading and subheading.

## 3. `src/components/pricing/FleetCalculator.tsx`

### 3.1 `describeFleet`, empty fleet

Location: line 32.

Current:

```text
`No nodes selected. Nodes start at ${formatHourlyUsd(entryPlan.hourlyUsd)} an hour.`
```

New:

```text
`No nodes selected. Nodes start at ${formatHourlyUsd(entryPlan.hourlyUsd)} an hour, billed per second.`
```

Rendered: `No nodes selected. Nodes start at $0.0700 an hour, billed per second.`

### 3.2 `describeFleet`, one node or more

Location: line 35.

Current:

```text
`${count} ${nodeWord}. ${formatHourlyUsd(fleetHourlyUsd(fleet))} per hour, or ${formatUsdTotal(fleetTotalUsd(fleet, hours))} for ${hours} running hours in a month — an estimate, and there is no monthly plan.`
```

New:

```text
`${count} ${nodeWord}. ${formatHourlyUsd(fleetHourlyUsd(fleet))} per hour, billed per second, or ${formatUsdTotal(fleetTotalUsd(fleet, hours))} for ${hours} running hours in a month — an estimate, and there is no monthly plan.`
```

Rendered for one `n4` node at 730 hours: `1 node. $0.0700 per hour, billed per second, or $51.10 for 730 running hours in a month — an estimate, and there is no monthly plan.`

### 3.3 Fleet summary

Location: summary `<p>`, lines 230 and 231. US-003 requires no "whole" in the summary text.

Current:

```text
{nodeCount} {nodeCount === 1 ? "node" : "nodes"}, each metering on its own for every whole hour it runs.
```

New:

```text
{nodeCount} {nodeCount === 1 ? "node" : "nodes"}, each metering on its own for every second it runs.
```

The estimate line at lines 234 to 239 stays `unchanged`. The labels `/hr`, `Free tier eligible`, `Default`, `Running hours a month`, and `Add a node above to price a fleet.` stay `unchanged`.

## 4. `src/data/faqs.ts`

### 4.1 `faqs`, "How do I start?"

Location: `faqs[5].answer`, line 44. The home page shows this answer. The prd acceptance criteria forbid "up to three" on the site.

Current:

```text
Open console.mifune.dev and start free with a personal account: up to three n4 nodes that share 24 running hours each UTC month, no card, opened in your browser. Visit github.com/mifunedev/agro and read the docs at agro.mifune.dev for the self-hosted path. Email hello@mifune.dev to discuss engineering support for the Console.
```

New:

```text
Open console.mifune.dev and start free with a personal account: two n4 nodes that share 24 running hours each UTC month, no card, opened in your browser. Visit github.com/mifunedev/agro and read the docs at agro.mifune.dev for the self-hosted path. Email hello@mifune.dev to discuss engineering support for the Console.
```

### 4.2 `pricingFaqs`, "How does billing work?"

Location: `pricingFaqs[0].answer`, line 68.

Current:

```text
You pay for the hours your node runs. Only whole running UTC hours meter, so any UTC hour in which the node was running counts as one full hour at the rate for its size. Time spent queued, building, or on a build that failed is not billed. Pause a node in the Console to stop billing and keep its workspace, or destroy it to delete it for good.
```

New. The value `300` comes from `MINIMUM_BILLED_SECONDS`:

```text
You pay from prepaid credit for each second your node runs, at the rate for its size. Each run pays for at least 300 seconds. Time spent queued, building, or on a build that failed is not billed. Pause a node in the Console to stop the running charge and keep its workspace, or destroy it to delete it for good. A paused paid node keeps its disk free for 14 days, then pays $0.16 per GB-month.
```

### 4.3 `pricingFaqs`, "What does a node cost?"

Location: `pricingFaqs[1].answer`, line 72. Each rate still comes from `cloudNodePlans` through `hourlyRateSentence`.

Current:

```text
`Each size is priced per whole running hour: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan.`
```

New:

```text
`Each size has an hourly rate, billed per second of running time: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan.`
```

Rendered rates: `4 GB (2 vCPU, 4 GB RAM, 50 GB SSD) is $0.0700 an hour; 8 GB (4 vCPU, 8 GB RAM, 50 GB SSD) is $0.1100 an hour; 16 GB (4 vCPU, 16 GB RAM, 100 GB SSD) is $0.2600 an hour; 32 GB (8 vCPU, 32 GB RAM, 200 GB SSD) is $0.5200 an hour; 64 GB (8 vCPU, 64 GB RAM, 200 GB SSD) is $0.6400 an hour`.

Rendered estimates: `4 GB about $51.10, 8 GB about $80.30, 16 GB about $189.80, 32 GB about $379.60, 64 GB about $467.20`.

### 4.4 `pricingFaqs`, "Do I need a card to start?"

Location: `pricingFaqs[3].answer`, line 82.

Current:

```text
No, not for the free tier. A personal account gets up to three n4 nodes that share 24 running hours each UTC month, and no card. At the limit, the nodes pause, and each workspace is kept for 60 days. A paid node needs a card. Free spots are limited.
```

New:

```text
No, not for the free tier. A personal account gets two n4 nodes that share 24 running hours each UTC month, and no card. At the limit, the nodes pause, and each workspace is kept for 14 days. A paid node runs from prepaid credit, which you buy with a card. Free spots are limited.
```

### 4.5 New question, "How does prepaid credit work?"

Location: new entry in `pricingFaqs`, after "Do I need a card to start?". The top-up amounts, the warning hours, and the grace window come from `src/config/cloud-pricing.ts`.

Current: none.

New:

```text
question: How does prepaid credit work?
answer: A paid node runs from your organization's prepaid credit. Buy credit in the Console in amounts of $10, $25, $50, or $100. Turn on automatic top-up to charge your saved card when the balance falls below a threshold that you set. When the balance covers less than 24 hours at your current spend, each org admin and billing account manager gets an email, and the Console shows a banner. A negative balance starts a 24-hour grace window. A top-up during the window keeps your nodes running. At the end of the window, the Console pauses each running paid node.
```

### 4.6 `pricingFaqs`, "What happens when my free hours run out?"

Location: `pricingFaqs[4].answer`, line 87.

Current:

```text
Your free nodes pause automatically, and nothing is billed. Add a card to continue now, or wait for the next UTC month. The workspace is kept for 60 days after each pause.
```

New:

```text
Your free nodes pause automatically, and nothing is billed. Add credit to continue now, or wait for the next UTC month. The workspace is kept for 14 days after each pause.
```

### 4.7 Other answers

"Is AI usage included?" and "Do I need an SSH key?" stay `unchanged`. "How many nodes can I run?" stays `unchanged` at this stage. "Questions for review" item 6 covers that answer.

## 5. `src/config/offerings.ts`

Location: `offeringPaths[0].bullets`, lines 34 to 36.

Current:

```text
Persistent workspace for coding agents
Free: up to three n4 nodes that share 24 running hours a month
Browser terminal and editor, no SSH key
```

New. The list grows from three bullets to four:

```text
Persistent workspace for coding agents
Free: two n4 nodes that share 24 running hours a month
Paid nodes billed per second from prepaid credit
Browser terminal and editor, no SSH key
```

The `description`, `cta`, `operator`, and `bestFor` strings stay `unchanged`.

## 6. `posts/run-agro-on-mifune-console.md`

### 6.1 Beta paragraph

Location: line 25. US-006 removes the "payments are off" sentence.

Current:

```text
Mifune Console is in public beta. Expect rough edges and frequent changes. During the beta, payments are off, so you can use only the free tier.
```

New:

```text
Mifune Console is in public beta. Expect rough edges and frequent changes.
```

### 6.2 Free-tier terms

Location: lines 33 to 41. Lines 34, 36, 37, and 40 stay `unchanged`.

Line 33, current:

```text
- You can hold up to **three free nodes** at the same time. Each free node uses the `n4` spec.
```

Line 33, new:

```text
- You can hold **two free nodes** at the same time. Each free node uses the `n4` spec.
```

Line 35, `unchanged`:

```text
- All your free nodes share **24 running hours each UTC calendar month**. Two running free nodes use the allowance twice as fast.
```

Line 38, current:

```text
- When the allowance runs out, the Console pauses each running free node. A pause archives the node's files and deletes the VM. No process state and no memory state survive a pause.
```

Line 38, new. US-006 removes "archives the node's files". "Questions for review" item 7 covers the overlap with E4-00:

```text
- When the allowance runs out, the Console pauses each running free node. A pause keeps the node's files. No process state and no memory state survive a pause.
```

Line 39, current:

```text
- A paused free node keeps its workspace for **60 days**. After 60 days without a resume, the Console deletes the files.
```

Line 39, new:

```text
- A paused free node keeps its workspace for **14 days**. After 14 days without a resume, the Console deletes the files.
```

Line 41, current:

```text
- A paused free node still counts toward the limit of three. Destroy a free node to free its place.
```

Line 41, new:

```text
- A paused free node still counts toward the limit of two. Destroy a free node to free its place.
```

### 6.3 Billing section

Location: line 43.

Current:

```text
When payments open, paid nodes are billed a la carte per node, by the hour. The meter counts whole running UTC hours. There is no monthly plan, and destroying a node stops the charge.
```

New:

```text
Paid nodes run from prepaid credit. The Console debits each running second at the rate for the node spec, and each run pays for at least 300 seconds. There is no monthly plan, and destroying a node stops the charge. See [Pricing](/pricing) for top-ups, the low-balance email, and the grace window.
```

### 6.4 Price table

Location: lines 45 to 51. The vCPU, RAM, and disk columns stay `unchanged`.

Current:

```text
| Spec | vCPU | RAM | Disk | Each running hour |
| --- | --- | --- | --- | --- |
| `n4` (default) | 2 | 4 GB | 50 GB SSD | $0.0450 |
| `n8` | 4 | 8 GB | 50 GB SSD | $0.1000 |
| `n16` | 4 | 16 GB | 100 GB SSD | $0.2100 |
| `n32` | 8 | 32 GB | 200 GB SSD | $0.4500 |
| `n64` | 8 | 64 GB | 200 GB SSD | $0.6000 |
```

New:

```text
| Spec | vCPU | RAM | Disk | Per running hour, billed per second |
| --- | --- | --- | --- | --- |
| `n4` (default) | 2 | 4 GB | 50 GB SSD | $0.0700 |
| `n8` | 4 | 8 GB | 50 GB SSD | $0.1100 |
| `n16` | 4 | 16 GB | 100 GB SSD | $0.2600 |
| `n32` | 8 | 32 GB | 200 GB SSD | $0.5200 |
| `n64` | 8 | 64 GB | 200 GB SSD | $0.6400 |
```

### 6.5 Create form description

Location: line 59. The current text names the limit of three free nodes.

Current:

```text
- **Billing.** **Free** is selected. The option shows the free hours left this month, the reset date, and how many of your three free nodes are in use. At three free nodes, the form disables the free option.
```

New:

```text
- **Billing.** **Free** is selected. The option shows the free hours left this month, the reset date, and how many of your two free nodes are in use. At two free nodes, the form disables the free option.
```

Line 53, the link to `/pricing` at line 179, and the rest of the guide stay `unchanged`.

## 7. `scripts/generate-llm-txt.mjs` and `public/llm.txt`

`npm run build` regenerates `public/llm.txt` from the script. The design team reviews the script text. `HOURLY_RATES` and the `MONTHLY_ESTIMATES` template stay `unchanged`. The new prices change the rendered numbers.

### 7.1 Billing paragraph

Location: `LLM_TXT_CONTENT`, line 64.

Current:

```text
Nodes are billed by the hour they run, each on a dedicated VM rather than shared infrastructure. Only whole running UTC hours meter; queued, building, and failed time is free. Pausing a node stops billing and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.
```

New. The clause `keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data` is `unchanged: E4-00`:

```text
Nodes are billed per second they run, from prepaid credit, each on a dedicated VM rather than shared infrastructure. Each run pays for at least 300 seconds; queued, building, and failed time is free. Credit comes in top-ups of 10, 25, 50, or 100 USD, with an optional automatic top-up. When the balance covers less than 24 hours of spend, the org admins get an email; a negative balance starts a 24-hour grace window, and running paid nodes pause at its end. Pausing a node stops the running charge and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. A paused paid node keeps its disk free for 14 days, then pays 0.16 USD per GB-month, prorated per second. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.
```

### 7.2 Rates heading

Location: line 66.

Current:

```text
Hourly rates, per whole hour a node is running:
```

New:

```text
Hourly rates, billed per second a node is running:
```

Rendered rates in `public/llm.txt`:

```text
- 4 GB (2 vCPU / 4 GB RAM / 50 GB SSD): $0.0700
- 8 GB (4 vCPU / 8 GB RAM / 50 GB SSD): $0.1100
- 16 GB (4 vCPU / 16 GB RAM / 100 GB SSD): $0.2600
- 32 GB (8 vCPU / 32 GB RAM / 200 GB SSD): $0.5200
- 64 GB (8 vCPU / 64 GB RAM / 200 GB SSD): $0.6400
```

### 7.3 Free-tier paragraph

Location: line 70.

Current:

```text
A personal free tier gives up to three n4 nodes that share 24 running hours per UTC month, with no card; the nodes auto-pause at the limit and each workspace is kept 60 days after each pause. Free spots are limited, and a paid node needs a card. There is no monthly plan.
```

New:

```text
A personal free tier gives two n4 nodes that share 24 running hours per UTC month, with no card; the nodes auto-pause at the limit and each workspace is kept 14 days after each pause. Free spots are limited, and a paid node runs from prepaid credit. There is no monthly plan.
```

### 7.4 Monthly estimate lead

Location: line 72.

Current:

```text
A node left running for a whole month is billed as ${HOURS_PER_MONTH} whole hours at the rate above, which works out to:
```

New:

```text
A node left running for a whole month is billed for ${HOURS_PER_MONTH} hours at the rate above, which works out to:
```

Rendered estimates in `public/llm.txt`:

```text
- 4 GB: about $51.10 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 8 GB: about $80.30 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 16 GB: about $189.80 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 32 GB: about $379.60 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 64 GB: about $467.20 for 730 running hours — an estimate from the hourly rate, not a monthly plan
```

Line 76 and the rest of the script stay `unchanged`.

## 8. `src/lib/schema.ts`

No text change. `faqPageSchema` reads `pricingFaqs`, so the `FAQPage` JSON-LD carries each changed answer and the new question from section 4.

## Questions for review

1. The website `prd.md` US-002 states "one live `n4` node". US-003, US-005, US-006, and the Console prd US-005 state two nodes. This deck uses two. The plan owner corrects US-002.
   Answer (supervisor, 2026-11-14): Resolved. Two free `n4` nodes is the approved value. The "one live `n4` node" text in US-002 of `prd.md` is a stale line, and the advisor corrects `prd.md`. The deck keeps two.
2. The free paused days for a paid node have no approved value. The Console prd US-009 names `platform.pause.freeDays` and sets no number. Agro-console `config.yaml` line 77 sets `freeDays: 14` today, but the operator approval at line 302 omits this value. The first draft used a placeholder. The operator supplies the value.
   Answer (supervisor, 2026-11-14): Resolved. Free paused days for a paid node stay at `14` (`platform.pause.freeDays`). The Console Stage 1 plan does not change that value. A later cold-tier task (agro-console#767) can change the value. Until then, the site states `14`.
3. The Console prd states no number for paused free retention. The value `14` comes from agro-console `config.yaml` `platform.pause.freeRetentionDays` and from the website `prd.md`. The same `config.yaml` also sets `platform.freeTier.retentionDays: 60` at line 72. The operator confirms `14` as the customer-facing retention.
   Answer (supervisor, 2026-11-14): Resolved. `14` days is the paused free retention. The Console reads `platform.pause.freeRetentionDays` (`14`) in `apps/web/server/services/free-tier.service.ts` and in the provisioner free-tier cleanup. `freeTier.retentionDays` (`60`) is not on the retention path. The `60` in the agro-console README is one of the known stale facts. If agro-console#732 changes a free-tier limit before US-002 starts, the site follows production at build time.
4. The Console prd does not name the free node spec. The deck uses `n4` from the website `FREE_TIER_NODE_SPEC`. The operator confirms `n4`.
5. The Console prd Open Question 2 asks whether US-001 confirms the 300-second minimum. US-001 can raise the minimum. The site ships only after the Console deploys, so the deck uses `300`. The implementer re-checks `MINIMUM_BILLED_SECONDS` against the US-001 evidence.
6. The hero link "Running more than three nodes? Talk to us" and the answer "How many nodes can I run?" state a default of three paid nodes. No approved value names a paid node limit. Agro-console `config.yaml` sets `platform.pause.maxPausedNodesPerOrg: 3`, which is a pause limit. The deck keeps both strings. The operator confirms the paid node limit.
7. US-006 removes "archives the node's files" from the guide. The accurate pause fact belongs to story E4-00. The deck writes "A pause keeps the node's files." as a neutral bridge. The design team confirms the bridge, or the plan owner moves line 38 to E4-00.
8. The Console prd Open Question 1 leaves credit expiry and refunds open (issue #486). The deck states no expiry and no refund term.
9. The billing facts grid uses `lg:grid-cols-4`. The new list holds five facts. The design team picks the layout.
10. The Console offering grows from three bullets to four. The design team confirms the card layout on `/`.
11. The guide screenshot `create-form.png` and the video `create-free-node.mp4` can show three free nodes. US-008 captures new evidence. The design team decides whether the guide media needs a new capture. This plan adds no new illustration.
12. The Console prd describes two free nodes as room for "a brain and one hand". The deck keeps the term "node" in all new copy. The design team decides whether the free-tier copy names a brain and a hand.
13. US-003 names a "CTA strip" without a location. The deck reads the CTA strip as the mono line under the hero buttons, lines 133 to 135. `CTASection` holds no pricing text.
14. `<design approver>` is open in the website `prd.md` Open Questions. The approver names the copy deck commit in the scope approval.
