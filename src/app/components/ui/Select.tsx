import { cn } from "./utils";

export default function Select({
  value, onChange, options, className = ""
}: {
  value: string; onChange: (v: string) => void; options: string[]; className?: string;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className={cn("w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-ring/60 transition-all", className)}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}