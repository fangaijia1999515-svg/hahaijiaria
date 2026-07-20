/**
 * DS CARDS — ProjectCard (image · title · description · "View project →") and
 * QuoteCard (large mark · italic serif quote · attribution). Her component sheet.
 */
import type { ReactNode } from "react"
import { DsLink } from "./primitives"

/* ---- Project card ---- */
export function ProjectCard({
  title, image, imageAlt,
  description = "A brief description of the project or content goes here.",
  href = "#",
}: {
  title: string; image?: string; imageAlt?: string; description?: string; href?: string
}) {
  return (
    <article className="ds-card ds-project-card">
      <div className="ds-project-card__media">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={imageAlt ?? title} />
        ) : (
          <div aria-hidden style={{ position: "absolute", inset: 0,
            background: "linear-gradient(135deg, var(--ds-warm-taupe), var(--ds-amber-brown))",
            opacity: 0.7 }} />
        )}
      </div>
      <div className="ds-project-card__body">
        <h3 className="ds-project-card__title">{title}</h3>
        <p className="ds-project-card__desc">{description}</p>
        <div className="ds-project-card__link"><DsLink href={href}>View project</DsLink></div>
      </div>
    </article>
  )
}

/* ---- Quote card ---- */
export function QuoteCard({ quote, author }: { quote: ReactNode; author: string }) {
  return (
    <article className="ds-card ds-quote-card">
      <span className="ds-quote-card__mark" aria-hidden>&ldquo;</span>
      <p className="ds-quote-card__text">{quote}</p>
      <p className="ds-quote-card__cite">— {author}</p>
    </article>
  )
}
