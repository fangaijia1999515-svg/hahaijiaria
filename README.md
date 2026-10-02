# hahaijia.com

My portfolio. Designed and built by me, with Claude Code in the loop.

**Live → [hahaijia.com](https://hahaijia.com)**

---

## The file worth looking at

**`components/tarot/deck.tsx`** — 1,553 lines that generate all 78 cards of a tarot
deck from one shared component library. There is no `Math.random` anywhere in it,
so every card renders identically every time.

I built it this way after making the first version with image models. Card by card
they looked fine. Laid out as a set, line weights drifted and the palette wandered,
and I only saw it once all 78 were side by side. The deterministic build is what
makes the set checkable at all.

**Live deck → [hahaijia.com/garden/deck](https://hahaijia.com/garden/deck)**

---

## Stack

Next.js 16 · React 19 · TypeScript · Tailwind 4
GSAP + Lenis for the scroll-driven motion · Three.js / React Three Fiber

Deployed on Vercel.
