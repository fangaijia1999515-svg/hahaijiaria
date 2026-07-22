"use client"

/**
 * EAU DE TOI — case study composed on the case-v2 grammar (mirrors the
 * /work/skya pilot, incl. the 2026-07 mixed-density amendment). Every KPI,
 * research fact, quote, testing finding, award mention and label carries
 * over verbatim from the previous page (app/work/eau-de-toi, pre-2026-07
 * build); nothing invented. Media keeps its own warm booth photography
 * INSIDE the plates; the chrome stays cream.
 *
 * Anatomy: FOUR chapters, regrouped IN ORDER from the old seven —
 *   THE CHALLENGE = Overview (awards + KPI + challenge/approach/outcome) +
 *                   The Problem (quote + pain points)
 *   APPROACH      = The Solution (three service features)
 *   THE DESIGN    = Blueprint + Prototype + Technology
 *   OUTCOME       = Business (ledger, verdict, film, recommendations, close)
 * Each tab's dossier lead is a sentence group that already lived in that
 * chapter's content (the old Problem / Solution / Blueprint / Business
 * leads); the old Prototype and Technology leads stay in the stream verbatim
 * as TextCards, which also signpost the merged Design chapter. This
 * dissolves the old empty Overview-lead problem.
 *
 * The one page-specific extension (a video cover, contact-sheet plates,
 * the business ledger) lives in edt-case.css under .edt-* classes only.
 */
import { useRef } from "react"
import {
  CaseChapter,
  CaseClose,
  CaseFrame,
  CaseTop,
  Duo,
  Plate,
  Rise,
  StatRegister,
  TextCard,
} from "@/components/case-v2/case-frame"
import { gsap, useGSAP, V2_EASE } from "@/lib/gsap"
import { getNextProject } from "@/lib/projects"

const BACK_HREF = "/#work"
const MOTION = "(prefers-reduced-motion: no-preference)"

/* the four research pain points (verbatim from the previous Problem section) */
const PAIN_POINTS = [
  {
    n: "01",
    title: "Cognitive Overload",
    text: "Paralyzed by excessive choices, complex terminology, and a lack of clear comparability.",
  },
  {
    n: "02",
    title: "Contextual Discovery",
    text: "Shoppers connect with scents through experiential moments rather than static displays or online text.",
  },
  {
    n: "03",
    title: "The Articulation Gap",
    text: "Consumers lack the specific olfactory vocabulary to accurately describe their tastes.",
  },
  {
    n: "04",
    title: "Missing Sensory Cues",
    text: "Traditional retail formats fail to engage shoppers through visual, auditory, and emotional stimuli.",
  },
]

/* the three core service features (verbatim from the previous Solution grid) */
const FEATURES = [
  {
    step: "01",
    title: "Personalized Scent Matching",
    description:
      "Users match perfumes to their mood, preferences, and personality using a fast, intuitive quiz.",
    image: "/image/eaudetoi/image/outcome101.png",
  },
  {
    step: "02",
    title: "Immersive Discovery Experience",
    description:
      "Shoppers discover scents in a multisensory booth equipped with ambient visuals, sounds, and immersive testing.",
    image: "/image/eaudetoi/image/outcome02.webp",
  },
  {
    step: "03",
    title: "Scent Personality Profiling",
    description:
      "Users receive a scent-based personality profile defined by keywords, moods, and style (e.g., “The Warm Idealist”).",
    image: "/image/eaudetoi/image/outcome03.png",
  },
]

/* the journey touchpoints (verbatim from the previous Blueprint section) */
const TOUCHPOINTS = [
  {
    title: "Awareness & Entry",
    text: "A customer views a window display or scans a QR code (“I’m curious about the fragrance personality test”) and follows aisle signage to the booth.",
  },
  {
    title: "Discovery",
    text: "The user takes the recommendation quiz on the booth’s interactive screen. Backstage, the system processes the scent profile and mood mapping, routing recommendations to the booth and the sales associate’s terminal.",
  },
  {
    title: "Decision & Purchase",
    text: "The user samples recommendations, saves favorites to a wishlist, and proceeds to the checkout counter.",
  },
  {
    title: "Post-Sale Engagement",
    text: "The customer receives an automated email summary with their personality type, saved scents, and longevity / sillage details.",
  },
]

