"use client"

const skills = [
  { title: "Systems Thinking" },
  { title: "Strategic Design" },
  { title: "Service Ecosystems" },
  { title: "3D Modeling & CAD" },
  { title: "User Research" },
  { title: "Physical Prototyping" },
  { title: "AI-Empowered Workflows" },
  { title: "Service Blueprints" },
]

// Accent palette — colors are assigned by the card's position in the scrolling
// carousel (not by its skill index), so the sequence yellow → green → blue → pink → purple
// loops continuously across the infinite scroll without breaking at the array boundary.
const PALETTE = ["#FFC973", "#7AFEA7", "#96C1FF", "#FF9992", "#E692FF"]
const TEXT_COLOR = "#1E1510"

function SkillCard({ title, bgColor }: { title: string; bgColor: string }) {
  return (
    <div
      className="flex-shrink-0 inline-flex items-center justify-center h-14 md:h-16 px-7 md:px-9 rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <h3
        className="font-sans font-semibold text-base md:text-lg leading-none whitespace-nowrap tracking-[-0.01em]"
        style={{ color: TEXT_COLOR }}
      >
        {title}
      </h3>
    </div>
  )
}

export function CoreCapabilities() {
  const duplicatedSkills = [...skills, ...skills, ...skills]

  return (
    <section className="mt-6 md:mt-8 pb-14 md:pb-18 overflow-hidden">
      <div className="mx-auto mb-6 w-full max-w-[100rem] px-6 md:mb-8 md:px-12 lg:px-16">
        <span className="block text-center text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground md:text-left">
          Toolkit
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full">
        {/* Gradient masks for smooth edge fade */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden">
          <div
            className="flex gap-4 animate-scroll-left"
            style={{
              width: "fit-content",
            }}
          >
            {duplicatedSkills.map((skill, index) => (
              <SkillCard
                key={`${skill.title}-${index}`}
                title={skill.title}
                bgColor={PALETTE[index % PALETTE.length]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
