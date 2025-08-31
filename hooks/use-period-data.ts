// SWR-based state for Period Tracker (backed by localStorage)

"use client"

import useSWR from "swr"
import type { PeriodData, SymptomEntry, NoteEntry, ReminderEntry } from "@/lib/types"
import { loadData, saveData, STORAGE_KEY } from "@/lib/storage"

const fetcher = () => loadData()

export function usePeriodData() {
  const { data, mutate, isLoading } = useSWR<PeriodData>(STORAGE_KEY, fetcher, {
    revalidateOnFocus: false,
  })

  function update(partial: Partial<PeriodData>) {
    if (!data) return
    const next = { ...data, ...partial }
    saveData(next)
    mutate(next, false)
  }

  function reset() {
    const initial = loadData()
    localStorage.removeItem(STORAGE_KEY)
    saveData(initial)
    mutate(loadData(), false)
  }

  // Actions
  function addCycle(start: string, end?: string) {
    if (!data) return
    const nextStarts = [...data.cycleStartDates, start].sort()
    let avgPeriod = data.averagePeriodLength
    if (end && end >= start) {
      const len = Math.max(
        1,
        Math.min(14, Math.round((new Date(end).getTime() - new Date(start).getTime()) / (24 * 3600 * 1000)) + 1),
      )
      avgPeriod = Math.round((data.averagePeriodLength + len) / 2)
    }
    update({ cycleStartDates: nextStarts, averagePeriodLength: avgPeriod })
  }

  function removeCycle(date: string) {
    if (!data) return
    update({ cycleStartDates: data.cycleStartDates.filter((d) => d !== date) })
  }

  function setAverages(cycleLen: number, periodLen: number) {
    if (!data) return
    update({
      averageCycleLength: Math.max(20, Math.min(45, Math.round(cycleLen))),
      averagePeriodLength: Math.max(1, Math.min(14, Math.round(periodLen))),
    })
  }

  function addSymptom(entry: SymptomEntry) {
    if (!data) return
    update({ symptoms: [...data.symptoms, entry] })
  }

  function addNote(entry: NoteEntry) {
    if (!data) return
    update({ notes: [...data.notes, entry] })
  }

  function addReminder(entry: ReminderEntry) {
    if (!data) return
    update({ reminders: [...data.reminders, entry] })
  }

  function removeReminder(index: number) {
    if (!data) return
    const copy = [...data.reminders]
    copy.splice(index, 1)
    update({ reminders: copy })
  }

  function setSettings(next: Partial<PeriodData["settings"]>) {
    if (!data) return
    update({ settings: { ...data.settings, ...next } })
  }

  return {
    data,
    isLoading,
    update,
    reset,
    addCycle,
    removeCycle,
    setAverages,
    addSymptom,
    addNote,
    addReminder,
    removeReminder,
    setSettings,
  }
}
