'use client'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface PieChartProps {
  data: DataPoint[]
  title?: string
  size?: number
}

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16', // lime
]

export function PieChart({ data, title, size = 200 }: PieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Không có dữ liệu
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)
  let currentAngle = 0

  const slices = data.map((d, i) => {
    const percentage = (d.value / total) * 100
    const angle = (d.value / total) * 360
    const startAngle = currentAngle
    const endAngle = currentAngle + angle
    currentAngle += angle

    // Calculate SVG path for pie slice
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180)
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180)
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180)
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180)

    const largeArcFlag = angle > 180 ? 1 : 0

    const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    return {
      path,
      color: d.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length],
      label: d.label,
      value: d.value,
      percentage,
    }
  })

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className="flex items-center gap-8">
        <svg
          viewBox="0 0 100 100"
          style={{ width: size, height: size }}
          className="flex-shrink-0"
        >
          {slices.map((slice, i) => (
            <path
              key={i}
              d={slice.path}
              fill={slice.color}
              stroke="white"
              strokeWidth="0.5"
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {slices.map((slice, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: slice.color }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {slice.label}
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">
                {slice.percentage.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}