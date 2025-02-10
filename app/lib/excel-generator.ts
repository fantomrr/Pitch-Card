import * as XLSX from "xlsx"

// Pitch interface
interface Pitch {
  name: string           // e.g. "Fast Ball"
  abbreviation: string   // e.g. "FB"
  percentage: string     // e.g. "25"
}

/**
 * The main function that creates and downloads the .xlsx file.
 */
export const generateExcel = (pitches: Pitch[], sheets: number) => {
  const wb = XLSX.utils.book_new()

  // 1) Create the Player sheet (and capture the in-memory matrix)
  const { ws: playerWs, matrix: playerMatrix } = generatePlayerSheet(pitches)
  XLSX.utils.book_append_sheet(wb, playerWs, "Player")

  // 2) Create the Coach sheet, using data from the Player matrix
  const coachWs = generateCoachSheetFromPlayer(playerMatrix, pitches)
  XLSX.utils.book_append_sheet(wb, coachWs, "Coach")

  // 3) Write the workbook to a Blob and trigger the browser download
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" })
  const data = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  const url = URL.createObjectURL(data)
  const link = document.createElement("a")
  link.href = url
  link.download = `pitch-card-${new Date().toISOString()}.xlsx`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Generates the "Player" sheet with two colored blocks (M10..15, P20..25,
 * M30..35, P40..45). M/P is placed in the first column, with numeric rows
 * under it, and numeric column headers (10..15, etc.) across the top.
 */
function generatePlayerSheet(pitches: Pitch[]) {
  const rowCount = 13  // 0..12
  const colCount = 15  // 0..14

  // For storing pitch calls + labels
  interface CellInfo {
    display?: string   // text shown in Excel
    pitch?: string     // pitch abbreviation if it's a random call
    colLabel?: string  // "10", "15", "20", etc.
    rowLabel?: string  // "1", "2", ...
  }

  // 2D matrix of empty objects
  const matrix: CellInfo[][] = Array.from({ length: rowCount }, () =>
    Array(colCount).fill({} as CellInfo)
  )

  // FIRST BLOCK (rows 0..5)
  // Row 0 => c0 => "M", c1..6 => "10..15", c7 => "P", c8..13 => "20..25"
  matrix[0][0] = { display: "M" }
  matrix[0][7] = { display: "P" }
  matrix[0][1] = { display: "10", colLabel: "10" }
  matrix[0][2] = { display: "11", colLabel: "11" }
  matrix[0][3] = { display: "12", colLabel: "12" }
  matrix[0][4] = { display: "13", colLabel: "13" }
  matrix[0][5] = { display: "14", colLabel: "14" }
  matrix[0][6] = { display: "15", colLabel: "15" }
  matrix[0][8] = { display: "20", colLabel: "20" }
  matrix[0][9] = { display: "21", colLabel: "21" }
  matrix[0][10] = { display: "22", colLabel: "22" }
  matrix[0][11] = { display: "23", colLabel: "23" }
  matrix[0][12] = { display: "24", colLabel: "24" }
  matrix[0][13] = { display: "25", colLabel: "25" }

  // Rows 1..5 => c0 => "1..5", c7 => "1..5"
  for (let r = 1; r <= 5; r++) {
    matrix[r][0] = { display: String(r), rowLabel: String(r) }
    matrix[r][7] = { display: String(r), rowLabel: String(r) }
  }

  // Generate 60 random calls for first block
  const firstBlockSeq = generatePitchSequence(pitches, 60)
  let idx = 0

  // M10..15 => row=1..5, col=1..6
  for (let rr = 1; rr <= 5; rr++) {
    for (let cc = 1; cc <= 6; cc++) {
      const pitchAbbrev = firstBlockSeq[idx++]
      const colLabel = matrix[0][cc].colLabel
      const rowLabel = matrix[rr][0].rowLabel
      matrix[rr][cc] = {
        display: pitchAbbrev,
        pitch: pitchAbbrev,
        colLabel,
        rowLabel,
      }
    }
  }

  // P20..25 => row=1..5, col=8..13
  for (let rr = 1; rr <= 5; rr++) {
    for (let cc = 8; cc <= 13; cc++) {
      const pitchAbbrev = firstBlockSeq[idx++]
      const colLabel = matrix[0][cc].colLabel
      const rowLabel = matrix[rr][7].rowLabel
      matrix[rr][cc] = {
        display: pitchAbbrev,
        pitch: pitchAbbrev,
        colLabel,
        rowLabel,
      }
    }
  }

  // SECOND BLOCK (rows 7..12)
  // Row 7 => c0 => "M", c1..6 => "30..35", c7 => "P", c8..13 => "40..45"
  matrix[7][0] = { display: "M" }
  matrix[7][7] = { display: "P" }
  matrix[7][1] = { display: "30", colLabel: "30" }
  matrix[7][2] = { display: "31", colLabel: "31" }
  matrix[7][3] = { display: "32", colLabel: "32" }
  matrix[7][4] = { display: "33", colLabel: "33" }
  matrix[7][5] = { display: "34", colLabel: "34" }
  matrix[7][6] = { display: "35", colLabel: "35" }
  matrix[7][8] = { display: "40", colLabel: "40" }
  matrix[7][9] = { display: "41", colLabel: "41" }
  matrix[7][10] = { display: "42", colLabel: "42" }
  matrix[7][11] = { display: "43", colLabel: "43" }
  matrix[7][12] = { display: "44", colLabel: "44" }
  matrix[7][13] = { display: "45", colLabel: "45" }

  // Rows 8..12 => c0 => "1..5", c7 => "1..5"
  for (let r = 8; r <= 12; r++) {
    matrix[r][0] = { display: String(r - 7), rowLabel: String(r - 7) }
    matrix[r][7] = { display: String(r - 7), rowLabel: String(r - 7) }
  }

  // Generate 60 random calls for second block
  const secondBlockSeq = generatePitchSequence(pitches, 60)
  idx = 0

  // M30..35 => row=8..12, col=1..6
  for (let rr = 8; rr <= 12; rr++) {
    for (let cc = 1; cc <= 6; cc++) {
      const pitchAbbrev = secondBlockSeq[idx++]
      const colLabel = matrix[7][cc].colLabel
      const rowLabel = matrix[rr][0].rowLabel
      matrix[rr][cc] = {
        display: pitchAbbrev,
        pitch: pitchAbbrev,
        colLabel,
        rowLabel,
      }
    }
  }

  // P40..45 => row=8..12, col=8..13
  for (let rr = 8; rr <= 12; rr++) {
    for (let cc = 8; cc <= 13; cc++) {
      const pitchAbbrev = secondBlockSeq[idx++]
      const colLabel = matrix[7][cc].colLabel
      const rowLabel = matrix[rr][7].rowLabel
      matrix[rr][cc] = {
        display: pitchAbbrev,
        pitch: pitchAbbrev,
        colLabel,
        rowLabel,
      }
    }
  }

  // Convert the matrix to a plain string[][] for XLSX
  const aoa: string[][] = matrix.map((row) => row.map((cell) => cell.display || ""))

  // Build the XLSX sheet
  const ws = XLSX.utils.aoa_to_sheet(aoa)

  // Styling for each cell
  const RED = "FF0000"
  const WHITE = "FFFFFF"
  const BLUE = "CCE6FF"
  const GRAY = "D9D9D9"
  const GREEN = "C6EFCE"

  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const ref = XLSX.utils.encode_cell({ r, c })
      if (!ws[ref]) {
        ws[ref] = { t: "s", v: "" }
      }
      ws[ref].s = ws[ref].s || {}
      // Borders + center alignment
      ws[ref].s.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      }
      ws[ref].s.alignment = { horizontal: "center", vertical: "center" }

      // Red header cells => row=0, row=7, col=0, col=7
      if (r === 0 || r === 7 || c === 0 || c === 7) {
        ws[ref].s.fill = { fgColor: { rgb: RED } }
        ws[ref].s.font = { color: { rgb: WHITE }, bold: true }
        continue
      }

      // First block M => row in [1..5], col in [1..6] => white
      if (r >= 1 && r <= 5 && c >= 1 && c <= 6) {
        ws[ref].s.fill = { fgColor: { rgb: WHITE } }
      }
      // First block P => row in [1..5], col in [8..13] => blue
      else if (r >= 1 && r <= 5 && c >= 8 && c <= 13) {
        ws[ref].s.fill = { fgColor: { rgb: BLUE } }
      }
      // Second block M => row in [8..12], col in [1..6] => gray
      else if (r >= 8 && r <= 12 && c >= 1 && c <= 6) {
        ws[ref].s.fill = { fgColor: { rgb: GRAY } }
      }
      // Second block P => row in [8..12], col in [8..13] => green
      else if (r >= 8 && r <= 12 && c >= 8 && c <= 13) {
        ws[ref].s.fill = { fgColor: { rgb: GREEN } }
      }
    }
  }

  // Apply "auto width" based on the AoA contents
  ws["!cols"] = autoWidth(aoa)

  // Return the sheet + the in-memory matrix
  return { ws, matrix }
}

