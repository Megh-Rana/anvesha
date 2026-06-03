import { ArrowUpRight, FileText } from "lucide-react";

export type HistoryEntry = {
  id: string;
  date: string; // ISO
  stream: "Science" | "Commerce" | "Arts";
  confidence: number;
  probabilities?: Record<"Arts" | "Commerce" | "Science", number>;
};

export function HistoryScreen({
  entries,
  onTakeSurvey,
}: {
  entries: HistoryEntry[];
  onTakeSurvey: () => void;
}) {
  return (
    <main
      style={{
        paddingInline: "clamp(1rem, 5vw, 6rem)",
        paddingBlock: "clamp(2rem, 6vw, 5rem)",
      }}
    >
      <div className="max-w-[1000px] mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
          <div>
            <div className="font-[var(--font-mono)] text-muted-foreground mb-2" style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}>
              YOUR JOURNEY
            </div>
            <h1>
              <em className="italic">Past</em> assessments
            </h1>
          </div>
          <button
            onClick={onTakeSurvey}
            className="rounded-full bg-foreground text-background px-5 py-3 hover:bg-primary hover:text-primary-foreground transition-colors min-h-[48px]"
          >
            Take a new survey
          </button>
        </div>

        {entries.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed border-border text-center"
            style={{ padding: "clamp(2rem, 6vw, 4rem)" }}
          >
            <div className="mx-auto size-12 rounded-full bg-secondary grid place-items-center mb-5">
              <FileText size={20} className="text-muted-foreground" />
            </div>
            <h3>Nothing here yet.</h3>
            <p className="text-muted-foreground mt-2 max-w-[40ch] mx-auto">
              Take your first 21-question assessment — your recommendations
              will live here, with timestamps and confidence scores.
            </p>
            <button
              onClick={onTakeSurvey}
              className="mt-6 rounded-full bg-foreground text-background px-6 py-3 hover:bg-primary hover:text-primary-foreground transition-colors min-h-[48px]"
            >
              Start Your Journey
            </button>
          </div>
        ) : (
          <ul className="grid gap-3">
            {entries.map((e, i) => (
              <li key={e.id}>
                <article
                  className="rounded-xl border border-border bg-card grid gap-4 items-center hover:border-foreground/40 transition-colors"
                  style={{
                    padding: "clamp(1rem, 2.4vw, 1.5rem)",
                    gridTemplateColumns: "auto 1fr auto auto",
                  }}
                >
                  <div
                    className="font-[var(--font-mono)] text-muted-foreground hidden sm:block"
                    style={{ fontSize: "0.72rem", letterSpacing: "0.12em" }}
                  >
                    #{String(entries.length - i).padStart(2, "0")}
                  </div>
                  <div>
                    <div
                      className="font-[var(--font-display)] italic"
                      style={{ fontSize: "clamp(1.3rem, 2.4vw, 1.6rem)", lineHeight: 1.2 }}
                    >
                      {e.stream}
                    </div>
                    <div className="text-muted-foreground" style={{ fontSize: "0.85rem" }}>
                      {new Date(e.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <div className="font-[var(--font-mono)]" style={{ fontSize: "0.9rem" }}>
                      {e.confidence}%
                    </div>
                    <div className="text-muted-foreground" style={{ fontSize: "0.72rem", letterSpacing: "0.1em" }}>
                      CONFIDENCE
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-muted-foreground" />
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
