import Image from "next/image";

export type OpenHarnessBrandBarDensity = "compact" | "card" | "hero";

interface OpenHarnessBrandBarProps {
  density?: OpenHarnessBrandBarDensity;
  context?: string;
  status?: string;
  className?: string;
}

const densityStyles: Record<
  OpenHarnessBrandBarDensity,
  {
    wrapper: string;
    mark: number;
    name: string;
    status: string;
    context: string;
  }
> = {
  compact: {
    wrapper: "gap-2",
    mark: 24,
    name: "inline text-sm",
    status: "inline text-[10px]",
    context: "text-[9px] tracking-[0.14em]",
  },
  card: {
    wrapper: "gap-3",
    mark: 32,
    name: "block text-base sm:text-lg",
    status: "mt-0.5 block text-[11px] sm:text-xs",
    context: "text-[10px] tracking-[0.16em] sm:text-xs",
  },
  hero: {
    wrapper: "gap-3 sm:gap-4",
    mark: 44,
    name: "block text-xl sm:text-2xl",
    status: "mt-0.5 block text-xs sm:text-sm",
    context: "text-[10px] tracking-[0.16em] sm:text-xs",
  },
};

export default function OpenHarnessBrandBar({
  density = "card",
  context,
  status,
  className = "",
}: OpenHarnessBrandBarProps) {
  const styles = densityStyles[density];

  return (
    <div
      className={`flex min-w-0 flex-wrap items-center ${styles.wrapper} ${className}`}
    >
      <span className="relative shrink-0" aria-hidden="true">
        <Image
          src="/brand/open-harness/logo.svg"
          alt=""
          width={styles.mark}
          height={styles.mark}
          className="block dark:hidden"
        />
        <Image
          src="/brand/open-harness/logo-dark.svg"
          alt=""
          width={styles.mark}
          height={styles.mark}
          className="hidden dark:block"
        />
      </span>
      <span className="min-w-0 leading-tight">
        <span
          className={`font-montserrat font-bold tracking-tight text-current ${styles.name}`}
        >
          Open Harness
        </span>
        {status ? (
          <span
            className={`font-montserrat font-medium text-current opacity-60 ${styles.status}`}
          >
            {status}
          </span>
        ) : null}
      </span>
      {context ? (
        <span
          className={`ml-auto max-w-full font-mono font-semibold uppercase leading-relaxed text-current opacity-60 ${styles.context}`}
        >
          {context}
        </span>
      ) : null}
    </div>
  );
}
