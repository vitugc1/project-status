import type { ProjectWithTasks } from "@/types";

interface SummaryCardsProps {
  projects: ProjectWithTasks[];
}

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-[10px] flex flex-col"
      style={{
        border: "0.5px solid #e5e5e5",
        padding: "10px 14px",
      }}
    >
      <span
        className="font-bold leading-none"
        style={{ fontSize: 22 }}
      >
        {value}
      </span>
      <span
        className="mt-1 leading-none"
        style={{ fontSize: 11, color: "#888" }}
      >
        {label}
      </span>
    </div>
  );
}

export function SummaryCards({ projects }: SummaryCardsProps) {
  const allTasks = projects.flatMap((p) => p.tasks);
  const total = allTasks.length;
  const doing = allTasks.filter((t) => t.status === "DOING").length;
  const done = allTasks.filter((t) => t.status === "DONE").length;
  const alert = allTasks.filter((t) => t.status === "ALERT").length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <StatCard value={total} label="Total de atividades" />
      <StatCard value={doing} label="Em andamento" />
      <StatCard value={done} label="Concluídas" />
      <StatCard value={alert} label="Requerem atenção" />
    </div>
  );
}
