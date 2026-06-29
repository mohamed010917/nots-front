import { Bell, CheckSquare, FileText, Menu, Plus, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Btn, Input } from "./ui/UI";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "./ui/utils";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logout from "../pages/Logout";


interface Notification {
  id: string;
  type: "note" | "task" | "system";
  message: string;
  time: string;
  read: boolean;
}

export default function TopNav({
   setIsSidebarOpen, notifications, setNotifications
}: {
 
  setIsSidebarOpen: (v: boolean) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}) {
  const [search, setSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter(n => !n.read).length;
  const notifRef = useRef<HTMLDivElement>(null);

  const user = useSelector((state: any) => state.user.user);
  const navigate = useNavigate() ;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
    };
    document.addEventListener("mousedown", handler);
  
    console.log("user in topnav", user);
    
    return () => document.removeEventListener("mousedown", handler);

  }, [user]);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

//loading
if(!user){
    return (
        <div></div>
    )
}

  return (
    <header className="h-14 bg-card/80 backdrop-blur-xl border-b border-border flex items-center px-4 gap-3 sticky top-0 z-30">
      <button className="lg:hidden p-2 hover:bg-accent rounded-lg text-muted-foreground transition-colors"
        onClick={() => setIsSidebarOpen(true)}>
        <Menu className="w-5 h-5" />
      </button>




 
      <div className="flex-1 flex items-center gap-2"></div>
      <div className="hidden lg:flex items-center gap-2">
        <span className="text-sm text-muted-foreground dark:text-white text-3xl">{user?.name}</span>
            
            {
                user ? user.image && (
                    <img src={user.image} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
                ) : ""
            }
            <Logout />
      </div>
    </header>
   
 
  );
}
