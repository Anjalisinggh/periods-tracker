"use client"

import { useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export function PeriodLogger() {
  const { data, addCycle, removeCycle, setAverages } = usePeriodData()
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")
  const [avgCycle, setAvgCycle] = useState<number>(data?.averageCycleLength ?? 28)
  const [avgPeriod, setAvgPeriod] = useState<number>(data?.averagePeriodLength ?? 5)

  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white p-4 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Period Logging</h3>
        <p className="text-sm text-gray-500">Add cycle start and end dates. Averages help predictions.</p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="start">Cycle start</Label>
            <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="end">Period end (optional)</Label>
            <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
          </div>
          <div className="flex items-end">
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (!start) return
                addCycle(start, end || undefined)
                setStart("")
                setEnd("")
              }}
            >
              Add cycle
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="avgCycle">Average cycle length (days)</Label>
            <Input
              id="avgCycle"
              type="number"
              value={avgCycle}
              onChange={(e) => setAvgCycle(Number.parseInt(e.target.value || "0", 10))}
              min={20}
              max={45}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="avgPeriod">Average period length (days)</Label>
            <Input
              id="avgPeriod"
              type="number"
              value={avgPeriod}
              onChange={(e) => setAvgPeriod(Number.parseInt(e.target.value || "0", 10))}
              min={1}
              max={14}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="outline"
              className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 bg-transparent"
              onClick={() => setAverages(avgCycle, avgPeriod)}
            >
              Save averages
            </Button>
          </div>
        </div>

        {data.cycleStartDates.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Logged cycles</h4>
            <ul className="mt-2 flex flex-wrap gap-2">
              {data.cycleStartDates.map((d) => (
                <li key={d} className="flex items-center gap-2 rounded-md border px-2 py-1 text-sm">
                  <span>{d}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => removeCycle(d)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
