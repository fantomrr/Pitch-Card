"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Pitch {
  name: string
  abbreviation: string
  percentage: string
}

const presets: { name: string; pitches: Pitch[] }[] = [
  {
    name: "Basic Fastball Mix",
    pitches: [
      { name: "4-Seam Fastball", abbreviation: "4FB", percentage: "50" },
      { name: "2-Seam Fastball", abbreviation: "2FB", percentage: "30" },
      { name: "Change Up", abbreviation: "CH", percentage: "20" },
    ],
  },
  {
    name: "Advanced Mix",
    pitches: [
      { name: "4-Seam Fastball", abbreviation: "4FB", percentage: "40" },
      { name: "Curveball", abbreviation: "CB", percentage: "20" },
      { name: "Slider", abbreviation: "SL", percentage: "20" },
      { name: "Change Up", abbreviation: "CH", percentage: "20" },
    ],
  },
  {
    name: "HWC",
    pitches: [
      { name: "Fast Ball", abbreviation: "FB", percentage: "10" },
      { name: "Curve Ball", abbreviation: "CB", percentage: "10" },
      { name: "Fast In", abbreviation: "FN", percentage: "10" },
      { name: "Fast Out", abbreviation: "FO", percentage: "10" },
      { name: "Curve Out", abbreviation: "CO", percentage: "10" },
      { name: "Curve", abbreviation: "C", percentage: "10" },
      { name: "Screw Ball", abbreviation: "SB", percentage: "10" },
      { name: "Pitch Out", abbreviation: "PO", percentage: "10" },
      { name: "Change", abbreviation: "G", percentage: "10" },
      { name: "Change Out", abbreviation: "GO", percentage: "10" },
    ],
  },
]

interface PitchPresetsProps {
  onSelect: (pitches: Pitch[]) => void
}

export function PitchPresets({ onSelect }: PitchPresetsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Load Preset</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {presets.map((preset) => (
          <DropdownMenuItem key={preset.name} onClick={() => onSelect(preset.pitches)}>
            {preset.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

