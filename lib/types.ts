// Types for Period Tracker data

export type SymptomEntry =
  | {
      date: string
      type: "cramps" | "bloating" | "headaches" | "acne" | "fatigue"
      intensity: "low" | "medium" | "high"
    }
  | { date: string; type: "mood"; value: "happy" | "sad" | "anxious" | "irritable" | "energetic" }

export type NoteEntry = { date: string; text: string }

export type ReminderEntry = { date: string; text: string }

export type Insights = {
  averageCycle: number
  averagePeriod: number
  irregularCycles: number
}

export type Settings = {
  theme: "light" | "dark"
  notifications: boolean
  privacyLock: boolean
  pin?: string // stored locally (not secure), simple privacy lock
}

export type PeriodData = {
  // Logging
  cycleStartDates: string[] // ISO yyyy-mm-dd
  averageCycleLength: number
  averagePeriodLength: number

  // Predictions
  predictedNextPeriod?: string
  fertileWindow?: [string, string]
  ovulationDay?: string

  // Tracking
  symptoms: SymptomEntry[]
  notes: NoteEntry[]
  reminders: ReminderEntry[]

  // Insights
  insights: Insights

  // Settings
  settings: Settings
}
