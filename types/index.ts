export interface Task {
  id: string;
  title: string;
  description: string | null;
  list: string;
  projectId: string | null;
  dueAt: string | null;
  reminderAt: string[];
  status: "pending" | "in_progress" | "done";
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  linkedRepos: string[];
  tasks: Task[];
  createdAt: string;
}

export interface Subscription {
  id: string;
  serviceName: string;
  plan: string | null;
  cost: number | null;
  renewalDate: string | null;
  remindDaysBefore: number;
  notes: string | null;
}
