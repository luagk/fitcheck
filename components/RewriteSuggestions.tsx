import { useState } from "react";
import { Copy } from "lucide-react";
import type { Labels } from "@/lib/i18n";
import type { Report } from "@/lib/schema";

export default function RewriteSuggestions({ items, t }: { items: Report["rewrites"]; t: Labels }) {
  const [copied, setCopied] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);
  async function copy(text: string, index: number) {
    try { await navigator.clipboard.writeText(text); setCopied(index); setFailed(false); }
    catch { setCopied(null); setFailed(true); }
  }
  return <section><h3>{t.rewrites}</h3>{!items.length && <p>{t.empty}</p>}{items.map((item, index) => <div className="rewrite" key={index}><p><del>{item.original}</del></p><p>{item.suggested}</p><button type="button" onClick={() => copy(item.suggested, index)}><Copy size={16} aria-hidden="true" />{copied === index ? t.copied : t.copy}</button></div>)}<p role="status">{failed ? t.copyFailed : ""}</p></section>;
}