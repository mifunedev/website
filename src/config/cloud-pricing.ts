export type NodeSpec = "n2" | "n4" | "n8" | "n16" | "n32" | "n64";

export type CloudNodePlan = {
  spec: NodeSpec;
  label: string;
  vcpu: number;
  ramGb: number;
  diskGb: number;
  computeHourlyUsd: number;
  storageHourlyUsd: number;
};

export const DEFAULT_NODE_SPEC: NodeSpec = "n4";

export const cloudNodePlans: CloudNodePlan[] = [
  {
    spec: "n2",
    label: "2 GB",
    vcpu: 1,
    ramGb: 2,
    diskGb: 20,
    computeHourlyUsd: 0.023,
    storageHourlyUsd: 0.008,
  },
  {
    spec: "n4",
    label: "4 GB",
    vcpu: 2,
    ramGb: 4,
    diskGb: 50,
    computeHourlyUsd: 0.045,
    storageHourlyUsd: 0.015,
  },
  {
    spec: "n8",
    label: "8 GB",
    vcpu: 4,
    ramGb: 8,
    diskGb: 50,
    computeHourlyUsd: 0.08,
    storageHourlyUsd: 0.015,
  },
  {
    spec: "n16",
    label: "16 GB",
    vcpu: 4,
    ramGb: 16,
    diskGb: 100,
    computeHourlyUsd: 0.21,
    storageHourlyUsd: 0.026,
  },
  {
    spec: "n32",
    label: "32 GB",
    vcpu: 8,
    ramGb: 32,
    diskGb: 200,
    computeHourlyUsd: 0.42,
    storageHourlyUsd: 0.049,
  },
  {
    spec: "n64",
    label: "64 GB",
    vcpu: 8,
    ramGb: 64,
    diskGb: 200,
    computeHourlyUsd: 0.54,
    storageHourlyUsd: 0.049,
  },
];

export const MINIMUM_BILLED_SECONDS = 60;
export const PAUSED_DISK_USD_PER_GB_MONTH = 0.16;
export const EXTRA_DISK_USD_PER_GB_MONTH = 0.16;
export const DISPOSABLE_BOOT_STORAGE_HOURLY_USD = 0.003;
export const FREE_PAUSED_DAYS = 14;
export const FREE_TIER_NODE_COUNT = 2;
export const FREE_TIER_RUNNING_HOURS_PER_MONTH = 24;
export const FREE_TIER_PAUSED_RETENTION_DAYS = 14;
export const TOP_UP_AMOUNTS_USD: readonly number[] = [10, 25, 50, 100];
export const LOW_BALANCE_WARNING_HOURS = 24;
export const GRACE_WINDOW_HOURS = 24;

const numberWords = ["zero", "one", "two", "three", "four", "five"];

export function countWord(count: number): string {
  return numberWords[count] ?? String(count);
}

export function formatTopUpAmounts(amounts: readonly number[]): string {
  const dollars = amounts.map((amount) => `$${amount}`);
  return `${dollars.slice(0, -1).join(", ")}, or ${dollars[dollars.length - 1]}`;
}

function toTenThousandths(usd: number): number {
  return Math.round(usd * 10000);
}

export function fullHourUsd(plan: CloudNodePlan): number {
  return (
    (toTenThousandths(plan.computeHourlyUsd) +
      toTenThousandths(plan.storageHourlyUsd)) /
    10000
  );
}

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
  (cheapest, plan) =>
    fullHourUsd(plan) < fullHourUsd(cheapest) ? plan : cheapest,
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

function fleetTenThousandths(
  fleet: FleetQuantities,
  hourlyUsd: (plan: CloudNodePlan) => number,
): number {
  return cloudNodePlans.reduce(
    (total, plan) =>
      total + toTenThousandths(hourlyUsd(plan)) * (fleet[plan.spec] ?? 0),
    0,
  );
}

function fleetHourlyTenThousandths(fleet: FleetQuantities): number {
  return (
    fleetTenThousandths(fleet, (plan) => plan.computeHourlyUsd) +
    fleetTenThousandths(fleet, (plan) => plan.storageHourlyUsd)
  );
}

export function fleetComputeHourlyUsd(fleet: FleetQuantities): number {
  return fleetTenThousandths(fleet, (plan) => plan.computeHourlyUsd) / 10000;
}

export function fleetStorageHourlyUsd(fleet: FleetQuantities): number {
  return fleetTenThousandths(fleet, (plan) => plan.storageHourlyUsd) / 10000;
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
