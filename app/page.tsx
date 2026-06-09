"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Database,
  ClipboardList,
  Cpu,
  User,
  ChevronRight,
  Activity,
} from "lucide-react";
import Link from "next/link";

const modules = [
  {
    id: "data-management",
    name: "数据管理",
    description: "管理飞行数据、分析模板与元数据配置",
    icon: Database,
    href: "/data-management",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    hoverColor: "hover:bg-blue-100 hover:border-blue-300",
  },
  {
    id: "task-management",
    name: "任务管理",
    description: "故障分析任务处理、任务进展进度跟踪",
    icon: ClipboardList,
    href: "/task-management",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hoverColor: "hover:bg-emerald-100 hover:border-emerald-300",
  },
  {
    id: "model-management",
    name: "模型管理",
    description: "模型信息、版本管理与开发思路",
    icon: Cpu,
    href: "/model-management",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    hoverColor: "hover:bg-purple-100 hover:border-purple-300",
  },
  {
    id: "workspace",
    name: "个人工作台",
    description: "个人待办事项与统计分析",
    icon: User,
    href: "/workspace",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    hoverColor: "hover:bg-amber-100 hover:border-amber-300",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                健康管理与性能监控平台
              </h1>
              <p className="text-sm text-muted-foreground">
                Aircraft Health Management & Performance Monitoring System
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-1">功能模块</h2>
          <p className="text-sm text-muted-foreground">
            选择一个模块开始工作
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={module.href}>
                <Card
                  className={`cursor-pointer transition-all duration-200 border-2 ${module.color} ${module.hoverColor}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div
                          className={`h-12 w-12 rounded-lg flex items-center justify-center bg-white/80`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-base font-medium text-foreground mb-1">
                            {module.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {module.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