/* the four testing methods (verbatim from the previous TestingPager data) */
const TESTS = [
  {
    number: "01",
    title: "Service Advertisement",
    description: "We tested our value proposition via an entrance poster.",
    findings:
      "While the messaging successfully attracted interest, a single poster was insufficient; we must implement a network of in-store directional signage to successfully guide customers to the booth.",
    images: [
      "/image/eaudetoi/image/poster01.webp",
      "/image/eaudetoi/image/poster02.png",
    ],
  },
  {
    number: "02",
    title: "Desktop Walkthrough",
    description:
      "We utilized a cardboard store model to simulate and observe customer traffic patterns (spatial flow).",
    findings:
      "This allowed us to determine the optimal placement for the booth and iterate on its physical scale and visibility to ensure a natural transition from the browsing aisles.",
    images: [
      "/image/eaudetoi/image/desktop01.webp",
      "/image/eaudetoi/image/desktop02.webp",
      "/image/eaudetoi/image/desktop04.webp",
    ],
  },
  {
    number: "03",
    title: "Cardboard Prototyping & Investigative Rehearsal",
    description:
      "We built a low-fidelity physical mockup and simulated real interactions to test user behavior and desirability.",
    findings:
      "The flow of questions and wishlist integration seamlessly fostered engagement, though scent delivery channels and sales associate roles require refinement.",
    images: [
      "/image/eaudetoi/image/booth03.webp",
      "/image/eaudetoi/image/booth02.webp",
      "/image/eaudetoi/image/booth01.webp",
    ],
  },
  {
    number: "04",
    title: "Paper Prototyping",
    description:
      "We tested a post-experience email containing the user’s scent personality results and fragrance education.",
    findings:
      "Users found the personalized feedback highly engaging and expressed strong intent to share it, validating its value for long-term retention.",
    images: ["/image/eaudetoi/image/email04b.webp"],
  },
]

/* the ML feasibility rows (verbatim from the previous Technology section) */
const ML_ROWS = [
  {
    label: "The Model",
    text: "Predictive recommendations based on descriptive keywords.",
  },
  {
    label: "The Data",
    text: "Trained using the Fragrantica Dataset from Kaggle.",
  },
  {
    label: "The Algorithms",
    text: "Evaluated via K-Nearest Neighbors (KNN) and Naive Bayes to process variables like Gender and Main Accords.",
  },
]

/* final recommendations for retailers (verbatim from the previous tail) */
const RECOMMENDATIONS = [
  {
    n: "01",
    title: "Strategic Placement",
    text: "Place the booth outside the store or in entry zones to actively attract foot traffic.",
  },
  {
    n: "02",
    title: "Delivery Channel Innovation",
    text: "Utilize technical solutions like vending machines or embedded scent tiles for sample delivery to improve user comfort.",
  },
  {
    n: "03",
    title: "Service Evolution",
    text: "Develop a system that builds a “Scent History” over time for deeper, long-term personalization and retention.",
  },
]

/* ---------------------------------------------------------------------------
   HERO (video variant) — same zoom-settle grammar as CaseHero, but the old
   page's cover is the promo VIDEO, so the plate carries the same source with
   the same playback behavior (autoplay, loop, muted, inline, no poster).
--------------------------------------------------------------------------- */
function EdtHeroVideo({
  src,
  captionLeft,
  captionRight,
}: {
  src: string
  captionLeft: string
  captionRight: string
}) {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const video = rootRef.current?.querySelector("video")
      if (!video) return
      const mm = gsap.matchMedia()
      mm.add(MOTION, () => {
        gsap.fromTo(
          rootRef.current,
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.9, ease: V2_EASE, delay: 0.05 }
        )
        /* the cover settles as you begin to read (absolute scroll 0 -> 560px) */
        gsap.fromTo(
          video,
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { start: 0, end: 560, scrub: 0.5 },
          }
        )
      })
      return () => mm.revert()
    },
    { scope: rootRef }
  )

  return (
    <figure ref={rootRef} className="cv2-hero edt-hero">
      <div className="cv2-hero__well">
        <video src={src} autoPlay loop muted playsInline preload="metadata" />
      </div>
      <figcaption>
        <span>{captionLeft}</span>
        <span>{captionRight}</span>
      </figcaption>
    </figure>
  )
}

/* contact sheet: the testing photos keep the old pager's crop logic
   (one hero frame on top, supporting frames below) inside one plate */
function TestShots({ test }: { test: (typeof TESTS)[number] }) {
  if (test.images.length === 1) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={test.images[0]} alt={test.title} loading="lazy" />
    )
  }
  return (
    <div className={`edt-shots edt-shots--${test.images.length}`}>
      {test.images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`${test.title} ${i + 1}`} loading="lazy" key={src} />
      ))}
    </div>
  )
}

