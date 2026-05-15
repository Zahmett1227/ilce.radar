import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import xlsx from 'xlsx'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

const DEFAULT_INPUT = path.join(rootDir, 'src', 'data', 'ideal_ilce_genisletilmis.son.xlsx')
const INPUT = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_INPUT
const OUTPUT = path.join(rootDir, 'src', 'data', 'districts.json')
const METRIC_OUTPUT = path.join(rootDir, 'src', 'data', 'metricQuestions.json')

/** Kolon adları Excel ile aynı kalır; sayısal alanlar Number veya null olur */
const NUMERIC_KEYS = new Set([
  'district_id',
  'default_overall_score_100',
  'model_rank',
  'sege_rank',
  'sege_score',
  'population_2024',
  'social_culture_score_20',
  'sea_access_score_20',
  'earthquake_safety_score_20',
  'low_crowding_score_20',
  'judicial_low_event_score_20',
  'affordability_score_20',
  'sale_price_m2_try',
  'rent_price_m2_try',
  'avg_rent_try',
  'avg_home_price_try',
  'rent_increase_1y_pct',
  'amortization_years',
  'lat',
  'lng',
])

function trimRowKeys(row) {
  const out = {}
  for (const [key, raw] of Object.entries(row)) {
    if (key === '__rowNum__') continue
    out[String(key).trim()] = raw
  }
  return out
}

function coerceCell(key, value) {
  if (value === undefined || value === '') return null
  if (!NUMERIC_KEYS.has(key)) {
    if (value === null) return null
    return value
  }
  if (typeof value === 'number' && Number.isFinite(value)) return value
  const n = Number(String(value).replace(',', '.').trim())
  return Number.isFinite(n) ? n : null
}

function normalizeRow(row) {
  const trimmed = trimRowKeys(row)
  const out = {}
  for (const [key, raw] of Object.entries(trimmed)) {
    out[key] = coerceCell(key, raw)
  }
  return out
}

function normalizeMetricRow(row) {
  const t = trimRowKeys(row)
  return {
    key: t.key ?? t.metric_key ?? null,
    title: t.title ?? t.ui_label ?? null,
    question: t.question ?? t.weight_prompt ?? null,
    description: t.description ?? t.frontend_helper_text ?? '',
    scoreColumn: t.scoreColumn ?? t.score_column ?? null,
  }
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Excel bulunamadı:', INPUT)
    process.exit(1)
  }

  const workbook = xlsx.readFile(INPUT)
  const sheetName = 'districts_app'
  if (!workbook.SheetNames.includes(sheetName)) {
    console.error(
      `Sheet "${sheetName}" yok. Mevcut sheet'ler:`,
      workbook.SheetNames.join(', '),
    )
    process.exit(1)
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: null, raw: true })
  const districts = rows.map(normalizeRow)

  const generatedAt = new Date().toISOString()
  const payload = {
    generatedAt,
    rowCount: districts.length,
    districts,
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true })
  fs.writeFileSync(OUTPUT, JSON.stringify(payload, null, 2), 'utf8')
  console.log(`Yazıldı: ${OUTPUT} (${districts.length} ilçe)`)

  const metricSheetName = 'metric_config'
  if (workbook.SheetNames.includes(metricSheetName)) {
    const mSheet = workbook.Sheets[metricSheetName]
    const mRows = xlsx.utils.sheet_to_json(mSheet, { defval: null, raw: false })
    const cleaned = mRows
      .map(normalizeMetricRow)
      .filter((r) => r.key && r.title && r.question && r.scoreColumn)
    fs.writeFileSync(METRIC_OUTPUT, JSON.stringify(cleaned, null, 2), 'utf8')
    console.log(`Yazıldı: ${METRIC_OUTPUT} (${cleaned.length} satır)`)
  } else {
    fs.writeFileSync(METRIC_OUTPUT, JSON.stringify([], null, 2), 'utf8')
    console.log(`Sheet "${metricSheetName}" yok; boş dizi yazıldı: ${METRIC_OUTPUT}`)
  }
}

main()
