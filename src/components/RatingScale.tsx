'use client'

interface Props {
  value: number | null
  onChange: (value: number) => void
  disabled?: boolean
}

export function RatingScale({ value, onChange, disabled = false }: Props) {
  const ratings = [
    { value: 1, label: 'Never', color: 'from-red-500 to-red-600' },
    { value: 2, label: 'Very unlikely', color: 'from-red-400 to-red-500' },
    { value: 3, label: 'Unlikely', color: 'from-orange-500 to-red-400' },
    { value: 4, label: 'Somewhat unlikely', color: 'from-orange-400 to-orange-500' },
    { value: 5, label: 'Neutral', color: 'from-yellow-400 to-orange-400' },
    { value: 6, label: 'Somewhat likely', color: 'from-lime-400 to-yellow-400' },
    { value: 7, label: 'Likely', color: 'from-green-400 to-lime-400' },
    { value: 8, label: 'Very likely', color: 'from-green-500 to-green-400' },
    { value: 9, label: 'Extremely likely', color: 'from-green-600 to-green-500' },
    { value: 10, label: 'Perfect together', color: 'from-emerald-600 to-green-600' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Scale labels */}
      <div className="flex justify-between mb-4 text-sm text-gray-300">
        <span>Never (1)</span>
        <span>Perfect (10)</span>
      </div>

      {/* Rating buttons */}
      <div className="grid grid-cols-5 md:grid-cols-10 gap-2 mb-6">
        {ratings.map((rating) => (
          <button
            key={rating.value}
            onClick={() => onChange(rating.value)}
            disabled={disabled}
            className={`
              relative h-16 md:h-20 rounded-lg font-bold text-white transition-all duration-200
              ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105'}
              ${
                value === rating.value
                  ? `bg-gradient-to-br ${rating.color} ring-4 ring-white/50 scale-105`
                  : `bg-gradient-to-br ${rating.color} opacity-70 hover:opacity-100`
              }
            `}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
              <span className="text-lg md:text-xl font-bold">
                {rating.value}
              </span>
              <span className="text-xs md:text-sm leading-tight text-center hidden md:block">
                {rating.label}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Selected rating description */}
      {value && (
        <div className="text-center">
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-white font-medium text-lg">
              {value}/10 - {ratings.find(r => r.value === value)?.label}
            </span>
          </div>
        </div>
      )}

      {/* Mobile labels */}
      <div className="md:hidden mt-4 grid grid-cols-5 gap-2 text-xs text-gray-400">
        {ratings.slice(0, 5).map((rating) => (
          <div key={rating.value} className="text-center">
            {rating.label}
          </div>
        ))}
      </div>
      <div className="md:hidden mt-2 grid grid-cols-5 gap-2 text-xs text-gray-400">
        {ratings.slice(5).map((rating) => (
          <div key={rating.value} className="text-center">
            {rating.label}
          </div>
        ))}
      </div>
    </div>
  )
}
