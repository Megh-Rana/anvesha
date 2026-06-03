import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { QUESTIONS } from "../lib/assessment";
import {
  buildInputVector,
  predictWithLocalModel,
  type ModelData,
} from "../lib/model";
import modelJson from "../../../model.json";

export function Survey({
  onComplete,
  onExit,
}: {
  onComplete: (result: {
    stream: "Science" | "Commerce" | "Arts";
    confidence: number;
    probabilities: Record<"Arts" | "Commerce" | "Science", number>;
  }) => void;
  onExit: () => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => QUESTIONS.map(() => null));
  const modelData = modelJson as ModelData;

  const q = QUESTIONS[step];
  const selected = answers[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = ((step + 1) / QUESTIONS.length) * 100;
  const questionIds = useMemo(() => QUESTIONS.map((question) => question.id), []);

  const pick = (i: number) => {
    const next = [...answers];
    next[step] = i;
    setAnswers(next);
  };

  const finish = () => {
    const inputVector = buildInputVector(modelData.columns, questionIds, answers);
    const prediction = predictWithLocalModel(modelData, inputVector);
    const confidence = Math.round(prediction.probabilities[prediction.prediction] * 100);
    onComplete({
      stream: prediction.prediction,
      confidence,
      probabilities: prediction.probabilities,
    });
  };

  return (
    <main className="min-h-[calc(100vh-72px)] flex flex-col">
      <div
        className="sticky top-[64px] z-30 bg-background/90 backdrop-blur border-b border-border"
        style={{ paddingInline: "clamp(1rem, 5vw, 6rem)", paddingBlock: "0.75rem" }}
      >
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center justify-between mb-2 font-[var(--font-mono)] text-muted-foreground" style={{ fontSize: "0.72rem", letterSpacing: "0.12em" }}>
            <span>QUESTION {String(step + 1).padStart(2, "0")} / {String(QUESTIONS.length).padStart(2, "0")}</span>
            <button onClick={onExit} className="hover:text-foreground">EXIT</button>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div
        className="flex-1 grid place-items-center"
        style={{ paddingInline: "clamp(1rem, 5vw, 6rem)", paddingBlock: "clamp(2rem, 6vw, 4rem)" }}
      >
        <div className="w-full max-w-[820px]">
          <div className="text-center mb-10">
            <div className="font-[var(--font-mono)] text-primary mb-4" style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}>
              --- REFLECT ---
            </div>
            <h1 style={{ fontSize: "clamp(1.6rem, 4.2vw, 2.6rem)", lineHeight: 1.2 }}>
              {q.text}
            </h1>
          </div>

          <div
            className="grid gap-3"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))" }}
          >
            {q.options.map((opt, i) => {
              const active = selected === i;
              return (
                <button
                  key={opt}
                  onClick={() => pick(i)}
                  className={`text-left rounded-xl border transition-all min-h-[64px] flex items-center justify-between gap-4 ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-card hover:border-foreground/40"
                  }`}
                  style={{ padding: "clamp(0.9rem, 2vw, 1.15rem) clamp(1rem, 2.4vw, 1.4rem)" }}
                >
                  <span style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.05rem)" }}>{opt}</span>
                  <span
                    className={`shrink-0 grid place-items-center size-6 rounded-full border ${
                      active ? "bg-primary border-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {active && <Check size={14} />}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-between gap-3">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 min-h-[48px] disabled:opacity-30 disabled:cursor-not-allowed hover:border-foreground transition-colors"
            >
              <ArrowLeft size={16} /> Previous
            </button>

            <div className="hidden sm:flex gap-1">
              {QUESTIONS.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 w-3 rounded-full ${
                    i < step ? "bg-primary" : i === step ? "bg-foreground" : "bg-border"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => (isLast ? finish() : setStep((s) => s + 1))}
              disabled={selected === null}
              className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 min-h-[48px] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {isLast ? "See my result" : "Next"} <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
