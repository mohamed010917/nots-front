import { AlertTriangle, BarChart2, Check, CheckSquare, ChevronLeft, Eye, EyeOff, FileText, Github, Globe, Lock, Mail, Sparkles, Star } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Btn, Input } from "../components/ui/UI";
import { cn } from "../components/ui/utils";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUser } from "../../slices/UserSlice";

export default  function LoginPage() {
  const [email, setEmail] = useState("alex@example.com");
  const [password, setPassword] = useState("••••••••");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const Navigate = useNavigate();
   const dispatch = useDispatch() ;


  const handleLogin = async () => {
    try{

      if (!email || !password) { setError("Please fill in all fields."); return; }
      setError(""); setLoading(true);
  
      const data = await axios.post("http://localhost:5000/api/login", { email, password })
      console.log("data from login page" , data) ;
      if(data.status === 402){
        setError("User not found. Please check your email and try again.");
        setLoading(false);
        return;
      }
      if(data.status !== 200){
        setError(data.data.message || "Login failed. Please try again.");
        setLoading(false);
        return;
      }
        dispatch(setUser({user : data.data.existingUser , token : data.data.token})) ;
        cookieStore.set("token" , data.data.token) ;
        Navigate("/") ;
        setLoading(false);
        toast.success("Welcome back, Alex! 👋");
    }catch (error) {
        setLoading(false);
        setError("An error occurred during login. Please try again.");
    
    }

  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-violet-600 to-indigo-800" />
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-violet-300/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col h-full p-12">
          <button onClick={() => Navigate("/")} className="flex items-center gap-2.5 text-white/90 hover:text-white mb-16 text-sm font-medium w-fit">
            <div className="w-7 h-7 bg-white/20 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            SmartNotes
          </button>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display text-[2.4rem] font-extrabold text-white leading-tight mb-5 tracking-tight">
              Your ideas,<br />beautifully<br />organized.
            </h2>
            <p className="text-white/70 text-base mb-10 leading-relaxed">
              Join 12,000 professionals who trust SmartNotes to capture their best thinking and execute consistently.
            </p>
            <div className="space-y-4">
              {[
                { icon: FileText, text: "Unlimited notes with rich markdown" },
                { icon: CheckSquare, text: "Smart Kanban task management" },
                { icon: BarChart2, text: "Real-time productivity analytics" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-white/80 text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
            <div className="flex gap-1 mb-2.5">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />)}
            </div>
            <p className="text-white/80 text-sm italic mb-3">&ldquo;SmartNotes replaced Notion, Trello, and my entire note system. One tool to rule them all.&rdquo;</p>
            <div className="flex items-center gap-2.5">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&auto=format" alt="" className="w-8 h-8 rounded-full object-cover" />
              <div>
                <p className="text-white text-xs font-semibold">Marcus Williams</p>
                <p className="text-white/60 text-[11px]">Staff Eng at Vercel</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[360px]">
          <button onClick={() => Navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-10 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="mb-8">
            <h1 className="font-display text-2xl font-extrabold text-foreground mb-1.5">Welcome back</h1>
            <p className="text-muted-foreground text-sm">Sign in to your SmartNotes workspace</p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {[{ icon: Github, label: "GitHub" }, { icon: Globe, label: "Google" }].map(({ icon: Icon, label }) => (
              <button key={label} className="flex items-center justify-center gap-2 py-2.5 border border-border rounded-xl text-sm font-medium text-foreground hover:bg-accent transition-all">
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-medium">or with email</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg mb-4 text-sm text-destructive">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email</label>
              <Input value={email} onChange={setEmail} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <button className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <Input value={password} onChange={setPassword} type={showPw ? "text" : "password"}
                  placeholder="Enter your password" icon={<Lock className="w-4 h-4" />} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center transition-all", remember ? "bg-primary border-primary" : "border-muted-foreground/40")}
                onClick={() => setRemember(!remember)}>
                {remember && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
              </div>
              <span className="text-sm text-muted-foreground">Remember me for 30 days</span>
            </label>
            <Btn variant="primary" onClick={handleLogin} disabled={loading} className="w-full justify-center py-2.5" size="md">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                : "Sign in to workspace"
              }
            </Btn>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-7">
            Don&apos;t have an account?{" "}
            <button onClick={() => Navigate("/register")} className="text-primary font-semibold hover:underline">Sign up free</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
