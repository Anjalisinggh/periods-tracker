"use client"

import { useMemo, useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import { daysInMonth, fmt, getPeriodWindows, isWithin } from "@/lib/storage"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function monthLabel(year: number, monthIdx: number) {
  return new Date(year, monthIdx, 1).toLocaleString(undefined, { month: "long", year: "numeric" })
}

export function PeriodCalendar() {
  const { data } = usePeriodData()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())

  const days = useMemo(() => {
    const total = daysInMonth(year, month)
    const firstDow = new Date(year, month, 1).getDay()
    const cells = [] as Array<{ date?: string }>
    for (let i = 0; i < firstDow; i++) cells.push({})
    for (let d = 1; d <= total; d++) {
      const date = fmt(new Date(year, month, d))
      cells.push({ date })
    }
    return cells
  }, [year, month])

  const windows = useMemo(() => (data ? getPeriodWindows(data) : []), [data])
  const fertile = data?.fertileWindow
  const ov = data?.ovulationDay

  function isPeriodDay(date: string) {
    return windows.some(([s, e]) => isWithin(date, s, e))
  }

  function isFertileDay(date: string) {
    return fertile ? isWithin(date, fertile[0], fertile[1]) : false
  }

  function isOvulation(date: string) {
    return ov === date
  }

  if (!data) return null

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Calendar & Predictions</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1))}
            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Prev
          </Button>
          <div className="text-sm font-medium">{monthLabel(year, month)}</div>
          <Button
            variant="outline"
            onClick={() => setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1))}
            className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2 text-center text-xs text-gray-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {days.map((cell, idx) => {
          const d = cell.date
          const isToday = d === fmt(new Date())
          const period = d && isPeriodDay(d)
          const fertileDay = d && isFertileDay(d)
          const ovulation = d && isOvulation(d)

          const base =
            "relative h-10 rounded-md border text-sm flex items-center justify-center select-none " +
            "bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
          const styles = [
            base,
            period ? "border-rose-500 bg-rose-50 dark:bg-gray-900" : "border-gray-200 dark:border-gray-800",
            fertileDay && !period ? "ring-2 ring-offset-0 ring-rose-300" : "",
            isToday ? "outline outline-1 outline-blue-600" : "",
          ].join(" ")

          return (
            <div key={idx} className={styles} aria-label={d || ""}>
              {d ? d.split("-")[2] : ""}
              {ovulation && (
                <span
                  className="absolute bottom-0 right-0 m-1 h-1.5 w-1.5 rounded-full bg-blue-600"
                  aria-label="Ovulation"
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm bg-rose-500"></span> Period window
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm ring-2 ring-rose-300"></span> Fertile window
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full bg-blue-600"></span> Ovulation day
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="inline-block h-3 w-3 rounded-sm outline outline-1 outline-blue-600"></span> Today
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
        {data.predictedNextPeriod ? (
          <div>
            Next period predicted: <strong className="text-gray-900 dark:text-white">{data.predictedNextPeriod}</strong>
          </div>
        ) : (
          <div>Add a cycle start to see predictions.</div>
        )}
        {data.fertileWindow && (
          <div>
            Fertile window:{" "}
            <strong className="text-gray-900 dark:text-white">
              {data.fertileWindow[0]} – {data.fertileWindow[1]}
            </strong>{" "}
            • Ovulation: <strong className="text-gray-900 dark:text-white">{data.ovulationDay}</strong>
          </div>
        )}
      </div>
    </Card>
  )
}
