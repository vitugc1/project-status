import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entrar — Centro Einstein de Inovação",
};

export default function LoginPage() {
  return <LoginForm />;
}
