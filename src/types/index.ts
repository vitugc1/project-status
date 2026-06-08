import type { Project, Task, TaskStatus, Lane } from "@prisma/client";

export type { TaskStatus, Lane };

export type TaskWithProject = Task & {
  project: Project;
};

export type ProjectWithTasks = Project & {
  tasks: Task[];
};

export type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; error: string };
