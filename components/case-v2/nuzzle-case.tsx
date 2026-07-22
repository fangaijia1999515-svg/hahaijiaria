"use client"

/**
 * NUZZLE — case study composed on the case-v2 grammar (mirrors the /work/skya
 * pilot, incl. the 2026-07 mixed-density amendment). Every KPI, research
 * fact, quote, feature step and outcome stat carries over verbatim from the
 * previous page (app/work/nuzzle, pre-2026-07 build); nothing invented. The
 * only removal is one dossier-lead duplicate (the "strategic pivot" framing
 * sub), reported in the amendment. Media keeps its own warm-brown deck art
 * INSIDE the plates.
 *
 * Anatomy: FOUR chapters (The Challenge / Approach / The Design / Outcome);
 * the former Mission chapter (vision board + closing quote) folds into the
 * end of Outcome, which dissolves the missing Mission-lead problem. The four
 * companion features run as a QUAD register (one row of four, 2x2 under
 * 1024) with compact sub captions, not one giant phone per screen.
 */
import { useEffect, useState } from "react"
import {
  CaseChapter,
  CaseClose,
  CaseFrame,
  CaseHero,
  CaseTop,
  Duo,
  Plate,
  Quad,
  Rise,
  StatRegister,
  TextCard,
} from "@/components/case-v2/case-frame"
import { getNextProject } from "@/lib/projects"

const BACK_HREF = "/#work"

/* the four companion features (verbatim from the previous Intelligent
   Companion module); each ships as a phone-portrait screen recording */
const FEATURES: {
  step: string
  title: string
  description: React.ReactNode
  video: string
}[] = [
  {
    step: "01",
    title: "The Phygital Handshake",
    description: (
      <>
        A QR scan at adoption instantly imports the cat&apos;s medical history
        and personality, eliminating manual setup.
      </>
    ),
    video: "/video/nuzzle/onboarding.mp4",
  },
  {
    step: "02",
    title: "The Daily Anchor",
    description: (
      <>
        Capturing daily emotional data to track bonding progress and trigger
        personalized support.
      </>
    ),
    video: "/video/nuzzle/dailylog01.mp4",
  },
  {
    step: "03",
    title: "Just-in-Time Guide",
    description: (
      <>
        Delivering a &quot;7-Day Scientific Cat Course&quot; with bite-sized
        education for critical moments.
      </>
    ),
    video: "/video/nuzzle/7daycourse.mp4",
  },
  {
    step: "04",
    title: "The Safety Net",
    description: (
      <>
        A 24/7 tiered lifeline escalating from instant AI chat to verified
        experts, preventing panic-driven returns.
      </>
    ),
    video: "/video/nuzzle/aichatbot.mp4",
  },
]

/* roadmap flipbook (verbatim behavior from the previous page): all three
   frames stay mounted so the 2s swap is instant, with no in-between state */
const ROADMAP_SLIDES = [
  "/image/Nuzzle/year101.png",
  "/image/Nuzzle/year2.png",
  "/image/Nuzzle/year5.png",
]

function RoadmapSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % ROADMAP_SLIDES.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="nz-roadmap">
      {ROADMAP_SLIDES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={`Nuzzle roadmap phase ${i + 1}`}
          style={{ visibility: i === index ? "visible" : "hidden" }}
        />
      ))}
    </div>
  )
}

