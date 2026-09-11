/**
 * Published Open Harness Cloud node prices — the single source of every price
 * string on this site. A price change is a one-file edit here.
 *
 * Provenance — the five-rung ladder, transcribed from:
 *
 *   repo:  mifunedev/openharness-cloud
 *   spec:  .oh/tasks/node-catalog-repricing/prd.md
 *          → "The approved sheet — 730-hour month", the `price/h` column
 *
 * READ THIS BEFORE CHANGING A NUMBER. These rates are approved but are NOT yet
 * live upstream. `packages/shared/src/provider-catalog.yaml` still carries
 * `small`/`medium`/`large` at the old prices, and `NODE_SPECS` is still the
 * three t-shirt sizes. The website leads the platform here **on purpose**: the
 * marketing page ships the ladder in phase 1, the Console catalog, migration,
 * and Stripe SKUs follow in phase 2 (cloud US-002→US-006). Do not "fix" this
 * file back to the three old specs because upstream disagrees — upstream is
 * behind, and catching up is scheduled work.
 *
 * The hardware IS verified. `pnpm ovh:explore US-EAST-VA-1` was run read-only
 * against the live OVHcloud API on 2026-08-06 and every flavor exists, with
 * vCPU and disk matching the approved sheet exactly:
 *
 *   n4   d2-4    5051d54d-6341-4860-bf63-c4bddbb7c6f0   2 vcpu / 50 GB
 *   n8   d2-8    9802d615-a353-4668-b581-7b2bdedbf54c   4 vcpu / 50 GB
 *   n16  b3-16   1efeacd6-7639-44b3-b0ce-243c827c5ff2   4 vcpu / 100 GB
 *   n32  b3-32   7df840d0-cbd1-4fd0-9642-4c0f9ba65a9e   8 vcpu / 200 GB
 *   n64  r3-64   cd1d3a46-4167-451c-b97b-44f36d3c7994   8 vcpu / 200 GB
 *
 * RAM is NOT in that list deliberately. OVH's flavor API reports `ram=0` for
 * every flavor in the US regions — a documented quirk
 * (`scripts/ovh-explore.mjs:101-103` upstream). The real figure is the trailing
 * number in the flavor name, which is why `n32` is 32 GB. Never take RAM from
 * the API response.
 *
 * Disk reads SSD, not NVMe, and that is a considered choice. The approved sheet
 * calls the top three rungs NVMe, but the API's own taxonomy puts `b3-16` and
 * `b3-32` on `ovh.ssd.eg` — the same family as the outgoing `b2-30` — and
 * `r3-64` on `ovh.ssd.ram`; the genuinely NVMe flavors in this region carry
 * `ovh.raid-nvme.*`. Read-only evidence cannot settle it, so this file claims
 * only what was observed. If provisioning one confirms NVMe, widen it then.
 *
 * TRANSCRIBE, NEVER RECOMPUTE. Provider cost is server-only upstream and must
 * never appear in this repo, so an hourly rate is copied from the approved
 * sheet's `price/h` column and nothing else. Upstream openharness-cloud#123
 * made the customer price a stated catalog input and turned gross margin into a
 * value derived from it, replacing the older `hourlyMarginPct` from which price
 * used to be computed. If a future reader finds `hourlyMarginPct` upstream,
 * they are on a commit older than #123 and should not multiply anything.
 *
 * There is no monthly price field, and none is pending. Decision R4 withdrew
 * the monthly SKU and that still stands: nothing here is a monthly plan, and
 * no monthly plan is coming. What R4 no longer forbids is *displaying* a
 * monthly estimate derived from the hourly rate — see `HOURS_PER_MONTH`.
 *
 * That display is not a hole in TRANSCRIBE, NEVER RECOMPUTE. Multiplying a
 * transcribed rate by a quantity and an hour count the visitor chose is
 * arithmetic on a published price; the rate itself is still copied verbatim
 * from the source named above. What the rule forbids is *deriving* a rate —
 * from provider cost, from a margin, from anything upstream keeps server-side.
 * That remains forbidden, and no cost or margin figure may enter this repo.
 */

/**
 * Spec keys are RAM in GB, not t-shirt sizes. Upstream US-003: t-shirt names
 * "break the moment a rung is added in the middle", and reusing `large` for a
 * different machine was rejected outright because `node_hour_large` is a live
 * billing identifier. The number never collides, so the next insertion is
 * additive.
 */
export type NodeSpec = "n4" | "n8" | "n16" | "n32" | "n64";

export type CloudNodePlan = {
  spec: NodeSpec;
  label: string;
  vcpu: number;
  ramGb: number;
  diskGb: number;
  hourlyUsd: number;
};

/**
 * The spec a node gets when the customer does not choose one. Upstream's
 * migration maps the old `small` to `n4`, so the default follows it.
 */
export const DEFAULT_NODE_SPEC: NodeSpec = "n4";

/**
 * Ascending by price, which is also ascending by RAM. Order is the render
 * order — `FleetCalculator` maps this array straight to rows.
 *
 * `label` is RAM in human-readable form and never the raw spec key: upstream
 * US-003 requires "Console labels remain human-readable (e.g. '4 GB', '32 GB'),
 * never raw enum values", and the two surfaces should read the same.
 */
