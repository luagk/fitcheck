import type { Labels } from "@/lib/i18n";

export default function KeywordChips({ keywords, t }: { keywords: string[]; t: Labels }) {
  return <section><h3>{t.keywords}</h3>{keywords.length ? <ul className="keywords">{keywords.map((keyword, index) => <li key={index}>{keyword}</li>)}</ul> : <p>{t.empty}</p>}</section>;
}