
export type NoteStatus = "active" | "archived" | "deleted";
export type TaskStatus = "todo" | "in-progress" | "done" | "review";
export type Priority = "low" | "medium" | "high" | "urgent";

export type Theme = "light" | "dark" | "system";


export interface Note {
  _id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  status: NoteStatus;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  dueTime: string;
  priority: Priority;
  status: TaskStatus;
  category: string;
  labels: string[];
  progress: number;

}

export interface Notification {
  id: string;
  type: "note" | "task" | "system";
  message: string;
  time: string;
  read: boolean;
}



