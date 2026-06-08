"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { ProjectWithTasks } from "@/types";
import type { Lane, TaskStatus } from "@prisma/client";

export async function getTasks(): Promise<ProjectWithTasks[]> {
  return prisma.project.findMany({
    include: {
      tasks: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function createProject(
  name: string,
  key: string,
  color: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!name.trim() || !key.trim())
      return { success: false, error: "Nome e chave são obrigatórios" };

    const slug = key
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    await prisma.project.create({
      data: { name: name.trim(), key: slug, color },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { success: false, error: "Já existe um projeto com essa chave" };
    }
    return { success: false, error: "Falha ao criar projeto" };
  }
}

export async function deleteProject(
  projectId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.project.delete({ where: { id: projectId } });
    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Falha ao excluir projeto" };
  }
}

export async function createTask(
  projectId: string,
  lane: Lane,
  text: string,
  dueDate?: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!text.trim()) return { success: false, error: "Text is required" };

    await prisma.task.create({
      data: {
        text: text.trim(),
        lane,
        projectId,
        status: "TODO",
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status },
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateTaskText(
  taskId: string,
  text: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!text.trim()) return { success: false, error: "Text is required" };

    await prisma.task.update({
      where: { id: taskId },
      data: { text: text.trim() },
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(
  taskId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.task.delete({ where: { id: taskId } });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete task" };
  }
}

export async function updateTaskDueDate(
  taskId: string,
  dueDate: string | null,
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { dueDate: dueDate ? new Date(dueDate) : null },
    });

    revalidatePath("/");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update due date" };
  }
}
