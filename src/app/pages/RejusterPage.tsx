
import { AlertTriangle, BarChart2, Check, CheckSquare, ChevronLeft, Eye, EyeOff, FileText, Github, Globe, Lock, Mail, Sparkles, Star, User } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Btn, Input } from "../components/ui/UI";
import { cn } from "../components/ui/utils";
import axios from "axios" ;
import { useDispatch } from "react-redux";
import { setUser } from "../../slices/UserSlice";

export default function RejusterPage() {
  const url = "https://express-lilac-xi-96.vercel.app/api"

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const Navigate = useNavigate();
  const dispatch = useDispatch() ;

  const strength = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  }, [password]);

  const strengthConfig = [
    { label: "Too weak", color: "bg-red-500" },
    { label: "Weak", color: "bg-orange-500" },
    { label: "Fair", color: "bg-amber-500" },
    { label: "Good", color: "bg-blue-500" },
    { label: "Strong", color: "bg-green-500" },
  ];

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email.includes("@")) errs.email = "Enter a valid email";
    if (password.length < 8) errs.password = "Password must be at least 8 characters";
    if (!agreed) errs.agreed = "You must agree to the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {


    if (!validate()) return;
    setLoading(true);

    const data = await axios.post(url + "/register" , {
      name ,
      email ,
      password ,
    })
    console.log("data from register page" , data) ;
    if(data.status !== 200){
      setLoading(false);
      return ;
    }

    dispatch(setUser({user : data.data.savedUser , token : data.data.token})) ;
    cookieStore.set("token" , data.data.token) ;
    Navigate("/dashboard") ;
    setLoading(false);

    toast.success("Account created! Welcome to SmartNotes 🎉");

  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex flex-col w-[42%] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-primary to-indigo-700" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(45deg, white 25%, transparent 25%, transparent 75%, white 75%), linear-gradient(45deg, white 25%, transparent 25%)", backgroundSize: "20px 20px", backgroundPosition: "0 0, 10px 10px" }} />
        <div className="relative z-10 p-12 flex flex-col h-full">
          <button onClick={() => Navigate("/")} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium mb-16 w-fit">
            <Sparkles className="w-4 h-4" /> SmartNotes
          </button>
          <div className="flex-1 flex flex-col justify-center">
            <h2 className="font-display text-[2.4rem] font-extrabold text-white leading-tight mb-5 tracking-tight">
              Start organizing<br />in minutes.
            </h2>
            <p className="text-white/70 text-base mb-10">Free forever for individuals. No credit card required.</p>
            <div className="grid grid-cols-2 gap-3">
              {[["📝", "Rich Editor"], ["📋", "Kanban Board"], ["📊", "Analytics"], ["🔒", "Secure & Private"]].map(([emoji, label]) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="text-2xl mb-2">{emoji}</div>
                  <div className="text-white text-sm font-semibold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-background overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[380px] py-8">
          <button onClick={() => Navigate("/")} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          <div className="mb-7">
            <h1 className="font-display text-2xl font-extrabold text-foreground mb-1.5">Create your account</h1>
            <p className="text-muted-foreground text-sm">Free forever — no credit card required</p>
          </div>

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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Full name</label>
              <Input value={name} onChange={setName} placeholder="Alex Johnson" icon={<User className="w-4 h-4" />} />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
              <Input value={email} onChange={setEmail} placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Password</label>
              <div className="relative">
                <Input value={password} onChange={setPassword} type={showPw ? "text" : "password"}
                  placeholder="Min. 8 characters" icon={<Lock className="w-4 h-4" />} />
                <button onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              {password.length > 0 && (
                <div className="mt-2.5 space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className={cn("h-1 flex-1 rounded-full transition-all duration-300",
                        s <= strength ? strengthConfig[strength].color : "bg-border")} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Password strength: <span className="font-semibold text-foreground">{strengthConfig[strength].label}</span>
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className="flex items-start gap-2.5 cursor-pointer">
                <div className={cn("w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 transition-all flex-shrink-0",
                  agreed ? "bg-primary border-primary" : "border-muted-foreground/40")}
                  onClick={() => setAgreed(!agreed)}>
                  {agreed && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-destructive mt-1">{errors.agreed}</p>}
            </div>
            <Btn variant="primary" onClick={handleRegister} disabled={loading} className="w-full justify-center py-2.5">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account…</>
                : "Create free account"
              }
            </Btn>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button onClick={() => Navigate("/login")} className="text-primary font-semibold hover:underline">Sign in</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}