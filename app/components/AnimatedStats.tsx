"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  label: string;
  prefix?: string;
  suffix?: string;
  value: number;
};

export function AnimatedStats({ stats }: { stats: Stat[] }) {
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || hasStarted) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.32 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasStarted]);

  return (
    <div ref={ref} className="mx-auto grid max-w-7xl gap-4 px-5 py-7 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <CounterCard key={stat.label} stat={stat} hasStarted={hasStarted} index={index} />
      ))}
    </div>
  );
}

function CounterCard({ stat, hasStarted, index }: { stat: Stat; hasStarted: boolean; index: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!hasStarted) {
      return;
    }

    const duration = 1250;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(stat.value * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    const frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hasStarted, stat.value]);

  return (
    <div
      className={`stat-card ${hasStarted ? "is-visible" : ""}`}
      style={{ transitionDelay: `${index * 110}ms` }}
      aria-label={`${stat.prefix ?? ""}${stat.value}${stat.suffix ?? ""} ${stat.label}`}
    >
      <p className="stat-number">
        {stat.prefix}
        {count}
        {stat.suffix}
      </p>
      <p className="stat-label">{stat.label}</p>
    </div>
  );
}
