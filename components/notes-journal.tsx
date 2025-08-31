"use client"

import { useState } from "react"
import { usePeriodData } from "@/hooks/use-period-data"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function NotesJournal() {
  const { data, addNote } = usePeriodData()
  const [date, setDate] = useState("")
  const [text, setText] = useState("")

  if (!data) return null

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Notes & Journaling</h3>
      <p className="text-sm text-gray-500">Keep personal notes for each day.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="md:col-span-2 space-y-1.5">
          <Label>Note</Label>
          <Textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Felt tired, drank ginger tea"
          />
        </div>
        <div className="md:col-span-3">
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => {
              if (!date || !text.trim()) return
              addNote({ date, text: text.trim() })
              setDate("")
              setText("")
            }}
          >
            Add note
          </Button>
        </div>
      </div>

      {data.notes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Recent notes</h4>
          <ul className="mt-2 grid gap-2">
            {data.notes
              .slice()
              .reverse()
              .slice(0, 5)
              .map((n, i) => (
                <li key={i} className="rounded-md border p-3 text-sm">
                  <div className="font-medium">{n.date}</div>
                  <div className="text-gray-700 dark:text-gray-300">{n.text}</div>
                </li>
              ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
