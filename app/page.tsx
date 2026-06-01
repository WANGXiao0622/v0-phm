"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Database,
  ClipboardList,
  Cpu,
  User,
  ChevronRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HardDrive,
  FileText,
  Sliders,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

// 本月统计数据
const monthlyStats = {
  total: 48,
  analyzed: 32,
  ignored: 8,
  noQar: 8,
};

// 待办任务
const todoTasks = [
  { id: 1, title: "PACK 1 FAULT 故障分析", registration: "B-1234", airline: "成都航空", priority: "high", dueDate: "2024-01-16", status: "pending" },
  { id: 2, title: "BLEED 1 OVHT 故障分析", registration: "B-5678", airline: "东方航空", priority: "high", dueDate: "2024-01-16", status: "pending" },
  { id: 3, title: "ENG 1 VIB HI 故障分析", registration: "B-1234", airline: "成都航空", priority: "medium", dueDate: "2024-01-17", status: "pending" },
  { id: 4, title: "PRSOV 1 FAULT 故障分析", registration: "B-3456", airline: "南方航空", priority: "medium", dueDate: "2024-01-18", status: "pending" },
];

// 我的模板
const myTemplates = [
  { id: 1, name: "APU EGT超温分析模板", ataChapter: "49", usageCount: 12 },
  { id: 2, name: "引气系统故障分析模板", ataChapter: "36", usageCount: 8 },
  { id: 3, name: "刹车温度异常分析模板", ataChapter: "32", usageCount: 6 },
];

// 我的参数配置
const myParameters = [
  { id: 1, name: "成都航空 EGT参数配置", airline: "UEA", paramCount: 15 },
  { id: 2, name: "东方航空 引气参数配置", airline: "CES", paramCount: 12 },
  { id: 3, name: "通用刹车温度参数配置", airline: "ALL", paramCount: 8 },
];

// 功能模块
const modules = [
  {
    id: "data-management",
    name: "数据管理",
    description: "管理飞机运行数据、传感器数据和历史记录",
    icon: Database,
    href: "/data-management",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    hoverColor: "hover:bg-blue-100 hover:border-blue-300",
  },
  {
    id: "task-management",
    name: "任务管理",
    description: "故障任务分配、处理进度跟踪和工单管理",
    icon: ClipboardList,
    href: "/task-management",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    hoverColor: "hover:bg-emerald-100 hover:border-emerald-300",
  },
  {
    id: "model-management",
    name: "模型管理",
    description: "AI分析模型配置、训练和版本管理",
    icon: Cpu,
    href: "/model-management",
    color: "bg-purple-50 text-purple-600 border-purple-200",
    hoverColor: "hover:bg-purple-100 hover:border-purple-300",
  },
  {
    id: "workspace",
    name: "个人工作台",
    description: "个人待办事项、消息通知和工作统计",
    icon: User,
    href: "/workspace",
    color: "bg-amber-50 text-amber-600 border-amber-200",
    hoverColor: "hover:bg-amber-100 hover:border-amber-300",
  },
];

// 优先级徽章
const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge className="bg-red-100 text-red-700 border-red-200">高</Badge>;
    case "medium":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200">中</Badge>;
    case "low":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200">低</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
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
      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* 本月统计 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-foreground">本月工作统计</h2>
              <p className="text-sm text-muted-foreground">2024年1月 个人任务处理情况</p>
            </div>
            <Link href="/workspace">
              <Button variant="ghost" size="sm" className="gap-1">
                查看详情 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">所有故障</p>
                    <p className="text-2xl font-bold mt-1">{monthlyStats.total}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">已完成分析</p>
                    <p className="text-2xl font-bold mt-1 text-emerald-600">{monthlyStats.analyzed}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">忽略分析</p>
                    <p className="text-2xl font-bold mt-1 text-gray-600">{monthlyStats.ignored}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-gray-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">暂无QAR数据</p>
                    <p className="text-2xl font-bold mt-1 text-red-600">{monthlyStats.noQar}</p>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 待办任务和快捷入口 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* 待办任务 */}
          <Card className="col-span-2 border border-border">
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  待办任务
                </CardTitle>
                <Link href="/task-management">
                  <Button variant="ghost" size="sm" className="gap-1 text-xs">
                    查看全部 <ChevronRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {todoTasks.map((task) => (
                  <div key={task.id} className="p-4 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{task.title}</span>
                          {getPriorityBadge(task.priority)}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs">
                              {task.registration}
                            </Badge>
                          </span>
                          <span>{task.airline}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            截止: {task.dueDate}
                          </span>
                        </div>
                      </div>
                      <Link href="/task-management">
                        <Button variant="outline" size="sm" className="text-xs">
                          处理
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 快捷入口 */}
          <div className="space-y-4">
            {/* 我的模板 */}
            <Card className="border border-border">
              <CardHeader className="pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4 text-purple-600" />
                    我的模板
                  </CardTitle>
                  <Link href="/data-management?tab=template">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                      管理 <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myTemplates.map((template) => (
                    <Link key={template.id} href="/data-management?tab=template">
                      <div className="px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-purple-50 text-purple-600 text-xs">
                              ATA {template.ataChapter}
                            </Badge>
                            <span className="text-sm">{template.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">使用 {template.usageCount} 次</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 我的参数配置 */}
            <Card className="border border-border">
              <CardHeader className="pb-2 border-b border-border">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-amber-600" />
                    我的参数配置
                  </CardTitle>
                  <Link href="/data-management?tab=parameter">
                    <Button variant="ghost" size="sm" className="gap-1 text-xs h-7">
                      管理 <ChevronRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myParameters.map((param) => (
                    <Link key={param.id} href="/data-management?tab=parameter">
                      <div className="px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={param.airline === "ALL" ? "bg-emerald-50 text-emerald-600 text-xs" : "bg-blue-50 text-blue-600 text-xs"}>
                              {param.airline}
                            </Badge>
                            <span className="text-sm">{param.name}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{param.paramCount} 个参数</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 功能模块 */}
        <div className="mb-4">
          <h2 className="text-lg font-medium text-foreground mb-1">功能模块</h2>
          <p className="text-sm text-muted-foreground">
            选择一个模块开始工作
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.id} href={module.href}>
                <Card
                  className={`cursor-pointer transition-all duration-200 border-2 h-full ${module.color} ${module.hoverColor}`}
                >
                  <CardContent className="p-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center bg-white/80`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-medium text-foreground">
                          {module.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {module.description}
                      </p>
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
