import { useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function districtKey(d) {
  if (d.district_id != null && d.district_id !== '') return `id:${d.district_id}`
  const ilce = d.ilce ?? ''
  const il = d.il ?? ''
  if (il && ilce) return `nm:${il}|${ilce}`
  return `fn:${d.full_name ?? ''}`
}

export default function DistrictMap({ allDistricts, topDistricts }) {
  const getColor = (score) => {
    if (score >= 70) return '#34d399'
    if (score >= 55) return '#fbbf24'
    if (score >= 40) return '#f97316'
    return '#ef4444'
  }

  const topKeys = useMemo(
    () => new Set((topDistricts ?? []).map((d) => districtKey(d))),
    [topDistricts],
  )

  const userScoreByKey = useMemo(() => {
    const m = new Map()
    for (const d of topDistricts ?? []) {
      const us = d.user_score_100
      if (typeof us === 'number' && Number.isFinite(us)) {
        m.set(districtKey(d), us)
      }
    }
    return m
  }, [topDistricts])

  return (
    <div
      className="overflow-hidden rounded-3xl border border-white/10 ring-1 ring-white/10"
      style={{ height: '420px' }}
    >
      <MapContainer
        center={[39.0, 35.0]}
        zoom={5.5}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap &copy; CARTO"
        />
        {(allDistricts ?? [])
          .filter((d) => d.lat != null && d.lng != null)
          .map((d) => {
            const key = districtKey(d)
            const isTop = topKeys.has(key)
            const score =
              userScoreByKey.get(key) ??
              d.user_score_100 ??
              d.default_overall_score_100 ??
              0
            return (
              <CircleMarker
                key={key}
                center={[Number(d.lat), Number(d.lng)]}
                radius={isTop ? 10 : 6}
                pathOptions={{
                  fillColor: getColor(score),
                  fillOpacity: isTop ? 1 : 0.55,
                  color: isTop ? '#ffffff' : 'transparent',
                  weight: isTop ? 2 : 0,
                }}
              >
                <Tooltip>
                  <span style={{ fontWeight: 600 }}>
                    {d.ilce} / {d.il}
                  </span>
                  <br />
                  Skor: {Math.round(score)}/100
                  {isTop ? ' ⭐ Önerilen' : ''}
                </Tooltip>
              </CircleMarker>
            )
          })}
      </MapContainer>
    </div>
  )
}
