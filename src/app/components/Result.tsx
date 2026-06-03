import { RotateCcw, History } from "lucide-react";

type ResultData = {
  stream: "Science" | "Commerce" | "Arts";
  confidence: number;
  probabilities: Record<"Arts" | "Commerce" | "Science", number>;
};

const COPY: Record<ResultData["stream"], { tagline: string; why: string; subjects: string[] }> = {
  Science: {
    tagline: "You think in systems and questions.",
    why:
      "Your answers lean toward curiosity-led problem solving — you like figuring out how things work and you don't flinch at hard maths. A Science stream will give you room to build that muscle and keep your options open across engineering, medicine, and research.",
    subjects: ["Physics", "Chemistry", "Mathematics", "Biology / CS"],
  },
  Commerce: {
    tagline: "You think in incentives and outcomes.",
    why:
      "You're drawn to how value moves — markets, businesses, the calculus of risk and reward. Commerce will sharpen that instinct and open doors into finance, entrepreneurship, economics, and chartered paths.",
    subjects: ["Accountancy", "Business Studies", "Economics", "Maths (optional)"],
  },
  Arts: {
    tagline: "You think in stories and questions of meaning.",
    why:
      "You read people and ideas before you read tables. The Humanities will give your reading depth and discipline — preparing you for law, policy, design, journalism, psychology, and a hundred other paths the algorithm can't name yet.",
    subjects: ["History", "Political Science", "Psychology", "English Literature"],
  },
};

export function Result({
  data,
  onRetake,
  onHistory,
}: {
  data: ResultData;
  onRetake: () => void;
  onHistory: () => void;
}) {
  const copy = COPY[data.stream];

  return (
    <main
      className="min-h-[calc(100vh-72px)] grid place-items-center relative overflow-hidden"
      style={{ paddingInline: "clamp(1rem, 5vw, 6rem)", paddingBlock: "clamp(2rem, 6vw, 5rem)" }}
    >
      {/* radiant sun behind badge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid place-items-center opacity-[0.18]"
      >
        <svg viewBox="0 0 400 400" style={{ width: "min(40rem, 80vw)" }}>
          <g fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary">
            {Array.from({ length: 48 }).map((_, i) => (
              <line key={i} x1="200" y1="200" x2="200" y2="0" transform={`rotate(${i * 7.5} 200 200)`} />
            ))}
          </g>
        </svg>
      </div>

      <div className="relative max-w-[680px] w-full text-center">
        <div className="font-[var(--font-mono)] text-muted-foreground mb-6" style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}>
          ✦ ANVESHA RECOMMENDS ✦
        </div>

        <div className="inline-block">
          <div className="text-primary font-[var(--font-display)] italic" style={{ fontSize: "clamp(3.5rem, 14vw, 8rem)", lineHeight: 0.95 }}>
            {data.stream}
          </div>
          <div className="h-px bg-foreground/30 my-4" />
          <div className="font-[var(--font-mono)] text-muted-foreground flex items-center justify-center gap-3" style={{ fontSize: "0.8rem", letterSpacing: "0.12em" }}>
            <span>{data.confidence}% CONFIDENCE</span>
            <span className="text-border">|</span>
            <span>v2.1 MODEL</span>
          </div>
        </div>

        <h2 className="mt-10 font-[var(--font-display)] italic" style={{ fontSize: "clamp(1.3rem, 3vw, 1.85rem)", lineHeight: 1.3 }}>
          "{copy.tagline}"
        </h2>

        <p className="mt-6 text-muted-foreground mx-auto max-w-[52ch]" style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)" }}>
          {copy.why}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {copy.subjects.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-card px-4 py-2"
              style={{ fontSize: "0.85rem" }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* tally mini-bar */}
        <div className="mt-10 max-w-[420px] mx-auto">
          <div className="font-[var(--font-mono)] text-muted-foreground mb-2 text-left" style={{ fontSize: "0.7rem", letterSpacing: "0.12em" }}>
            HOW YOUR ANSWERS DISTRIBUTED
          </div>
          <div className="space-y-2">
            {(["S", "C", "A"] as const).map((k) => {
              const label = k === "S" ? "Science" : k === "C" ? "Commerce" : "Arts";
              const score =
                label === "Science"
                  ? data.probabilities.Science
                  : label === "Commerce"
                    ? data.probabilities.Commerce
                    : data.probabilities.Arts;
              const pct = Math.round(score * 100);
              return (
                <div key={k} className="flex items-center gap-3" style={{ fontSize: "0.85rem" }}>
                  <span className="w-20 text-left text-muted-foreground">{label}</span>
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={label === data.stream ? "bg-primary h-full" : "bg-foreground/40 h-full"}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-[var(--font-mono)]">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onRetake}
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 min-h-[48px] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <RotateCcw size={16} /> Retake the survey
          </button>
          <button
            onClick={onHistory}
            className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 min-h-[48px] hover:border-foreground transition-colors"
          >
            <History size={16} /> View my history
          </button>
        </div>
      </div>
    </main>
  );
}
