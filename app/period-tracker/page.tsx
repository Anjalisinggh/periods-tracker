"use client"

// Period Tracker main page

import { useEffect, useMemo, useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import { PeriodLogger } from "@/components/period-logger"
import { PeriodCalendar } from "@/components/period-calendar"
import { SymptomTracker } from "@/components/symptom-tracker"
import { NotesJournal } from "@/components/notes-journal"
import { Reminders } from "@/components/reminders"
import { Insights } from "@/components/insights"
import { SettingsPanel } from "@/components/settings-panel"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function PeriodTrackerPage() {
  const { data } = usePeriodData()
  const [enteredPin, setEnteredPin] = useState("")

  const locked = useMemo(() => {
    if (!data) return false
    if (!data.settings.privacyLock) return false
    return data.settings.privacyLock
  }, [data])

  useEffect(() => {
    if (data?.settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [data?.settings.theme])

  if (!data) {
    return <div className="p-6">Loading…</div>
  }

  const unlocked = !locked || (data.settings.pin && enteredPin === data.settings.pin)

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-balance">Period Tracker</h1>
        <p className="text-sm text-gray-500">
          Offline-first app with period logging, predictions, symptoms, notes, reminders, insights, and settings.
        </p>
      </header>

      {!unlocked ? (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Unlock</h2>
          <p className="text-sm text-gray-500">Enter your PIN to view your data.</p>
          <div className="mt-3 flex gap-2">
            <Input
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="Enter PIN"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Unlock</Button>
          </div>
          <p className="mt-2 text-xs text-gray-500">Note: This is a local privacy lock, not secure encryption.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <PeriodLogger />
            <PeriodCalendar />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SymptomTracker />
            <NotesJournal />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Reminders />
            <Insights />
          </div>

          <SettingsPanel />
        </div>
      )}

      <footer className="mt-10 text-center text-xs text-gray-500">
        Colors used: blue-600 (primary), white, gray-900/500 (neutrals), rose-500/300 (accent). No gradients.
      </footer>
    </main>
  )
}
