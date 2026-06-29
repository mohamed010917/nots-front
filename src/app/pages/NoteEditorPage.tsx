import { use, useEffect, useState } from "react";
import type { Note, NoteStatus } from "../types/types";
import { cn } from "../components/ui/utils";
import { motion, AnimatePresence } from "motion/react";
import { Archive, Badge, Bookmark, CheckCircle2, ChevronLeft, Code, Eye, Hash, Pin, Save, X } from "lucide-react";

import { Btn, Textarea } from "../components/ui/UI";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Select from "../components/ui/Select";
import axios from "axios";
import { useSelector } from "react-redux";


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


export default function NoteEditorPage() {
  const [editNote, setEditNote] = useState<Note | null>(null);
  const {id} = useParams() ;
  const token = useSelector((state: any) => state.user.token);
  const [title, setTitle] = useState(editNote?.title || "");
  const [content, setContent] = useState(editNote?.content || "## Start writing\n\nUse **bold**, *italic*, `code`, and more.\n\n- Bullet one\n- Bullet two\n\n> Important quote here\n\n```\ncode block\n```");
  const [category, setCategory] = useState(editNote?.category || "Work");
  const [status, setStatus] = useState<NoteStatus>(editNote?.status || "active");
  const [tags, setTags] = useState<string[]>(editNote?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [isPinned, setIsPinned] = useState(editNote?.isPinned || false);
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isEdit, setIsEdit] = useState(!!editNote);
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string>("");

    useEffect(()=>{
    if(id){
      const fetchNote = async () => {
        try{
          const res = await axios.get(`http://localhost:5000/api/notes/${id}`, {
            headers: {
              authorization: "Bearer " + token,
              contentType: "application/json",
            }
          });
          console.log("Fetched note data:", res.data);
          setEditNote(res.data.note);

        }catch(err){
          console.error(err);
          toast.error("Failed to fetch note data.");
        }
      };
      fetchNote();
  
    }
  },[id ]);

  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title);
      setContent(editNote.content);
      setCategory(editNote.category);
      setStatus(editNote.status);
      setTags(editNote.tags);
      setIsPinned(editNote.isPinned);
      setIsEdit(true);
    }
  }, [editNote]);
  useEffect(() => {
    setWordCount(content.split(/\s+/).filter(Boolean).length);
  }, [content]);

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-");
    if (t && !tags.includes(t)) { setTags(p => [...p, t]); setTagInput(""); }
  };


  const handleSave = async () => {
    if(id){
      await handelUpdate();
    }else{
      await handelAdd();
    }
  };

  const handelAdd = async () => {
        try{

      setSaving(true);
      const noteData = { title, content, category, status, tags, isPinned };
      let res = await axios.post("http://localhost:5000/api/notes/addNote", noteData, {
        headers :{
          authorization : "Bearer " + token ,
          contentType: "application/json" ,
  
        }
      }) 
      console.log(res);
      
      if(res){
        toast.success("Note saved successfully!");
        navigate("/notes");
      }else{
        setErrors("Failed to save note. Please try again.");
        toast.error("Failed to save note. Please try again.");
      }
      setSaving(false);
    }catch(err){
      console.error(err);
      setErrors("An error occurred while saving the note.");
      toast.error("An error occurred while saving the note.");
      setSaving(false);
      setTimeout(() => setErrors(""), 5000); // Clear error after 5 seconds
    }
  }

  const handelUpdate = async () => {
    try{
      setSaving(true);
      const noteData = { title, content, category, status, tags, isPinned };
      let res = await axios.put(`http://localhost:5000/api/notes/${id}`, noteData, {
        headers :{
          authorization : "Bearer " + token ,
          contentType: "application/json" ,
  
        }
      }) 
      console.log(res);
      
      if(res){
        toast.success("Note updated successfully!");
        navigate("/notes");
      }else{
        setErrors("Failed to update note. Please try again.");
        toast.error("Failed to update note. Please try again.");
      }
      setSaving(false);
    }catch(err){
      console.error(err);
      setErrors("An error occurred while updating the note.");
      toast.error("An error occurred while updating the note.");
      setSaving(false);
      setTimeout(() => setErrors(""), 5000); // Clear error after 5 seconds
    }
  }

  const renderPreview = (text: string) => text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return <h2 key={i} className="font-display text-xl font-bold text-foreground mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith("### ")) return <h3 key={i} className="font-display text-base font-bold text-foreground mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith("```")) return null;
    if (line.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-primary/40 pl-4 my-3 text-sm text-muted-foreground italic">{line.slice(2)}</blockquote>;
    if (line.startsWith("- [ ] ")) return <div key={i} className="flex items-center gap-2 py-1"><div className="w-4 h-4 border-2 border-muted-foreground/30 rounded-sm flex-shrink-0" /><span className="text-sm text-foreground">{line.slice(6)}</span></div>;
    if (line.startsWith("- [x] ")) return <div key={i} className="flex items-center gap-2 py-1"><CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /><span className="text-sm text-muted-foreground line-through">{line.slice(6)}</span></div>;
    if (line.startsWith("- ")) return <li key={i} className="text-sm text-foreground/85 ml-4 py-0.5 list-disc leading-relaxed">{line.slice(2)}</li>;
    if (!line.trim()) return <div key={i} className="h-2.5" />;
    const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`);
    const italic = bold.replace(/\*(.*?)\*/g, (_, m) => `<em>${m}</em>`);
    return <p key={i} className="text-sm text-foreground/85 leading-relaxed" dangerouslySetInnerHTML={{ __html: italic }} />;
  });

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-background">
      {/* Toolbar */}
    
     <div  className={ errors ? "bg-red-100 text-red-800 p-2 text-sm ": "hidden"} >
        {errors }
      </div>
      <div className="h-12 border-b border-border bg-card/80 backdrop-blur-xl flex items-center px-4 gap-2 flex-shrink-0">
        <Btn variant="ghost" onClick={() => navigate("/notes")} size="xs">
          <ChevronLeft className="w-4 h-4" /> Notes
        </Btn>
        <div className="w-px h-5 bg-border mx-1" />
        <div className="flex items-center gap-0.5 bg-muted rounded-lg px-1 py-0.5">
          {[
            { icon: Code, title: "Code block" },
            { icon: Hash, title: "Heading" },
            { icon: Bookmark, title: "Bookmark" },
            { icon: Archive, title: "Archive" },
          ].map(({ icon: Icon, title }) => (
            <button key={title} title={title}
              className="p-1.5 hover:bg-card rounded text-muted-foreground hover:text-foreground transition-colors">
              <Icon className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-muted-foreground hidden sm:block">{wordCount} words</span>
          <button onClick={() => setPreview(!preview)}
            className={cn("flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all font-medium",
              preview ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:bg-accent")}>
            <Eye className="w-3.5 h-3.5" /> {preview ? "Edit" : "Preview"}
          </button>
          <Btn variant="primary" onClick={handleSave} disabled={saving} size="sm">
            {saving ? <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {saving ? "Saving…" : isEdit ? "Update" : "Save"}
          </Btn>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <input value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Note title…"
            className="w-full px-6 lg:px-10 pt-8 pb-3 text-[1.75rem] font-display font-extrabold text-foreground placeholder:text-muted-foreground/40 bg-transparent border-none outline-none tracking-tight" />
          <div className="flex items-center gap-2 px-6 lg:px-10 pb-4 border-b border-border">
            <Badge className={getCategoryBadge(category)}>{category}</Badge>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{isEdit ? "Editing" : "New"} · {new Date().toLocaleDateString()}</span>
            {isPinned && <><span className="text-xs text-muted-foreground">·</span><span className="text-xs text-amber-500 font-medium flex items-center gap-1"><Pin className="w-3 h-3" />Pinned</span></>}
          </div>
          <div className="flex-1 overflow-auto px-6 lg:px-10 py-6">
            {preview ? (
              <div className="max-w-2xl prose-sm">{renderPreview(content)}</div>
            ) : (
              <Textarea value={content} onChange={setContent} placeholder="Start writing your note…"
                rows={24} mono className="w-full border-none bg-transparent focus:ring-0 p-0 text-[13px] leading-7" />
            )}
          </div>
        </div>

        {/* Metadata panel */}
        <div className="hidden lg:flex w-72 border-l border-border bg-card flex-col flex-shrink-0">
          <div className="p-5 flex-1 overflow-y-auto">
            <h3 className="font-display font-bold text-sm text-foreground mb-4">Properties</h3>
            <div className="space-y-5">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Category</label>
                <Select value={category} onChange={setCategory} options={["Work", "Personal", "Development", "Design", "Research"]} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Status</label>
                <Select value={status} onChange={(v : any) => setStatus(v as NoteStatus)} options={["draft", "active", "archived"]} />
              </div>
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Tags</label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
                  {tags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-medium">
                      #{tag}
                      <button onClick={() => setTags(p => p.filter(t => t !== tag))} className="hover:text-destructive transition-colors ml-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-1.5">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    placeholder="Type and press Enter…"
                    className="flex-1 text-xs border border-border rounded-lg px-2.5 py-1.5 bg-input-background text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring" />
                  <button onClick={addTag} className="px-2.5 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:opacity-90 transition">+</button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">Pin Note</label>
                  <p className="text-xs text-muted-foreground mt-0.5">Show at top of list</p>
                </div>
                <button onClick={() => setIsPinned(!isPinned)}
                  className={cn("relative w-11 h-6 rounded-full transition-colors duration-200", isPinned ? "bg-primary" : "bg-muted border border-border")}>
                  <motion.div layout className={cn("absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                    isPinned ? "translate-x-[22px]" : "translate-x-1")} />
                </button>
              </div>
              <div className="pt-3 border-t border-border space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Characters</span>
                  <span className="font-semibold text-foreground font-mono">{content.length.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Words</span>
                  <span className="font-semibold text-foreground font-mono">{wordCount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Reading time</span>
                  <span className="font-semibold text-foreground font-mono">~{Math.max(1, Math.ceil(wordCount / 200))} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
