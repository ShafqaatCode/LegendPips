import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { motion, useInView } from "framer-motion";
import SectionHeadingSet from "../SharedComponents/SectionHeadingSet";

type StatDef = {
  /** Target number to count toward (null = non-numeric display like 24/7) */
  end: number | null;
  /** Static display when end is null */
  staticValue?: string;
  prefix?: string;
  suffix?: string;
  /** Thousands separators while counting */
  format?: "plain" | "comma";
  label: string;
  durationMs?: number;
};

const STATS: StatDef[] = [
  { end: 150, suffix: "+", label: "Countries served", durationMs: 1400 },
  { end: 105000, suffix: "+", label: "Happy traders", format: "comma", durationMs: 1800 },
  { end: null, staticValue: "24/7", label: "Support", durationMs: 1200 },
  { end: 90, suffix: "%", label: "Signal accuracy", durationMs: 1400 },
  { end: 48000, suffix: "+", label: "Last year's pips", format: "comma", durationMs: 1700 },
  { end: 9000, suffix: "+", label: "VIP members", format: "comma", durationMs: 1600 },
];

const viewport = { once: true, amount: 0.35 } as const;

function formatCount(n: number, format: "plain" | "comma" = "plain"): string {
  if (format === "comma") return Math.round(n).toLocaleString("en-US");
  return String(Math.round(n));
}

/** Ease-out cubic for a snappy count finish */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const AnimatedValue: React.FC<{
  stat: StatDef;
  active: boolean;
}> = ({ stat, active }) => {
  const [display, setDisplay] = useState(() =>
    stat.end == null ? stat.staticValue || "" : `0${stat.suffix || ""}`
  );

  useEffect(() => {
    if (!active) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (stat.end == null) {
      // Animate 24/7 as two counters: 0/0 → 24/7
      if (stat.staticValue === "24/7" && !prefersReduced) {
        const duration = stat.durationMs ?? 1200;
        let raf = 0;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = easeOutCubic(t);
          const a = Math.round(24 * eased);
          const b = Math.round(7 * eased);
          setDisplay(`${a}/${b}`);
          if (t < 1) raf = requestAnimationFrame(tick);
          else setDisplay("24/7");
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      }
      setDisplay(stat.staticValue || "");
      return;
    }

    if (prefersReduced) {
      setDisplay(
        `${stat.prefix || ""}${formatCount(stat.end, stat.format || "plain")}${stat.suffix || ""}`
      );
      return;
    }

    const duration = stat.durationMs ?? 1500;
    const target = stat.end;
    const format = stat.format || "plain";
    const suffix = stat.suffix || "";
    const prefix = stat.prefix || "";
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutCubic(t);
      const current = target * eased;
      setDisplay(`${prefix}${formatCount(current, format)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(`${prefix}${formatCount(target, format)}${suffix}`);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, stat]);

  return <Value aria-label={stat.label}>{display}</Value>;
};

const GlobalReachSection: React.FC = () => {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const inView = useInView(rowRef, viewport);

  return (
    <Section aria-labelledby="global-reach-heading">
      <Inner>
        <SectionHeadingSet
          upperText="Worldwide"
          mainHeading="Global & community reach"
          subText="Our impact in numbers — serving the forex community globally."
        />

        <StatsRow
          ref={rowRef}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((stat, i) => (
            <Stat
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <AnimatedValue stat={stat} active={inView} />
              <Label>{stat.label}</Label>
            </Stat>
          ))}
        </StatsRow>
      </Inner>
    </Section>
  );
};

export default GlobalReachSection;

const Section = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 3rem 1.25rem 3.25rem;
  background-color: #fff;
`;

const Inner = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

const StatsRow = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 0;
  margin-top: 0.5rem;
  border: 1px solid #e8ecf1;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
  overflow: hidden;

  @media (max-width: 980px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 560px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const Stat = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 1.35rem 0.75rem;
  text-align: center;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    top: 22%;
    right: 0;
    bottom: 22%;
    width: 1px;
    background: #eef2f7;
  }

  @media (max-width: 980px) {
    &:nth-child(3n)::after {
      display: none;
    }
  }

  @media (max-width: 560px) {
    &:nth-child(3n)::after {
      display: block;
    }
    &:nth-child(2n)::after {
      display: none;
    }
  }
`;

const Value = styled.div`
  font-size: clamp(1.3rem, 2.2vw, 1.7rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: #132e58;
  font-variant-numeric: tabular-nums;
  min-height: 1.1em;
`;

const Label = styled.div`
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.35;
  color: #64748b;
`;
