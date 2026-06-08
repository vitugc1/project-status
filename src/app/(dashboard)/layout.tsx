"use client";

import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data: session } = useSession();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f5f3" }}>
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-800">
              Status Report · Centro Einstein
            </span>
          </div>
          <div className="flex items-center gap-3">
            {session?.user?.email && (
              <span className="text-xs text-gray-500 hidden sm:block">
                {session.user.email}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-800 h-8 gap-1.5"
            >
              <LogOut size={14} />
              <span className="text-xs">Sair</span>
            </Button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