export function NuzzleCase() {
  const next = getNextProject("nuzzle")

  /* nav = the FOUR chapters + framing leads (verbatim), per the case-anatomy
     spec's single-source lead architecture. */
  const nav = [
    {
      id: "challenge",
      label: "The Challenge",
      lead: (
        <>
          Nearly 50% of adopted cats are returned within the first 30 days.
          Through my research, I discovered this isn&apos;t due to &apos;bad
          cats,&apos; but a systemic failure driven by an &apos;Expectation
          Gap.&apos; New owners are often unprepared for the reality of animal
          adaptation, causing emotional distress that spirals into regret.
        </>
      ),
    },
    {
      id: "approach",
      label: "Approach",
      lead: (
        <>
          I shifted the strategic model from Reactive (waiting for returns) to
          Proactive (preventing them). By utilizing Service Blueprinting to
          integrate the app into shelter operations and Rapid Prototyping
          (Vibe Coding), I was able to validate emotional interactions early
          in the process.
        </>
      ),
    },
    {
      id: "design",
      label: "The Design",
      lead: (
        <>
          Nuzzle is a post-adoption support service prescribed by shelters.
          Starting with a seamless QR-code scan at the shelter desk to
          instantly import the cat&apos;s medical and personality profile, I
          designed the system to guide new owners through the emotional
          rollercoaster of the first month. By providing daily check-ins and
          expert access, Nuzzle extends the shelter&apos;s care into the home,
          preventing returns before they happen.
        </>
      ),
    },
    {
      id: "outcome",
      label: "Outcome",
      lead: (
        <>
          Unlocking the Value Network. Nuzzle is more than a companion app; it
          is a self-sustaining ecosystem. By capturing precise
          &quot;First-30-day&quot; behavioral data, Nuzzle transforms the
          heavy operational burden of adoption support into a valuable engine
          for commercial and local partners.
        </>
      ),
    },
  ]

  return (
    <div className="cv2-stage ds-dark">
      <CaseTop homeHref="/" />

      <CaseFrame
        title="Nuzzle"
        oneLiner="From breakdown to bond. A shelter-prescribed companion service that closes the expectation gap for first-time cat adopters."
        meta={[
          { k: "Role", v: "Lead Service Designer" },
          { k: "Timeline", v: "10 Weeks" },
          { k: "Team", v: "Solo Project" },
        ]}
        services={[
          "Figma",
          "Cursor (Vibe Coding)",
          "LLM",
          "User Research",
          "Affinity Mapping",
          "Service Blueprinting",
          "Journey Mapping",
          "System Thinking",
        ]}
        nav={nav}
        live={{
          label: "Experience Live Prototype",
          href: "https://fangaijia1999515-svg.github.io/NazzleCatapp/",
        }}
        backHref={BACK_HREF}
        next={next}
      >
        <CaseHero
          src="/image/Nuzzle/hero2.webp"
          alt="Nuzzle Hero"
          captionLeft="Nuzzle &middot; Shelter-prescribed companion service"
          captionRight="Solo Project &middot; 10 Weeks"
        />

        {/* ================= 01 THE CHALLENGE ================= */}
        <CaseChapter id="challenge" index="01" label="The Challenge">
          <div className="cv2-module">
            <StatRegister
              stats={[
                { value: "50%", label: "of cat returns", detail: "happen in the first 30 days" },
                {
                  value: "127K+",
                  label: "Cats returned annually",
                  detail: "within first 30 days after adoption",
                },
                { value: "41%", label: "of returners", detail: "never adopt again" },
              ]}
            />
          </div>

          {/* SUB + the cost register it frames: one tight group */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>The problem landscape</h3>
              <p>
                A systemic failure driven by high financial costs for shelters
                and a deep emotional disconnect for adopters. Without guidance,
                adopters interpret normal biological behaviors as behavioral
                issues or personal failure.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <StatRegister
              cols={2}
              loud
              stats={[
                { value: "$250", label: "Shelter Cost", detail: "Per cat returned" },
                {
                  value: "$32M",
                  label: "Annual Re-intake Burden",
                  detail: "Per year (~127,000 cats returned)",
                },
              ]}
            />
          </div>

          <Rise className="cv2-module">
            <blockquote className="cv2-quote">
              <p>
                &ldquo;I was crying for the first three days, just thinking
                about how to return him.&rdquo;
              </p>
              <footer>First-time Adopter.</footer>
            </blockquote>
          </Rise>

          {/* the two research charts share one duo row (working evidence) */}
          <div className="cv2-module">
            <Duo ratio="1:1">
              <Plate
                size="half"
                tone="dark"
                aspect="2560 / 1954"
                caption="Disappointment Factors (1)"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/Nuzzle/data01.webp"
                  alt="Disappointment Factors (1)"
                  loading="lazy"
                />
              </Plate>
              <Plate
                size="half"
                tone="dark"
                aspect="8108 / 6188"
                caption="Disappointment Factors (3)"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/Nuzzle/data3.png"
                  alt="Disappointment Factors (3)"
                  loading="lazy"
                />
              </Plate>
            </Duo>
          </div>

          {/* the journey map: dense working diagram, wide not full */}
          <div className="cv2-module">
            <Plate
              size="wide"
              tone="dark"
              aspect="2560 / 1954"
              caption="Journey Map"
              captionRight="The first 30 days"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/Nuzzle/journeymap03.webp" alt="Journey Map" loading="lazy" />
            </Plate>
          </div>
        </CaseChapter>

        {/* ================= 02 APPROACH ================= */}
        <CaseChapter id="approach" index="02" label="Approach">
          {/* the two support states as framed cards, side by side (copy
              verbatim from the previous prop rail) */}
          <div className="cv2-module">
            <Duo ratio="1:1">
              <TextCard overline="Current State" title="Reactive Support">
                <p>
                  Adopters face a &quot;Support Vacuum&quot; immediately after
                  leaving the shelter. When crises occur, they frantically turn
                  to Reddit or social media. This reactive searching leads to
                  conflicting advice, deep isolation, and eventual burnout.
                </p>
              </TextCard>
              <TextCard overline="Future State" title="Proactive Intervention">
                <p>
                  Nuzzle shifts from passive manuals to proactive,
                  stage-appropriate guidance. Starting from the critical
                  &quot;First Night,&quot; the system uses daily check-ins to
                  push bite-sized education exactly when expected behavioral
                  challenges arise.
                </p>
              </TextCard>
            </Duo>
          </div>
        </CaseChapter>

        {/* ================= 03 THE DESIGN ================= */}
        <CaseChapter id="design" index="03" label="The Design">
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>The Intelligent Companion</h3>
              <p>
                To deliver this proactive support and validate emotional
                interactions, I utilized AI-assisted rapid prototyping to build
                a fully functional HTML/CSS app. This allowed me to test
                real-world pacing and tone in a fraction of traditional
                development time.
              </p>
            </div>
          </Rise>

          {/* the four companion features: one quad register (2x2 under 1024),
              descriptions as compact sub captions — tight after its sub */}
          <div className="cv2-module cv2-module--tight">
            <Quad>
              {FEATURES.map((feature) => (
                <Plate
                  key={feature.step}
                  size="half"
                  tone="dark"
                  caption={`${feature.step} / ${feature.title}`}
                  sub={feature.description}
                >
                  <video
                    src={feature.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                  />
                </Plate>
              ))}
            </Quad>
          </div>

          {/* SUB + the blueprint it frames: tight */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>Back-Stage Orchestration</h3>
              <p>
                The App is just the &quot;Front Stage.&quot; This blueprint
                details how user inputs trigger &quot;Back Stage&quot;
                operations. By analyzing daily check-in data, the system flags
                high-risk adopters, enabling volunteers and shelter staff to
                initiate proactive outreach before the bond breaks.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <Plate
              contain
              aspect="17979 / 5279"
              caption="Service blueprint"
              captionRight="Front Stage &middot; Back Stage"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/Nuzzle/serviceblueprint.png"
                alt="Back-Stage Orchestration service blueprint"
                loading="lazy"
              />
            </Plate>
          </div>
        </CaseChapter>

        {/* ================= 04 OUTCOME ================= */}
        <CaseChapter id="outcome" index="04" label="Outcome">
          {/* the ecosystem diagram: dense working artifact, wide not full */}
          <div className="cv2-module">
            <Plate
              size="wide"
              contain
              aspect="2560 / 2072"
              caption="Nuzzle B2B2C value network ecosystem"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/Nuzzle/ecosystem.webp"
                alt="Nuzzle B2B2C value network ecosystem"
                loading="lazy"
              />
            </Plate>
          </div>

          <div className="cv2-module">
            <ul className="cv2-props">
              <Rise className="cv2-prop">
                <h4>Commercial Partners</h4>
                <p>
                  Reach 100% of high-intent new cat parents. By driving
                  first-time purchases through Nuzzle&apos;s curated shopping
                  guides, we generate sustainable affiliate revenue.
                </p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>Local Vet Clinics</h4>
                <p>
                  Alleviate first-week health anxieties via one-click
                  appointments, establishing a stable, geo-targeted acquisition
                  channel for local partners.
                </p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>Shelter Organizations</h4>
                <p>
                  Reduce return rates and automate follow-ups, providing
                  critical retention analytics while alleviating their
                  financial and operational strain.
                </p>
              </Rise>
            </ul>
          </div>

          {/* SUB + the impact boards it frames: one tight passage of two duos */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>Sustainable Impact &amp; Path to Profitability</h3>
              <p>
                Nuzzle transforms a shelter&apos;s cost center into a
                sustainable service ecosystem, saving both lives and
                operational budgets.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <Duo ratio="1:1">
              <Plate size="half" tone="dark" aspect="2560 / 1990">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/Nuzzle/impact101.webp" alt="Nuzzle impact 01" loading="lazy" />
              </Plate>
              <Plate size="half" tone="dark" aspect="4476 / 3480">
                <RoadmapSlideshow />
              </Plate>
            </Duo>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Duo ratio="1:1">
              <Plate size="half" tone="dark" aspect="2560 / 1990">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/Nuzzle/impact03.webp" alt="Nuzzle impact 03" loading="lazy" />
              </Plate>
              <Plate size="half" tone="dark" aspect="2560 / 1990">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/image/Nuzzle/impact04.webp" alt="Nuzzle impact 04" loading="lazy" />
              </Plate>
            </Duo>
          </div>

          <div className="cv2-module">
            <ul className="cv2-props">
              <Rise className="cv2-prop">
                <h4>Operational Savings</h4>
                <p>
                  Saves approximately $250 in medical and housing operations
                  per intercepted return.
                </p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>The Adopter Data Asset</h4>
                <p>
                  Transforms 30-day daily logs into highly valuable, anonymized
                  behavioral and commercial data.
                </p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>Scalability</h4>
                <p>
                  Designed to scale from a single-shelter pilot to the standard
                  U.S. adoption infrastructure.
                </p>
              </Rise>
            </ul>
          </div>

          {/* the mission fold: vision board (TRUE presentation: full) + the
              closing quote end the case */}
          <div className="cv2-module">
            <Plate tone="dark" aspect="16 / 9" caption="The Future" captionRight="Nuzzle vision">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/image/Nuzzle/vision.webp" alt="Nuzzle vision" loading="lazy" />
            </Plate>
          </div>
          <Rise className="cv2-module">
            <blockquote className="cv2-quote">
              <p>
                &quot;Ultimately, Nuzzle demonstrates that the key to solving
                the animal return crisis isn&apos;t about finding
                &apos;better&apos; pets, but about designing proactive,
                human-centric support systems for the people who adopt
                them.&quot;
              </p>
            </blockquote>
          </Rise>
        </CaseChapter>
      </CaseFrame>

      <CaseClose backHref={BACK_HREF} next={next} />
    </div>
  )
}
