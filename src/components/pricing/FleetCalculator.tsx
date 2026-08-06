"use client";

/**
 * The fleet pricing calculator on /pricing. Replaces the three rate cards.
 *
 * THREE RULES THAT MUST HOLD (FR-5, tasks/fleet-pricing-calculator/prd.md).
 * The upstream catalog is moving from three node specs to five, and this file
 * must not need editing when it does:
 *
 *   1. Fleet state derives from `cloudNodePlans` via `emptyFleet()` — never a
 *      literal `{ small: 0, medium: 0, large: 0 }`.
 *   2. All rendering is `.map` over `cloudNodePlans`. There is no
 *      `plan.spec === "…"` comparison anywhere in this file, and adding one
 *      breaks the guarantee.
 *   3. Tiers are single-column rows, never a fixed grid column count. A
 *      `lg:grid-cols-3` is what made the old cards unable to survive a fourth
 *      spec.
 *
 * This component performs NO price arithmetic. Every number it shows comes
 * from a helper in `@/config/cloud-pricing`, so `scripts/generate-llm-txt.mjs`
 * and the verification oracle compute from the same code the page does.
 */

import { useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import {
  cloudNodePlans,
  emptyFleet,
  entryPlan,
  fleetHourlyUsd,
  fleetNodeCount,
  fleetTotalUsd,
  formatHourlyUsd,
  formatUsdTotal,
  isDefault,
  monthlyHourPresets,
  type FleetQuantities,
  type NodeSpec,
} from "@/config/cloud-pricing";
import { OFFERING_URLS } from "@/config/offerings";

/**
 * The most nodes the stepper will count to. A `+` button has to stop
 * somewhere; past this the honest answer is a conversation, which is what the
 * hero's "Running more than three nodes? Talk to us" link is for.
 */
const MAX_NODES_PER_SPEC = 24;

/** Whole nodes only, and never negative. Input validation, not pricing. */
function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(MAX_NODES_PER_SPEC, Math.max(0, Math.trunc(value)));
}

/**
 * The screen-reader sentence for a given fleet. Kept as a pure function so the
 * initial state below is computed the same way on the server and the client —
 * a mismatch here is a hydration error on a live region.
 */
function describeFleet(fleet: FleetQuantities, hours: number): string {
  const count = fleetNodeCount(fleet);
  if (count === 0) {
    return `No nodes selected. Nodes start at ${formatHourlyUsd(entryPlan.hourlyUsd)} an hour.`;
  }
  const nodeWord = count === 1 ? "node" : "nodes";
  return `${count} ${nodeWord}. ${formatHourlyUsd(fleetHourlyUsd(fleet))} per hour, or ${formatUsdTotal(fleetTotalUsd(fleet, hours))} for ${hours} running hours in a month — an estimate, and there is no monthly plan.`;
}

