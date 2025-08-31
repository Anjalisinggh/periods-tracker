"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePeriodData } from "@/hooks/use-period-data"

export function SettingsPanel() {
  const { data, setSettings, reset } = usePeriodData()
  const [pin, setPin] = useState("")
  const [theme, setTheme] = useState<"light" | "dark">(data?.settings.theme ?? "light")

  useEffect(() => {
    if (data?.settings.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [data?.settings.theme])

  if (!data) return null

  return (
    <Card className="p-4 bg-white dark:bg-gray-900">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-balance">Settings</h3>
      <p className="text-sm text-gray-500">Personalize your experience. Data stays on your device.</p>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label className="font-medium">Dark theme</Label>
            <div className="text-xs text-gray-500">Toggle light/dark appearance</div>
          </div>
          <Switch
            checked={data.settings.theme === "dark"}
            onCheckedChange={(checked) => setSettings({ theme: checked ? "dark" : "light" })}
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label className="font-medium">Notifications</Label>
            <div className="text-xs text-gray-500">Show reminders when the app is open</div>
          </div>
          <Switch
            checked={data.settings.notifications}
            onCheckedChange={(checked) => setSettings({ notifications: checked })}
          />
        </div>

        <div className="rounded-md border p-3">
          <Label className="font-medium">Privacy lock (PIN)</Label>
          <div className="mt-2 flex items-center gap-2">
            <Input
              placeholder="4+ digits"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <Button
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 bg-transparent"
              onClick={() => {
                if (!pin || pin.length < 4) return
                setSettings({ privacyLock: true, pin })
                setPin("")
              }}
            >
              Set PIN
            </Button>
          </div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-rose-600 hover:text-rose-700"
              onClick={() => setSettings({ privacyLock: false, pin: undefined })}
            >
              Disable lock
            </Button>
          </div>
          <div className="mt-2 text-xs text-gray-500">Note: PIN is stored locally and is not secure encryption.</div>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="destructive" className="bg-rose-600 hover:bg-rose-700" onClick={reset}>
          Reset all data
        </Button>
      </div>
    </Card>
  )
}
