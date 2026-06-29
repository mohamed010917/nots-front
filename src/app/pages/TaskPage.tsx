import { toast } from "sonner";
import type { Priority, Task, TaskStatus } from "../types/types";
import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { Badge, ConfirmDialog, getCategoryBadge, ProgressBar } from "../components/ui/UI";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import { Trash2, MoreHorizontal, Clock, X, Pencil, Loader2 } from "lucide-react";
import { Btn, Input, Textarea } from "../components/ui/UI";
import { cn, getPriorityBadge, getPriorityDot } from "../components/ui/utils";
import Select from "../components/ui/Select";
import axios from "axios";
import { useSelector } from "react-redux";

// ─── Types ────────────────────────────────────────────────────────────────────

/** Shape returned by the backend */
interface ApiTask {
  _id: string;
  title: string;
  content : string ;
  doIn: string;           // ISO date string
  isDone?: boolean;
  Priority?: BackendPriority;
  catgory?: BackendCategory;
  status?: TaskStatus;
  progress?: number;
  labels?: string[];
}

type BackendPriority = "low" | "medium" | "high" | "urgent";
type BackendCategory = "work" | "personal" | "shopping" | "other";

/** Shape used by the UI */
interface UITask {
  id: string;
  title: string;
  content : string ;

  doIn: string;           // YYYY-MM-DD
  isDone: boolean;
  priority: BackendPriority;
  category: BackendCategory;
  status: TaskStatus;
  progress: number;
  labels: string[];
}

