export type NodeSpec = "n4" | "n8" | "n16" | "n32" | "n64";

export type CloudNodePlan = {
  spec: NodeSpec;
  label: string;
  vcpu: number;
  ramGb: number;
  diskGb: number;
  hourlyUsd: number;
};

export const DEFAULT_NODE_SPEC: NodeSpec = "n4";

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

export const FREE_TIER_NODE_SPEC: NodeSpec = "n4";

export function isFreeTierEligible(spec: NodeSpec): boolean {
  return spec === FREE_TIER_NODE_SPEC;
}

export function isDefault(spec: NodeSpec): boolean {
  return spec === DEFAULT_NODE_SPEC;
}

export function formatHourlyUsd(hourlyUsd: number): string {
  return `$${hourlyUsd.toFixed(4)}`;
}

export const entryPlan: CloudNodePlan = cloudNodePlans.reduce(
  (cheapest, plan) => (plan.hourlyUsd < cheapest.hourlyUsd ? plan : cheapest),
);

export const HOURS_PER_MONTH = 730;

export type MonthlyHourPreset = {
  hours: number;
  label: string;
};

export const monthlyHourPresets: MonthlyHourPreset[] = [
  { hours: HOURS_PER_MONTH, label: "Always on" },
  { hours: 240, label: "Weekdays, 12 h" },
  { hours: 160, label: "Weekdays, 8 h" },
];

export type FleetQuantities = Record<NodeSpec, number>;

export function emptyFleet(): FleetQuantities {
  return Object.fromEntries(
    cloudNodePlans.map((plan) => [plan.spec, 0]),
  ) as FleetQuantities;
}

export function fleetNodeCount(fleet: FleetQuantities): number {
  return cloudNodePlans.reduce(
    (total, plan) => total + (fleet[plan.spec] ?? 0),
    0,
  );
}

function fleetHourlyTenThousandths(fleet: FleetQuantities): number {
  return cloudNodePlans.reduce(
    (total, plan) =>
      total + Math.round(plan.hourlyUsd * 10000) * (fleet[plan.spec] ?? 0),
    0,
  );
}

export function fleetHourlyUsd(fleet: FleetQuantities): number {
  return fleetHourlyTenThousandths(fleet) / 10000;
}

export function fleetTotalUsd(fleet: FleetQuantities, hours: number): number {
  return (fleetHourlyTenThousandths(fleet) * hours) / 10000;
}

export function formatUsdTotal(usd: number): string {
  const [whole, cents] = usd.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+$)/g, ",");
  return `$${grouped}.${cents}`;
}