export function EdtCase() {
  const next = getNextProject("eau-de-toi")

  /* nav = the FOUR chapters; each lead is chosen VERBATIM from sentences
     already living in that chapter's regrouped content (the old Problem /
     Solution / Blueprint / Business chapter leads). */
  const nav = [
    {
      id: "challenge",
      label: "The Challenge",
      lead: (
        <>
          The paradox of choice in fragrance shopping. The &ldquo;moment of
          truth&rdquo; for a customer arrives when they must choose a
          fragrance without fully understanding what suits them. Our research
          surfaced four interconnected pain points that cause this breakdown
          in the customer journey.
        </>
      ),
    },
    {
      id: "approach",
      label: "Approach",
      lead: (
        <>
          Eau de Toi acts as an immersive discovery booth that connects
          customers with scents they truly love. It accomplishes this through
          three core service features.
        </>
      ),
    },
    {
      id: "design",
      label: "The Design",
      lead: (
        <>
          To ensure a flawless experience, we mapped the
          &ldquo;Frontstage&rdquo; (user touchpoints) and
          &ldquo;Backstage&rdquo; (system processes) across the entire
          shopping journey.
        </>
      ),
    },
    {
      id: "outcome",
      label: "Outcome",
      lead: (
        <>
          Is replacing retail shelf space with a digital booth worth the
          investment?
        </>
      ),
    },
  ]

  return (
    <div className="cv2-stage ds-dark">
      <CaseTop homeHref="/" />

      <CaseFrame
        title="Eau de Toi"
        oneLiner="A multisensory booth that walks shoppers from decision paralysis to a fragrance they trust."
        meta={[
          { k: "Role", v: "Service Designer" },
          { k: "Timeline", v: "10 Weeks" },
          { k: "Team", v: "Eau Yeah (5 Members)" },
          { k: "Year", v: "2025" },
        ]}
        services={[
          "Service Ecosystems",
          "ML Integration",
          "Rapid Prototyping",
          "UI/UX",
          "Service Blueprinting",
          "Investigative Rehearsal",
        ]}
        nav={nav}
        backHref={BACK_HREF}
        next={next}
      >
        <EdtHeroVideo
          src="/image/eaudetoi/Video/edtpromovideo.mp4"
          captionLeft="Eau de Toi &middot; Multisensory retail experience"
          captionRight="2025"
        />

        {/* ================= 01 THE CHALLENGE ================= */}
        <CaseChapter id="challenge" index="01" label="The Challenge">
          {/* awards register: verbatim from the previous page header */}
          <Rise className="cv2-module edt-awards">
            <a
              className="edt-awards__link"
              href="https://indigoaward.com/winners/11703"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View 2026 Indigo Design Awards profile (opens in new tab)"
            >
              2026 Indigo Design Awards <span aria-hidden="true">&#8599;</span>
            </a>
            <ul className="cv2-props edt-register">
              <li className="cv2-prop">
                <h4>Silver</h4>
                <p>Interaction Design</p>
              </li>
              <li className="cv2-prop">
                <h4>Silver</h4>
                <p>UX &amp; Navigation</p>
              </li>
              <li className="cv2-prop">
                <h4>Bronze</h4>
                <p>Interactive Design</p>
              </li>
            </ul>
          </Rise>

          {/* KPI + the paragraph that explains the numbers: one tight group */}
          <div className="cv2-module">
            <StatRegister
              stats={[
                {
                  value: "54%",
                  label: "Cognitive Overload",
                  detail: "Overwhelmed by excessive choices",
                },
                {
                  value: "26%",
                  label: "Lack of Trust",
                  detail: "In sales associate suggestions",
                },
                {
                  value: "72%",
                  label: "Want Sensory Engagement",
                  detail: "Prefer multi-sensory experiences",
                },
              ]}
            />
          </div>
          <Rise className="cv2-module cv2-module--tight">
            <div className="cv2-sub">
              <h3>The Challenge</h3>
              <p>
                Fragrance shoppers often face decision paralysis in retail
                stores, overwhelmed by countless options, complex note
                descriptions, and unfamiliar brands. Current experiences rarely
                tap into visuals, sound, or mood, leading to missing sensory
                cues. As a result, customers experience longer browsing times,
                lower purchase confidence, and frequently abandon their
                shopping journeys.
              </p>
            </div>
          </Rise>

          {/* the overview pair rides two framed cards instead of two more
              floating screens (copy verbatim from the old Overview subs) */}
          <div className="cv2-module">
            <Duo ratio="1:1">
              <TextCard title="The Approach">
                <p>
                  To solve this, we employed a highly iterative prototyping
                  process to test the desirability, usability, and feasibility
                  of a tech-aided recommendation system. We utilized diverse
                  methods, including Desktop Walkthroughs to map store
                  movement, Service Advertisements to test value propositions,
                  and Cardboard/Paper Prototyping to simulate booth
                  interactions and post-purchase touchpoints.
                </p>
              </TextCard>
              <TextCard title="The Outcome">
                <p>
                  We created Eau de Toi, a guided, multisensory fragrance
                  experience that helps casual shoppers discover who they are
                  and what they want to wear. The result is a seamless,
                  confidence-building experience that makes fragrance shopping
                  inspiring, memorable, and deeply personal.
                </p>
              </TextCard>
            </Duo>
          </div>

          <Rise className="cv2-module">
            <blockquote className="cv2-quote">
              <p>
                &ldquo;I will only online shop at Zara because there
                aren&rsquo;t 100 different choices that make me feel
                overwhelmed.&rdquo;
              </p>
              <footer>Interview participant, fragrance shopper</footer>
            </blockquote>
          </Rise>

          <div className="cv2-module">
            <ul className="cv2-props edt-props--2col">
              {PAIN_POINTS.map((p) => (
                <Rise className="cv2-prop" key={p.n}>
                  <span className="cv2-step__index edt-prop-index">{p.n}</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </Rise>
              ))}
            </ul>
          </div>
        </CaseChapter>

        {/* ================= 02 APPROACH ================= */}
        <CaseChapter id="approach" index="02" label="Approach">
          <div className="cv2-module edt-grid3">
            {FEATURES.map((f) => (
              <div className="edt-feature" key={f.step}>
                <Plate aspect="1239 / 1575">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.image} alt={f.title} loading="lazy" />
                </Plate>
                <Rise className="edt-feature__text">
                  <p className="cv2-step__index">{f.step}</p>
                  <h3 className="cv2-step__title">{f.title}</h3>
                  <p className="cv2-step__desc">{f.description}</p>
                </Rise>
              </div>
            ))}
          </div>
        </CaseChapter>

        {/* ================= 03 THE DESIGN ================= */}
        <CaseChapter id="design" index="03" label="The Design">
          {/* the two service maps: dense working diagrams, wide not full,
              tight-paired as one drawing set */}
          <div className="cv2-module">
            <Plate
              size="wide"
              aspect="21 / 10"
              contain
              caption="Service Blueprint"
              captionRight="Frontstage to backstage"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/eaudetoi/image/blueprint.png"
                alt="Eau de Toi service blueprint, frontstage to backstage"
                loading="lazy"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <Plate size="wide" aspect="21 / 10" contain caption="User Journey">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/image/eaudetoi/image/journeymap.png"
                alt="Eau de Toi user journey map"
                loading="lazy"
              />
            </Plate>
          </div>
          <div className="cv2-module cv2-module--tight">
            <ul className="cv2-props edt-props--2col">
              {TOUCHPOINTS.map((t) => (
                <Rise className="cv2-prop" key={t.title}>
                  <h4>{t.title}</h4>
                  <p>{t.text}</p>
                </Rise>
              ))}
            </ul>
          </div>

          {/* prototyping: the old Prototype chapter lead stays in the stream
              verbatim, framed as the passage's card */}
          <div className="cv2-module">
            <TextCard overline="Prototyping & Testing">
              <p>
                We rigorously tested our assumptions before finalizing the
                service, focusing on whether immersive elements and fewer
                options build user confidence.
              </p>
            </TextCard>
          </div>
          <div className="cv2-module cv2-module--tight">
            {TESTS.map((t) => (
              <div className="cv2-step" key={t.number}>
                <Rise>
                  <p className="cv2-step__index">
                    {t.number} / {String(TESTS.length).padStart(2, "0")}
                  </p>
                  <h3 className="cv2-step__title">{t.title}</h3>
                  <p className="cv2-step__desc">{t.description}</p>
                  <p className="cv2-step__desc">
                    <span className="edt-findings__label">Findings.</span>{" "}
                    {t.findings}
                  </p>
                </Rise>
                <Plate
                  aspect={t.images.length === 1 ? "3 / 4" : "4 / 5"}
                  contain={t.images.length === 1}
                >
                  <TestShots test={t} />
                </Plate>
              </div>
            ))}
          </div>

          {/* technology: data plate + the old Technology chapter lead and the
              ML rows as one framed card beside it */}
          <div className="cv2-module">
            <Duo ratio="2:3">
              <Plate
                size="half"
                aspect="2535 / 2658"
                contain
                caption="Orange Data Mining"
                captionRight="Fragrantica dataset"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/image/eaudetoi/image/data.png"
                  alt="Orange Data Mining: KNN / Naive Bayes analysis of Fragrantica dataset"
                  loading="lazy"
                />
              </Plate>
              <TextCard overline="Machine Learning Feasibility">
                <p>
                  To determine whether a tech-aided system could accurately
                  support our service, we tested the viability of a Machine
                  Learning backbone.
                </p>
                <ul className="cv2-props edt-props--stack edt-ml">
                  {ML_ROWS.map((row) => (
                    <li className="cv2-prop" key={row.label}>
                      <h4>{row.label}</h4>
                      <p>{row.text}</p>
                    </li>
                  ))}
                </ul>
              </TextCard>
            </Duo>
          </div>
        </CaseChapter>

        {/* ================= 04 OUTCOME ================= */}
        <CaseChapter id="outcome" index="04" label="Outcome">
          {/* the ledger + the verdict that reads it: one tight group */}
          <Rise className="cv2-module">
            <ul className="cv2-stats cv2-stats--loud">
              <li className="cv2-stat">
                <span className="edt-ledger__kicker">The Cost</span>
                <span className="cv2-stat__value">0.29%</span>
                <span className="cv2-stat__label">Passive Revenue Drop</span>
                <span className="cv2-stat__detail">
                  Dedicating floor space to the booth removes 2.94% of
                  displayed units, producing only a marginal drop in passive
                  revenue.
                </span>
              </li>
              <li className="cv2-stat">
                <span className="edt-ledger__kicker">The Validation</span>
                <span className="cv2-stat__value">90%</span>
                <span className="cv2-stat__label">User Desirability</span>
                <span className="cv2-stat__detail">
                  An overwhelming majority of tested shoppers perceived the
                  guided, multisensory experience as highly desirable and
                  confidence-building.
                </span>
              </li>
              <li className="cv2-stat">
                <span className="edt-ledger__kicker">The Tipping Point</span>
                <span className="cv2-stat__value">+1%</span>
                <span className="cv2-stat__label">
                  Conversion Lift to Break Even
                </span>
                <span className="cv2-stat__detail">
                  Because user confidence is so high, even a mere 1% increase
                  in conversion entirely balances the lost shelf revenue.
                </span>
              </li>
            </ul>
          </Rise>
          <Rise className="cv2-module cv2-module--tight">
            <p className="edt-kicker">The Verdict</p>
            <p className="edt-verdict">
              Trade a <em>0.29% passive loss</em> for a{" "}
              <em>1% conversion win</em>, backed by <em>90% desirability</em>.
              Anything beyond is pure upside.
            </p>
          </Rise>

          <div className="cv2-module">
            <Plate tone="dark" aspect="16 / 9">
              <iframe
                src="https://www.youtube.com/embed/NcUgDQB3j3M?rel=0&modestbranding=1"
                title="Eau de Toi final hero video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
              />
            </Plate>
          </div>

          <Rise className="cv2-module">
            <p className="edt-kicker">Final Recommendations for Retailers</p>
            <ul className="cv2-props edt-register">
              {RECOMMENDATIONS.map((rec) => (
                <li className="cv2-prop" key={rec.n}>
                  <span className="cv2-step__index edt-prop-index">
                    {rec.n}
                  </span>
                  <h4>{rec.title}</h4>
                  <p>{rec.text}</p>
                </li>
              ))}
            </ul>
          </Rise>

          <Rise className="cv2-module">
            <blockquote className="cv2-quote">
              <p>
                &ldquo;Eau de Toi proves that in a crowded retail environment,
                the key to conversion isn&apos;t more choice. It&apos;s more
                clarity. By reducing cognitive load and building emotional
                trust, we transform browsing into meaningful discovery.&rdquo;
              </p>
            </blockquote>
          </Rise>
        </CaseChapter>
      </CaseFrame>

      <CaseClose backHref={BACK_HREF} next={next} />
    </div>
  )
}
