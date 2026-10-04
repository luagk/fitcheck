export default function ScoreBar({ score, label }: { score: number; label: string }) {
  return <div className="score"><div><h3>{label}</h3><strong>{score}<small>/100</small></strong></div><div className="score-track" role="meter" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={score}><span style={{ width: `${score}%` }} /></div></div>;
}