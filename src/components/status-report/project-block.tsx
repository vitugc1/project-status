"use client";

import { useState, useCallback } from "react";
import { Trash2, X, Check, History } from "lucide-react";
import type { ProjectWithTasks } from "@/types";
import { TaskLane } from "./task-lane";
import { TaskHistoryModal } from "./task-history-modal";
import { deleteProject } from "@/actions/task-actions";

interface ProjectBlockProps {
  project: ProjectWithTasks;
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function ProjectBlock({ project }: ProjectBlockProps) {
  const [savedVisible, setSavedVisible] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSaved = useCallback(() => {
    setSavedVisible(true);
    const timer = setTimeout(() => setSavedVisible(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  async function handleDelete() {
    setIsDeleting(true);
    await deleteProject(project.id);
  }

  const techTasks = project.tasks.filter((t) => t.lane === "TECH");
  const gestaoTasks = project.tasks.filter((t) => t.lane === "GESTAO");
  const taskCount = project.tasks.length;

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs transition-opacity"
      style={{ opacity: isDeleting ? 0.4 : 1 }}
    >
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: hexToRgba(project.color, 0.1) }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ backgroundColor: project.color }}
          />
          <span
            className="text-sm font-semibold truncate"
            style={{ color: project.color }}
          >
            {project.name}
          </span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-medium flex-shrink-0"
            style={{
              backgroundColor: hexToRgba(project.color, 0.15),
              color: project.color,
            }}
          >
            {taskCount} {taskCount === 1 ? "atividade" : "atividades"}
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-gray-400 hover:text-gray-600 transition-colors p-0.5 rounded"
            aria-label="Ver histórico de atividades"
            title="Ver histórico de atividades"
          >
            <History size={14} />
          </button>

          <span
            className="flex items-center gap-1 text-xs font-medium transition-opacity duration-300"
            style={{ color: "#3B6D11", opacity: savedVisible ? 1 : 0, fontSize: 11 }}
          >
            ✓ Salvo
          </span>

          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600 mr-1">Excluir projeto?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-0.5 text-xs font-medium text-red-600 hover:text-red-800 px-2 py-0.5 rounded hover:bg-red-50"
              >
                <Check size={11} /> Sim
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="flex items-center gap-0.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded hover:bg-gray-100"
              >
                <X size={11} /> Não
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-gray-300 hover:text-red-400 transition-colors p-0.5 rounded"
              aria-label="Excluir projeto"
              title="Excluir projeto"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-gray-100">
        <div className="p-4">
          <TaskLane
            projectId={project.id}
            projectColor={project.color}
            lane="TECH"
            tasks={techTasks}
            label="Liderança Técnica"
            icon="⚙️"
            onSaved={handleSaved}
          />
        </div>
        <div className="p-4">
          <TaskLane
            projectId={project.id}
            projectColor={project.color}
            lane="GESTAO"
            tasks={gestaoTasks}
            label="Gestão de Projetos"
            icon="📋"
            onSaved={handleSaved}
          />
        </div>
      </div>

      <TaskHistoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        tasks={project.tasks}
        projectColor={project.color}
        projectName={project.name}
        onSaved={handleSaved}
      />
    </div>
  );
}
