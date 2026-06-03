import { Sparkles, Compass, MessageCircle, ArrowUpRight } from "lucide-react";
import type { Screen } from "./NavBar";

export function Landing({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <main>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          paddingInline: "clamp(1rem, 5vw, 6rem)",
          paddingBlock: "clamp(3rem, 9vw, 7rem)",
        }}
      >
        {/* Decorative sun/mandala motif */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-24 opacity-[0.12]"
          style={{ width: "min(46rem, 80vw)", aspectRatio: "1/1" }}
        >
          <svg viewBox="0 0 400 400" className="size-full">
            <g fill="none" stroke="currentColor" strokeWidth="0.6" className="text-primary">
              {Array.from({ length: 36 }).map((_, i) => (
                <line
                  key={i}
                  x1="200"
                  y1="200"
                  x2="200"
                  y2="20"
                  transform={`rotate(${i * 10} 200 200)`}
                />
              ))}
              <circle cx="200" cy="200" r="120" />
              <circle cx="200" cy="200" r="80" />
              <circle cx="200" cy="200" r="40" />
            </g>
          </svg>
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-12 items-end max-w-[1400px] mx-auto">
          <div>
            <h1 style={{ fontSize: "clamp(2.25rem, 7vw, 4.75rem)", lineHeight: 1.02 }}>
              Find the stream{" "}
              <em className="text-primary not-italic">
                <span className="italic font-[var(--font-display)]">that fits</span>
              </em>{" "}
              who you already are.
            </h1>
            <p
              className="mt-6 max-w-[44ch] text-muted-foreground"
              style={{ fontSize: "clamp(1rem, 1.6vw, 1.25rem)" }}
            >
              Twenty-one honest questions. One quiet model trained on thousands
              of Indian students. A direction you can actually walk toward —
              Science, Commerce, or Arts.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate("survey")}
                className="group inline-flex items-center gap-2 bg-foreground text-background rounded-full transition-colors hover:bg-primary hover:text-primary-foreground"
                style={{
                  paddingInline: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  paddingBlock: "clamp(0.85rem, 1.4vw, 1.1rem)",
                  fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
                }}
              >
                Start Your Journey
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </button>
              <button
                onClick={() => onNavigate("auth")}
                className="rounded-full border border-border hover:border-foreground transition-colors"
                style={{
                  paddingInline: "clamp(1.25rem, 2.5vw, 1.75rem)",
                  paddingBlock: "clamp(0.85rem, 1.4vw, 1.1rem)",
                  fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)",
                }}
              >
                Login / Register
              </button>
            </div>
          </div>

          <aside className="relative hidden lg:block">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_1px_0_rgba(28,20,16,0.04),0_30px_60px_-30px_rgba(28,20,16,0.25)]">
              <div
                className="font-[var(--font-mono)] text-muted-foreground"
                style={{ fontSize: "0.75rem", letterSpacing: "0.08em" }}
              >
                STUDENT 24 — KOLKATA
              </div>
              <p className="font-[var(--font-display)] italic mt-4" style={{ fontSize: "1.4rem", lineHeight: 1.3 }}>
                "I thought I had to do Science. Anvesha showed me I'd be
                happier — and better — in Commerce."
              </p>
              <div className="mt-6 flex items-center justify-between text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                <span>— Riya S.</span>
                <span className="font-[var(--font-mono)]">94% match</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Stat strip */}
      <section
        style={{
          paddingInline: "clamp(1rem, 5vw, 6rem)",
          paddingBlock: "clamp(1rem, 3vw, 2rem)",
        }}
      >
        <div
          className="grid border-y border-border max-w-[1400px] mx-auto"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          {[
            { n: "250+", l: "students guided" },
            { n: "95%", l: "report a confident choice" },
            { n: "24 / 7", l: "always-on AI support" },
            { n: "21", l: "questions, that's it" },
          ].map((s, i) => (
            <div
              key={s.n}
              className={`py-8 px-5 ${i !== 0 ? "md:border-l border-border" : ""}`}
            >
              <div
                className="font-[var(--font-display)]"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1 }}
              >
                {s.n}
              </div>
              <div className="text-muted-foreground mt-2" style={{ fontSize: "0.9rem" }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        style={{
          paddingInline: "clamp(1rem, 5vw, 6rem)",
          paddingBlock: "clamp(2rem, 6vw, 5rem)",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-end justify-between gap-6 flex-wrap mb-10">
            <h2 style={{ maxWidth: "22ch" }}>
              Built for the moment after the Boards.
            </h2>
            <p className="text-muted-foreground max-w-[40ch]">
              No coaching-class jargon, no parental pressure — just a careful
              read of how you think, what you enjoy, and where you'll grow.
            </p>
          </div>

          <div
            className="grid gap-5"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}
          >
            {[
              {
                icon: Sparkles,
                title: "AI-powered guidance",
                body: "A gradient-boosted model trained on real student outcomes — not a quiz from a magazine.",
              },
              {
                icon: Compass,
                title: "Perfect stream match",
                body: "Recommends Science, Commerce, or Arts with a confidence score and the reasoning behind it.",
              },
              {
                icon: MessageCircle,
                title: "Live AI chatbot",
                body: "Stuck after the result? Talk it out with our chatbot — ask about subjects, careers, or that one doubt you can't shake.",
                cta: "chatbot" as const,
              },
            ].map((f) => (
              <button
                key={f.title}
                onClick={() => f.cta === "chatbot" && onNavigate("chatbot")}
                className="text-left group rounded-2xl border border-border bg-card transition-colors hover:border-foreground/40"
                style={{ padding: "clamp(1rem, 3vw, 1.5rem)" }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="size-10 grid place-items-center rounded-full bg-primary/10 text-primary">
                    <f.icon size={18} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </div>
                <h3 className="mb-2">{f.title}</h3>
                <p className="text-muted-foreground" style={{ fontSize: "0.95rem" }}>
                  {f.body}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <footer
        className="border-t border-border"
        style={{
          paddingInline: "clamp(1rem, 5vw, 6rem)",
          paddingBlock: "clamp(1.5rem, 3vw, 2.5rem)",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-3 text-muted-foreground" style={{ fontSize: "0.85rem" }}>
          <span>© 2026 Anvesha · Made for students of India</span>
          <span className="font-[var(--font-mono)]" style={{ letterSpacing: "0.08em" }}>
            v2.1 — JUN 2026
          </span>
        </div>
      </footer>
    </main>
  );
}
