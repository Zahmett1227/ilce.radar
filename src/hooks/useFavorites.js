import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'ilceradar_favorites'

export function districtKey(d) {
  return `${d.il ?? ''}|${d.ilce ?? d.full_name ?? ''}`
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw)
    return new Set(Array.isArray(arr) ? arr : [])
  } catch {
    return new Set()
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => loadFromStorage())

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
    } catch {
      /* storage full or private mode */
    }
  }, [favorites])

  const toggleFavorite = useCallback((key) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((key) => favorites.has(key), [favorites])

  return { favorites, toggleFavorite, isFavorite }
}