export const cloudNodePlans: CloudNodePlan[] = [
  {
    spec: "n4",
    label: "4 GB",
    vcpu: 2,
    ramGb: 4,
    diskGb: 50,
    hourlyUsd: 0.045,
  },
  {
    spec: "n8",
    label: "8 GB",
    vcpu: 4,
    ramGb: 8,
    diskGb: 50,
    hourlyUsd: 0.1,
  },
  {
    spec: "n16",
    label: "16 GB",
    vcpu: 4,
    ramGb: 16,
    diskGb: 100,
    hourlyUsd: 0.21,
  },
  {
    spec: "n32",
    label: "32 GB",
    vcpu: 8,
    ramGb: 32,
    diskGb: 200,
    hourlyUsd: 0.45,
  },
  {
    spec: "n64",
    label: "64 GB",
    vcpu: 8,
    ramGb: 64,
    diskGb: 200,
    hourlyUsd: 0.6,
  },
];

/** True for the spec a new node gets by default. */
export function isDefault(spec: NodeSpec): boolean {
  return spec === DEFAULT_NODE_SPEC;
}

/**
 * The published hourly rate as a display string. Every dollar string on the
 * site goes through here, so no page ever hardcodes a number or a format.
 */
export function formatHourlyUsd(hourlyUsd: number): string {
  return `$${hourlyUsd.toFixed(4)}`;
}

/** The cheapest published node, so "starts at" lines cannot drift. */
export const entryPlan: CloudNodePlan = cloudNodePlans.reduce(
  (cheapest, plan) => (plan.hourlyUsd < cheapest.hourlyUsd ? plan : cheapest),
);

/**
 * Hours in the reference month used for every monthly estimate: 730, the
 * 365-day year divided by 12. Chosen over 720 (30 × 24) because it is the
 * convention every hourly cloud vendor quotes against, so a buyer comparing
 * us to one of them is comparing the same month.
 *
 * A monthly figure built from this is an ESTIMATE and never a plan. There is
 * no monthly SKU — see the R4 note in this file's header, and FR-6 of
 * `tasks/fleet-pricing-calculator/prd.md`, which requires every monthly figure
 * the site emits to carry that fact in the same sentence.
 */
export const HOURS_PER_MONTH = 730;

export type MonthlyHourPreset = {
  /** Whole hours in the month. Never fractional — see the note below. */
  hours: number;
  label: string;
};

/**
 * The selectable running-hour scenarios.
 *
 * Every value is a whole integer, and that is a requirement rather than a
 * convenience: a node meters in whole UTC hours, so a control that can express
 * 7.5 hours can express a bill the meter cannot produce. This is exactly the
 * objection that made a calculator a non-goal in
 * `tasks/cloud-pricing-page/prd.md` §4, and fixed integer presets are the
 * answer to it. Do not replace this with a slider or a free number field.
 */
export const monthlyHourPresets: MonthlyHourPreset[] = [
  { hours: HOURS_PER_MONTH, label: "Always on" },
  { hours: 240, label: "Weekdays, 12 h" },
  { hours: 160, label: "Weekdays, 8 h" },
];

/** How many nodes of each size a visitor is pricing. */
export type FleetQuantities = Record<NodeSpec, number>;

/**
 * A fleet with every published spec at zero.
 *
 * Derived from `cloudNodePlans` rather than written as a literal, because this
 * is the single rule that keeps a catalog change data-only: no component, and
 * nothing here, enumerates spec keys. That is not a hypothetical any more —
 * going from the three t-shirt specs to these five rungs touched this file and
 * nothing under `src/components/`.
 */
export function emptyFleet(): FleetQuantities {
  return Object.fromEntries(
    cloudNodePlans.map((plan) => [plan.spec, 0]),
  ) as FleetQuantities;
}

/** Total nodes across every spec. */
export function fleetNodeCount(fleet: FleetQuantities): number {
  return cloudNodePlans.reduce(
    (total, plan) => total + (fleet[plan.spec] ?? 0),
    0,
  );
}

/**
 * The fleet's cost per hour, in integer ten-thousandths of a dollar.
 *
 * Published rates carry four decimals, so a rate is an exact integer count of
 * ten-thousandths ($0.0384 → 384). Summing in that unit and dividing once at
 * the end keeps a mixed fleet exact: in plain float arithmetic `0.0384 * 5` is
 * 0.19199999999999998, and those errors accumulate across specs and then get
 * multiplied by 730.
 */
function fleetHourlyTenThousandths(fleet: FleetQuantities): number {
  return cloudNodePlans.reduce(
    (total, plan) =>
      total + Math.round(plan.hourlyUsd * 10000) * (fleet[plan.spec] ?? 0),
    0,
  );
}

/** The fleet's combined hourly rate in dollars. */
export function fleetHourlyUsd(fleet: FleetQuantities): number {
  return fleetHourlyTenThousandths(fleet) / 10000;
}

/** What the fleet costs over `hours` whole running hours, in dollars. */
export function fleetTotalUsd(fleet: FleetQuantities, hours: number): number {
  return (fleetHourlyTenThousandths(fleet) * hours) / 10000;
}

/**
 * A period total as a display string: two decimals, thousands grouped.
 *
 * Deliberately a second formatter rather than a wider `formatHourlyUsd`,
 * because the two quantities are different kinds of thing:
 *
 *   - an hourly RATE is a published price. Rounding $0.0384 to $0.04 restates
 *     it by 4.2%, so rates keep all four decimals and never pass through here.
 *   - a period TOTAL is a dollars-and-cents figure a buyer compares against an
 *     invoice, where four decimals are noise and grouping aids reading.
 *
 * Hand-rolled rather than `Intl.NumberFormat` so the server and the client
 * emit byte-identical strings: `Intl` output depends on the runtime's ICU
 * build and locale, and a mismatch between the two is a hydration error on a
 * price.
 */
export function formatUsdTotal(usd: number): string {
  const [whole, cents] = usd.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, ",");
  return `$${grouped}.${cents}`;
}
