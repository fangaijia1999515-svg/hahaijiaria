"use client"

interface NarrativeBlockProps {
  title?: string
  content: string
  accentColor?: string
}

export function NarrativeBlock({ title, content, accentColor }: NarrativeBlockProps) {
  return (
    <div className="mb-12">
      {title && (
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
          {title}
        </h3>
      )}
      <p className="text-[#F2F0E9] leading-relaxed text-lg max-w-3xl">{content}</p>
    </div>
  )
}
