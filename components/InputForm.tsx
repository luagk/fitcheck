"use client";

import { useState, type FormEvent } from "react";
import { FileText } from "lucide-react";
import { strings, type Language } from "@/lib/i18n";
import { reportSchema, type Report } from "@/lib/schema";

export default function InputForm({ lang, passwordRequired, examples, onResult }: {
  lang: Language;
  passwordRequired: boolean;
  examples: Record<Language, { resume: string; job: string }>;
  onResult: (report: Report, lang: Language) => void;
}) {
  const t = strings[lang];
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<"invalidInput" | "wrongPassword" | "analysisFailed" | null>(null);

  async function analyze(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if ([resume, job].some(text => text.trim().length < 50 || text.length > 15000)) {
      setError("invalidInput");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, job, lang, password }),
      });
      if (!response.ok) {
        setError(response.status === 401 ? "wrongPassword" : response.status === 400 ? "invalidInput" : "analysisFailed");
        return;
      }
      onResult(reportSchema.parse(await response.json()), lang);
    } catch { setError("analysisFailed"); }
    finally { setLoading(false); }
  }

  return <form onSubmit={analyze} aria-busy={loading} noValidate>
    <div className="fields">
      <label htmlFor="resume">{t.resume}<textarea id="resume" value={resume} onChange={event => setResume(event.target.value)} maxLength={15000} disabled={loading} aria-describedby="input-hint" /></label>
      <label htmlFor="job">{t.job}<textarea id="job" value={job} onChange={event => setJob(event.target.value)} maxLength={15000} disabled={loading} aria-describedby="input-hint" /></label>
    </div>
    <p id="input-hint" className="muted">{t.hint}</p>
    {passwordRequired && <label htmlFor="password">{t.password}<input id="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} disabled={loading} /></label>}
    <div className="actions"><button type="button" disabled={loading} onClick={() => { setResume(examples[lang].resume); setJob(examples[lang].job); setError(null); }}><FileText size={16} aria-hidden="true" />{t.example}</button><button className="primary" disabled={loading} type="submit">{loading ? t.loading : t.analyze}</button></div>
    <p role="alert">{error ? t[error] : ""}</p>
  </form>;
}