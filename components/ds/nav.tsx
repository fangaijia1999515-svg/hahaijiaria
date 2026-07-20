/**
 * DS NAV — her navigation bar (light + dark). Rounded pill / capsule container:
 * wordmark left, links center-right, a filled "Book a call" CTA pill right.
 * Dark = wrap in `.ds-dark` via the `dark` prop.
 */
import { Logo, Button } from "./primitives"

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ")

const DEFAULT_LINKS = [
  { label: "Home", href: "#", active: true },
  { label: "About", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Contact", href: "#" },
]

export function Nav({ dark, links = DEFAULT_LINKS, cta = "Book a call" }:
  { dark?: boolean; links?: { label: string; href: string; active?: boolean }[]; cta?: string }) {
  return (
    <nav className={cx("ds-nav", dark && "ds-dark")}>
      <Logo tagline="" size={20} />
      <div className="ds-nav__links">
        {links.map((l) => (
          <a key={l.label} href={l.href}
            className={cx("ds-nav__link", l.active && "ds-nav__link--active")}>
            {l.label}
          </a>
        ))}
      </div>
      <Button variant="solid" size="sm">{cta}</Button>
    </nav>
  )
}
