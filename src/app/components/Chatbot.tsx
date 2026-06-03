import { useEffect, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string };

const SUGGESTIONS = [
  "Which stream has better scope in India?",
  "I'm scared of Maths — can I still do Commerce?",
  "What if my parents disagree with my choice?",
  "Tell me about careers after Arts.",
];

export function Chatbot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text:
        "Hey — I'm Anvesha. Ask me anything about streams, subjects, or that career doubt sitting on your chest. No judgement, no jargon.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setMessages((m) => [...m, { role: "bot", text: "Thinking..." }]);
    fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        prompt: t,
        stream: false,
      }),
    })
      .then((res) => res.json())
      .then((data: { response?: string }) => {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "bot",
            text: data.response?.trim() || "No response from AI.",
          };
          return next;
        });
      })
      .catch(() => {
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "bot",
            text: "Error connecting to Gemma model.",
          };
          return next;
        });
      });
  };

  return (
    <main
      className="min-h-[calc(100vh-72px)] flex flex-col"
      style={{ paddingInline: "clamp(1rem, 5vw, 6rem)", paddingBlock: "clamp(1.5rem, 4vw, 3rem)" }}
    >
      <div className="w-full max-w-[860px] mx-auto flex-1 flex flex-col">
        <div className="mb-6">
          <div
            className="font-[var(--font-mono)] text-muted-foreground mb-2"
            style={{ fontSize: "0.72rem", letterSpacing: "0.18em" }}
          >
            ✦ LIVE AI CHATBOT ✦
          </div>
          <h1>
            Talk it out with <em className="italic text-primary">Anvesha</em>.
          </h1>
        </div>

        <div className="flex-1 rounded-2xl border border-border bg-card flex flex-col overflow-hidden">
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto"
            style={{ padding: "clamp(1rem, 3vw, 1.75rem)", maxHeight: "calc(100vh - 320px)", minHeight: "320px" }}
          >
            <ul className="space-y-4">
              {messages.map((m, i) => (
                <li
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "bot" && (
                    <div className="shrink-0 size-8 rounded-full bg-accent/15 text-accent grid place-items-center mt-0.5">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div
                    className={`rounded-2xl max-w-[78%] ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-secondary text-foreground rounded-bl-sm"
                    }`}
                    style={{ padding: "0.75rem 1rem", fontSize: "0.95rem", lineHeight: 1.5 }}
                  >
                    {m.text}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {messages.length <= 1 && (
            <div
              className="border-t border-border flex flex-wrap gap-2"
              style={{ padding: "clamp(0.75rem, 2vw, 1rem)" }}
            >
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border bg-background hover:border-foreground transition-colors px-3 py-1.5"
                  style={{ fontSize: "0.82rem" }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-border flex items-center gap-2"
            style={{ padding: "clamp(0.75rem, 2vw, 1rem)" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything — I'm listening."
              className="flex-1 bg-transparent outline-none px-2 py-3"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="shrink-0 size-11 grid place-items-center rounded-full bg-foreground text-background disabled:opacity-30 hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Send"
            >
              <Send size={16} />
            </button>
          </form>
        </div>

        <p className="text-muted-foreground text-center mt-4" style={{ fontSize: "0.8rem" }}>
          Conversations are private. Anvesha may make mistakes — verify important details with a teacher or counsellor.
        </p>
      </div>
    </main>
  );
}
