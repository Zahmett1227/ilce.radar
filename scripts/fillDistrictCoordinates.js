/**
 * Eksik lat/lng alanlarını il merkez koordinatlarıyla doldurur.
 * Kullanım: node scripts/fillDistrictCoordinates.js
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DISTRICTS_PATH = path.join(__dirname, '..', 'src', 'data', 'districts.json')
const CENTROIDS_PATH = path.join(__dirname, '..', 'src', 'data', 'ilCentroids.json')
const BACKUP_PATH = path.join(__dirname, '..', 'src', 'data', 'districts.backup.json')

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function main() {
  const bundle = loadJson(DISTRICTS_PATH)
  const districts = Array.isArray(bundle) ? bundle : bundle.districts
  const centroids = fs.existsSync(CENTROIDS_PATH) ? loadJson(CENTROIDS_PATH) : {}

  let backupMap = new Map()
  if (fs.existsSync(BACKUP_PATH)) {
    const backup = loadJson(BACKUP_PATH)
    const list = Array.isArray(backup) ? backup : backup.districts ?? []
    for (const d of list) {
      if (d.lat != null && d.lng != null) {
        backupMap.set(d.district_id ?? d.full_name, { lat: d.lat, lng: d.lng })
      }
    }
  }

  let filled = 0
  for (const d of districts) {
    if (d.lat != null && d.lng != null) continue
    const key = d.district_id ?? d.full_name
    const fromBackup = backupMap.get(key)
    if (fromBackup) {
      d.lat = fromBackup.lat
      d.lng = fromBackup.lng
      filled += 1
      continue
    }
    const il = d.il?.trim()
    const c = il && centroids[il]
    if (c) {
      d.lat = c.lat
      d.lng = c.lng
      filled += 1
    }
  }

  const out = Array.isArray(bundle)
    ? districts
    : {
        ...bundle,
        districts,
        rowCount: districts.length,
        generatedAt: new Date().toISOString(),
      }

  fs.writeFileSync(DISTRICTS_PATH, `${JSON.stringify(out, null, 2)}\n`, 'utf8')
  const withCoord = districts.filter((d) => d.lat != null && d.lng != null).length
  console.log(`Koordinat dolduruldu: ${filled} kayıt güncellendi.`)
  console.log(`Toplam ${withCoord}/${districts.length} ilçede lat/lng var.`)
}

main()
