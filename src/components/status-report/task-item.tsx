"use client";

import { useState, useOptimistic, useRef, useEffect } from "react";
import { Pencil, Trash2, Check, X, ChevronDown, AlertCircle, Calendar, Clock } from "lucide-react";
import type { Task, TaskStatus } from "@prisma/client";
import {
  updateTaskStatus,
  updateTaskText,
  deleteTask,
  updateTaskDueDate,
} from "@/actions/task-actions";

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; color: string }
> = {
  TODO: { label: "A fazer", bg: "#F1EFE8", color: "#5F5E5A" },
  DOING: { label: "Em andamento", bg: "#E6F1FB", color: "#0C447C" },
  DONE: { label: "Concluído", bg: "#EAF3DE", color: "#3B6D11" },
  ALERT: { label: "Atenção", bg: "#FAEEDA", color: "#633806" },
};

const STATUS_ORDER: TaskStatus[] = ["TODO", "DOING", "DONE", "ALERT"];

interface TaskItemProps {
  task: Task;
  projectColor: string;
  onSaved?: () => void;
}

function getDeadlineStatus(dueDate: Date | null): {
  status: "overdue" | "due-soon" | "normal" | "none";
  daysLeft: number | null;
} {
  if (!dueDate) return { status: "none", daysLeft: null };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);

  const diffMs = due.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { status: "overdue", daysLeft };
  if (daysLeft <= 3) return { status: "due-soon", daysLeft };
  return { status: "normal", daysLeft };
}

