"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const config = {
  views: { label: "Profile views", color: "var(--color-brand)" },
  requests: { label: "Interview requests", color: "var(--color-ink)" },
  impressions: { label: "Social impressions", color: "var(--color-lilac)" },
} satisfies ChartConfig;

export function StatsChart({
  data,
}: {
  data: { month: string; views: number; requests: number; impressions: number }[];
}) {
  return (
    <ChartContainer config={config} className="aspect-auto h-80 w-full">
      <AreaChart data={data} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          {Object.keys(config).map((key) => (
            <linearGradient key={key} id={`fill-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${key})`} stopOpacity={0.28} />
              <stop offset="100%" stopColor={`var(--color-${key})`} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="var(--color-subtle)" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
        <YAxis tickLine={false} axisLine={false} width={44} />
        <ChartTooltip content={<ChartTooltipContent className="rounded-2xl" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {Object.keys(config).map((key) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={`var(--color-${key})`}
            strokeWidth={2.5}
            fill={`url(#fill-${key})`}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  );
}
