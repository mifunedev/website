/**
 * Published Open Harness Cloud node prices — the single source of every price
 * string on this site. A price change is a one-file edit here.
 *
 * Provenance — these values were transcribed from:
 *
 *   repo:   mifunedev/openharness-cloud
 *   commit: b56c2dfe673aa3ac3f95b8018568130666f6ae7c   ("task: delete the unreachable theme reader, keep the tested rule (#111)", 2026-08-02)
 *   specs:  packages/shared/src/node-specs.ts:18-23
 *   prices: packages/shared/src/provider-catalog.yaml
 *           → `plans.<spec>.hourlyCustomerPriceUsd`
 *
 * `openharness-cloud` is a separate repository and is not reachable from a
 * `website` checkout, so these values are transcribed rather than imported.
 * Field names mirror the upstream `node-specs.ts` so a side-by-side diff is
 * legible.
 *
 * TRANSCRIBE, NEVER RECOMPUTE. Provider cost is server-only upstream and must
 * never appear in this repo, so an hourly rate must be copied from the field
 * named above and nothing else. That field is now a literal — upstream
 * openharness-cloud#123 made the customer price a stated catalog input and
 * turned gross margin into a value derived from it, replacing the older
 * `hourlyMarginPct` from which price used to be computed. The published rates
 * are unchanged by that work; only the field to read them from has a new name.
 * If a future reader finds `hourlyMarginPct` upstream, they are on a commit
 * older than #123 and should not multiply anything.
 *
 * There is no monthly price field, and none is pending. Decision R4 withdrew
 * the monthly SKU and that still stands: nothing here is a monthly plan, and
 * no monthly plan is coming. What R4 no longer forbids is *displaying* a
 * monthly estimate derived from the hourly rate — see `HOURS_PER_MONTH`.
 *
 * That display is not a hole in TRANSCRIBE, NEVER RECOMPUTE. Multiplying a
 * transcribed rate by a quantity and an hour count the visitor chose is
 * arithmetic on a published price; the rate itself is still copied verbatim
 * from the field named above. What the rule forbids is *deriving* a rate —
 * from provider cost, from a margin, from anything upstream keeps server-side.
 * That remains forbidden, and no cost or margin figure may enter this repo.
 */

export type NodeSpec = "small" | "medium" | "large";

export type CloudNodePlan = {
  spec: NodeSpec;
  label: string;
  vcpu: number;
  ramGb: number;
  diskGb: number;
  hourlyUsd: number;
};

/**
 * The spec a node gets when the customer does not choose one — upstream
 * `node-specs.ts:23`, `export const DEFAULT_NODE_SPEC: NodeSpec = "small"`.
 * Mirrored here so the site can badge the default without reaching upstream.
 */
export const DEFAULT_NODE_SPEC: NodeSpec = "small";

export const cloudNodePlans: CloudNodePlan[] = [
  {
    spec: "small",
    label: "Small",
    vcpu: 2,
    ramGb: 4,
    diskGb: 50,
    hourlyUsd: 0.0384,
  },
  {
    spec: "medium",
    label: "Medium",
    vcpu: 4,
    ramGb: 8,
    diskGb: 50,
    hourlyUsd: 0.0692,
  },
  {
    spec: "large",
    label: "Large",
    vcpu: 8,
    ramGb: 30,
    diskGb: 200,
    hourlyUsd: 0.5046,
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
 * is the single rule that makes growing the catalog from three specs to five a
 * data-only change: no component, and nothing here, enumerates spec keys.
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
