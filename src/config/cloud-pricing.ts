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
 *
 * `openharness-cloud` is a separate repository and is not reachable from a
 * `website` checkout, so these values are transcribed rather than imported.
 * Field names mirror the upstream `node-specs.ts` so a side-by-side diff is
 * legible. Do not recompute an hourly rate from provider cost: provider cost
 * and margin are server-only upstream and must never appear in this repo.
 *
 * There is no monthly price field, and none is pending — monthly was withdrawn
 * per decision R4.
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
