"use client";

import { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import type { Task, TaskStatus } from "@prisma/client";
import { TaskItem } from "./task-item";

interface TaskHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  projectColor: string;
  projectName: string;
  onSaved?: () => void;
}

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; color: string }
> = {
  TODO: { label: "A fazer", bg: "#F1EFE8", color: "#5F5E5A" },
  DOING: { label: "Em andamento", bg: "#E6F1FB", color: "#0C447C" },
  DONE: { label: "Concluído", bg: "#EAF3DE", color: "#3B6D11" },
  ALERT: { label: "Atenção", bg: "#FAEEDA", color: "#633806" },
};

const STATUS_ORDER: TaskStatus[] = ["TODO", "DOING", "ALERT", "DONE"];

export function TaskHistoryModal({
  isOpen,
  onClose,
  tasks,
  projectColor,
  projectName,
  onSaved,
}: TaskHistoryModalProps) {
  const [expandedStatuses, setExpandedStatuses] = useState<
    Record<TaskStatus, boolean>
  >({
    TODO: true,
    DOING: true,
    ALERT: true,
    DONE: false,
  });

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      TODO: [],
      DOING: [],
      ALERT: [],
      DONE: [],
    };

    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });

    return grouped;
  }, [tasks]);

  const toggleStatus = (status: TaskStatus) => {
    setExpandedStatuses((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Histórico de Atividades - {projectName}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {STATUS_ORDER.map((status) => {
            const statusTasks = tasksByStatus[status];
            const config = STATUS_CONFIG[status];
            const isExpanded = expandedStatuses[status];

            return (
              <div key={status} className="border-b border-gray-100 last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggleStatus(status)}
                  className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                  <span
                    className="rounded-full px-2 py-0.5 text-xs font-medium"
                    style={{
                      backgroundColor: config.bg,
                      color: config.color,
                    }}
                  >
                    {config.label}
                  </span>
                  <span
                    className="text-xs font-medium ml-auto"
                    style={{ color: config.color }}
                  >
                    ({statusTasks.length})
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-3 space-y-1">
                    {statusTasks.length > 0 ? (
                      statusTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          projectColor={projectColor}
                          onSaved={onSaved}
                        />
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 py-2">
                        Nenhuma atividade neste status
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <span className="text-xs text-gray-600">
            Total: {tasks.length} atividade{tasks.length !== 1 ? "s" : ""}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
