import { CheckSquare, FileText, Flag, Home, Moon, PanelLeftClose, PanelLeftOpen, PenLine, Sparkles, Sun, User, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "./ui/utils";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "notes", label: "Notes", icon: FileText },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "profile", label: "Profile", icon: User },
];


interface Notification {
  id: string;
  type: "note" | "task" | "system";
  message: string;
  time: string;
  read: boolean;
}
 
const INIT_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "task", message: "Task \"Ship Stripe integration\" marked as done", time: "2h ago", read: false },
  { id: "n2", type: "note", message: "Your note \"Product Roadmap Q3\" was updated", time: "4h ago", read: false },
  { id: "n3", type: "system", message: "Weekly productivity report is ready to view", time: "1d ago", read: false },
  { id: "n4", type: "task", message: "Task \"Fix auth bug #342\" is due tomorrow", time: "1d ago", read: true },
  { id: "n5", type: "note", message: "5 notes archived this month", time: "3d ago", read: true },
];

export default function Sidebar({
 isDark, setIsDark, isOpen, setIsOpen, collapsed, setCollapsed, notes, tasks
}: {
  isDark: boolean;
  setIsDark: (v: boolean) => void; isOpen: boolean; setIsOpen: (v: boolean) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void; notes: any[]; tasks: any[];
}) {
  const unread = INIT_NOTIFICATIONS.filter(n => !n.read).length;
  const navigate = useNavigate() ;
  const user = useSelector((state: any) => state.user.user);
  return (
    <>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)} />
      )}
      <aside className={cn(
        "fixed top-0 left-0 h-full bg-sidebar border-r border-sidebar-border z-50 flex flex-col transition-all duration-300",
        collapsed ? "w-[68px]" : "w-60",
        "lg:translate-x-0 lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn("flex items-center border-b border-sidebar-border h-14 flex-shrink-0 px-4", collapsed ? "justify-center" : "gap-2.5")}>
          <motion.div whileHover={{ rotate: 10 }} className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-primary/30">
            <Sparkles className="w-4 h-4 text-primary-foreground" />
          </motion.div>
          {!collapsed && (
            <span className="font-display font-bold text-[15px] text-sidebar-foreground tracking-tight">SmartNotes</span>
          )}
          {!collapsed && (
            <button className="ml-auto lg:hidden text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
           
          
            return (
              <button key={item.id}
               onClick={() => navigate(`/${item.id}`)}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "w-full flex items-center rounded-lg text-sm font-medium transition-all duration-150 relative",
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5", "text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}>
                
                <Icon className={cn("w-4 h-4 flex-shrink-0")} />
                {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
               

              </button>
            );
          })}

          {!collapsed && (
            <>
              <div className="pt-5 pb-1.5 px-3">
                <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Quick Add</p>
              </div>
              <button onClick={()=> navigate("/nots/add")}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all">
                <PenLine className="w-4 h-4" /> New Note
              </button>
       
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={cn("px-2 py-3 border-t border-sidebar-border space-y-1 flex-shrink-0", collapsed ? "items-center" : "")}>
          <button onClick={() => setIsDark(!isDark)} title={isDark ? "Light mode" : "Dark mode"}
            className={cn("w-full flex items-center rounded-lg text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5")}>
            {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
            {!collapsed && (isDark ? "Light Mode" : "Dark Mode")}
          </button>
          <button
            onClick={() => setCollapsed(!collapsed)}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn("w-full hidden lg:flex items-center rounded-lg text-sm font-medium text-sidebar-foreground/65 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-all",
              collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2.5")}>
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            {!collapsed && "Collapse"}
          </button>
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
              <div >
                <img src={user.image} alt="no" className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm"/>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{user ? user.name : ""}</p>
                <p className="text-[11px] text-muted-foreground truncate">Pro Plan</p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}