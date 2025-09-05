"use client"

import { useEffect, useMemo, useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function supportsNotifications() {
  return typeof window !== "undefined" && "Notification" in window
}

export function Reminders() {
  const { data, addReminder, removeReminder } = usePeriodData()
  const [date, setDate] = useState("")
  const [text, setText] = useState("")

  const dueSoon = useMemo(() => {
    if (!data) return []
    const now = new Date()
    const nowStr = now.toISOString().slice(0, 10)
    const tomorrow = new Date(now)
    tomorrow.setDate(now.getDate() + 1)
    const tomorrowStr = tomorrow.toISOString().slice(0, 10)
    return data.reminders.filter((r) => r.date === nowStr || r.date === tomorrowStr)
  }, [data])

  useEffect(() => {
    if (!data?.settings.notifications || !supportsNotifications()) return
    if (Notification.permission === "default") {
      Notification.requestPermission()
    }
    const today = new Date().toISOString().slice(0, 10)
    data.reminders
      .filter((r) => r.date === today)
      .forEach((r) => {
        if (Notification.permission === "granted") {
          new Notification("Reminder", { body: r.text })
        }
      })
  }, [data?.settings.notifications])

  if (!data) return null

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Reminders & Notifications</h3>
      <p className="text-sm text-gray-500">
        Add reminders (e.g., medication, self-care). Browser notifications are best-effort while the app is open.
      </p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Reminder for your periods </Label>
          <Input placeholder="Take pain relief" value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div className="md:col-span-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (!date || !text.trim()) return
              addReminder({ date, text: text.trim() })
              setDate("")
              setText("")
            }}
          >
            Add reminder
          </Button>
        </div>
      </div>

      {dueSoon.length > 0 && (
        <div className="mt-4 rounded-md border p-3 text-sm">
          <div className="font-medium">Due soon</div>
          <ul className="mt-2 space-y-1">
            {dueSoon.map((r, i) => (
              <li key={i} className="flex items-center justify-between">
                <span>
                  {r.date}: {r.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {data.reminders.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">All reminders</h4>
          <ul className="mt-2 space-y-2">
            {data.reminders.map((r, i) => (
              <li key={`${r.date}-${i}`} className="flex items-center justify-between rounded-md border p-2 text-sm">
                <span>
                  {r.date}: {r.text}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-rose-600 hover:text-rose-700"
                  onClick={() => removeReminder(i)}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