export default function FleetCalculator() {
  const [fleet, setFleet] = useState<FleetQuantities>(emptyFleet);
  const [hours, setHours] = useState<number>(monthlyHourPresets[0].hours);
  const [announcement, setAnnouncement] = useState<string>(() =>
    describeFleet(emptyFleet(), monthlyHourPresets[0].hours),
  );

  const nodeCount = fleetNodeCount(fleet);
  const hourlyUsd = fleetHourlyUsd(fleet);
  const periodUsd = fleetTotalUsd(fleet, hours);

  const nextAnnouncement = useMemo(
    () => describeFleet(fleet, hours),
    [fleet, hours],
  );

  /**
   * The visible figures update instantly; only the announcement waits. Typing
   * "12" is two state changes, and an undebounced live region reads the
   * intermediate "1" fleet out loud before the real one.
   */
  useEffect(() => {
    const timer = setTimeout(() => setAnnouncement(nextAnnouncement), 350);
    return () => clearTimeout(timer);
  }, [nextAnnouncement]);

  function setQuantity(spec: NodeSpec, value: number) {
    setFleet((current) => ({ ...current, [spec]: clampQuantity(value) }));
  }

  return (
    <div className="mt-10">
      <ul role="list" className="divide-y divide-border border-y border-border">
        {cloudNodePlans.map((plan) => {
          const quantity = fleet[plan.spec] ?? 0;
          const rowFleet = { ...emptyFleet(), [plan.spec]: quantity };
          const atMin = quantity <= 0;
          const atMax = quantity >= MAX_NODES_PER_SPEC;

          return (
            <li key={plan.spec} className="py-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-montserrat text-xl font-semibold text-foreground sm:text-2xl">
                      {plan.label}
                    </h3>
                    {isDefault(plan.spec) ? (
                      <span className="border-oh-accent/40 rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-mono text-xs leading-relaxed text-muted-foreground">
                    {plan.vcpu} vCPU · {plan.ramGb} GB RAM · {plan.diskGb} GB
                    SSD
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                  <p className="flex flex-wrap items-baseline gap-1 font-montserrat text-foreground">
                    <span className="text-2xl font-bold tabular-nums">
                      {formatHourlyUsd(plan.hourlyUsd)}
                    </span>
                    <span className="font-mono text-sm font-semibold text-muted-foreground">
                      /hr
                    </span>
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-disabled={atMin}
                      aria-label={`Remove one ${plan.label} node`}
                      onClick={() => setQuantity(plan.spec, quantity - 1)}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border font-montserrat text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus ${
                        atMin
                          ? "text-muted-foreground/40"
                          : "hover:border-oh-accent/50 text-foreground hover:text-oh-accent"
                      }`}
                    >
                      <span aria-hidden="true">−</span>
                    </button>
                    <input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={MAX_NODES_PER_SPEC}
                      step={1}
                      value={quantity}
                      aria-label={`Number of ${plan.label} nodes`}
                      onChange={(event) =>
                        setQuantity(plan.spec, Number(event.target.value))
                      }
                      className="h-11 w-16 rounded-lg border border-border bg-background text-center font-montserrat text-base font-semibold tabular-nums text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus"
                    />
                    <button
                      type="button"
                      aria-disabled={atMax}
                      aria-label={`Add one ${plan.label} node`}
                      onClick={() => setQuantity(plan.spec, quantity + 1)}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-border font-montserrat text-lg font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus ${
                        atMax
                          ? "text-muted-foreground/40"
                          : "hover:border-oh-accent/50 text-foreground hover:text-oh-accent"
                      }`}
                    >
                      <span aria-hidden="true">+</span>
                    </button>
                  </div>
                </div>
              </div>

              {quantity > 0 ? (
                <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
                  {quantity} × {formatHourlyUsd(plan.hourlyUsd)} ={" "}
                  <span className="tabular-nums text-foreground">
                    {formatHourlyUsd(fleetHourlyUsd(rowFleet))}
                  </span>
                  /hr
                </p>
              ) : null}
            </li>
          );
        })}
      </ul>

      <fieldset className="mt-8">
        <legend className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
          Running hours a month
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {monthlyHourPresets.map((preset) => {
            const selected = preset.hours === hours;
            return (
              <label
                key={preset.hours}
                className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-4 py-2 font-montserrat text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-oh-focus has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background ${
                  selected
                    ? "border-oh-accent/60 bg-oh-accent/10 font-semibold text-oh-accent"
                    : "hover:border-oh-accent/40 border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <input
                  type="radio"
                  name="fleet-running-hours"
                  value={preset.hours}
                  checked={selected}
                  onChange={() => setHours(preset.hours)}
                  className="sr-only"
                />
                <span>{preset.label}</span>
                <span className="font-mono text-xs tabular-nums opacity-70">
                  {preset.hours} h
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {nodeCount === 0 ? (
          <div className="min-w-0">
            <p className="font-montserrat text-lg font-semibold text-foreground">
              Add a node above to price a fleet.
            </p>
            <p className="mt-2 font-montserrat text-sm leading-relaxed text-muted-foreground">
              Nodes start at {formatHourlyUsd(entryPlan.hourlyUsd)} an hour.
            </p>
          </div>
        ) : (
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-oh-accent">
              Your fleet
            </p>
            <p className="mt-3 flex flex-wrap items-baseline gap-1 font-montserrat text-foreground">
              <span className="text-4xl font-bold tabular-nums sm:text-5xl">
                {formatHourlyUsd(hourlyUsd)}
              </span>
              <span className="font-mono text-base font-semibold text-muted-foreground">
                /hr
              </span>
            </p>
            <p className="mt-3 font-montserrat text-sm leading-relaxed text-muted-foreground">
              {nodeCount} {nodeCount === 1 ? "node" : "nodes"}, each metering on
              its own for every whole hour it runs.
            </p>
            <p className="mt-4 border-t border-border pt-4 font-montserrat text-base leading-relaxed text-muted-foreground">
              About{" "}
              <span className="font-semibold tabular-nums text-foreground">
                {formatUsdTotal(periodUsd)}
              </span>{" "}
              for {hours} running hours in a month — an estimate from the hourly
              rates above, and there is no monthly plan.
            </p>
          </div>
        )}

        <a
          href={OFFERING_URLS.cloud}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-xl bg-oh-solid px-5 py-3 text-center font-montserrat text-sm font-semibold text-black transition-colors hover:bg-green-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-oh-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Open the Console
          <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
