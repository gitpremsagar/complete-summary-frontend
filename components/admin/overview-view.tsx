"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  EyeIcon,
  MessageSquareTextIcon,
  ShieldCheckIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { ErrorBlock, LoadingBlock, PageBody, PageHeader, formatDateTime } from "@/components/admin/admin-ui";
import { adminApi } from "@/lib/admin-api";
import type { AdminActivityAction, AdminStats } from "@/lib/admin-types";
import { formatCount } from "@/lib/engagement";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 pt-4">
        <div className="rounded-lg bg-muted p-2 text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function describeAction(action: AdminActivityAction) {
  const details = action.details ?? {};
  const title = typeof details.title === "string" ? details.title : null;
  return title ?? action.targetId ?? "—";
}

export function OverviewView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [actions, setActions] = useState<AdminActivityAction[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [series, setSeries] = useState<"users" | "comments">("users");

  const load = useCallback(() => {
    setError(null);
    Promise.all([adminApi.stats(), adminApi.activity(12)])
      .then(([statsData, activityData]) => {
        setStats(statsData);
        setActions(activityData.actions);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "Could not load the dashboard"));
  }, []);

  useEffect(() => {
    const timer = setTimeout(load, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const chartData = (stats?.trend ?? []).map((day) => ({
    date: day.date.slice(5),
    value: day[series],
  }));

  return (
    <>
      <AdminTopbar
        title="Overview"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/content/new">New summary</Link>
          </Button>
        }
      />
      <PageBody>
        <PageHeader title="Overview" description="How the site is doing across users, content and discussion." />

        {error ? (
          <ErrorBlock message={error} onRetry={load} />
        ) : !stats ? (
          <LoadingBlock />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard
                label="Active users"
                value={formatCount(stats.totals.users, "en")}
                hint={`${stats.totals.newUsers7d} joined this week`}
                icon={UsersIcon}
              />
              <StatCard
                label="Comments"
                value={formatCount(stats.totals.comments, "en")}
                hint={`${stats.totals.comments7d} in the last 7 days`}
                icon={MessageSquareTextIcon}
              />
              <StatCard
                label="Summary views"
                value={formatCount(stats.totals.views, "en")}
                hint={`${stats.totals.likes} likes · ${stats.totals.dislikes} dislikes`}
                icon={EyeIcon}
              />
              <StatCard
                label="Admins"
                value={String(stats.totals.admins)}
                hint={`${stats.totals.suspendedUsers} suspended users`}
                icon={ShieldCheckIcon}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-5">
              <Card className="lg:col-span-3">
                <CardHeader className="flex-row items-start justify-between gap-3">
                  <div>
                    <CardTitle>Last 30 days</CardTitle>
                    <CardDescription>New signups and new comments per day (UTC).</CardDescription>
                  </div>
                  <Tabs value={series} onValueChange={(value) => setSeries(value as typeof series)}>
                    <TabsList>
                      <TabsTrigger value="users">
                        <UserPlusIcon className="size-3.5" />
                        Users
                      </TabsTrigger>
                      <TabsTrigger value="comments">
                        <MessageSquareTextIcon className="size-3.5" />
                        Comments
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </CardHeader>
                <CardContent>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="admin-trend" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                            <stop offset="100%" stopColor="var(--brand)" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={24}
                          fontSize={11}
                          stroke="var(--muted-foreground)"
                        />
                        <YAxis tickLine={false} axisLine={false} allowDecimals={false} fontSize={11} stroke="var(--muted-foreground)" />
                        <Tooltip
                          cursor={{ stroke: "var(--border)" }}
                          contentStyle={{
                            background: "var(--popover)",
                            border: "1px solid var(--border)",
                            borderRadius: 8,
                            color: "var(--popover-foreground)",
                            fontSize: 12,
                          }}
                          labelFormatter={(label) => `Day ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          name={series === "users" ? "New users" : "New comments"}
                          stroke="var(--brand)"
                          strokeWidth={2}
                          fill="url(#admin-trend)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>Top summaries</CardTitle>
                    <CardDescription>By views.</CardDescription>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/admin/content">
                      All
                      <ArrowRightIcon />
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {stats.topSummaries.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No engagement recorded yet.</p>
                  ) : (
                    stats.topSummaries.map((row, index) => (
                      <div key={row.slug} className="flex items-center gap-3 text-sm">
                        <span className="w-4 text-right text-xs text-muted-foreground">{index + 1}</span>
                        <div className="min-w-0 flex-1">
                          <Link href={`/admin/content/${row.slug}`} className="block truncate font-medium hover:underline">
                            {row.slug}
                          </Link>
                          <p className="text-xs text-muted-foreground">
                            {formatCount(row.views, "en")} views · {row.comments} comments
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <ThumbsUpIcon className="size-3" />
                          {row.likes}
                          <ThumbsDownIcon className="ml-1 size-3" />
                          {row.dislikes}
                        </span>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent admin activity</CardTitle>
                <CardDescription>Every change made from this dashboard is recorded.</CardDescription>
              </CardHeader>
              <CardContent>
                {!actions || actions.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No admin actions yet.</p>
                ) : (
                  <ul className="flex flex-col divide-y">
                    {actions.map((action) => (
                      <li key={action.id} className="flex flex-wrap items-center gap-2 py-2 text-sm first:pt-0 last:pb-0">
                        <Badge variant="outline" className="font-mono text-[11px]">
                          {action.action}
                        </Badge>
                        <span className="min-w-0 truncate font-medium">{describeAction(action)}</span>
                        <span className="text-muted-foreground">by {action.adminName}</span>
                        <span className="ml-auto text-xs text-muted-foreground">{formatDateTime(action.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </PageBody>
    </>
  );
}
