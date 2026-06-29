
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle2,
  Pin,
  Plus,
  Flag,
  Target,
  Zap,
  Clock,
} from "lucide-react";
import {
  Btn,
  NoteCardSkeleton,
  Skeleton,
  StatCard,
} from "../components/ui/UI";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

interface Stats {
  notesCount: number;
  completedNotesCount: number;
  pendingNotesCount: number;
  tasksCount: number;
  completedTasksCount: number;
  pendingTasksCount: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const token = useSelector((state: any) => state.user.token);
  const user = useSelector((state: any) => state.user.user);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "https://express-lilac-xi-96.vercel.app/api/users/statistics",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStats(data);
      } catch (error) {
        console.error("Failed to fetch user stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const totalItems =
    (stats?.notesCount ?? 0) + (stats?.tasksCount ?? 0);

  const completedItems =
    (stats?.completedNotesCount ?? 0) +
    (stats?.completedTasksCount ?? 0);

  const pendingItems =
    (stats?.pendingNotesCount ?? 0) +
    (stats?.pendingTasksCount ?? 0);

  const notesPercentage =
    totalItems > 0
      ? Math.round(((stats?.notesCount ?? 0) / totalItems) * 100)
      : 0;

  const tasksPercentage =
    totalItems > 0
      ? Math.round(((stats?.tasksCount ?? 0) / totalItems) * 100)
      : 0;

  const notesCompletion =
    (stats?.notesCount ?? 0) > 0
      ? Math.round(
          ((stats?.completedNotesCount ?? 0) /
            (stats?.notesCount ?? 1)) *
            100
        )
      : 0;

  const tasksCompletion =
    (stats?.tasksCount ?? 0) > 0
      ? Math.round(
          ((stats?.completedTasksCount ?? 0) /
            (stats?.tasksCount ?? 1)) *
            100
        )
      : 0;

  const productivity =
    totalItems > 0
      ? Math.round((completedItems / totalItems) * 100)
      : 0;

  const cards = [
    {
      label: "Total Notes",
      value: stats?.notesCount ?? 0,
      subValue: `${notesPercentage}% of all items`,
      icon: <FileText className="w-5 h-5 text-indigo-500" />,
      color:
        "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40",
      trend: `${notesPercentage}%`,
    },
    {
      label: "Total Tasks",
      value: stats?.tasksCount ?? 0,
      subValue: `${tasksPercentage}% of all items`,
      icon: <Target className="w-5 h-5 text-sky-500" />,
      color:
        "bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-950/40 dark:to-sky-900/40",
      trend: `${tasksPercentage}%`,
    },
    {
      label: "Completed Notes",
      value: stats?.completedNotesCount ?? 0,
      subValue: `${notesCompletion}% completed`,
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      color:
        "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/40",
    },
    {
      label: "Completed Tasks",
      value: stats?.completedTasksCount ?? 0,
      subValue: `${tasksCompletion}% completed`,
      icon: <Flag className="w-5 h-5 text-emerald-500" />,
      color:
        "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/40",
    },
    {
      label: "Pending Items",
      value: pendingItems,
      subValue: `${pendingItems} waiting`,
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      color:
        "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/40 dark:to-amber-900/40",
    },
    {
      label: "Productivity",
      value: `${productivity}%`,
      subValue: `${completedItems}/${totalItems} completed`,
      icon: <Zap className="w-5 h-5 text-pink-500" />,
      color:
        "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/40 dark:to-pink-900/40",
      trend: `${productivity}%`,
    },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <NoteCardSkeleton key={i} />
          ))}
        </div>

        <Skeleton className="h-52 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {user?.name} 👋
          </h1>

          <p className="text-muted-foreground mt-1">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="flex gap-2">
          <Btn
            variant="outline"
            onClick={() => navigate("/tasks")}
          >
            <Flag className="w-4 h-4" />
            Tasks
          </Btn>

          <Btn
            variant="primary"
            onClick={() => navigate("/nots/add")}
          >
            <Plus className="w-4 h-4" />
            New Note
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {cards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.08,
            }}
            whileHover={{
              y: -6,
              scale: 1.02,
            }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="rounded-2xl border bg-card p-6">
          <div className="flex justify-between mb-3">
            <span className="font-medium">
              Notes Completion
            </span>
            <span>{notesCompletion}%</span>
          </div>

          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-700"
              style={{
                width: `${notesCompletion}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex justify-between mb-3">
            <span className="font-medium">
              Tasks Completion
            </span>
            <span>{tasksCompletion}%</span>
          </div>

          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-700"
              style={{
                width: `${tasksCompletion}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="flex justify-between mb-3">
            <span className="font-medium">
              Productivity
            </span>
            <span>{productivity}%</span>
          </div>

          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-pink-500 rounded-full transition-all duration-700"
              style={{
                width: `${productivity}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}


