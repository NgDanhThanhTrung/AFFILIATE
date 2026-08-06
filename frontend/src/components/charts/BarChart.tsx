'use client'

interface DataPoint {
  label: string
  value: number
}

interface BarChartProps {
  data: DataPoint[]
  title?: string
  color?: string
  height?: number
}

export function BarChart({ data, title, color = '#3b82f6', height = 200 }: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Không có dữ liệu
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      <div className="relative" style={{ height: `${height}px` }}>
        <div className="flex items-end justify-between h-full gap-2">
          {data.map((d, i) => {
            const heightPercent = (d.value / maxValue) * 100
            return (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div className="w-full relative" style={{ height: `${heightPercent}%` }}>
                  <div
                    className="absolute bottom-0 w-full rounded-t-md transition-all duration-300"
                    style={{ backgroundColor: color }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 text-center truncate w-full">
                  {d.label}
                </span>
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {d.value.toLocaleString()}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}