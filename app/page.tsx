"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const router = useRouter()

  const goToPeriodTracker = () => {
    router.push("/period-tracker")
  }

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-6 font-sans">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to Period Tracker
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Your comprehensive, offline-first period tracking app with logging, predictions, 
          symptoms tracking, notes, reminders, and insights.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">📅</div>
          <h3 className="text-lg font-semibold mb-2">Period Logging</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Track your menstrual cycles with ease
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">🔮</div>
          <h3 className="text-lg font-semibold mb-2">Predictions</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Get accurate cycle predictions
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">📊</div>
          <h3 className="text-lg font-semibold mb-2">Insights</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Understand your patterns better
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">💊</div>
          <h3 className="text-lg font-semibold mb-2">Symptom Tracking</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Monitor symptoms and changes
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">📝</div>
          <h3 className="text-lg font-semibold mb-2">Notes & Journal</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Keep personal notes and observations
          </p>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-3xl mb-3">⏰</div>
          <h3 className="text-lg font-semibold mb-2">Reminders</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Never miss important dates
          </p>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={goToPeriodTracker}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg"
        >
          Get Started
        </Button>
      </div>

      <footer className="mt-12 text-center text-sm text-muted-foreground">
        <p>Privacy-focused • Offline-first </p>
      </footer>
    </main>
  )
}
