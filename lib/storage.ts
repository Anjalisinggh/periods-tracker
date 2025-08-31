// LocalStorage helpers and date utilities for the Period Tracker

import type { PeriodData } from "./types"

// Storage key
export const STORAGE_KEY = "periodTrackerData"

// Date helpers
export function fmt(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parse(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map((v) => Number.parseInt(v, 10))
  return new Date(y, m - 1, d)
}

export function addDays(dateStr: string, days: number): string {
  const d = parse(dateStr)
  d.setDate(d.getDate() + days)
  return fmt(d)
}

export function daysBetween(a: string, b: string): number {
  const da = parse(a).getTime()
  const db = parse(b).getTime()
  return Math.round((db - da) / (24 * 60 * 60 * 1000))
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// Build initial data
export function getInitialData(): PeriodData {
  return {
    cycleStartDates: [],
    averageCycleLength: 28,
    averagePeriodLength: 5,
    predictedNextPeriod: undefined,
    fertileWindow: undefined,
    ovulationDay: undefined,
    symptoms: [],
    notes: [],
    reminders: [],
    insights: { averageCycle: 28, averagePeriod: 5, irregularCycles: 0 },
    settings: { theme: "light", notifications: false, privacyLock: false },
  }
}

// Compute predictions based on last cycle start and averages
export function computePredictions(data: PeriodData): PeriodData {
  if (!data.cycleStartDates.length) {
    data.predictedNextPeriod = undefined
    data.fertileWindow = undefined
    data.ovulationDay = undefined
    return data
  }
  const lastStart = data.cycleStartDates[data.cycleStartDates.length - 1]
  const nextStart = addDays(lastStart, data.averageCycleLength)
  const ovulation = addDays(nextStart, -14)
  const fertileStart = addDays(ovulation, -3)
  const fertileEnd = addDays(ovulation, 3)

  data.predictedNextPeriod = nextStart
  data.ovulationDay = ovulation
  data.fertileWindow = [fertileStart, fertileEnd]
  return data
}

// Compute insights from logs
export function computeInsights(data: PeriodData): PeriodData {
  const starts = data.cycleStartDates
  let avgCycle = data.averageCycleLength
  let irregular = 0

  if (starts.length >= 2) {
    const lengths: number[] = []
    for (let i = 1; i < starts.length; i++) {
      lengths.push(daysBetween(starts[i - 1], starts[i]))
    }
    if (lengths.length) {
      avgCycle = Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
      irregular = lengths.filter((len) => Math.abs(len - avgCycle) > 3).length
    }
  }

  data.insights = {
    averageCycle: avgCycle,
    averagePeriod: data.averagePeriodLength,
    irregularCycles: irregular,
  }
  return data
}

// Safe load/save
export function loadData(): PeriodData {
  if (typeof window === "undefined") return getInitialData()
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = computeInsights(computePredictions(getInitialData()))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    const parsed: PeriodData = JSON.parse(raw)
    const merged: PeriodData = { ...getInitialData(), ...parsed }
    return computeInsights(computePredictions(merged))
  } catch {
    const initial = getInitialData()
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    }
    return initial
  }
}

export function saveData(data: PeriodData) {
  if (typeof window === "undefined") return
  const withComputed = computeInsights(computePredictions({ ...data }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withComputed))
}

// Calendar helpers
export function daysInMonth(year: number, monthIndexZero: number): number {
  return new Date(year, monthIndexZero + 1, 0).getDate()
}

export function isWithin(date: string, startInclusive: string, endInclusive: string): boolean {
  return date >= startInclusive && date <= endInclusive
}

// Derive period windows (past and predicted)
export function getPeriodWindows(data: PeriodData): Array<[string, string]> {
  const windows: Array<[string, string]> = []
  data.cycleStartDates.forEach((start) => {
    const end = addDays(start, clamp(data.averagePeriodLength - 1, 0, 14))
    windows.push([start, end])
  })
  if (data.predictedNextPeriod) {
    const pStart = data.predictedNextPeriod
    const pEnd = addDays(pStart, clamp(data.averagePeriodLength - 1, 0, 14))
    windows.push([pStart, pEnd])
  }
  return windows
}
