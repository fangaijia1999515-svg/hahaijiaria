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
        <h3 className="classic-label text-sm uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>
          {title}
        </h3>
      )}
      {content && <p className="text-[var(--cl-ink)] leading-relaxed text-lg max-w-3xl">{content}</p>}
    </div>
  )
}
