export const dynamic = "force-dynamic";

import { getTasks } from "@/actions/task-actions";
import { SummaryCards } from "@/components/status-report/summary-cards";
import { ProjectBlock } from "@/components/status-report/project-block";
import { ExportButton } from "@/components/status-report/export-button";
import { AddProjectForm } from "@/components/status-report/add-project-form";

function getWeekRange(): string {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const fmt = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  });

  return `Semana de ${fmt.format(monday)} a ${fmt.format(friday)}`;
}

export default async function DashboardPage() {
  const projects = await getTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">
            📊 Status report semanal
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{getWeekRange()}</p>
        </div>
        <ExportButton projects={projects} />
      </div>

      <SummaryCards projects={projects} />

      <div className="space-y-4">
        {projects.map((project) => (
          <ProjectBlock key={project.id} project={project} />
        ))}
        <AddProjectForm />
      </div>
    </div>
  );
}