interface NewTaskForm {
  title: string;
  doIn: string;
  content : string ;
  priority: BackendPriority;
  category: BackendCategory;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const API = "https://express-lilac-xi-96.vercel.app/api/tasks";

const toUITask = (t: ApiTask): UITask => ({
  id: t._id,
  title: t.title,
  content : t.content ?? "" ,

  doIn: t.doIn ? t.doIn.slice(0, 10) : "",
  isDone: t.isDone ?? false,
  priority: t.Priority ?? "medium",
  category: t.catgory ?? "work",
  status: t.status ?? "todo",
  progress: t.progress ?? 0,
  labels: t.labels ?? [],
});

const fmtDateShort = (d: string) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—";

// ─── Constants ────────────────────────────────────────────────────────────────

const COLUMNS: { id: TaskStatus; label: string; accent: string; bg: string; dot: string }[] = [
  { id: "todo",        label: "To Do",       accent: "text-slate-600 dark:text-slate-300", bg: "bg-slate-50 dark:bg-slate-900/30",   dot: "bg-slate-400" },
  { id: "in-progress", label: "In Progress", accent: "text-blue-600 dark:text-blue-300",   bg: "bg-blue-50 dark:bg-blue-950/30",     dot: "bg-blue-500"  },
  { id: "review",      label: "Review",      accent: "text-amber-600 dark:text-amber-300", bg: "bg-amber-50 dark:bg-amber-950/30",   dot: "bg-amber-500" },
  { id: "done",        label: "Done",        accent: "text-green-600 dark:text-green-300", bg: "bg-green-50 dark:bg-green-950/30",   dot: "bg-green-500" },
];

const PRIORITY_OPTIONS: BackendPriority[] = ["low", "medium", "high", "urgent"];
const CATEGORY_OPTIONS: BackendCategory[] = ["work", "personal", "shopping", "other"];

const EMPTY_FORM: NewTaskForm = {
  title: "",
  content: "",
  doIn: "",
  priority: "medium",
  category: "work",
};

// ─── Task Form Modal ──────────────────────────────────────────────────────────

interface TaskFormModalProps {
  title: string;
  form: NewTaskForm;
  loading: boolean;
  onChange: (patch: Partial<NewTaskForm>) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitLabel: string;
}

function TaskFormModal({ title, form, loading, onChange, onSubmit, onClose, submitLabel }: TaskFormModalProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-extrabold text-lg text-foreground">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Title *</label>
            <Input
              value={form.title}
              onChange={v => onChange({ title: v })}
              placeholder="What needs to be done?"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">content</label>
            <Textarea
              value={form.content}
              onChange={v => onChange({ content: v })}
              placeholder="Add context or details…"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Due Date *</label>
              <input
                type="date"
                value={form.doIn}
                min={new Date().toISOString().slice(0, 10)}
                onChange={e => onChange({ doIn: e.target.value })}
                className="w-full rounded-lg border border-border bg-input-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-foreground block mb-1.5">Priority</label>
              <Select
                value={form.priority}
                onChange={v => onChange({ priority: v as BackendPriority })}
                options={PRIORITY_OPTIONS}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-1.5">Category</label>
            <Select
              value={form.category}
              onChange={v => onChange({ category: v as BackendCategory })}
              options={CATEGORY_OPTIONS}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Btn variant="outline" onClick={onClose} className="flex-1 justify-center" disabled={loading}>
            Cancel
          </Btn>
          <Btn variant="primary" onClick={onSubmit} className="flex-1 justify-center" disabled={loading || !form.title.trim() || !form.doIn}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {submitLabel}
          </Btn>
        </div>
      </motion.div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function TasksPage() {
  const token = useSelector((state: any) => state.user.token);
  const authHeader = { Authorization: `Bearer ${token}` };

  const [tasks, setTasks] = useState<UITask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  // Drag state
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<TaskStatus | null>(null);

  // Modal state
  const [showAdd, setShowAdd] = useState(false);
  const [editTask, setEditTask] = useState<UITask | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Form state
  const [newForm, setNewForm] = useState<NewTaskForm>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<NewTaskForm>(EMPTY_FORM);

  // Per-action loading
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);

  // ── Fetch all tasks ──────────────────────────────────────────────────────────
  const fetchTasks = useCallback(async () => {
    setLoadingTasks(true);
    try {
      const { data } = await axios.get<ApiTask[]>(API, { headers: authHeader });
      setTasks(data.map(toUITask));
      console.log("Fetched tasks:", data);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to load tasks");
    } finally {
      setLoadingTasks(false);
    }
  }, [token]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // ── Create ───────────────────────────────────────────────────────────────────
  const addTask = async () => {
    if (!newForm.title.trim() || !newForm.doIn) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post<ApiTask>(
        API,
        {
          title:       newForm.title,
          content: newForm.content,
          doIn:        new Date(newForm.doIn).toString(),
          Priority:    newForm.priority,
          catgory:     newForm.category,
          status:      "todo",
          isDone:      false,
        },
        { headers: authHeader },
      );
      fetchTasks() ;
      setNewForm(EMPTY_FORM);
      setShowAdd(false);
      toast.success("Task added!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to add task");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update (edit) ────────────────────────────────────────────────────────────
  const saveEdit = async () => {
    if (!editTask || !editForm.title.trim() || !editForm.doIn) return;
    setSubmitting(true);
    try {
      const { data } = await axios.put<ApiTask>(
        `${API}/${editTask.id}`,
        {
          title:       editForm.title,
          content: editForm.content,
          doIn:        new Date(editForm.doIn).toISOString(),
          Priority:    editForm.priority,
          catgory:     editForm.category,
        },
        { headers: authHeader },
      );
      fetchTasks()
      setEditTask(null);
      toast.success("Task updated!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to update task");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Update status (drag & drop) ──────────────────────────────────────────────
  const updateStatus = async (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    setStatusUpdating(taskId);
    try {
      await axios.put(
        `${API}/${taskId}`,
        {
          status: newStatus,
          isDone: newStatus === "done",
        },
        { headers: authHeader },
      );
      toast.success(`Moved to ${COLUMNS.find(c => c.id === newStatus)?.label}`);
    } catch (err: any) {
      // Rollback on failure
      setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: task.status } : t));
      toast.error(err?.response?.data?.message ?? "Failed to move task");
    } finally {
      setStatusUpdating(null);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const deleteTask = async (id: string) => {
    setDeletingId(id);
    try {
      await axios.delete(`${API}/${id}`, { headers: authHeader });
      setTasks(prev => prev.filter(t => t.id !== id));
      setConfirmDelete(null);
      toast.success("Task deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to delete task");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Open edit modal ──────────────────────────────────────────────────────────
  const openEdit = (task: UITask) => {
    setEditTask(task);
    setEditForm({
      title:       task.title,
      content: task.content,
      doIn:        task.doIn,
      priority:    task.priority,
      category:    task.category,
    });
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const overallProgress = tasks.length
    ? Math.round(tasks.filter(t => t.status === "done").length / tasks.length * 100)
    : 0;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="p-5 lg:p-8  flex flex-col gap-4">

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this task?"
        description="This cannot be undone."
        onConfirm={() => confirmDelete && deleteTask(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        loading={!!deletingId}
      />

      {/* Add Task Modal */}
      <AnimatePresence>
        {showAdd && (
          <TaskFormModal
            title="New Task"
            form={newForm}
            loading={submitting}
            onChange={patch => setNewForm(p => ({ ...p, ...patch }))}
            onSubmit={addTask}
            onClose={() => { setShowAdd(false); setNewForm(EMPTY_FORM); }}
            submitLabel="Add Task"
          />
        )}
      </AnimatePresence>

      {/* Edit Task Modal */}
      <AnimatePresence>
        {editTask && (
          <TaskFormModal
            title="Edit Task"
            form={editForm}
            loading={submitting}
            onChange={patch => setEditForm(p => ({ ...p, ...patch }))}
            onSubmit={saveEdit}
            onClose={() => setEditTask(null)}
            submitLabel="Save Changes"
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-shrink-0">
        <div className="flex-1">
          <h2 className="font-display text-2xl font-extrabold text-foreground">Task Board</h2>
          <p className="text-sm text-muted-foreground">{tasks.length} tasks · {overallProgress}% complete</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5">
            <span>Overall:</span>
            <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${overallProgress}%` }} />
            </div>
            <span className="font-semibold text-foreground">{overallProgress}%</span>
          </div>
          <Btn variant="primary" size="sm" onClick={() => setShowAdd(true)}>
            <Plus className="w-4 h-4" /> Add Task
          </Btn>
        </div>
      </div>

      {/* Loading skeleton */}
      {loadingTasks ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        /* Board */
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-hidden min-h-0">
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.status === col.id);
            const done = colTasks.filter(t => t.progress === 100 || t.isDone).length;

            return (
              <div
                key={col.id}
                className={cn(
                  "flex flex-col rounded-2xl border border-border transition-all duration-150",
                  dragOver === col.id ? "border-primary/50 bg-primary/5 shadow-inner" : "bg-muted/30",
                )}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDrop={() => {
                  if (dragging) {
                    updateStatus(dragging, col.id);
                    setDragging(null);
                    setDragOver(null);
                  }
                }}
                onDragLeave={() => setDragOver(null)}
              >
                {/* Column header */}
                <div className="px-3.5 pt-3.5 pb-2.5 flex-shrink-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0", col.dot)} />
                    <h3 className={cn("font-display font-bold text-sm flex-1", col.accent)}>{col.label}</h3>
                    <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center", col.bg, col.accent)}>
                      {colTasks.length}
                    </span>
                  </div>
                  <ProgressBar
                    value={colTasks.length ? (done / colTasks.length) * 100 : 0}
                    color={col.id === "todo" ? "bg-slate-400" : col.id === "in-progress" ? "bg-blue-500" : col.id === "review" ? "bg-amber-500" : "bg-green-500"}
                  />
                </div>

                {/* Task cards */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-2 min-h-0">
                  <AnimatePresence>
                    {colTasks.map(task => (
                      <motion.div
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable={statusUpdating !== task.id}
                        onDragStart={() => setDragging(task.id)}
                        onDragEnd={() => { setDragging(null); setDragOver(null); }}
                        className={cn(
                          "bg-card border border-border rounded-xl p-3.5 cursor-grab active:cursor-grabbing group",
                          "hover:shadow-md hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-150",
                          dragging === task.id ? "opacity-40 rotate-1 scale-[1.02] shadow-xl" : "",
                          statusUpdating === task.id ? "opacity-60 pointer-events-none" : "",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-semibold text-foreground leading-snug flex-1">{task.title}</p>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                            <button
                              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                              title="Edit"
                              onClick={() => openEdit(task)}
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button
                              className="p-1 hover:bg-accent rounded text-muted-foreground hover:text-foreground transition-colors"
                              title="Delete"
                              onClick={() => setConfirmDelete(task.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {task.content && (
                          <p className="text-xs text-muted-foreground mb-2.5 leading-relaxed line-clamp-2">{task.content}</p>
                        )}

                        {task.progress > 0 && (
                          <div className="mb-2.5">
                            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                              <span>Progress</span><span className="font-semibold">{task.progress}%</span>
                            </div>
                            <ProgressBar value={task.progress} color={task.progress === 100 ? "bg-green-500" : "bg-primary"} />
                          </div>
                        )}

                        {task.labels.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2.5">
                            {task.labels.slice(0, 2).map(l => (
                              <span key={l} className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-[10px] font-medium">{l}</span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <Badge className={getPriorityBadge(task.priority)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", getPriorityDot(task.priority))} />
                            {task.priority}
                          </Badge>
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {fmtDateShort(task.doIn)}
                          </div>
                        </div>

                        <div className="mt-2 pt-2 border-t border-border">
                          <Badge className={cn(getCategoryBadge(task.category), "text-[10px]")}>{task.category}</Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {colTasks.length === 0 && dragOver !== col.id && (
                    <div className="flex flex-col items-center justify-center py-8 text-center opacity-60">
                      <div className="w-8 h-8 rounded-xl border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2">
                        <Plus className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-xs text-muted-foreground">Drop here</p>
                    </div>
                  )}

                  {dragOver === col.id && (
                    <div className="h-16 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 flex items-center justify-center">
                      <p className="text-xs text-primary font-medium">Drop to move here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TasksPage;