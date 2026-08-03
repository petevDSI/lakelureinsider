import fs from 'fs'
import path from 'path'
import type { PlaceRecord } from '@/types/places'

const PLACES_DIR = path.join(process.cwd(), 'content', 'places')
const STALE_DAYS = 120

function validateRecord(record: unknown, filePath: string, index: number): PlaceRecord {
  const r = record as Record<string, unknown>
  if (!r.source) {
    throw new Error(`[places] Missing required field "source" in ${filePath} record[${index}] (id: ${r.id ?? '?'})`)
  }
  if (!r.lastVerified) {
    throw new Error(`[places] Missing required field "lastVerified" in ${filePath} record[${index}] (id: ${r.id ?? '?'})`)
  }
  return r as unknown as PlaceRecord
}

let _cache: Map<string, PlaceRecord[]> | null = null

function loadAll(): Map<string, PlaceRecord[]> {
  if (_cache) return _cache
  _cache = new Map()
  if (!fs.existsSync(PLACES_DIR)) return _cache

  const staleThreshold = new Date()
  staleThreshold.setDate(staleThreshold.getDate() - STALE_DAYS)
  const stale: string[] = []

  for (const file of fs.readdirSync(PLACES_DIR).filter((f) => f.endsWith('.json'))) {
    const filePath = path.join(PLACES_DIR, file)
    const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as unknown[]
    const category = file.replace('.json', '')
    const records = raw.map((r, i) => validateRecord(r, filePath, i))

    for (const rec of records) {
      if (new Date(rec.lastVerified) < staleThreshold) {
        stale.push(`  • ${rec.name} (${rec.id}): lastVerified ${rec.lastVerified}`)
      }
    }

    _cache.set(category, records)
  }

  if (stale.length > 0) {
    console.warn(
      `[places] WARNING: ${stale.length} record(s) not re-verified in ${STALE_DAYS}+ days:\n` +
        stale.join('\n') +
        '\nRe-confirm the data and update lastVerified.',
    )
  }

  return _cache
}

export function getPlaces(category: string): PlaceRecord[] {
  return loadAll().get(category) ?? []
}

export function getPlacesBySubcategory(category: string, subcategory: string): PlaceRecord[] {
  return getPlaces(category).filter((p) => p.subcategory === subcategory)
}

export function getPlacesExcludingSubcategory(category: string, excludeSubcategory: string): PlaceRecord[] {
  return getPlaces(category).filter((p) => p.subcategory !== excludeSubcategory)
}
