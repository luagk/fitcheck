import { CircleCheck, CircleDashed, CircleX } from "lucide-react";
import type { Report } from "@/lib/schema";
import type { Labels } from "@/lib/i18n";

const icons = { met: CircleCheck, partial: CircleDashed, gap: CircleX };
export default function RequirementsList({ items, t }: { items: Report["requirements"]; t: Labels }) {
  return <section><h3>{t.requirements}</h3>{items.length === 0 ? <p>{t.empty}</p> : <ul className="requirements">{items.map((item, index) => {
    const Icon = icons[item.status];
    return <li key={index}><div className="requirement-title"><Icon size={18} aria-hidden="true" /><span className={`highlight ${item.status}`} style={{ animationDelay: `${index * 90}ms` }}>{item.item}</span><small>{t[item.status]}</small></div>{item.evidence && <blockquote>{item.evidence}</blockquote>}{item.suggestion && <p>{item.suggestion}</p>}</li>;
  })}</ul>}</section>;
}