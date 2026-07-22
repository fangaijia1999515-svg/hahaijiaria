"use client"

/**
 * SKYA — the PILOT of the case-anatomy rebuild (CASE-ANATOMY-SPEC.md §8 +
 * the 2026-07 mixed-density amendment). Every KPI, research fact, quote,
 * step and outcome stat carries over verbatim from the previous build;
 * nothing invented. The only removals are dossier-lead duplicates, reported
 * in the amendment (the "problem landscape" framing sub).
 *
 * Anatomy: FOUR chapters (The Challenge / Approach / The Design / Outcome);
 * the former Mission chapter folds into the end of Outcome (its board +
 * statement close there; its paragraph rides a TextCard verbatim). Framing
 * leads live in the nav array (dossier swapping lead). The stream is
 * mixed-density: true presentation boards full-bleed, working diagrams wide
 * (~78%) or paired in Duo rows, the app screen beside its TextCard, the
 * five service moments paced as 2-up duos + one wide closer. Fact-sets stay
 * full-width set-pieces (KPI / PROP / QUOTE / STATEMENT). Stage =
 * warm-charcoal `.ds-dark` gallery; `stage="cream"` drops the class for the
 * one-class cream variant (?stage=cream).
 */
import {
  CaseChapter,
  CaseClose,
  CaseFrame,
  CaseHero,
  CaseTop,
  Duo,
  Plate,
  Rise,
  StatRegister,
  TextCard,
} from "@/components/case-v2/case-frame"
import { getNextProject } from "@/lib/projects"

const BACK_HREF = "/#work"

/* the five service moments (verbatim from the previous How-It-Works module).
   Steps 1-4 ship alpha-channel renders: Safari decodes HEVC (.mov, hvc1),
   the rest take VP9 (.webm); the poster is the matching still. */
const STEPS: {
  index: string
  title: string
  desc: string
  poster: string
  mov?: string
  webm?: string
}[] = [
  {
    index: "01",
    title: "Pod Retrieval",
    desc: "The autonomous chassis arrives at the apartment complex to pick up the used locker pod (containing processed returns) to transport it back to the hub.",
    poster: "/image/skya/step1.webp",
    mov: "/video/skya/step1.mov",
    webm: "/video/skya/step1.webm",
  },
  {
    index: "02",
    title: "Hub Processing",
    desc: "At the logistics hub, the pod is removed. Robotic arms process the returns and load a fresh pod with new packages, ensuring 100% sorting accuracy.",
    poster: "/image/skya/step2.webp",
    mov: "/video/skya/step2.mov",
    webm: "/video/skya/step2.webm",
  },
  {
    index: "03",
    title: "Autonomous Transit",
    desc: "The Skya chassis attaches to the newly loaded pod and navigates through the city using optimized routes to minimize delivery time.",
    poster: "/image/skya/step3.webp",
    mov: "/video/skya/step3-1.mov",
    webm: "/video/skya/step3-1.webm",
  },
  {
    index: "04",
    title: "Docking & Separation",
    desc: "The vehicle docks at the apartment station and releases the pod. The chassis then detaches and departs to serve the next location, leaving the locker behind.",
    poster: "/image/skya/step4.webp",
    mov: "/video/skya/step4.mov",
    webm: "/video/skya/step4.webm",
  },
  {
    index: "05",
    title: "Access & Returns",
    desc: "Residents receive an App notification. They can unlock the pod to collect packages or drop off returns instantly, no printing labels required.",
    poster: "/image/skya/step5.webp",
  },
]

function StepMedia({ step }: { step: (typeof STEPS)[number] }) {
  if (!step.mov && !step.webm) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={step.poster} alt={step.title} loading="lazy" />
    )
  }
  return (
    <video autoPlay loop muted playsInline preload="metadata" poster={step.poster}>
      {step.mov && <source src={step.mov} type='video/mp4; codecs="hvc1"' />}
      {step.webm && <source src={step.webm} type="video/webm" />}
    </video>
  )
}

