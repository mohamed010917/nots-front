import { AlertTriangle, ChevronLeft, ChevronRight, Trash2, TrendingUp } from "lucide-react";
import { cn } from "./utils";
import { motion, AnimatePresence } from "motion/react";



function Btn({
  children, onClick, variant = "primary", size = "md", className = "",
  disabled = false, type = "button", title
}: {
  children: React.ReactNode; onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline" | "glass";
  size?: "xs" | "sm" | "md" | "lg"; className?: string; disabled?: boolean;
  type?: "button" | "submit"; title?: string;
}) {
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent text-foreground",
    danger: "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
    outline: "border border-border bg-transparent hover:bg-accent text-foreground",
    glass: "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm",
  };
  const sizes = { xs: "px-2 py-1 text-xs gap-1", sm: "px-3 py-1.5 text-sm gap-1.5", md: "px-4 py-2 text-sm gap-2", lg: "px-6 py-3 text-base gap-2" };
  return (
    <button type={type} onClick={onClick} disabled={disabled} title={title}
      className={cn(
        "inline-flex items-center rounded-lg font-medium transition-all duration-150 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70",
        "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]",
        variants[variant], sizes[size], className
      )}>
      {children}
    </button>
  );
}

function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap", className)}>
      {children}
    </span>
  );
}

function Input({
  placeholder, value, onChange, type = "text", icon, className = "", autoFocus = false
}: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  type?: string; icon?: React.ReactNode; className?: string; autoFocus?: boolean;
}) {
  return (
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">{icon}</span>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} autoFocus={autoFocus}
        className={cn(
          "w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/60",
          "transition-all duration-150",
          icon ? "pl-9" : "", className
        )} />
    </div>
  );
}

export const getCategoryBadge = (cat: string) => {
  const map: Record<string, string> = {
    Work: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300",
    Personal: "bg-violet-100 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300",
    Development: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    Design: "bg-pink-100 text-pink-700 dark:bg-pink-950/70 dark:text-pink-300",
    Research: "bg-amber-100 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300",
    Docs: "bg-sky-100 text-sky-700 dark:bg-sky-950/70 dark:text-sky-300",
    Engineering: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300",
    Marketing: "bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300",
    Management: "bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300",
  };
  return map[cat] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300";
};

function Textarea({
  placeholder, value, onChange, rows = 6, className = "", mono = false
}: {
  placeholder?: string; value: string; onChange: (v: string) => void;
  rows?: number; className?: string; mono?: boolean;
}) {
  return (
    <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows}
      className={cn(
        "w-full rounded-lg border border-border bg-input-background px-4 py-3 text-sm text-foreground",
        "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/60",
        "transition-all duration-150 resize-none leading-relaxed",
        mono ? "font-mono text-xs" : "", className
      )} />
  );
}

function Select({
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

// Shimmer skeleton
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg bg-muted",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
      "before:animate-[shimmer_1.8s_infinite]",
      className
    )} />
  );
}

function NoteCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <Skeleton className="h-1 w-full rounded-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
    </div>
  );
}

function StatCard({
  label, value, icon, trend, color, subValue
}: {
  label: string; value: string | number; icon: React.ReactNode;
  trend?: string; color: string; subValue?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-card rounded-xl border border-border p-5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2.5 rounded-xl", color)}>{icon}</div>
        {trend && (
          <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" />{trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-display">{value}</div>
      {subValue && <div className="text-xs text-muted-foreground mt-0.5">{subValue}</div>}
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

// Confirm delete modal
function ConfirmDialog({
  open, title, description, onConfirm, onCancel, loading = false
}: {
  open: boolean; title: string; description: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={onCancel} />
          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6"
          >
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="font-display font-bold text-lg text-foreground text-center mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">{description}</p>
            <div className="flex gap-3">
              <Btn variant="outline" onClick={onCancel} className="flex-1 justify-center">Cancel</Btn>
              <Btn variant="danger" onClick={onConfirm} disabled={loading} className="flex-1 justify-center">
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete
              </Btn>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Pagination
function Pagination({
  currentPage, totalPages, onPageChange
}: {
  currentPage: number; totalPages: number; onPageChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <Btn variant="ghost" size="xs" onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
        <ChevronLeft className="w-4 h-4" />
      </Btn>
      {pages.map(p => (
        <button key={p} onClick={() => onPageChange(p)}
          className={cn(
            "w-8 h-8 rounded-lg text-sm font-medium transition-all",
            p === currentPage
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}>
          {p}
        </button>
      ))}
      <Btn variant="ghost" size="xs" onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
        <ChevronRight className="w-4 h-4" />
      </Btn>
    </div>
  );
}

// Progress bar
function ProgressBar({ value, className = "", color = "bg-primary" }: { value: number; className?: string; color?: string }) {
  return (
    <div className={cn("h-1.5 bg-muted rounded-full overflow-hidden", className)}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("h-full rounded-full", color)}
      />
    </div>
  );
}



export { Btn, Badge, Input, Textarea, Select, Skeleton, NoteCardSkeleton, StatCard, ConfirmDialog, Pagination, ProgressBar };