function formatDate(date: Date | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function TaskItem({ task, projectColor, onSaved }: TaskItemProps) {
  const [optimisticStatus, setOptimisticStatus] = useOptimistic(task.status);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [isHovered, setIsHovered] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDueDate, setEditDueDate] = useState(
    task.dueDate ? task.dueDate.toISOString().split("T")[0] : ""
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const deadlineStatus = getDeadlineStatus(task.dueDate);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditingDate) {
      dateInputRef.current?.focus();
    }
  }, [isEditingDate]);

  useEffect(() => {
    if (!statusOpen) return;
    function handleClick(e: MouseEvent) {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [statusOpen]);

  async function handleSelectStatus(s: TaskStatus) {
    setStatusOpen(false);
    if (s === optimisticStatus) return;
    setOptimisticStatus(s);
    await updateTaskStatus(task.id, s);
    onSaved?.();
  }

  async function handleSaveEdit() {
    if (!editText.trim()) return;
    setIsEditing(false);
    await updateTaskText(task.id, editText.trim());
    onSaved?.();
  }

  function handleCancelEdit() {
    setEditText(task.text);
    setIsEditing(false);
  }

  async function handleSaveDueDate() {
    setIsEditingDate(false);
    await updateTaskDueDate(task.id, editDueDate || null);
    onSaved?.();
  }

  function handleCancelDateEdit() {
    setEditDueDate(task.dueDate ? task.dueDate.toISOString().split("T")[0] : "");
    setIsEditingDate(false);
  }

  async function handleDelete() {
    setConfirmDelete(false);
    await deleteTask(task.id);
    onSaved?.();
  }

  const statusCfg = STATUS_CONFIG[optimisticStatus];
  const isDone = optimisticStatus === "DONE";

  if (confirmDelete) {
    return (
      <div className="flex items-center gap-2 py-1.5 px-1 rounded bg-red-50 border border-red-100">
        <span className="flex-1 text-xs text-red-700">Excluir esta atividade?</span>
        <button
          type="button"
          onClick={handleDelete}
          className="text-xs font-medium text-red-700 hover:text-red-900 px-2 py-0.5 rounded hover:bg-red-100"
        >
          Sim
        </button>
        <button
          type="button"
          onClick={() => setConfirmDelete(false)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded hover:bg-gray-100"
        >
          Não
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col gap-1 py-1.5 px-1 rounded hover:bg-gray-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setStatusOpen(false);
      }}
    >
      <div className="flex items-start gap-2">
        {/* Checkbox */}
        <button
          type="button"
          aria-label="Marcar como concluído"
          onClick={() => handleSelectStatus(isDone ? "TODO" : "DONE")}
          className="mt-0.5 flex-shrink-0 flex items-center justify-center rounded transition-colors"
          style={{
            width: 16,
            height: 16,
            border: `1.5px solid ${isDone ? projectColor : "#d1d5db"}`,
            borderRadius: 4,
            backgroundColor: isDone ? projectColor : "transparent",
            color: isDone ? "#fff" : "transparent",
          }}
        >
          {isDone && <Check size={10} strokeWidth={3} />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveEdit();
                if (e.key === "Escape") handleCancelEdit();
              }}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-0.5 outline-none focus:border-blue-400"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="text-green-700 hover:text-green-900 p-0.5"
              aria-label="Confirmar"
            >
              <Check size={13} />
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="text-gray-400 hover:text-gray-600 p-0.5"
              aria-label="Cancelar"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <>
            <span
              className="flex-1 leading-snug min-w-0"
              style={{
                fontSize: 12,
                textDecoration: isDone ? "line-through" : "none",
                opacity: isDone ? 0.45 : 1,
              }}
            >
              {task.text}
            </span>

            <div className="flex items-center gap-1 flex-shrink-0">
              {isHovered && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setEditText(task.text);
                      setIsEditing(true);
                    }}
                    className="text-gray-400 hover:text-gray-700 p-0.5"
                    aria-label="Editar"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingDate(true)}
                    className={`p-0.5 ${
                      task.dueDate ? "text-gray-600 hover:text-gray-700" : "text-gray-400 hover:text-gray-600"
                    }`}
                    aria-label={task.dueDate ? "Editar prazo" : "Adicionar prazo"}
                    title={task.dueDate ? "Editar prazo" : "Adicionar prazo"}
                  >
                    <Calendar size={12} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="text-gray-400 hover:text-red-500 p-0.5"
                    aria-label="Excluir"
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}

              {/* Status badge / dropdown trigger */}
              <div ref={dropdownRef} className="relative">
                <button
                  type="button"
                  onClick={() => setStatusOpen((o) => !o)}
                  className="flex items-center gap-0.5 rounded-full px-2 py-0.5 leading-none transition-opacity hover:opacity-80"
                  style={{
                    fontSize: 10,
                    backgroundColor: statusCfg.bg,
                    color: statusCfg.color,
                  }}
                >
                  {statusCfg.label}
                  <ChevronDown size={9} strokeWidth={2.5} />
                </button>

                {statusOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 bg-white border border-gray-200 rounded-lg shadow-md py-1 min-w-[130px]">
                    {STATUS_ORDER.map((s) => {
                      const cfg = STATUS_CONFIG[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleSelectStatus(s)}
                          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 text-left"
                        >
                          <span
                            className="rounded-full px-2 py-0.5 leading-none"
                            style={{
                              fontSize: 10,
                              backgroundColor: cfg.bg,
                              color: cfg.color,
                            }}
                          >
                            {cfg.label}
                          </span>
                          {s === optimisticStatus && (
                            <Check size={10} className="text-gray-400 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Deadline badge - shown when exists */}
              {task.dueDate && (
                <div
                  className={`flex items-center gap-1 rounded px-2 py-0.5 text-xs font-semibold flex-shrink-0 border ${
                    deadlineStatus.status === "overdue"
                      ? "bg-red-100 text-red-800 border-red-300 shadow-sm"
                      : deadlineStatus.status === "due-soon"
                        ? "bg-amber-100 text-amber-800 border-amber-300 shadow-sm"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                  }`}
                  title={`Prazo: ${formatDate(task.dueDate)}`}
                >
                  {deadlineStatus.status === "overdue" && (
                    <AlertCircle size={11} className="flex-shrink-0" />
                  )}
                  {deadlineStatus.status === "due-soon" && (
                    <Clock size={11} className="flex-shrink-0" />
                  )}
                  {deadlineStatus.status === "normal" && (
                    <Calendar size={11} className="flex-shrink-0" />
                  )}
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Deadline editor - shown when editing */}
      {isEditingDate && (
        <div className="flex items-center gap-1 px-1 py-2 bg-gray-50 rounded mt-1">
          <input
            ref={dateInputRef}
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-0.5 outline-none focus:border-blue-400"
          />
          <button
            type="button"
            onClick={handleSaveDueDate}
            className="text-green-700 hover:text-green-900 p-0.5 flex-shrink-0"
          >
            <Check size={13} />
          </button>
          <button
            type="button"
            onClick={handleCancelDateEdit}
            className="text-gray-400 hover:text-gray-600 p-0.5 flex-shrink-0"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