/**
 * Build the "Coach" sheet by reading the "Player" matrix. Each pitch gets its own column,
 * row=0 => pitch names, row=1.. => references (e.g. "10-1") sorted by column then row.
 */
function generateCoachSheetFromPlayer(
  playerMatrix: { pitch?: string; colLabel?: string; rowLabel?: string }[][],
  pitches: Pitch[]
) {
  // 1) Build a map: abbreviation -> full pitch name
  const abToName: Record<string, string> = {}
  for (const p of pitches) {
    abToName[p.abbreviation] = p.name
  }

  // 2) Collect references for each pitch
  const pitchMap: Record<string, string[]> = {}
  for (let r = 0; r < playerMatrix.length; r++) {
    for (let c = 0; c < playerMatrix[r].length; c++) {
      const cell = playerMatrix[r][c]
      if (!cell.pitch) continue
      if (!cell.colLabel || !cell.rowLabel) continue

      const ab = cell.pitch
      const refString = `${cell.colLabel}-${cell.rowLabel}`
      if (!pitchMap[ab]) {
        pitchMap[ab] = []
      }
      pitchMap[ab].push(refString)
    }
  }

  // 3) Sort each pitch's references by col then row
  for (const ab in pitchMap) {
    pitchMap[ab].sort((a, b) => {
      const [aC, aR] = a.split("-").map(Number)
      const [bC, bR] = b.split("-").map(Number)
      if (aC !== bC) return aC - bC
      return aR - bR
    })
  }

  // 4) Create columns for each pitch
  const pitchAbbrevs = Object.keys(pitchMap).sort()
  const maxRefs = Math.max(...pitchAbbrevs.map((ab) => pitchMap[ab].length), 0)
  const rowCount = 1 + maxRefs
  const colCount = pitchAbbrevs.length

  // Build AoA
  const coachAoA: string[][] = Array.from({ length: rowCount }, () =>
    Array(colCount).fill("")
  )

  // row=0 => pitch names
  for (let i = 0; i < pitchAbbrevs.length; i++) {
    const ab = pitchAbbrevs[i]
    const fullName = abToName[ab] || ab
    coachAoA[0][i] = fullName
  }

  // references in rows below
  for (let i = 0; i < pitchAbbrevs.length; i++) {
    const ab = pitchAbbrevs[i]
    const refs = pitchMap[ab]
    for (let r = 0; r < refs.length; r++) {
      coachAoA[r + 1][i] = refs[r]
    }
  }

  // 5) Build sheet
  const ws = XLSX.utils.aoa_to_sheet(coachAoA)

  // style
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount; c++) {
      const ref = XLSX.utils.encode_cell({ r, c })
      if (!ws[ref]) {
        ws[ref] = { t: "s", v: "" }
      }
      ws[ref].s = ws[ref].s || {}
      // borders + center alignment
      ws[ref].s.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      }
      ws[ref].s.alignment = { horizontal: "center", vertical: "center" }

      // row=0 => black header
      if (r === 0) {
        ws[ref].s.fill = { fgColor: { rgb: "000000" } }
        ws[ref].s.font = { color: { rgb: "FFFFFF" }, bold: true }
      }
    }
  }

  // 6) Auto width
  ws["!cols"] = autoWidth(coachAoA)

  return ws
}

