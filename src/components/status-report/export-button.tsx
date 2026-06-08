"use client";

import { FileText } from "lucide-react";
import type { ProjectWithTasks } from "@/types";
import type { TaskStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: "A fazer",
  DOING: "Em andamento",
  DONE: "Concluído",
  ALERT: "Atenção",
};

interface ExportButtonProps {
  projects: ProjectWithTasks[];
}

function buildReport(projects: ProjectWithTasks[]): string {
  const now = new Date();
  const dateStr = now.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const lines: string[] = [
    "STATUS REPORT SEMANAL",
    `Centro Einstein de Inovação`,
    `Gerado em: ${dateStr}`,
    "═".repeat(50),
    "",
  ];

  for (const project of projects) {
    lines.push(`■ ${project.name}`);
    lines.push("─".repeat(40));

    const techTasks = project.tasks.filter((t) => t.lane === "TECH");
    const gestaoTasks = project.tasks.filter((t) => t.lane === "GESTAO");

    if (techTasks.length > 0) {
      lines.push("  ⚙ Liderança Técnica (Breno dos Santos)");
      for (const task of techTasks) {
        lines.push(`    • [${STATUS_LABELS[task.status]}] ${task.text}`);
      }
    }

    if (gestaoTasks.length > 0) {
      lines.push("  📋 Gestão de Projetos (Elinéa Libório)");
      for (const task of gestaoTasks) {
        lines.push(`    • [${STATUS_LABELS[task.status]}] ${task.text}`);
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

export function ExportButton({ projects }: ExportButtonProps) {
  function handleExport() {
    const text = buildReport(projects);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const a = document.createElement("a");
    a.href = url;
    a.download = `status_report_${today}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="gap-1.5 text-xs"
    >
      <FileText size={14} />
      Exportar resumo .txt
    </Button>
  );
}
