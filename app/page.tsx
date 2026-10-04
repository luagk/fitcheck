"use client";

import { useEffect, useState } from "react";
import InputForm from "@/components/InputForm";
import LanguageToggle from "@/components/LanguageToggle";
import ScoreBar from "@/components/ScoreBar";
import RequirementsList from "@/components/RequirementsList";
import KeywordChips from "@/components/KeywordChips";
import RewriteSuggestions from "@/components/RewriteSuggestions";
import { strings, type Language } from "@/lib/i18n";
import type { Report } from "@/lib/schema";

export default function Page() {
  const [lang, setLang] = useState<Language>("en");
  const [result, setResult] = useState<{ report: Report; lang: Language } | null>(null);
  const [examples, setExamples] = useState({ en: { resume: "", job: "" }, pt: { resume: "", job: "" } });
  const [passwordRequired, setPasswordRequired] = useState(false);
  useEffect(() => {
    let choice: Language = navigator.language.startsWith("pt") ? "pt" : "en";
    try { const saved = localStorage.getItem("fitcheck-language"); if (saved === "en" || saved === "pt") choice = saved; } catch {}
    setLang(choice);
    fetch("/api/config").then(response => response.json()).then(data => { setExamples(data.examples); setPasswordRequired(data.passwordRequired); }).catch(() => {});
  }, []);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);
  const t = strings[lang];
  function changeLanguage(value: Language) { setLang(value); try { localStorage.setItem("fitcheck-language", value); } catch {} }
  return <main><header><div><h1>fitcheck<span className="brand-dot">.</span></h1><p>{t.description}</p></div><LanguageToggle lang={lang} onChange={changeLanguage} /></header><InputForm lang={lang} examples={examples} passwordRequired={passwordRequired} onResult={(report, reportLang) => setResult({ report, lang: reportLang })} />{result && <article className="review" lang={result.lang} aria-label={t.report}><h2>{t.report}</h2><ScoreBar score={result.report.score} label={t.score} /><p className="summary">{result.report.summary}</p><RequirementsList items={result.report.requirements} t={t} /><KeywordChips keywords={result.report.missing_keywords} t={t} /><RewriteSuggestions key={JSON.stringify(result.report.rewrites)} items={result.report.rewrites} t={t} /></article>}<footer>{t.privacy}</footer></main>;
}