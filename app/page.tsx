"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PitchPresets } from "./components/pitch-presets"
import { generateExcel } from "./lib/excel-generator"
import { Heading } from "@/components/ui/heading"
import { Analytics } from "@vercel/analytics/react"

interface Pitch {
  name: string
  abbreviation: string
  percentage: string
}

const defaultPitch: Pitch = {
  name: "",
  abbreviation: "",
  percentage: "",
}

export default function PitchCardGenerator() {
  const [pitches, setPitches] = useState<Pitch[]>([defaultPitch])
  const [sheets, setSheets] = useState(1)

  useEffect(() => {
    const savedPitches = localStorage.getItem("pitches")
    if (savedPitches) {
      setPitches(JSON.parse(savedPitches))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("pitches", JSON.stringify(pitches))
  }, [pitches])

  const addPitch = () => {
    setPitches([...pitches, { ...defaultPitch }])
  }

  const removePitch = (index: number) => {
    const newPitches = pitches.filter((_, i) => i !== index)
    setPitches(newPitches)
  }

  const updatePitch = (index: number, field: keyof Pitch, value: string) => {
    const newPitches = [...pitches]
    newPitches[index] = { ...newPitches[index], [field]: value }
    setPitches(newPitches)
  }

  const handleExcelSubmit = () => {
    generateExcel(pitches, sheets)
  }

  const totalPercentage = pitches.reduce(
    (sum, pitch) => sum + (Number.parseFloat(pitch.percentage) || 0),
    0
  )

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <Card className="mx-auto max-w-4xl">
          <CardHeader className="flex flex-col items-center justify-between space-y-2 pb-7">
            <Heading size="lg" className="text-center">
              Pitch Card
            </Heading>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center">
              <PitchPresets onSelect={(presetPitches) => setPitches(presetPitches)} />
              <Button variant="outline" onClick={() => setPitches([defaultPitch])}>
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-4 gap-4 font-semibold">
              <div>Pitch Name</div>
              <div>Abbreviation</div>
              <div>Pitch %</div>
              <div></div>
            </div>

            {pitches.map((pitch, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 items-center">
                <Input
                  value={pitch.name}
                  onChange={(e) => updatePitch(index, "name", e.target.value)}
                  placeholder="Fastball"
                />
                <Input
                  value={pitch.abbreviation}
                  onChange={(e) => updatePitch(index, "abbreviation", e.target.value)}
                  placeholder="FB"
                  maxLength={3}
                />
                <div className="relative">
                  <Input
                    value={pitch.percentage}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, "")
                      if (Number.parseInt(value) <= 100) {
                        updatePitch(index, "percentage", value)
                      }
                    }}
                    placeholder="0"
                    type="number"
                    min="0"
                    max="100"
                  />
                  <span className="absolute right-3 top-2">%</span>
                </div>
                <Button variant="ghost" onClick={() => removePitch(index)} className="px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </Button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <Button onClick={addPitch} variant="outline">
                Add Pitch
              </Button>
              <div className="flex items-center space-x-4">
                <div className={`font-semibold ${totalPercentage > 100 ? "text-red-500" : ""}`}>
                  Total: {totalPercentage}%
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="sheets">Number of sheets:</Label>
                  <Input
                    id="sheets"
                    type="number"
                    min="1"
                    value={sheets}
                    onChange={(e) => setSheets(Number.parseInt(e.target.value) || 1)}
                    className="w-20"
                  />
                </div>
                <Button onClick={handleExcelSubmit} disabled={totalPercentage > 100}>
                  Generate Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="mt-8 flex flex-col items-center justify-center space-y-6 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <a
              href="https://venmo.com/u/Justinpfant"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center space-y-2"
            >
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-02-10%20at%207.20.41%20AM-L7AO6ToGBeO7SrNdrw0IvnvD2Zo2zh.jpeg"
                alt="Venmo QR Code"
                className="h-32 w-32 rounded-lg"
              />
              <span className="text-sm font-medium text-primary underline hover:text-primary/80">
                Support this project on Venmo
              </span>
            </a>
          </div>
        </div>
        <div className="mt-12 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-700 mb-4">
            Enter all your pitch names, their abbreviations, and the percentage you want each pitch to be used.
            Once you generate the Excel sheet, it will contain two tabs:
          </p>
          <ul className="list-disc text-left pl-6 mb-4">
            <li>
              <strong>Player Tab:</strong> For the pitcher's arm. This shows the pitch calls in a grid format.
            </li>
            <li>
              <strong>Coach Tab:</strong> Contains all the randomly generated calls and their corresponding locations.
              To use, call out the column number followed by the row number.
            </li>
          </ul>
          <p className="text-gray-700">
            This system allows for quick and efficient communication between the coach and pitcher during the game.
          </p>
        </div>
      </div>
      <Analytics />
    </>
  )
}

