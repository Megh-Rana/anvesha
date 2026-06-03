import { useState } from "react";
import { Menu, X } from "lucide-react";

export type Screen = "landing" | "auth" | "survey" | "result" | "history" | "chatbot";

export function NavBar({
  current,
  onNavigate,
  isAuthed,
  userEmail,
  onSignOut,
}: {
  current: Screen;
  onNavigate: (s: Screen) => void;
  isAuthed: boolean;
  userEmail: string | null;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);

  const links: { label: string; screen: Screen }[] = [
    { label: "Home", screen: "landing" },
    { label: "Take Survey", screen: "survey" },
    { label: "Chatbot", screen: "chatbot" },
    { label: "My Profile", screen: "history" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div
        className="flex items-center justify-between"
        style={{
          paddingInline: "clamp(1rem, 5vw, 6rem)",
          paddingBlock: "clamp(0.75rem, 1.6vw, 1.1rem)",
        }}
      >
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-baseline gap-1 group"
          aria-label="Anvesha home"
        >
          <span
            className="font-[var(--font-display)] italic"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 1.75rem)" }}
          >
            Anvesha
          </span>
          <span className="text-primary leading-none">.</span>
        </button>

        <nav className="hidden min-[520px]:flex items-center gap-1">
          {links.map((l) => {
            const active = current === l.screen;
            return (
              <button
                key={l.label}
                onClick={() => onNavigate(l.screen)}
                className={`px-3 py-2 rounded-full transition-colors min-h-[44px] ${
                  active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l.label}
              </button>
            );
          })}
          {isAuthed && userEmail && (
            <span
              className="text-muted-foreground"
              style={{ fontSize: "0.82rem", maxWidth: "220px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              title={userEmail}
            >
              {userEmail}
            </span>
          )}
          <span className="mx-2 h-5 w-px bg-border" />
          {isAuthed ? (
            <button
              onClick={onSignOut}
              className="px-4 py-2 rounded-full border border-border hover:border-foreground transition-colors min-h-[44px]"
            >
              Sign out
            </button>
          ) : (
            <button
              onClick={() => onNavigate("auth")}
              className="px-4 py-2 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors min-h-[44px]"
            >
              Sign in
            </button>
          )}
        </nav>

        <button
          className="min-[520px]:hidden p-2 rounded-full hover:bg-secondary min-h-[44px] min-w-[44px] grid place-items-center"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="min-[520px]:hidden border-t border-border bg-background">
          <div className="flex flex-col" style={{ padding: "clamp(0.75rem, 4vw, 1.25rem)" }}>
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => {
                  onNavigate(l.screen);
                  setOpen(false);
                }}
                className="text-left py-3 border-b border-border last:border-b-0"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                isAuthed ? onSignOut() : onNavigate("auth");
                setOpen(false);
              }}
              className="mt-3 py-3 rounded-full bg-foreground text-background"
            >
              {isAuthed ? "Sign out" : "Sign in"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
