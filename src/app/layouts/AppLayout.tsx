import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { cn } from "../components/ui/utils";
import TopNav from "../components/TopNav";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import type { Note, Task } from "../types/types";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../slices/UserSlice";

interface Notification {
  id: string;
  type: "note" | "task" | "system";
  message: string;
  time: string;
  read: boolean;
}
 

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  useEffect(()=>{
    if(isDark){
      document.documentElement.classList.add("dark");
    }else{
      document.documentElement.classList.remove("dark");
    }
  },[isDark]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar  isDark={isDark} setIsDark={setIsDark}
        isOpen={sidebarOpen} setIsOpen={setSidebarOpen}
        collapsed={collapsed} setCollapsed={setCollapsed}
        notes={notes} tasks={tasks} />
      <div className={cn("transition-all duration-300", collapsed ? "lg:pl-[68px]" : "lg:pl-60")}>
        <TopNav  setIsSidebarOpen={setSidebarOpen}
          notifications={notifications} setNotifications={setNotifications} />
        <main>
          <AnimatePresence mode="wait">
            <motion.div key={Math.random()} className="p-4 sm:p-6 lg:p-8"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: "easeOut" }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
