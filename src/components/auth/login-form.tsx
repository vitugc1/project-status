"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { signIn } from "@/lib/auth-client";

const schema = z.object({
  email: z.string().min(1, "E-mail obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setAuthError(null);
    const result = await signIn.email({
      email: values.email,
      password: values.password,
    });
    if (result.error) {
      setAuthError("E-mail ou senha inválidos.");
      return;
    }
    router.push("/");
  }

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: "#f5f5f3" }}>
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-12 flex-shrink-0"
        style={{
          background: "linear-gradient(160deg, #1a1a1a 0%, #2d2d2d 100%)",
        }}
      >
        <div>
          {/* Logo mark */}
          <div className="flex items-center gap-3 mb-12">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#e07b39" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm tracking-wide">
              Centro Einstein
            </span>
          </div>

          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            Acompanhamento<br />de projetos
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Visualize o progresso semanal de todos os projetos de inovação em um só lugar.
          </p>
        </div>

        {/* Status legend */}
        <div className="space-y-2">
          {[
            { color: "#EAF3DE", text: "#3B6D11", label: "Concluído" },
            { color: "#E6F1FB", text: "#0C447C", label: "Em andamento" },
            { color: "#FAEEDA", text: "#633806", label: "Atenção" },
            { color: "#F1EFE8", text: "#5F5E5A", label: "A fazer" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="rounded-full px-2 py-0.5 text-xs"
                style={{ backgroundColor: s.color, color: s.text }}
              >
                {s.label}
              </span>
            </div>
          ))}
          <p className="text-gray-600 text-xs mt-3">Status das atividades</p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-10 justify-center">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#e07b39" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-semibold text-gray-900 text-sm">Centro Einstein de Inovação</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Bem-vindo</h1>
            <p className="text-sm text-gray-500 mt-1">Entre com suas credenciais para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="seu@einstein.org"
                aria-invalid={!!errors.email}
                className={`w-full h-11 px-4 text-sm rounded-xl border outline-none transition-all bg-white shadow-xs focus:ring-[3px] ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-gray-800 focus:ring-gray-100"}`}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  className={`w-full h-11 px-4 pr-12 text-sm rounded-xl border outline-none transition-all bg-white shadow-xs focus:ring-[3px] ${errors.password ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-gray-800 focus:ring-gray-100"}`}
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
                <span className="text-red-500 mt-0.5 flex-shrink-0" style={{ fontSize: 14 }}>⚠</span>
                <p className="text-sm text-red-700">{authError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-700 transition-colors mt-2 disabled:opacity-60"
            >
              {isSubmitting ? (
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <>
                  Entrar
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-8">
            Centro Einstein de Inovação · Acesso restrito
          </p>
        </div>
      </div>
    </div>
  );
}
