"use client";

import { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import type { Task } from "@prisma/client";
import type { Lane } from "@prisma/client";
import { TaskItem } from "./task-item";
import { createTask } from "@/actions/task-actions";

interface AssigneeConfig {
  name: string;
  initials: string;
  bg: string;
  color: string;
}

const ASSIGNEES: Record<Lane, AssigneeConfig> = {
  TECH: {
    name: "Breno dos Santos",
    initials: "BS",
    bg: "#FAEEDA",
    color: "#633806",
  },
  GESTAO: {
    name: "Elinéa Libório",
    initials: "EL",
    bg: "#EEEDFE",
    color: "#3C3489",
  },
};

interface TaskLaneProps {
  projectId: string;
  projectColor: string;
  lane: Lane;
  tasks: Task[];
  label: string;
  icon: string;
  onSaved?: () => void;
}

export function TaskLane({
  projectId,
  projectColor,
  lane,
  tasks,
  label,
  icon,
  onSaved,
}: TaskLaneProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const assignee = ASSIGNEES[lane];

  async function handleAdd() {
    if (!newText.trim()) return;
    setIsAdding(false);
    setNewText("");
    setNewDueDate("");
    await createTask(projectId, lane, newText.trim(), newDueDate || undefined);
    onSaved?.();
  }

  function handleCancel() {
    setNewText("");
    setNewDueDate("");
    setIsAdding(false);
  }

  return (
    <div className="flex flex-col min-h-0">
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ fontSize: 13 }}>{icon}</span>
        <span className="text-xs font-medium text-gray-700">{label}</span>
      </div>

      <div className="flex-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            projectColor={projectColor}
            onSaved={onSaved}
          />
        ))}
      </div>

      {isAdding ? (
        <div className="flex flex-col gap-1 mt-1 px-1">
          <input
            autoFocus
            type="text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newText.trim()) handleAdd();
              if (e.key === "Escape") handleCancel();
            }}
            placeholder="Nova atividade…"
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-400"
          />
          <input
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            className="text-xs border border-gray-300 rounded px-2 py-1 outline-none focus:border-blue-400"
          />
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleAdd}
              className="text-green-700 hover:text-green-900 p-0.5"
              aria-label="Confirmar"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Cancelar"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-1.5 mt-2 px-1 text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 rounded hover:border-gray-300 transition-colors py-1"
          style={{ fontSize: 11 }}
        >
          <Plus size={12} />
          Adicionar atividade
        </button>
      )}

      <div
        className="mt-3 pt-2 flex items-center gap-1.5"
        style={{ borderTop: "1px solid #f0f0f0" }}
      >
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0 font-medium"
          style={{
            width: 22,
            height: 22,
            fontSize: 9,
            backgroundColor: assignee.bg,
            color: assignee.color,
          }}
        >
          {assignee.initials}
        </div>
        <span style={{ fontSize: 11, color: "#888" }}>{assignee.name}</span>
      </div>
    </div>
  );
}
