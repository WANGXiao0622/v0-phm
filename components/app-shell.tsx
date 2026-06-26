"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Database, ClipboardList, Cpu, User, Activity, MessageSquare } from "lucide-react";

const navItems = [
  { id: "workspace", name: "个人工作台", icon: User, href: "/workspace" },
  { id: "data-management", name: "数据管理", icon: Database, href: "/data-management" },
  { id: "requirement-management", name: "需求管理", icon: MessageSquare, href: "/requirement-management" },
  { id: "task-management", name: "任务管理", icon: ClipboardList, href: "/task-management" },
  { id: "model-management", name: "模型管理", icon: Cpu, href: "/model-management" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* 左侧主导航 */}
      <aside className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col sticky top-0 h-screen">
        <Link
          href="/workspace"
          className="px-4 py-4 border-b border-border flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground leading-tight text-balance">
              健康管理与性能监控平台
            </h1>
            <p className="text-[11px] text-muted-foreground truncate">
              AHM &amp; PM System
            </p>
          </div>
        </Link>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground px-1 leading-relaxed">
            Aircraft Health Management &amp; Performance Monitoring System
          </p>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
