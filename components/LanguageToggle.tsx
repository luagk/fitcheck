import type { Language } from "@/lib/i18n";

export default function LanguageToggle({ lang, onChange }: { lang: Language; onChange: (lang: Language) => void }) {
  return <div className="language-toggle">{(["en", "pt"] as const).map(value => <button key={value} type="button" lang={value} aria-label={value === "en" ? "English" : "Português"} aria-pressed={lang === value} onClick={() => onChange(value)}>{value.toUpperCase()}</button>)}</div>;
}