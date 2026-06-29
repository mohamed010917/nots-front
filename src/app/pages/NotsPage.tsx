import { useEffect, useMemo, useState } from "react";
import type { Note, NoteStatus } from "../types/types";
import {  Badge, Btn, ConfirmDialog, Input, NoteCardSkeleton, Pagination } from "../components/ui/UI";
import { motion, AnimatePresence } from "motion/react";
import {  Check, ChevronDown, Edit3, FileText, Grid, List, MoreHorizontal, Pin, Plus, Search, Share2, SlidersHorizontal, Trash2 } from "lucide-react";
import { cn } from "../components/ui/utils";
import { toast } from "sonner";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const getStatusBadge = (s: NoteStatus) => ({
  active: "bg-green-100 text-green-700 dark:bg-green-950/60 dark:text-green-300",
  draft: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  archived: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
  deleted: "bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300",
}[s]);


const getCategoryBadge = (cat: string) => {
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

const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });




export default function NotsPage() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("updated");
  const [showSortDd, setShowSortDd] = useState(false);
  const [page, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [notes , setNotes] = useState<Note[]>([]); ;
  const CATEGORIES = ["All", "Work", "Personal", "Development", "Design", "Research"];
  const NOTES_PER_PAGE = 6;
  const token = useSelector((state: any) => state.user.token);
  const navigate = useNavigate() ;
  useEffect(() => {
    const getNots = async()=>{

      const nots = await axios.post("https://express-lilac-xi-96.vercel.app/api/notes/getNotes" ,{},{
        headers : {
          Authorization : `Bearer ${token}`
        }
      }) ;
      setNotes(nots.data.notes) ;
      console.log("nots from nots page" , nots) ;
    }
    getNots() ;
    return ;
  },[])
  
  // Debounce
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => { setDebouncedSearch(search); setLoading(false); }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, category, status, sortBy]);

  const filtered = useMemo(() => notes
    .filter(n => category === "All" || n.category === category)
    .filter(n => status === "All" || n.status === status)
    .filter(n => !debouncedSearch || n.title.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.content.toLowerCase().includes(debouncedSearch.toLowerCase()) || n.tags.some(t => t.includes(debouncedSearch.toLowerCase())))
    .sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      if (sortBy === "updated") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === "created") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.title.localeCompare(b.title);
    }),
    [notes, category, status, debouncedSearch, sortBy]
  );

  const totalPages = Math.ceil(filtered.length / NOTES_PER_PAGE);
  const paginated = filtered.slice((page - 1) * NOTES_PER_PAGE, page * NOTES_PER_PAGE);



  const doDelete = async (id: string) => {
    const res = await axios.delete(`https://express-lilac-xi-96.vercel.app/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status !== 200) {
      toast.error("Failed to delete note");
      return;
    }

    setNotes(prev => prev.filter(n => n._id !== id));
    setConfirmDelete(null);
    toast.success("Note deleted");
  };

  const sortLabels: Record<string, string> = { updated: "Recently Updated", created: "Date Created", title: "Title A–Z" };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete this note?"
        description="This action cannot be undone. The note and all its content will be permanently removed."
        onConfirm={() => confirmDelete && doDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-extrabold text-foreground">My Notes</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{notes.length} total · {filtered.length} matching</p>
        </div>
        <Btn onClick={()=>navigate("/nots/add")} variant="primary"  size="sm">
          <Plus className="w-4 h-4" /> New Note
        </Btn>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="flex-1 max-w-sm">
          <Input value={search} onChange={setSearch} placeholder="Search notes, tags…" icon={<Search className="w-4 h-4" />} />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="text-sm border border-border rounded-lg px-3 py-2 bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring/60">
            {["All", "active", "draft", "archived"].map(s => (
              <option key={s} value={s}>{s === "All" ? "All Status" : s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <div className="relative">
            <button onClick={() => setShowSortDd(!showSortDd)}
              className="flex items-center gap-1.5 text-sm border border-border rounded-lg px-3 py-2 bg-input-background text-foreground hover:bg-accent transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">{sortLabels[sortBy]}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <AnimatePresence>
              {showSortDd && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full mt-1 right-0 bg-card border border-border rounded-xl shadow-xl z-20 min-w-[175px] py-1.5 overflow-hidden">
                  {Object.entries(sortLabels).map(([val, label]) => (
                    <button key={val} onClick={() => { setSortBy(val); setShowSortDd(false); }}
                      className={cn("w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-accent transition-colors",
                        sortBy === val ? "text-primary font-semibold" : "text-foreground")}>
                      {sortBy === val && <Check className="w-3.5 h-3.5" />}
                      {sortBy !== val && <span className="w-3.5" />}
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex border border-border rounded-lg overflow-hidden">
            {(["grid", "list"] as const).map(mode => (
              <button key={mode} onClick={() => setViewMode(mode)}
                className={cn("p-2 transition-colors", viewMode === mode ? "bg-primary text-primary-foreground" : "bg-input-background text-muted-foreground hover:bg-accent")}>
                {mode === "grid" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map(cat => (
          <motion.button key={cat} onClick={() => { setCategory(cat); setCurrentPage(1); }}
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className={cn("flex-shrink-0 px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all",
              category === cat ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20" : "bg-card border border-border text-muted-foreground hover:bg-accent hover:text-foreground")}>
            {cat}
            {cat !== "All" && <span className="ml-1.5 opacity-60 text-xs">{notes.filter(n => n.category === cat).length}</span>}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className={cn(viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2")}>
          {[...Array(6)].map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      ) : paginated.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-28 text-center">
          <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mb-5">
            <FileText className="w-9 h-9 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">No notes found</h3>
          <p className="text-muted-foreground text-sm mb-7 max-w-xs">
            {debouncedSearch ? `No results for "${debouncedSearch}". Try different keywords.` : "Create your first note to get started."}
          </p>
          <Btn  onClick={()=>navigate("/nots/add")} variant="primary" ><Plus className="w-4 h-4" /> New Note</Btn>
        </motion.div>
      ) : (
        <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}>
          {paginated.map((note, i) => (
            <motion.div  key={note._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ delay: i * 0.03 }}
              onClick={()=> navigate("/notes/" + note._id)} 
              className={cn(
                "group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer relative",
                viewMode === "list" ? "flex items-center gap-4 p-4" : "p-5"
              )}
              >

              {viewMode === "grid" ? (
                <>
                  <div className="w-full h-1.5 rounded-full mb-4 opacity-90" style={{ background: `linear-gradient(90deg, ${note.color}, ${note.color}99)` }} />
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      {note.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
                      <h3 className="font-display font-bold text-foreground text-sm leading-snug line-clamp-2">{note.title}</h3>
                    </div>
                    <div className="relative flex-shrink-0">
                      <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === note._id ? null : note._id); }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-accent rounded-lg transition-all text-muted-foreground hover:text-foreground">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      <AnimatePresence>
                        {openMenu === note._id && (
                          <motion.div initial={{ opacity: 0, scale: 0.95, y: 4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 4 }}
                            className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-xl z-10 py-1.5 w-44 overflow-hidden"
                            onClick={e => e.stopPropagation()}>
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                              onClick={()=> navigate("/notes/edit/" + note._id)}>
                              <Edit3  className="w-3.5 h-3.5 text-muted-foreground" /> Edit note
                            </button>
              
                            <div className="my-1 h-px bg-border mx-2" />
                            <button className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                              onClick={() => { setConfirmDelete(note._id); setOpenMenu(null); }}>
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                    {note.content.replace(/[#*`\[\]>-]/g, "").replace(/\n+/g, " ").slice(0, 110)}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    <Badge className={getCategoryBadge(note.category)}>{note.category}</Badge>
                    <Badge className={getStatusBadge(note.status)}>{note.status}</Badge>
                    {note.tags.slice(0, 1).map(t => (
                      <span key={t} className="text-[10px] text-muted-foreground font-mono">#{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground/70 pt-2.5 border-t border-border">
                    <span>{fmtDateShort(note.updatedAt)}</span>
                    <span>{note.content.split(/\s+/).filter(Boolean).length} words</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-1.5 h-14 rounded-full flex-shrink-0" style={{ background: note.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {note.isPinned && <Pin className="w-3 h-3 text-amber-500 flex-shrink-0" />}
                      <h3 className="font-display font-semibold text-foreground text-sm truncate">{note.title}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{note.content.replace(/[#*`\[\]>-]/g, "").slice(0, 80)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className={getCategoryBadge(note.category)}>{note.category}</Badge>
                    <span className="text-xs text-muted-foreground hidden md:block">{fmtDateShort(note.updatedAt)}</span>
                    <button onClick={e => { e.stopPropagation(); setConfirmDelete(note._id); }}
                      className="p-1.5 hover:bg-destructive/10 hover:text-destructive rounded-lg text-muted-foreground transition-colors opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}