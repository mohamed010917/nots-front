import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Badge, Btn, ConfirmDialog } from "../components/ui/UI";
import {
  ChevronLeft,
  Copy,
  Edit3,
  Pin,
  Share2,
  Trash2,
  CheckCircle2,
  Hash,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";

const fmtDate = (d?: string) => {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getCategoryBadge = () =>
  "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";

const getStatusBadge = (status?: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
    case "archived":
      return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
  }
};

export default function ShowNots() {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const token = useSelector((state: any) => state.user.token) ;

  useEffect(() => {
    if (!id) return;
    console.log(id) ;

    const fetchNote = async () => {
      try {
        const response = await axios.get("https://express-lilac-xi-96.vercel.app/api/notes/" + id ,{
            headers : {
                Authorization : `Bearer ${token}`
            }
        }) ;
        if (response.status !== 200) {
          throw new Error("Failed to fetch note");
        }

        
        setNote(response.data.note);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
 const res = await axios.delete(`https://express-lilac-xi-96.vercel.app/api/notes/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (res.status !== 200) {
      toast.error("Failed to delete note");
      return;
    }
    navigate("/notes") ;
    toast.success("Note deleted");
  };

  const renderContent = (text = "") =>
    text.split("\n").map((line, i) => {
      if (line.startsWith("## "))
        return (
          <h2
            key={i}
            className="font-display text-2xl font-bold text-foreground mt-8 mb-3"
          >
            {line.slice(3)}
          </h2>
        );

      if (line.startsWith("### "))
        return (
          <h3
            key={i}
            className="font-display text-lg font-bold text-foreground mt-5 mb-2"
          >
            {line.slice(4)}
          </h3>
        );

      if (line.startsWith("```")) return null;

      if (line.startsWith("> "))
        return (
          <blockquote
            key={i}
            className="border-l-4 border-primary/50 pl-5 my-4 text-muted-foreground italic text-sm leading-relaxed"
          >
            {line.slice(2)}
          </blockquote>
        );

      if (line.startsWith("- [ ] "))
        return (
          <div key={i} className="flex items-center gap-2.5 py-1.5">
            <div className="w-4 h-4 border-2 border-muted-foreground/30 rounded flex-shrink-0" />
            <span className="text-sm text-foreground">
              {line.slice(6)}
            </span>
          </div>
        );

      if (line.startsWith("- [x] "))
        return (
          <div key={i} className="flex items-center gap-2.5 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-sm text-muted-foreground line-through">
              {line.slice(6)}
            </span>
          </div>
        );

      if (line.startsWith("- "))
        return (
          <li key={i} className="text-sm ml-5 list-disc py-1">
            {line.slice(2)}
          </li>
        );

      if (!line.trim()) return <div key={i} className="h-3" />;

      const html = line
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(
          /`(.*?)`/g,
          '<code class="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">$1</code>'
        );

      return (
        <p
          key={i}
          className="text-sm leading-loose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    });

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!note) {
    return <div className="p-10 text-center">Note not found.</div>;
  }

  const words = note.content?.split(/\s+/).filter(Boolean).length || 0;

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-8">
      <ConfirmDialog
        open={confirmDelete}
        title="Delete this note?"
        description="This note will be permanently deleted and cannot be recovered."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <div className="flex items-center gap-2 mb-6">
        <Btn variant="ghost" size="sm" onClick={() => navigate("/notes")}>
          <ChevronLeft className="w-4 h-4" />
          All Notes
        </Btn>

        <div className="ml-auto flex gap-2">
          <Btn
            variant="outline"
            size="sm"
            onClick={() => navigate(`/notes/edit/${note._id}`)}
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Btn>

          <Btn
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(note.content || "");
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="w-4 h-4" />
          </Btn>

          <Btn variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Btn>

          <Btn
            variant="danger"
            size="sm"
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Btn>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <article className="bg-card border rounded-2xl overflow-hidden">
            <div
              className="h-2"
              style={{
                background: `linear-gradient(90deg,#3b82f6,#60a5fa)`,
              }}
            />

            <div className="p-8">
              <div className="mb-6">
                <div className="flex gap-2 flex-wrap mb-3">
                  <Badge className={getCategoryBadge()}>
                    {note.category}
                  </Badge>

                  <Badge className={getStatusBadge(note.status)}>
                    {note.status}
                  </Badge>

                  {note.isPinned && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-500">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold mb-2">
                  {note.title}
                </h1>

                <p className="text-sm text-muted-foreground">
                  Updated {fmtDate(note.updatedAt)} · {words} words
                </p>
              </div>

              <div className="border-t pt-6">
                {renderContent(note.content)}
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-4">
          <div className="bg-card border rounded-xl p-5">
            <h3 className="font-bold mb-4">Note Details</h3>

            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt>Created</dt>
                <dd>{fmtDate(note.createdAt)}</dd>
              </div>

              <div className="flex justify-between">
                <dt>Updated</dt>
                <dd>{fmtDate(note.updatedAt)}</dd>
              </div>

              <div className="flex justify-between">
                <dt>Category</dt>
                <dd>{note.category}</dd>
              </div>

              <div className="flex justify-between">
                <dt>Status</dt>
                <dd>{note.status}</dd>
              </div>

              <div className="flex justify-between">
                <dt>Words</dt>
                <dd>{words}</dd>
              </div>
            </dl>
          </div>

          {note.tags?.length > 0 && (
            <div className="bg-card border rounded-xl p-5">
              <h3 className="font-bold mb-3">Tags</h3>

              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-lg text-xs"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}