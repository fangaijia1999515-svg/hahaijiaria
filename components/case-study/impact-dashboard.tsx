"use client"

interface Metric {
  value: string
  label: string
  detail?: string
}

interface ImpactDashboardProps {
  metrics: Metric[]
  accentColor: string
  customSpacing?: boolean // Add optional prop for custom spacing
  centerItemLeftPadding?: string // Custom left padding for center item (e.g., "pl-4", "pl-8")
  rightItemLeftPadding?: string // Custom left padding for right item (e.g., "ml-4", "ml-8", "md:translate-x-8")
}

export function ImpactDashboard({ metrics, accentColor, customSpacing = false, centerItemLeftPadding, rightItemLeftPadding }: ImpactDashboardProps) {
  // Check if this is for Nuzzle (has custom spacing props)
  const isNuzzleLayout = rightItemLeftPadding || centerItemLeftPadding
  
  return (
    <div className="border-y-section py-12 mb-16">
      <div 
        className={`grid grid-cols-1 md:grid-cols-3 ${
          isNuzzleLayout 
            ? 'w-full max-w-full' 
            : 'gap-8 md:gap-12 lg:gap-16 justify-items-start md:justify-items-start'
        }`}
        style={isNuzzleLayout ? {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          width: '100%',
          gap: 0
        } : undefined}
      >
        {metrics.map((metric, index) => {
          // Get alignment for Nuzzle layout
          const getAlignment = () => {
            if (isNuzzleLayout) {
              if (index === 0) return 'text-left' // First: Left
              if (index === 1) return 'text-center' // Middle: Center
              if (index === 2) return 'text-right' // Third: Right
            }
            return 'text-center md:text-left'
          }

          return (
            <div
            key={index}
              className={`${getAlignment()} w-full ${
                !isNuzzleLayout && customSpacing ? (
                  index === 0 ? 'md:pr-8 lg:pr-12' : 
                  index === 1 ? 'md:px-6 lg:px-8' : 
                  'md:pl-8 lg:pl-12'
                ) : ''
              }`}
              style={isNuzzleLayout ? {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: index === 0 ? 'flex-start' : index === 1 ? 'flex-start' : 'flex-end',
                marginLeft: index === 1 ? '-1rem' : undefined
              } : undefined}
          >
            {/* The Data - Massive Theme Color */}
            <div
              className="font-black text-6xl md:text-7xl lg:text-8xl tracking-tight mb-2"
              style={{ color: accentColor }}
            >
              {metric.value}
            </div>

            {/* The Meaning - Bold Uppercase */}
            <div className="font-bold text-sm uppercase tracking-widest text-[#F2F0E9]">{metric.label}</div>

            {/* Optional Detail Caption */}
            {metric.detail && (
              <div className="text-sm text-[#A89080] mt-1.5 leading-snug">
                {metric.detail}
              </div>
            )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
