import { motion } from 'framer-motion'

const CX = 130
const CY = 130
const R = 80
const LABEL_R = 99
const N = 6

const SHORT_LABELS = {
  social_culture_score_20: 'Sosyal',
  sea_access_score_20: 'Deniz',
  earthquake_safety_score_20: 'Deprem',
  low_crowding_score_20: 'Sakinlik',
  judicial_low_event_score_20: 'Adli',
  affordability_score_20: 'Fiyat',
}

export const DATASET_COLORS = [
  { stroke: '#34d399', fill: 'rgba(52,211,153,0.18)' },
  { stroke: '#22d3ee', fill: 'rgba(34,211,238,0.18)' },
  { stroke: '#a855f7', fill: 'rgba(168,85,247,0.20)' },
]

function axisAngle(i) {
  return ((-90 + (360 / N) * i) * Math.PI) / 180
}

function ptAt(i, r) {
  const a = axisAngle(i)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function gridPoints(frac) {
  return Array.from({ length: N }, (_, i) => {
    const p = ptAt(i, frac * R)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
}

function safeNum(v) {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

function dataPoints(breakdown) {
  return breakdown.map((item, i) => {
    const ratio = Math.min(Math.max(safeNum(item.value) / Math.max(safeNum(item.max), 1), 0), 1)
    const p = ptAt(i, ratio * R)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
}

function textAnchor(i) {
  const cos = Math.cos(axisAngle(i))
  if (cos > 0.3) return 'start'
  if (cos < -0.3) return 'end'
  return 'middle'
}

function dominantBaseline(i) {
  if (i === 0) return 'hanging'
  if (i === 3) return 'auto'
  return 'middle'
}

/**
 * @param {{ breakdown: object[], stroke?: string, fill?: string }[]} datasets
 * @param {object[]} breakdown  — single-dataset shorthand
 */
export default function RadarChart({ breakdown, datasets }) {
  const resolvedDatasets = datasets?.length > 0
    ? datasets
    : breakdown?.length > 0
      ? [{ breakdown, ...DATASET_COLORS[0] }]
      : null

  if (!resolvedDatasets) return null

  const axisBreakdown = resolvedDatasets[0].breakdown

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex justify-center py-2"
    >
      <svg
        viewBox="0 0 260 260"
        className="w-full max-w-[220px]"
        aria-hidden
      >
        {[0.25, 0.5, 0.75, 1].map((level) => (
          <polygon
            key={level}
            points={gridPoints(level)}
            fill="none"
            stroke="rgba(148,163,184,0.12)"
            strokeWidth="1"
          />
        ))}

        {Array.from({ length: N }, (_, i) => {
          const p = ptAt(i, R)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x.toFixed(2)}
              y2={p.y.toFixed(2)}
              stroke="rgba(148,163,184,0.18)"
              strokeWidth="1"
            />
          )
        })}

        {resolvedDatasets.map((ds, di) => (
          <polygon
            key={di}
            points={dataPoints(ds.breakdown)}
            fill={ds.fill ?? DATASET_COLORS[di % DATASET_COLORS.length].fill}
            stroke={ds.stroke ?? DATASET_COLORS[di % DATASET_COLORS.length].stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        ))}

        {axisBreakdown.map((item, i) => {
          const p = ptAt(i, LABEL_R)
          const label = SHORT_LABELS[item.key] ?? item.label ?? item.key
          return (
            <text
              key={item.key ?? i}
              x={p.x.toFixed(2)}
              y={p.y.toFixed(2)}
              textAnchor={textAnchor(i)}
              dominantBaseline={dominantBaseline(i)}
              fill="rgba(148,163,184,0.85)"
              fontSize="9"
              fontWeight="500"
            >
              {label}
            </text>
          )
        })}
      </svg>
    </motion.div>
  )
}
