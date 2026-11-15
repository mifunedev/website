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
| `n2` plan | `2 GB`: 1 vCPU, 2 GB RAM, 20 GB SSD | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n2` compute price | `0.023` USD per hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n4` compute price | `0.045` USD per hour | operator pricing decision, 2026-11-14, relayed by the supervisor |
| `n8` compute price | `0.08` USD per hour | operator pricing decision, 2026-11-14, relayed by the supervisor |
| `n16` compute price | `0.21` USD per hour | operator pricing decision, 2026-11-14, relayed by the supervisor |
| `n32` compute price | `0.42` USD per hour | operator pricing decision, 2026-11-14, relayed by the supervisor |
| `n64` compute price | `0.54` USD per hour | operator pricing decision, 2026-11-14, relayed by the supervisor |
| `n2` storage price | `0.008` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n4` storage price | `0.015` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n8` storage price | `0.015` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n16` storage price | `0.026` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n32` storage price | `0.049` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n64` storage price | `0.049` USD per started clock hour | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n2` full running hour | `0.031` USD (`0.023` + `0.008`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n4` full running hour | `0.060` USD (`0.045` + `0.015`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n8` full running hour | `0.095` USD (`0.08` + `0.015`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n16` full running hour | `0.236` USD (`0.21` + `0.026`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n32` full running hour | `0.469` USD (`0.42` + `0.049`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| `n64` full running hour | `0.589` USD (`0.54` + `0.049`) | agro-console PROGRAM.md Decisions, 2026-11-15 (E8); provider-catalog.yaml |
| Compute unit | per second, with a minimum of `60` seconds for each run | operator pricing decision, 2026-11-14, relayed by the supervisor |
| Storage unit | per started clock hour while the node runs, for the node volumes | operator pricing decision, 2026-11-14, relayed by the supervisor |
| Hot paused disk price | `0.16` USD per GB-month, prorated per second | US-004, line 47; US-009, line 110 |
| Extra disk | `0.16` USD per GB-month, billed per started hour while the node runs; free nodes get no extra disk | PROGRAM.md Decisions, 2026-11-15 (#775); console-config.json platform.pause.diskPriceUsdPerGbMonth |
| Disposable hand boot storage | about `0.003` USD per started hour, plus the compute price of its spec. A disposable hand has no data volume. It cannot pause or fork. | PROGRAM.md Decisions, 2026-11-15 (E7, ADR agro-console#784); provider-catalog.yaml bootStorageHourlyCustomerPriceUsd |
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

The operator pricing decision replaces the single hourly price and the per-run minimum in the Console prd. The website `prd.md` Open Questions paragraph states the new compute, storage, and full-hour prices. The paragraph also restates the disk price, top-ups, warning, grace window, free node count, and retention. The Console prd and the website `prd.md` agree on each of those other values. The E8 decision of 2026-11-15 replaces the storage prices of 2026-11-14 and adds the `n2` plan. The E7 decision adds the disposable hand price.

The rendered monthly estimates below use `HOURS_PER_MONTH` (`730`) and the new prices. A node that runs without a stop starts 730 clock hours, so the estimate is compute times 730 plus storage times 730. The code computes these numbers. The deck shows them for review only.

| Spec | Compute, 730 hours | Storage, 730 started hours | Total |
|---|---|---|---|
| `n2` | `$16.79` | `$5.84` | `$22.63` |
| `n4` | `$32.85` | `$10.95` | `$43.80` |
| `n8` | `$58.40` | `$10.95` | `$69.35` |
| `n16` | `$153.30` | `$18.98` | `$172.28` |
| `n32` | `$306.60` | `$35.77` | `$342.37` |
| `n64` | `$394.20` | `$35.77` | `$429.97` |

## 1. `src/config/cloud-pricing.ts`

This file holds values, not visible copy. Each page reads the values from this file.

| Location | Current | New |
|---|---|---|
| `n2` plan, new first entry in `cloudNodePlans`: label `2 GB`, 1 vCPU, 2 GB RAM, 20 GB SSD | none | compute `0.023`, storage `0.008` |
| `cloudNodePlans[0]` (`n4`) compute price, `hourlyUsd` at line 21 | `0.045` | `0.045` |
| `cloudNodePlans[1]` (`n8`) compute price, `hourlyUsd` at line 29 | `0.1` | `0.08` |
| `cloudNodePlans[2]` (`n16`) compute price, `hourlyUsd` at line 37 | `0.21` | `0.21` |
| `cloudNodePlans[3]` (`n32`) compute price, `hourlyUsd` at line 45 | `0.45` | `0.42` |
| `cloudNodePlans[4]` (`n64`) compute price, `hourlyUsd` at line 53 | `0.6` | `0.54` |
| `cloudNodePlans[0]` (`n4`) storage price per started hour, new field | none | `0.015` |
| `cloudNodePlans[1]` (`n8`) storage price per started hour, new field | none | `0.015` |
| `cloudNodePlans[2]` (`n16`) storage price per started hour, new field | none | `0.026` |
| `cloudNodePlans[3]` (`n32`) storage price per started hour, new field | none | `0.049` |
| `cloudNodePlans[4]` (`n64`) storage price per started hour, new field | none | `0.049` |
| full-hour price, derived as compute plus storage | none | `0.031`, `0.060`, `0.095`, `0.236`, `0.469`, `0.589` |
| `MINIMUM_BILLED_SECONDS`, new export | none | `60` |
| paused disk price per GB-month, new export | none | `0.16` |
| extra disk price per GB-month, new export | none | `0.16` |
| disposable hand boot storage per started hour, new export | none | `0.003` |
| free paused days, new export | none | `14` |
| free node count, new export | none | `2` |
| free running hours each UTC month, new export | none | `24` |
| paused free retention days, new export | none | `14` |
| top-up amounts in USD, new export | none | `[10, 25, 50, 100]` |
| low-balance warning hours, new export | none | `24` |
| grace window hours, new export | none | `24` |

US-002 names only `MINIMUM_BILLED_SECONDS`. The implementer names the other exports and fields. In the new text below, `plan.computeHourlyUsd`, `plan.storageHourlyUsd`, and `fullHourUsd(plan)` stand for the compute price, the storage price, and the full-hour price. `fleetTotalUsd` adds compute and storage for each hour.

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
Mifune Console nodes bill compute per second they run and storage for each started hour, from prepaid credit, on a dedicated VM. AI usage is not included — you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, with your own account. Or self-host the Apache-2.0 licensed project yourself.
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
A node is a dedicated cloud VM running your AGRO workspace, and you pay from prepaid credit for each second of compute and each started hour of storage while it runs. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, or Hermes, inside the workspace with your own account, and pay that provider directly. Mifune holds no model credential.
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

Location: `billingFacts`, lines 45 to 66. The new list holds six facts in this order: 1, 2, 2b, 3, 4, 5. The current list holds four.

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

Fact 2, new. The value `60` comes from `MINIMUM_BILLED_SECONDS`. The new text holds two facts for the two price components, so the list holds six facts:

```text
title: Per-second compute
detail: Compute meters for each second your node runs, at the compute price for its size. Each run pays for at least 60 seconds of compute.
```

Fact 2b, new:

```text
title: Storage by the started hour
detail: Storage for the node volumes meters for each started clock hour while your node runs, at the storage price for its size. A full running hour costs the compute price plus the storage price.
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
`No nodes selected. Nodes start at ${formatHourlyUsd(fullHourUsd(entryPlan))} for a full running hour: ${formatHourlyUsd(entryPlan.computeHourlyUsd)} compute, billed per second, plus ${formatHourlyUsd(entryPlan.storageHourlyUsd)} storage for each started hour.`
```

Rendered. `entryPlan` is the cheapest plan shown, `n2`: `No nodes selected. Nodes start at $0.0310 for a full running hour: $0.0230 compute, billed per second, plus $0.0080 storage for each started hour.`

### 3.2 `describeFleet`, one node or more

Location: line 35.

Current:

```text
`${count} ${nodeWord}. ${formatHourlyUsd(fleetHourlyUsd(fleet))} per hour, or ${formatUsdTotal(fleetTotalUsd(fleet, hours))} for ${hours} running hours in a month — an estimate, and there is no monthly plan.`
```

New:

```text
`${count} ${nodeWord}. ${formatHourlyUsd(fleetComputeHourlyUsd(fleet))} compute per hour, billed per second, plus ${formatHourlyUsd(fleetStorageHourlyUsd(fleet))} storage for each started hour, ${formatHourlyUsd(fleetHourlyUsd(fleet))} for a full running hour, or ${formatUsdTotal(fleetTotalUsd(fleet, hours))} for ${hours} running hours in a month — an estimate, and there is no monthly plan.`
```

Rendered for one `n4` node at 730 hours: `1 node. $0.0450 compute per hour, billed per second, plus $0.0150 storage for each started hour, $0.0600 for a full running hour, or $43.80 for 730 running hours in a month — an estimate, and there is no monthly plan.`

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

### 3.4 Rate row for each spec

Location: the price `<p>` of each plan row, lines 105 to 112. US-003 requires three values for each spec on the rate table.

Current:

```text
{formatHourlyUsd(plan.hourlyUsd)} /hr
```

New:

```text
{formatHourlyUsd(fullHourUsd(plan))} /hr
Compute {formatHourlyUsd(plan.computeHourlyUsd)}/hr, billed per second · Storage {formatHourlyUsd(plan.storageHourlyUsd)} per started hour
```

Rendered rows:

```text
2 GB   $0.0310 /hr   Compute $0.0230/hr, billed per second · Storage $0.0080 per started hour
4 GB   $0.0600 /hr   Compute $0.0450/hr, billed per second · Storage $0.0150 per started hour
8 GB   $0.0950 /hr   Compute $0.0800/hr, billed per second · Storage $0.0150 per started hour
16 GB  $0.2360 /hr   Compute $0.2100/hr, billed per second · Storage $0.0260 per started hour
32 GB  $0.4690 /hr   Compute $0.4200/hr, billed per second · Storage $0.0490 per started hour
64 GB  $0.5890 /hr   Compute $0.5400/hr, billed per second · Storage $0.0490 per started hour
```

### 3.5 Row subtotal

Location: the quantity line of each plan row, lines 160 to 164.

Current:

```text
{quantity} × {formatHourlyUsd(plan.hourlyUsd)} = {formatHourlyUsd(fleetHourlyUsd(rowFleet))}/hr
```

New:

```text
{quantity} × {formatHourlyUsd(fullHourUsd(plan))} = {formatHourlyUsd(fleetHourlyUsd(rowFleet))}/hr
```

Rendered for two `n4` nodes: `2 × $0.0600 = $0.1200/hr`.

### 3.6 Fleet cost breakdown

Location: the "Your fleet" block, lines 221 to 228. The large total stays `{formatHourlyUsd(hourlyUsd)} /hr`, and `fleetHourlyUsd` returns compute plus storage. A new line under the total shows the two components.

Current: none.

New:

```text
Compute {formatHourlyUsd(fleetComputeHourlyUsd(fleet))}/hr, billed per second, 60-second minimum for each run · Storage {formatHourlyUsd(fleetStorageHourlyUsd(fleet))} for each started hour · Total {formatHourlyUsd(hourlyUsd)} for a full running hour
```

Rendered for one `n4` node: `Compute $0.0450/hr, billed per second, 60-second minimum for each run · Storage $0.0150 for each started hour · Total $0.0600 for a full running hour`.

Rendered estimate for one `n4` node at 730 hours, from the `unchanged` estimate line at lines 234 to 239: `About $43.80 for 730 running hours in a month — an estimate from the hourly rates above, and there is no monthly plan.`

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

New. The value `60` comes from `MINIMUM_BILLED_SECONDS`:

```text
You pay from prepaid credit for two parts while your node runs. Compute bills for each second, at the compute price for its size, with a minimum of 60 seconds for each run. Storage for the node volumes bills for each started clock hour, at the storage price for its size. Time spent queued, building, or on a build that failed is not billed. Pause a node in the Console to stop the running charge and keep its workspace, or destroy it to delete it for good. A paused paid node keeps its disk free for 14 days, then pays $0.16 per GB-month.
```

### 4.3 `pricingFaqs`, "What does a node cost?"

Location: `pricingFaqs[1].answer`, line 72, and `hourlyRateSentence`, line 51. Each compute price, storage price, and full-hour total comes from `cloudNodePlans` through `hourlyRateSentence`.

`hourlyRateSentence` item, current:

```text
`${plan.label} (${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.diskGb} GB SSD) is ${formatHourlyUsd(plan.hourlyUsd)} an hour`
```

`hourlyRateSentence` item, new:

```text
`${plan.label} (${plan.vcpu} vCPU, ${plan.ramGb} GB RAM, ${plan.diskGb} GB SSD) is ${formatHourlyUsd(plan.computeHourlyUsd)} an hour for compute plus ${formatHourlyUsd(plan.storageHourlyUsd)} for each started hour of storage, ${formatHourlyUsd(fullHourUsd(plan))} for a full running hour`
```

Answer:

Current:

```text
`Each size is priced per whole running hour: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan.`
```

New:

```text
`Each size has a compute price, billed per second with a 60-second minimum for each run, and a storage price, billed for each started clock hour while the node runs: ${hourlyRateSentence}. Every node is a dedicated VM rather than shared infrastructure, and if you run more than one, each meters on its own. Left running for a full ${HOURS_PER_MONTH}-hour month that works out to roughly ${monthlyEstimateList}, which is an estimate derived from the hourly rate and not a monthly plan, because there is no monthly plan. A disposable hand has no data volume, so it pays only a boot storage fee of about $0.003 for each started hour on top of compute. A disposable hand cannot pause or fork.`
```

Rendered rates: `2 GB (1 vCPU, 2 GB RAM, 20 GB SSD) is $0.0230 an hour for compute plus $0.0080 for each started hour of storage, $0.0310 for a full running hour; 4 GB (2 vCPU, 4 GB RAM, 50 GB SSD) is $0.0450 an hour for compute plus $0.0150 for each started hour of storage, $0.0600 for a full running hour; 8 GB (4 vCPU, 8 GB RAM, 50 GB SSD) is $0.0800 an hour for compute plus $0.0150 for each started hour of storage, $0.0950 for a full running hour; 16 GB (4 vCPU, 16 GB RAM, 100 GB SSD) is $0.2100 an hour for compute plus $0.0260 for each started hour of storage, $0.2360 for a full running hour; 32 GB (8 vCPU, 32 GB RAM, 200 GB SSD) is $0.4200 an hour for compute plus $0.0490 for each started hour of storage, $0.4690 for a full running hour; 64 GB (8 vCPU, 64 GB RAM, 200 GB SSD) is $0.5400 an hour for compute plus $0.0490 for each started hour of storage, $0.5890 for a full running hour`.

Rendered estimates: `2 GB about $22.63, 4 GB about $43.80, 8 GB about $69.35, 16 GB about $172.28, 32 GB about $342.37, 64 GB about $429.97`.

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
answer: A paid node runs from your organization's prepaid credit. The Console debits compute for each second the node runs, with a 60-second minimum for each run, and storage for each started clock hour. Buy credit in the Console in amounts of $10, $25, $50, or $100. Turn on automatic top-up to charge your saved card when the balance falls below a threshold that you set. When the balance covers less than 24 hours at your current spend, each org admin and billing account manager gets an email, and the Console shows a banner. A negative balance starts a 24-hour grace window. A top-up during the window keeps your nodes running. At the end of the window, the Console pauses each running paid node.
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
Paid nodes: compute per second, storage per started hour, from prepaid credit
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
Paid nodes run from prepaid credit. The Console debits compute for each running second at the compute price for the node spec, with a minimum of 60 seconds for each run. The Console also debits storage for each started clock hour while the node runs. There is no monthly plan, and destroying a node stops the charge. See [Pricing](/pricing) for top-ups, the low-balance email, and the grace window.
```

### 6.4 Price table

Location: lines 45 to 51. The vCPU, RAM, and disk columns stay `unchanged`. The new table holds three price columns.

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
| Spec | vCPU | RAM | Disk | Compute per hour, billed per second | Storage per started hour | Full running hour |
| --- | --- | --- | --- | --- | --- | --- |
| `n2` | 1 | 2 GB | 20 GB SSD | $0.0230 | $0.0080 | $0.0310 |
| `n4` (default) | 2 | 4 GB | 50 GB SSD | $0.0450 | $0.0150 | $0.0600 |
| `n8` | 4 | 8 GB | 50 GB SSD | $0.0800 | $0.0150 | $0.0950 |
| `n16` | 4 | 16 GB | 100 GB SSD | $0.2100 | $0.0260 | $0.2360 |
| `n32` | 8 | 32 GB | 200 GB SSD | $0.4200 | $0.0490 | $0.4690 |
| `n64` | 8 | 64 GB | 200 GB SSD | $0.5400 | $0.0490 | $0.5890 |
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

`npm run build` regenerates `public/llm.txt` from the script. The design team reviews the script text. The `MONTHLY_ESTIMATES` template stays `unchanged`. The `HOURLY_RATES` template changes in section 7.2. The new prices change the rendered numbers.

### 7.1 Billing paragraph

Location: `LLM_TXT_CONTENT`, line 64.

Current:

```text
Nodes are billed by the hour they run, each on a dedicated VM rather than shared infrastructure. Only whole running UTC hours meter; queued, building, and failed time is free. Pausing a node stops billing and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.
```

New. The clause `keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data` is `unchanged: E4-00`:

```text
Nodes run from prepaid credit, each on a dedicated VM rather than shared infrastructure. Compute bills per second, with a minimum of 60 seconds for each run. Storage for the node volumes bills for each started clock hour while the node runs. Queued, building, and failed time is free. Credit comes in top-ups of 10, 25, 50, or 100 USD, with an optional automatic top-up. When the balance covers less than 24 hours of spend, the org admins get an email; a negative balance starts a 24-hour grace window, and running paid nodes pause at its end. Pausing a node stops the running charge and keeps /home/sandbox, where the repositories live; it does not keep running processes, memory, or Docker volume data. A paused paid node keeps its disk free for 14 days, then pays 0.16 USD per GB-month, prorated per second. A disposable hand has no data volume, so it pays only a boot storage fee of about 0.003 USD for each started hour on top of compute. A disposable hand cannot pause or fork. Destroying a node deletes it. Each node opens in the browser with a terminal and an editor, and needs no SSH key. AI usage is not included: you sign in to each agent CLI you use, such as Claude Code, Codex, Pi, OpenCode, Hermes, or any other supported harness, inside the workspace with your own account and pay that provider directly. Mifune holds no model credential and does not mark up tokens.
```

### 7.2 Rates heading

Location: line 66.

Current:

```text
Hourly rates, per whole hour a node is running:
```

New:

```text
Hourly rates: compute bills per second with a 60-second minimum for each run, and storage bills for each started clock hour while the node runs:
```

`HOURLY_RATES` item, line 21, current:

```text
`- ${plan.label} (${plan.vcpu} vCPU / ${plan.ramGb} GB RAM / ${plan.diskGb} GB SSD): ${formatHourlyUsd(plan.hourlyUsd)}`
```

`HOURLY_RATES` item, new:

```text
`- ${plan.label} (${plan.vcpu} vCPU / ${plan.ramGb} GB RAM / ${plan.diskGb} GB SSD): compute ${formatHourlyUsd(plan.computeHourlyUsd)} per hour, storage ${formatHourlyUsd(plan.storageHourlyUsd)} per started hour, ${formatHourlyUsd(fullHourUsd(plan))} per full running hour`
```

Rendered rates in `public/llm.txt`:

```text
- 2 GB (1 vCPU / 2 GB RAM / 20 GB SSD): compute $0.0230 per hour, storage $0.0080 per started hour, $0.0310 per full running hour
- 4 GB (2 vCPU / 4 GB RAM / 50 GB SSD): compute $0.0450 per hour, storage $0.0150 per started hour, $0.0600 per full running hour
- 8 GB (4 vCPU / 8 GB RAM / 50 GB SSD): compute $0.0800 per hour, storage $0.0150 per started hour, $0.0950 per full running hour
- 16 GB (4 vCPU / 16 GB RAM / 100 GB SSD): compute $0.2100 per hour, storage $0.0260 per started hour, $0.2360 per full running hour
- 32 GB (8 vCPU / 32 GB RAM / 200 GB SSD): compute $0.4200 per hour, storage $0.0490 per started hour, $0.4690 per full running hour
- 64 GB (8 vCPU / 64 GB RAM / 200 GB SSD): compute $0.5400 per hour, storage $0.0490 per started hour, $0.5890 per full running hour
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
A node left running for a whole month pays compute for ${HOURS_PER_MONTH} hours and storage for ${HOURS_PER_MONTH} started hours at the rates above, which works out to:
```

Rendered estimates in `public/llm.txt`:

```text
- 2 GB: about $22.63 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 4 GB: about $43.80 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 8 GB: about $69.35 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 16 GB: about $172.28 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 32 GB: about $342.37 for 730 running hours — an estimate from the hourly rate, not a monthly plan
- 64 GB: about $429.97 for 730 running hours — an estimate from the hourly rate, not a monthly plan
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
5. Superseded by item 15. The Console prd Open Question 2 asks whether the Console US-001 confirms the 300-second minimum. The operator pricing decision sets a 60-second compute minimum for each run, and the deck uses `60`.
6. The hero link "Running more than three nodes? Talk to us" and the answer "How many nodes can I run?" state a default of three paid nodes. No approved value names a paid node limit. Agro-console `config.yaml` sets `platform.pause.maxPausedNodesPerOrg: 3`, which is a pause limit. The deck keeps both strings. The operator confirms the paid node limit.
7. US-006 removes "archives the node's files" from the guide. The accurate pause fact belongs to story E4-00. The deck writes "A pause keeps the node's files." as a neutral bridge. The design team confirms the bridge, or the plan owner moves line 38 to E4-00.
8. The Console prd Open Question 1 leaves credit expiry and refunds open (issue #486). The deck states no expiry and no refund term.
9. The billing facts grid uses `lg:grid-cols-4`. The new list holds six facts. The design team picks the layout.
10. The Console offering grows from three bullets to four. The design team confirms the card layout on `/`.
11. The guide screenshot `create-form.png` and the video `create-free-node.mp4` can show three free nodes. US-008 captures new evidence. The design team decides whether the guide media needs a new capture. This plan adds no new illustration.
12. The Console prd describes two free nodes as room for "a brain and one hand". The deck keeps the term "node" in all new copy. The design team decides whether the free-tier copy names a brain and a hand.
13. US-003 names a "CTA strip" without a location. The deck reads the CTA strip as the mono line under the hero buttons, lines 133 to 135. `CTASection` holds no pricing text.
14. `<design approver>` is open in the website `prd.md` Open Questions. The approver names the copy deck commit in the scope approval.
15. The operator changed the prices on 2026-11-14, and the supervisor relayed the change. Resolved. The Console bills two components. Compute bills per second, with a 60-second minimum for each run: `n4` `0.045`, `n8` `0.08`, `n16` `0.21`, `n32` `0.42`, `n64` `0.54` USD per hour. Storage for the node volumes bills for each started clock hour while the node runs: `n4` `0.023`, `n8` `0.023`, `n16` `0.045`, `n32` `0.09`, `n64` `0.09` USD. A full running hour costs `n4` `0.068`, `n8` `0.103`, `n16` `0.255`, `n32` `0.51`, `n64` `0.63` USD. The disk price, top-ups, warning, grace window, free tier, free paused days, and retention stay unchanged. The deck uses these values on each surface.
16. Open. The agro-console `.agro/tasks/per-second-prepaid-billing/prd.md` still states the single hourly price (US-003, line 37) and the 300-second minimum (US-008, line 99). US-001 criterion 2 requires each new value to match that prd. Criterion 2 cannot pass until that prd states the two-component prices and the 60-second minimum.
17. Resolved. The E8 storage prices (agro-console PROGRAM.md Decisions, 2026-11-15) replace the 2026-11-14 storage prices in item 15. E8 also adds the `n2` plan (1 vCPU, 2 GB RAM, 20 GB SSD) at `0.023` USD per hour of compute. Storage per started clock hour: `n2` `0.008`, `n4` `0.015`, `n8` `0.015`, `n16` `0.026`, `n32` `0.049`, `n64` `0.049` USD. A full running hour costs `n2` `0.031`, `n4` `0.060`, `n8` `0.095`, `n16` `0.236`, `n32` `0.469`, `n64` `0.589` USD. The compute prices of item 15 stay unchanged. Extra disk costs `0.16` USD per GB-month, and free nodes get no extra disk. A disposable hand (ADR agro-console#784) pays the compute price of its spec plus a boot storage fee of about `0.003` USD for each started hour. A disposable hand cannot pause or fork. The copy can state that a disposable hand costs less than a persistent node. The copy must not state that a disposable hand starts sooner than a persistent node. The measured warm start is 21.5 s for a disposable hand and 19.6 s for a persistent node.