export function SkyaCase({ stage = "dark" }: { stage?: "dark" | "cream" }) {
  const next = getNextProject("skya")

  /* nav = the FOUR chapters + each chapter's framing lead (single source;
     the dossier swaps them on scroll, mobile renders them inline). The old
     Mission lead is retired from the dossier; its paragraph stays in the
     stream verbatim (TextCard at the end of Outcome). */
  const nav = [
    {
      id: "challenge",
      label: "The Challenge",
      lead: (
        <>
          Last-mile delivery is the most expensive and inefficient part of the
          supply chain, accounting for 53% of total logistics costs. With
          rising package theft and carbon emissions, the traditional
          &ldquo;courier-to-door&rdquo; model is broken.
        </>
      ),
    },
    {
      id: "approach",
      label: "Approach",
      lead: (
        <>
          Skya is a bi-directional autonomous delivery system. Instead of
          moving individual packages, we transport mobile smart lockers
          directly to residential communities using autonomous vehicles.
        </>
      ),
    },
    {
      id: "design",
      label: "The Design",
      lead: (
        <>
          One vehicle, one pod, one app: the service runs as a loop, and every
          handover in it was designed away.
        </>
      ),
    },
    {
      id: "outcome",
      label: "Outcome",
      lead: <>The system holds up as a business, not just a concept.</>,
    },
  ]

  return (
    <div className={`cv2-stage${stage === "cream" ? "" : " ds-dark"}`}>
      <CaseTop homeHref="/" />

      <CaseFrame
        title="Skya"
        oneLiner="An autonomous delivery ecosystem transforming last-mile logistics into seamless urban infrastructure."
        meta={[
          { k: "Role", v: "Lead Service Designer" },
          { k: "Timeline", v: "10 Weeks" },
          { k: "Team", v: "4 Members" },
          { k: "Year", v: "2025" },
        ]}
        services={[
          "Service Blueprinting",
          "Journey Mapping",
          "Business Model Canvas",
          "Value Proposition Canvas",
          "Blue Ocean Strategy",
          "UserTesting",
          "Figma",
          "Notion",
          "After Effects",
        ]}
        nav={nav}
        backHref={BACK_HREF}
        next={next}
      >
        {/* BOARD 0 — hero flood + CAP */}
        <CaseHero
          src="/image/skya/heroshot.webp"
          alt="The Skya autonomous vehicle and its detachable smart-locker pod"
          aspect="2560 / 1280"
          captionLeft="Skya &middot; Autonomous delivery ecosystem"
          captionRight="SCAD Service Design &middot; 2025"
        />

        {/* ================= 01 THE CHALLENGE ================= */}
        <CaseChapter id="challenge" index="01" label="The Challenge">
          {/* KPI (3-up) + KPI (2-up loud): one tight evidence register */}
          <div className="cv2-module">
            <StatRegister
              stats={[
                { value: "53%", label: "Last-mile share", detail: "Of total logistics cost" },
                { value: "27%", label: "Urban residents", detail: "Experiencing delivery issues" },
                { value: "8.7%", label: "Last mile delivery", detail: "Share of US GDP" },
              ]}
            />
          </div>
          <div className="cv2-module cv2-module--tight">
            <StatRegister
              cols={2}
              loud
              stats={[
                { value: "$6B+", label: "Annual loss", detail: "Package theft" },
                { value: "$890B", label: "Lost", detail: "Retail returns" },
              ]}
            />
          </div>

          {/* the two research charts share one duo row (working evidence,
              not presentation boards — they do not earn full-bleed) */}
          <div className="cv2-module">
            <Duo ratio="1:1">
              <Plate
                size="half"
                aspect="2560 / 1990"
                caption="Top delivery pain points reported by urban residents"
                captionRight="n = 105"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/deliveryissuechart.webp"
                  alt="Bar chart of top delivery pain points: package theft 58.8%, inflexible delivery time 43.1%, high delivery costs 45.1%"
                  loading="lazy"
                />
              </Plate>
              <Plate
                size="half"
                tone="dark"
                aspect="2560 / 1954"
                caption="The environmental cost of returns"
                captionRight="4.2M+ metric tons CO2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/enviromental.webp"
                  alt="In 2022 the United States shipped, received and returned 21.2 billion packages, producing 4.2M+ metric tons of CO2"
                  loading="lazy"
                />
              </Plate>
            </Duo>
          </div>

          {/* QUOTE */}
          <Rise className="cv2-module">
            <blockquote className="cv2-quote">
              <p>
                &ldquo;Logistic Companies won&apos;t just pay for delivery
                speed. However, the return solution is gold. Returns are a
                massive pain point with terrible economics.&rdquo;
              </p>
              <footer>Quint Bailey, UX Designer at Penske</footer>
            </blockquote>
          </Rise>
        </CaseChapter>

        {/* ================= 02 APPROACH ================= */}
        <CaseChapter id="approach" index="02" label="Approach">
          {/* SUB + the value props it sets up: one tight group */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>Strategic pivot</h3>
              <p>
                User testing reframed the business: moving from B2B2C to B2B
                partnership with Property Management. I led the service
                ecosystem design, facilitated the user testing behind the
                pivot, and designed the end-to-end user experience.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <ul className="cv2-props">
              <Rise className="cv2-prop">
                <h4>For Residents</h4>
                <p>Contactless, 24/7 access, and &ldquo;Zero-Hassle&rdquo; returns.</p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>For Property Managers</h4>
                <p>Reduced package management workload and new revenue streams via ads/data.</p>
              </Rise>
              <Rise className="cv2-prop">
                <h4>For Logistics</h4>
                <p>60% reduction in handovers and optimized route efficiency.</p>
              </Rise>
            </ul>
          </div>

          {/* the strategy artifacts: one tight passage — wide, duo, wide
              (dense working canvases, downsized from four full boards) */}
          <div className="cv2-module">
            <Plate
              size="wide"
              aspect="2560 / 1456"
              caption="Blue Ocean Strategy"
              captionRight="Four-action framework"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/skya/blueocean.webp"
                alt="Blue Ocean Strategy four-action framework chart positioning Skya against Cainiao, Fetch Package, Relay Robotics, Parcel Pending and Luxer One"
                loading="lazy"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Duo ratio="1:1">
              <Plate
                size="half"
                aspect="7470 / 4248"
                caption="Business Model Canvas"
                captionRight="B2B partnership"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/businessmodel3.png"
                  alt="Skya Business Model Canvas: partners, activities, value proposition, customer segments, cost structure and revenue streams"
                  loading="lazy"
                />
              </Plate>
              <Plate
                size="half"
                aspect="7470 / 4248"
                caption="Defining Skya"
                captionRight="Positioning &middot; differentiation &middot; value"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/zag17.png"
                  alt="Defining SKYA positioning worksheet: 17 questions covering vision, brandscape, engagement and loyalty"
                  loading="lazy"
                />
              </Plate>
            </Duo>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Plate
              size="wide"
              aspect="5334 / 2952"
              caption="Multi-stakeholder value alignment"
              captionRight="Customers &middot; logistics &middot; property"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/skya/multistakeholdervaluemap.png"
                alt="Multi-stakeholder value map aligning gains creators and pain relievers to customers, logistics companies and property management"
                loading="lazy"
              />
            </Plate>
          </div>

          {/* SUB + the blueprint it frames: tight */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>Mapping the ecosystem</h3>
              <p>
                The blueprint orchestrates the interaction between the User,
                the Autonomous Vehicle (Skya), the Logistics Hub, and the
                Apartment infrastructure.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <Plate
              panorama
              caption="The service blueprint"
              captionRight="User &middot; vehicle &middot; hub &middot; apartment"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/skya/serviceblueprint3.png"
                alt="Skya service blueprint across five journey phases, mapping user actions, app interface, vehicle, hub actions and smart infrastructure"
                loading="lazy"
              />
            </Plate>
          </div>
        </CaseChapter>

        {/* ================= 03 THE DESIGN ================= */}
        <CaseChapter id="design" index="03" label="The Design">
          {/* the service loop: five moments as one tight passage —
              two 2-up duos, then the human payoff wide. Descriptions ride
              the compact sub captions, not full paragraphs. */}
          {[0, 2].map((start) => (
            <div
              className={start === 0 ? "cv2-module" : "cv2-module cv2-module--tight"}
              key={start}
            >
              <Duo ratio="1:1">
                {STEPS.slice(start, start + 2).map((step) => (
                  <Plate
                    key={step.index}
                    size="half"
                    tone="dark"
                    contain
                    aspect="5 / 4"
                    caption={`${step.index} / ${step.title}`}
                    sub={step.desc}
                  >
                    <StepMedia step={step} />
                  </Plate>
                ))}
              </Duo>
            </div>
          ))}
          <div className="cv2-module cv2-module--tight">
            <Plate
              size="wide"
              tone="dark"
              contain
              aspect="5 / 4"
              caption={`${STEPS[4].index} / ${STEPS[4].title}`}
              sub={STEPS[4].desc}
            >
              <StepMedia step={STEPS[4]} />
            </Plate>
          </div>

          {/* the digital experience: the framing text becomes a card beside
              the app screen instead of a floating sub + a lone phone screen */}
          <div className="cv2-module">
            <Duo ratio="3:2">
              <TextCard title="Digital experience">
                <p>
                  A centralized app that allows users to track deliveries in
                  real-time and, crucially, initiate returns in 3 clicks,
                  generating a QR code to drop items off without printing
                  labels.
                </p>
              </TextCard>
              <Plate tone="dark" size="half" className="cv2-phone" caption="The Skya app">
                <video
                  src="/video/skya/skya-app-demo4.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              </Plate>
            </Duo>
          </div>

          {/* SUB + the pod render it frames (TRUE presentation board: full) */}
          <Rise className="cv2-module">
            <div className="cv2-sub">
              <h3>Physical experience</h3>
              <p>
                The Skya Pod acts as a mobile hub, docking seamlessly with
                apartment complexes to serve as a temporary smart locker.
              </p>
            </div>
          </Rise>
          <div className="cv2-module cv2-module--tight">
            <Plate
              tone="dark"
              aspect="1920 / 1054"
              caption="The Skya Pod"
              captionRight="Docked as a smart locker"
            >
              <video
                src="/video/skya/renderhero.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </Plate>
          </div>
        </CaseChapter>

        {/* ================= 04 OUTCOME ================= */}
        <CaseChapter id="outcome" index="04" label="Outcome">
          {/* KPI (3-up loud) */}
          <div className="cv2-module">
            <StatRegister
              loud
              stats={[
                {
                  value: "$5.14M",
                  label: "Financial",
                  detail:
                    "Projected revenue in Year 1 with diversified income streams (Service fees, Ads, Data)",
                },
                {
                  value: "60%",
                  label: "Operational",
                  detail: "Potential reduction in logistics handovers",
                },
                {
                  value: "20+",
                  label: "Future vision",
                  detail: "Expanding from San Francisco to 20+ major US cities by 2033",
                },
              ]}
            />
          </div>

          {/* the financial evidence: one tight passage — wide chart, full
              expansion animation, then the two same-aspect charts as a duo */}
          <div className="cv2-module">
            <Plate
              size="wide"
              tone="dark"
              aspect="2560 / 1990"
              caption="Baseline scenario"
              captionRight="10-year forecast annual income"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/skya/baselineforcastincome.webp"
                alt="Baseline scenario chart: forecast annual income of 5.14, 24 and 110 million USD at years 1, 5 and 10"
                loading="lazy"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Plate
              tone="dark"
              aspect="4176 / 2928"
              caption="Expansion plan"
              captionRight="Year 3 to 10"
            >
              <video
                src="/video/skya/yr3-10-noaudio.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Duo ratio="1:1">
              <Plate
                size="half"
                tone="dark"
                aspect="5556 / 4320"
                caption="Revenue stream"
                captionRight="Service &middot; ads &middot; data"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/revenue.png"
                  alt="Revenue stream mix: property management partnership 30%, real estate developer partnership 40%, data service 20%, advertising and licensing 5% each"
                  loading="lazy"
                />
              </Plate>
              <Plate
                size="half"
                tone="dark"
                aspect="2560 / 1990"
                caption="60% process optimization"
                captionRight="Mobile locker mode"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/skya/60optimization.webp"
                  alt="Process loop diagram: mobile locker mode reduces unnecessary handover for 60% process optimization"
                  loading="lazy"
                />
              </Plate>
            </Duo>
          </div>

          {/* BOARD (video) — the concept film (TRUE presentation: full) */}
          <div className="cv2-module">
            <Plate tone="dark" aspect="16 / 9" caption="The concept film">
              <iframe
                src="https://www.youtube.com/embed/VXqqCg1p4s4?start=1&autoplay=0&loop=0&controls=1&modestbranding=1&rel=0"
                title="Skya concept film"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </Plate>
          </div>

          {/* the mission fold: brand board + its paragraph (verbatim, from
              the retired Mission dossier lead) + the serif statement close */}
          <div className="cv2-module">
            <Plate
              size="wide"
              tone="dark"
              aspect="2560 / 2292"
              caption="Move beyond"
              captionRight="Skya, 2025"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/skya/sliderphoto.webp"
                alt="The Skya vehicle beneath the project's Move Beyond mark"
                loading="lazy"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <TextCard overline="Mission">
              <p>
                While Skya was an ambitious concept requiring significant
                infrastructure investment, it successfully demonstrated how
                rethinking logistics as &ldquo;infrastructure&rdquo; rather
                than &ldquo;service&rdquo; can solve systemic urban
                challenges.
              </p>
            </TextCard>
          </div>
          <Rise className="cv2-module">
            <h3 className="cv2-statement">
              Logistics as infrastructure, not as a service.
            </h3>
          </Rise>
        </CaseChapter>
      </CaseFrame>

      <CaseClose backHref={BACK_HREF} next={next} />
    </div>
  )
}
