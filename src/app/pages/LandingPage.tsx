import { useEffect, useState } from "react";
import {FileText ,
CheckSquare ,
BarChart2 ,
Search ,
Shield ,
Sparkles,
ArrowRight,
Eye,
Star,
CheckCircle2,
TrendingUp,
Check,
Twitter,
Github,
Globe
} from "lucide-react"
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "motion/react";
import { Btn } from "../components/ui/UI";
import { cn } from "../components/ui/utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../slices/UserSlice";
import Logout from "./Logout";





export default function LandingPage() {
  const [activePricing, setActivePricing] = useState<"monthly" | "annual">("monthly");
  const navigate = useNavigate();
  const [token , seToken] = useState<any>(null) ;
  useEffect(()=>{
    const getToken = async () => {
      const tok = await cookieStore.get("token") ;
      seToken(tok?.value) ;
    }
    getToken() ;
  },[]) ;
 
  const features = [
    { icon: FileText, title: "Rich Markdown Editor", desc: "Write in markdown with live preview, syntax highlighting, code blocks, and seamless auto-save.", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50", border: "group-hover:border-indigo-200 dark:group-hover:border-indigo-800" },
    { icon: CheckSquare, title: "Kanban Task Board", desc: "Drag-and-drop tasks across To Do, In Progress, Review, and Done — with priority badges and due dates.", color: "text-violet-500 bg-violet-50 dark:bg-violet-950/50", border: "group-hover:border-violet-200 dark:group-hover:border-violet-800" },
    { icon: BarChart2, title: "Productivity Analytics", desc: "Visualize your output trends with beautiful charts. Track streaks, weekly cadence, and category breakdowns.", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50", border: "" },
    { icon: Search, title: "Instant Search", desc: "Full-text search across all notes with debounced queries, category filters, and relevance ranking.", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/50", border: "" },
    { icon: Shield, title: "Secure by Default", desc: "JWT authentication, bcrypt passwords, row-level security, and encrypted backups — privacy you can trust.", color: "text-sky-500 bg-sky-50 dark:bg-sky-950/50", border: "" },
    { icon: Sparkles, title: "AI Suggestions", desc: "Smart auto-tagging, related note discovery, and writing prompts powered by your writing patterns.", color: "text-pink-500 bg-pink-50 dark:bg-pink-950/50", border: "" },
  ];

  const testimonials = [
    { name: "Sarah Chen", role: "Product Designer at Figma", quote: "SmartNotes completely replaced my Notion setup. The markdown editor is flawless, and the Kanban board is exactly what I needed.", rating: 5, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&auto=format" },
    { name: "Marcus Williams", role: "Staff Eng at Vercel", quote: "I've tried every note tool. SmartNotes is the first that actually fits how engineers think — code blocks, tagging, search that works.", rating: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" },
    { name: "Priya Mehta", role: "Founder, Helios Studio", quote: "My entire team switched from Trello and Notion in a week. The Kanban drag-and-drop is so smooth, and analytics actually changed how we plan.", rating: 5, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&h=80&fit=crop&auto=format" },
  ];

  const pricing = [
    {
      name: "Free", price: { monthly: "$0", annual: "$0" }, period: "/month",
      features: ["50 notes", "Basic search", "2 categories", "Mobile app", "Community support"],
      cta: "Start for free", popular: false,
    },
    {
      name: "Pro", price: { monthly: "$12", annual: "$9" }, period: "/month",
      features: ["Unlimited notes", "Advanced search + filters", "All categories + custom", "Kanban board + calendar", "Analytics dashboard", "API access", "Priority support"],
      cta: "Start 14-day trial", popular: true,
    },
    {
      name: "Team", price: { monthly: "$29", annual: "$22" }, period: "/month",
      features: ["Everything in Pro", "Up to 15 members", "Shared workspaces", "Admin controls + roles", "SSO + SAML", "Custom integrations", "Dedicated success manager"],
      cta: "Contact sales", popular: false,
    },
  ];

  return (
    <div className="bg-background overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm shadow-primary/30">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground tracking-tight">SmartNotes</span>
          </div>
          <div className="hidden md:flex items-center gap-1 ml-6">
            {["Features", "Pricing", "Testimonials"].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-all">{l}</a>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            {token ? <Logout /> :  (<>
              <Btn variant="ghost" onClick={() => navigate("login") } size="sm">Sign in</Btn>
              <Btn variant="primary" onClick={() => navigate("/register")} size="sm">Get started free</Btn>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-primary/8 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-[5%] w-[400px] h-[400px] bg-violet-500/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 rounded-full blur-[80px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
            style={{ backgroundImage: "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-7"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Introducing SmartNotes v2 — Now with AI
              </motion.div>
              <h1 className="font-display text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold text-foreground leading-[1.05] tracking-tight mb-7">
                Think clearly.<br />
                <span className="bg-gradient-to-r from-primary via-violet-500 to-pink-500 bg-clip-text text-transparent">
                  Ship faster.
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-9 leading-relaxed max-w-lg">
                The productivity workspace that thinks the way you do — rich notes, smart task management, and real analytics in one beautifully designed tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                {
                  !token ? (
                    <>
                      <Btn variant="primary" onClick={() => navigate("/register")} size="lg" className="justify-center">
                        Start for free <ArrowRight className="w-4 h-4" />
                      </Btn>
                      <Btn variant="outline" onClick={() => navigate("login")} size="lg" className="justify-center">
                        <Eye className="w-4 h-4" /> Watch demo
                      </Btn>
                    </>
                  ):(
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Btn onClick={() => navigate("/dashboard")} size="lg" className="bg-white text-primary hover:bg-white/95 shadow-lg justify-center">
                        Go to Dashboard <ArrowRight className="w-4 h-4" />
                      </Btn>
                    </div>
                  )
                    
                }
              </div>
              <div className="flex items-center gap-5">
                <div className="flex -space-x-2">
                  {["photo-1494790108377-be9c29b29330", "photo-1507003211169-0a1dd7228f2d", "photo-1573496359142-b8d87734a5a2", "photo-1472099645785-5658abf4ff4e"].map((id, i) => (
                    <img key={i} src={`https://images.unsplash.com/${id}?w=40&h=40&fit=crop&auto=format`}
                      alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover bg-muted" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">12,000+</span> professionals trust SmartNotes
                  <div className="flex items-center gap-0.5 mt-0.5">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    <span className="ml-1">4.9/5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* App mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="hidden lg:block relative"
            >
              <div className="relative bg-card rounded-2xl border border-border shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden">
                {/* Window chrome */}
                <div className="bg-muted/60 px-4 py-3 flex items-center gap-2 border-b border-border">
                  {["#f87171", "#fbbf24", "#34d399"].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                  <div className="flex-1 bg-background/60 rounded-md px-3 py-1 text-[11px] text-muted-foreground mx-4 text-center">
                    app.smartnotes.io/dashboard
                  </div>
                </div>
                {/* Dashboard preview */}
                <div className="flex h-72">
                  {/* Mini sidebar */}
                  <div className="w-40 bg-sidebar border-r border-border p-3 space-y-1 flex-shrink-0">
                    <div className="flex items-center gap-2 mb-4 px-1">
                      <div className="w-5 h-5 bg-primary rounded-md" />
                      <span className="text-[11px] font-bold text-foreground">SmartNotes</span>
                    </div>
                    {[["Dashboard", true], ["Notes", false], ["Tasks", false]].map(([l, a]) => (
                      <div key={l as string} className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px]", a ? "bg-sidebar-accent text-primary font-medium" : "text-muted-foreground")}>
                        <div className="w-2.5 h-2.5 bg-current rounded-sm opacity-70 flex-shrink-0" />
                        {l}
                      </div>
                    ))}
                  </div>
                  {/* Mini dashboard */}
                  <div className="flex-1 p-4 overflow-hidden bg-background">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {[["24", "Notes", "bg-indigo-50 dark:bg-indigo-950/40"], ["8", "Pinned", "bg-violet-50 dark:bg-violet-950/40"], ["91%", "Done", "bg-green-50 dark:bg-green-950/40"]].map(([v, l, c]) => (
                        <div key={l} className={cn("rounded-lg p-2", c)}>
                          <div className="text-[13px] font-bold text-foreground">{v}</div>
                          <div className="text-[10px] text-muted-foreground">{l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-card rounded-lg border border-border p-2.5 mb-2">
                      <div className="text-[10px] font-semibold text-foreground mb-2">Recent Notes</div>
                      {["Product Roadmap Q3", "Design Sprint Notes", "Atomic Habits"].map((t, i) => (
                        <div key={t} className="flex items-center gap-2 py-1">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: ["#6366f1", "#8b5cf6", "#10b981"][i] }} />
                          <span className="text-[10px] text-muted-foreground truncate">{t}</span>
                        </div>
                      ))}
                    </div>
                    {/* Mini chart bars */}
                    <div className="bg-card rounded-lg border border-border p-2.5">
                      <div className="text-[10px] font-semibold text-foreground mb-2">This Week</div>
                      <div className="flex items-end gap-1 h-10">
                        {[3, 7, 4, 9, 11, 5, 7].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/70 rounded-sm" style={{ height: `${(h / 11) * 100}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute -bottom-5 -left-6 bg-card border border-border rounded-xl px-3.5 py-2.5 shadow-xl shadow-black/10">
                <div className="flex items-center gap-2 text-[12px]">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-foreground">Task shipped!</span>
                </div>
              </motion.div>
              <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute -top-3 -right-6 bg-primary text-primary-foreground rounded-xl px-3.5 py-2.5 shadow-xl shadow-primary/30">
                <div className="flex items-center gap-2 text-[12px] font-semibold">
                  <TrendingUp className="w-4 h-4" /> +23% this week
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 lg:py-24 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.15em] mb-3">Features</p>
            <h2 className="font-display text-4xl font-extrabold text-foreground mb-4 tracking-tight">
              Everything you need to do your best work
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              A complete productivity suite designed for deep focus, creative thinking, and structured execution.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={f.title}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }} viewport={{ once: true }}
                  className="group bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center mb-5", f.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.15em] mb-3">Testimonials</p>
            <h2 className="font-display text-4xl font-extrabold text-foreground mb-4 tracking-tight">
              Loved by 12,000+ professionals
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-6 hover:shadow-md transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-foreground/90 text-sm leading-relaxed mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover bg-muted ring-2 ring-border" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-primary font-bold text-xs uppercase tracking-[0.15em] mb-3">Pricing</p>
            <h2 className="font-display text-4xl font-extrabold text-foreground mb-4 tracking-tight">Simple, transparent pricing</h2>
            <p className="text-muted-foreground mb-7">Start free. Upgrade when you need more power.</p>
            {/* Toggle */}
            <div className="inline-flex items-center bg-muted rounded-xl p-1 gap-1">
              {(["monthly", "annual"] as const).map(t => (
                <button key={t} onClick={() => setActivePricing(t)}
                  className={cn("px-4 py-2 rounded-lg text-sm font-semibold transition-all",
                    activePricing === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                  {t === "annual" && <span className="ml-1.5 text-xs text-green-600 font-bold">-25%</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div key={plan.name}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                className={cn("rounded-2xl border p-7 relative flex flex-col",
                  plan.popular
                    ? "border-primary bg-primary text-primary-foreground shadow-2xl shadow-primary/25 scale-[1.02]"
                    : "border-border bg-card"
                )}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-black px-4 py-1 rounded-full tracking-wide uppercase">
                    Most Popular
                  </div>
                )}
                <h3 className={cn("font-display font-extrabold text-xl mb-1", plan.popular ? "text-primary-foreground" : "text-foreground")}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-7">
                  <AnimatePresence mode="wait">
                    <motion.span key={activePricing}
                      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className={cn("text-5xl font-extrabold font-display", plan.popular ? "text-primary-foreground" : "text-foreground")}>
                      {plan.price[activePricing]}
                    </motion.span>
                  </AnimatePresence>
                  <span className={cn("text-sm", plan.popular ? "text-primary-foreground/70" : "text-muted-foreground")}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <div className={cn("w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0",
                        plan.popular ? "bg-white/20" : "bg-primary/10")}>
                        <Check className={cn("w-2.5 h-2.5", plan.popular ? "text-white" : "text-primary")} />
                      </div>
                      <span className={plan.popular ? "text-primary-foreground/90" : "text-muted-foreground"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/register")}
                  className={cn(
                    "w-full py-3 rounded-xl font-bold text-sm transition-all",
                    plan.popular
                      ? "bg-white text-primary hover:bg-white/95 shadow-md"
                      : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm shadow-primary/20"
                  )}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-pink-600" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 25% 50%, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold text-white mb-5 tracking-tight">
              Ready to transform your workflow?
            </h2>
            <p className="text-white/80 text-lg mb-9 max-w-2xl mx-auto">
              Join 12,000+ professionals using SmartNotes to think clearly, stay organized, and ship consistently.
            </p>
            {
              !token ? (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Btn onClick={() => navigate("/register")} size="lg" className="bg-white text-primary hover:bg-white/95 shadow-lg justify-center">
                    Get started for free <ArrowRight className="w-4 h-4" />
                  </Btn>
                  <Btn variant="glass" onClick={() => navigate("/login")} size="lg" className="justify-center">
                    Sign in to existing account
                  </Btn>
                  
                </div>

              ) : (
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Btn onClick={() => navigate("/dashboard")} size="lg" className="bg-white text-primary hover:bg-white/95 shadow-lg justify-center">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Btn>
                </div>
              )
            }
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
                <span className="font-display font-bold text-foreground">SmartNotes</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-4">
                The modern productivity workspace for individuals and teams who want to think clearly and ship consistently.
              </p>
              <div className="flex items-center gap-2">
                {[Twitter, Github, Globe].map((Icon, i) => (
                  <button key={i} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "API Docs", "Roadmap"] },
              { title: "Company", links: ["About", "Blog", "Careers", "Press Kit"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-sm text-foreground mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => <li key={l}><a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">© 2024 SmartNotes Inc. All rights reserved.</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
