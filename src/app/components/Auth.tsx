import { useState } from "react";
import type { Screen } from "./NavBar";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export function Auth({
  onAuthed,
  onNavigate,
}: {
  onAuthed: () => void;
  onNavigate: (s: Screen) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onAuthed();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill all fields.");
    if (mode === "register" && password !== confirm)
      return setError("Passwords don't match.");

    try {
      setError(null);
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onAuthed();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    }
  };

  return (
    <main
      className="min-h-[calc(100vh-72px)] grid place-items-center"
      style={{
        paddingInline: "clamp(1rem, 5vw, 6rem)",
        paddingBlock: "clamp(2rem, 6vw, 5rem)",
      }}
    >
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="font-[var(--font-mono)] text-muted-foreground mb-3" style={{ fontSize: "0.75rem", letterSpacing: "0.14em" }}>
            {mode === "login" ? "WELCOME BACK" : "BEGIN YOUR JOURNEY"}
          </div>
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)" }}>
            {mode === "login" ? (
              <>Step <em className="italic">back in.</em></>
            ) : (
              <>Make an <em className="italic">account.</em></>
            )}
          </h1>
        </div>

        <form
          onSubmit={submit}
          className="rounded-2xl border border-border bg-card"
          style={{ padding: "clamp(1.25rem, 4vw, 2rem)" }}
        >
          <Field label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.in"
              className="w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3"
            />
          </Field>
          <Field label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3"
            />
          </Field>
          {mode === "register" && (
            <Field label="Confirm password">
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent border-b border-border focus:border-foreground outline-none py-3"
              />
            </Field>
          )}

          {error && (
            <div className="text-destructive mt-2" style={{ fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-6 rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors min-h-[48px]"
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </button>

          {mode === "login" && (
            <>
              <div className="my-4 text-center text-muted-foreground" style={{ fontSize: "0.8rem" }}>
                or
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                className="w-full rounded-full border border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground transition-colors min-h-[48px]"
              >
                Continue with Google
              </button>
            </>
          )}

          <p className="text-center text-muted-foreground mt-6" style={{ fontSize: "0.9rem" }}>
            {mode === "login" ? "New to Anvesha?" : "Already with us?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              {mode === "login" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </form>

        <button
          onClick={() => onNavigate("landing")}
          className="block mx-auto mt-6 text-muted-foreground hover:text-foreground"
          style={{ fontSize: "0.85rem" }}
        >
          ← Back home
        </button>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mt-4 first:mt-0">
      <span className="block font-[var(--font-mono)] text-muted-foreground mb-1" style={{ fontSize: "0.7rem", letterSpacing: "0.12em" }}>
        {label.toUpperCase()}
      </span>
      {children}
    </label>
  );
}
