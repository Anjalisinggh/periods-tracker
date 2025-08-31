"use client"

import { useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import type { SymptomEntry } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const symptomTypes = ["cramps", "bloating", "headaches", "acne", "fatigue"] as const
const moods = ["happy", "sad", "anxious", "irritable", "energetic"] as const

export function SymptomTracker() {
  const { data, addSymptom } = usePeriodData()
  const [date, setDate] = useState<string>("")
  const [mode, setMode] = useState<"symptom" | "mood">("symptom")
  const [symptomType, setSymptomType] = useState<(typeof symptomTypes)[number]>("cramps")
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("low")
  const [mood, setMood] = useState<(typeof moods)[number]>("happy")

  if (!data) return null

  function submit() {
    if (!date) return
    let entry: SymptomEntry
    if (mode === "symptom") {
      entry = { date, type: symptomType, intensity }
    } else {
      entry = { date, type: "mood", value: mood }
    }
    addSymptom(entry)
    setDate("")
  }

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Symptom & Mood Tracking</h3>
      <p className="text-sm text-gray-500">Log daily symptoms and moods.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Type</Label>
          <Select value={mode} onValueChange={(v: any) => setMode(v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="symptom">Symptom</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {mode === "symptom" ? (
          <>
            <div className="space-y-1.5">
              <Label>Symptom</Label>
              <Select value={symptomType} onValueChange={(v: any) => setSymptomType(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select symptom" />
                </SelectTrigger>
                <SelectContent>
                  {symptomTypes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Intensity</Label>
              <Select value={intensity} onValueChange={(v: any) => setIntensity(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Intensity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 md:col-span-2">
            <Label>Mood</Label>
            <Select value={mood} onValueChange={(v: any) => setMood(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select mood" />
              </SelectTrigger>
              <SelectContent>
                {moods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="md:col-span-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={submit}>
            Add entry
          </Button>
        </div>
      </div>

      {data.symptoms.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recent entries</h4>
          <ul className="mt-2 grid gap-2 md:grid-cols-2">
            {data.symptoms
              .slice()
              .reverse()
              .slice(0, 6)
              .map((s, i) => (
                <li key={i} className="rounded-md border p-2 text-sm">
                  {"intensity" in s ? (
                    <span>
                      {s.date}: {s.type} – {s.intensity}
                    </span>
                  ) : (
                    <span>
                      {s.date}: mood – {s.value}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
