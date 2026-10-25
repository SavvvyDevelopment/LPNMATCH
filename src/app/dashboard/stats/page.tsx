import { PageHeader, Panel, StatTile } from "@/components/dashboard/page-header";
import { StatsChart } from "@/components/dashboard/stats-chart";
import { CountUp, Reveal } from "@/components/motion";
import { ensureAccount, getOwnStats } from "@/lib/db/data";

export default async function StatsPage() {
  const account = await ensureAccount();
  if (!account) return null;
  const { stats, series } = await getOwnStats(account.profile.id);
  const data = series.map((row) => ({
    month: new Date(`${row.month}-01T00:00:00`).toLocaleString("en-US", { month: "short" }),
    views: row.views,
    requests: row.requests,
    impressions: row.impressions,
  }));
  const last = series.at(-1);
  const previous = series.at(-2);
  const growth =
    last && previous && previous.views > 0 ? Math.round(((last.views - previous.views) / previous.views) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Stats"
        title={
          <>
            How your profile <span className="text-ink-faint">is performing.</span>
          </>
        }
        description="Profile views, interview requests and social reach over the last six months."
      />

      <Reveal>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile tone="sun" label="Profile views" value={<CountUp to={stats?.profileViews ?? 0} />} />
          <StatTile label="Interview requests" value={<CountUp to={stats?.requests ?? 0} />} />
          <StatTile label="Social impressions" value={<CountUp to={stats?.socialImpressions ?? 0} />} />
          <StatTile
            tone="ink"
            label="Views this month"
            value={<CountUp to={last?.views ?? 0} />}
            hint={`${growth >= 0 ? "+" : ""}${growth}% vs last month`}
          />
        </div>
      </Reveal>

      <Reveal delay={0.08}>
        <Panel title="Last six months" description="Monthly views, requests and impressions.">
          <StatsChart data={data} />
        </Panel>
      </Reveal>
    </>
  );
}
