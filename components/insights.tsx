"use client"

import { Card } from "@/components/ui/card"
import { usePeriodData } from "@/hooks/use-period-data"
import { daysBetween } from "@/lib/storage"

export function Insights() {
  const { data } = usePeriodData()
  if (!data) return null

  const starts = data.cycleStartDates
  const cycleLengths = starts.length >= 2 ? starts.slice(1).map((s, i) => daysBetween(starts[i], s)) : []

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Insights & Stats</h3>
      <p className="text-sm text-gray-500">Averages and regularity derived from your logs.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="rounded-md border p-3">
          <div className="text-sm text-gray-500">Average cycle</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{data.insights.averageCycle} days</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-sm text-gray-500">Average period</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{data.insights.averagePeriod} days</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-sm text-gray-500">Irregular cycles</div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white">{data.insights.irregularCycles}</div>
        </div>
      </div>

      {cycleLengths.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Cycle length history</h4>
          <div className="mt-2 grid grid-cols-8 gap-2">
            {cycleLengths.slice(-16).map((len, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="h-16 w-4 rounded-sm bg-blue-600"
                  style={{ height: `${Math.min(64, Math.max(8, len))}px` }}
                />
                <div className="text-[10px] text-gray-500">{len}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
