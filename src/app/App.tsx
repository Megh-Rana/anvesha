import { useCallback, useEffect, useState } from "react";
import { NavBar, type Screen } from "./components/NavBar";
import { Landing } from "./components/Landing";
import { Auth } from "./components/Auth";
import { Survey } from "./components/Survey";
import { Result } from "./components/Result";
import { HistoryScreen, type HistoryEntry } from "./components/HistoryScreen";
import { Chatbot } from "./components/Chatbot";
import { auth, db } from "./lib/firebase";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

type ResultData = {
  stream: "Science" | "Commerce" | "Arts";
  confidence: number;
  probabilities: Record<"Arts" | "Commerce" | "Science", number>;
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<User | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [pendingAfterAuth, setPendingAfterAuth] = useState<Screen | null>(null);

  const loadHistory = useCallback(async (uid: string) => {
    const assessmentsRef = collection(db, "users", uid, "assessments");
    const qs = query(assessmentsRef, orderBy("timestamp", "desc"));
    const snapshot = await getDocs(qs);
    const parsed: HistoryEntry[] = snapshot.docs.map((doc) => {
      const data = doc.data() as {
        prediction: "Science" | "Commerce" | "Arts";
        probabilities: Record<"Arts" | "Commerce" | "Science", number>;
        timestamp?: Timestamp;
      };
      const strongest = Math.max(...Object.values(data.probabilities || { Arts: 0, Commerce: 0, Science: 0 }));
      return {
        id: doc.id,
        date: data.timestamp?.toDate().toISOString() ?? new Date().toISOString(),
        stream: data.prediction,
        confidence: Math.round(strongest * 100),
        probabilities: data.probabilities,
      };
    });
    setHistory(parsed);
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setScreen("landing");
        setHistory([]);
      } else {
        void loadHistory(nextUser.uid);
      }
    });
    return () => unsub();
  }, [loadHistory]);

  const navigate = (s: Screen) => {
    if ((s === "survey" || s === "history" || s === "chatbot") && !user) {
      setPendingAfterAuth(s);
      setScreen("auth");
      return;
    }
    setScreen(s);
  };

  const handleAuthed = async () => {
    if (!auth.currentUser) return;
    await loadHistory(auth.currentUser.uid);
    setScreen(pendingAfterAuth ?? "landing");
    setPendingAfterAuth(null);
  };

  const handleSurveyComplete = async (r: ResultData) => {
    setResult(r);
    if (auth.currentUser) {
      await addDoc(collection(db, "users", auth.currentUser.uid, "assessments"), {
        prediction: r.stream,
        probabilities: r.probabilities,
        timestamp: serverTimestamp(),
      });
      await loadHistory(auth.currentUser.uid);
    } else {
      setHistory((h) => [
        {
          id: `h${Date.now()}`,
          date: new Date().toISOString(),
          stream: r.stream,
          confidence: r.confidence,
          probabilities: r.probabilities,
        },
        ...h,
      ]);
    }
    setScreen("result");
  };

  return (
    <div className="min-h-screen size-full bg-background text-foreground">
        <NavBar
          current={screen}
          onNavigate={navigate}
          isAuthed={!!user}
          userEmail={user?.email ?? null}
          onSignOut={() => signOut(auth)}
        />
      {screen === "landing" && <Landing onNavigate={navigate} />}
      {screen === "auth" && <Auth onAuthed={handleAuthed} onNavigate={navigate} />}
      {screen === "survey" && (
        <Survey onComplete={handleSurveyComplete} onExit={() => setScreen("landing")} />
      )}
      {screen === "result" && result && (
        <Result
          data={result}
          onRetake={() => setScreen("survey")}
          onHistory={() => navigate("history")}
        />
      )}
      {screen === "history" && (
        <HistoryScreen entries={history} onTakeSurvey={() => setScreen("survey")} />
      )}
      {screen === "chatbot" && <Chatbot />}
    </div>
  );
}