/**
 * Generates a sequence of pitch abbreviations, randomly selected
 * according to each pitch's "percentage" property.
 */
function generatePitchSequence(pitches: Pitch[], length: number): string[] {
  const sequence: string[] = []
  const totalWeight = pitches.reduce((sum, p) => sum + (parseFloat(p.percentage) || 0), 0)

  for (let i = 0; i < length; i++) {
    const rand = Math.random() * totalWeight
    let cumulative = 0
    let selected = pitches[0].abbreviation

    for (const p of pitches) {
      cumulative += parseFloat(p.percentage) || 0
      if (rand <= cumulative) {
        selected = p.abbreviation
        break
      }
    }
    sequence.push(selected)
  }
  return sequence
}

/**
 * Helper function that approximates auto-width by measuring the longest text
 * in each column, then setting `wch` (characters) to that length + 1.
 */
function autoWidth(aoa: string[][]) {
  const colCount = aoa[0]?.length || 0
  const widths = new Array(colCount).fill(0)

  // find max length in each column
  for (let r = 0; r < aoa.length; r++) {
    for (let c = 0; c < colCount; c++) {
      const cellVal = aoa[r][c] || ""
      const len = cellVal.toString().length
      if (len > widths[c]) {
        widths[c] = len
      }
    }
  }

  // convert each length into { wch: length+1 }
  return widths.map(w => ({ wch: w + 1 }))
}

