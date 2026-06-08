"use client";

import { useState } from "react";
import { Plus, X, Check } from "lucide-react";
import { createProject } from "@/actions/task-actions";

const PRESET_COLORS = [
  "#e07b39",
  "#3a9e6e",
  "#e88fa8",
  "#c94040",
  "#5b8dee",
  "#8b5cf6",
  "#f59e0b",
  "#0ea5e9",
  "#10b981",
  "#6b7280",
];

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 20);
}

export function AddProjectForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[4]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleNameChange(v: string) {
    setName(v);
    setKey(slugify(v));
  }

  async function handleSubmit() {
    if (!name.trim()) { setError("Nome obrigatório"); return; }
    if (!key.trim()) { setError("Chave obrigatória"); return; }
    setError(null);
    setLoading(true);
    const result = await createProject(name, key, color);
    setLoading(false);
    if (!result.success) { setError(result.error ?? "Erro"); return; }
    setOpen(false);
    setName("");
    setKey("");
    setColor(PRESET_COLORS[4]);
  }

  function handleCancel() {
    setOpen(false);
    setName("");
    setKey("");
    setColor(PRESET_COLORS[4]);
    setError(null);
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors bg-white"
      >
        <Plus size={16} />
        Adicionar projeto
      </button>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-800">Novo projeto</span>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 p-0.5 rounded"
        >
          <X size={15} />
        </button>
      </div>

      <div className="p-4 space-y-3">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Nome do projeto
          </label>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") handleCancel();
            }}
            placeholder="Ex: Malar.IA"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
          />
        </div>

        {/* Key */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Chave (identificador único)
          </label>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(slugify(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
              if (e.key === "Escape") handleCancel();
            }}
            placeholder="Ex: malar"
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 font-mono"
          />
        </div>

        {/* Color */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-2">
            Cor do projeto
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-6 h-6 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
                style={{ backgroundColor: c }}
                aria-label={c}
              >
                {color === c && (
                  <Check size={12} className="text-white" strokeWidth={3} />
                )}
              </button>
            ))}
            {/* Custom color input */}
            <label
              className="w-6 h-6 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 overflow-hidden"
              title="Cor personalizada"
            >
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="opacity-0 absolute w-0 h-0"
              />
              <span className="text-gray-400" style={{ fontSize: 10 }}>+</span>
            </label>
          </div>

          {/* Preview */}
          <div
            className="mt-2 flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: `${color}18` }}
          >
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs font-medium" style={{ color }}>
              {name || "Nome do projeto"}
            </span>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded px-2 py-1">
            {error}
          </p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-white rounded-lg py-2 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: color }}
          >
            {loading ? (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <Check size={13} />
            )}
            Criar projeto
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg py-2 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
