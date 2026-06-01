"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileQuestion,
  ArrowLeft,
  ChevronRight,
  FileText,
  Settings,
  Clock,
  CalendarDays,
  ExternalLink,
  ListTodo,
} from "lucide-react";
import Link from "next/link";

// 本月统计数据
const monthlyStats = {
  totalFaults: 156,
  completedAnalysis: 98,
  ignoredAnalysis: 32,
  noQarData: 26,
};

// 待办事项数据
const todoItems = [
  { id: 1, title: "分析 B-6789 发动机振动异常", priority: "high", dueDate: "2024-01-15", status: "pending", aircraft: "B-6789", faultType: "发动机振动" },
  { id: 2, title: "处理 B-2345 液压系统告警", priority: "medium", dueDate: "2024-01-16", status: "pending", aircraft: "B-2345", faultType: "液压系统" },
  { id: 3, title: "审核 B-5678 APU性能报告", priority: "low", dueDate: "2024-01-17", status: "pending", aircraft: "B-5678", faultType: "APU" },
  { id: 4, title: "跟进 B-1234 刹车温度监控", priority: "medium", dueDate: "2024-01-18", status: "pending", aircraft: "B-1234", faultType: "刹车系统" },
  { id: 5, title: "完成 B-9012 燃油系统分析", priority: "high", dueDate: "2024-01-15", status: "pending", aircraft: "B-9012", faultType: "燃油系统" },
];

// 我的模板数据
const myTemplates = [
  { id: 1, name: "APU EGT超温", ataChapter: "49", coreParameters: 12, lastUsed: "2024-01-14" },
  { id: 2, name: "HPV开关响应", ataChapter: "36", coreParameters: 8, lastUsed: "2024-01-12" },
  { id: 3, name: "刹车温度不一致", ataChapter: "32", coreParameters: 16, lastUsed: "2024-01-10" },
];

// 我的参数配置数据
const myParameterConfigs = [
  { id: 1, version: "311A-ARJ-B01-01", name: "基本版本", configuredParams: 45, lastModified: "2024-01-10" },
  { id: 2, version: "311E-CUH-B01-01", name: "成都航空", configuredParams: 52, lastModified: "2024-01-12" },
  { id: 3, version: "3115-CES-B01-01", name: "东航", configuredParams: 48, lastModified: "2024-01-08" },
];

export default function WorkspacePage() {
  const [todos, setTodos] = useState(todoItems);

  const toggleTodo = (id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, status: todo.status === "pending" ? "completed" : "pending" } : todo
    ));
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive" className="text-xs">紧急</Badge>;
      case "medium":
        return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 text-xs">中等</Badge>;
      case "low":
        return <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 text-xs">普通</Badge>;
      default:
        return null;
    }
  };

  const completionRate = Math.round((monthlyStats.completedAnalysis / monthlyStats.totalFaults) * 100);

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  返回首页
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-amber-600" />
                </div>
                <h1 className="text-lg font-semibold text-foreground">个人工作台</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>2024年1月</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 本月统计卡片 */}
        <section>
          <h2 className="text-base font-medium text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            本月任务统计
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* 所有故障条数 */}
            <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">所有故障</p>
                    <p className="text-3xl font-bold text-slate-700">{monthlyStats.totalFaults}</p>
                    <p className="text-xs text-muted-foreground mt-1">本月累计</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-slate-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 已完成分析 */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">已完成分析</p>
                    <p className="text-3xl font-bold text-emerald-600">{monthlyStats.completedAnalysis}</p>
                    <p className="text-xs text-emerald-600 mt-1">完成率 {completionRate}%</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 忽略分析 */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">忽略分析</p>
                    <p className="text-3xl font-bold text-amber-600">{monthlyStats.ignoredAnalysis}</p>
                    <p className="text-xs text-muted-foreground mt-1">已标记忽略</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 暂无QAR数据 */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">暂无QAR数据</p>
                    <p className="text-3xl font-bold text-blue-600">{monthlyStats.noQarData}</p>
                    <p className="text-xs text-muted-foreground mt-1">待数据补充</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileQuestion className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 待办事项 */}
        <section>
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ListTodo className="h-4 w-4 text-primary" />
                  待办事项
                  <Badge variant="outline" className="ml-2">{todos.filter(t => t.status === "pending").length} 项待处理</Badge>
                </CardTitle>
                <Link href="/task-management">
                  <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                    查看全部
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {todos.map((todo) => (
                  <div 
                    key={todo.id} 
                    className={`flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors ${
                      todo.status === "completed" ? "opacity-50" : ""
                    }`}
                  >
                    <Checkbox 
                      checked={todo.status === "completed"}
                      onCheckedChange={() => toggleTodo(todo.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${todo.status === "completed" ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {todo.title}
                        </span>
                        {getPriorityBadge(todo.priority)}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {todo.dueDate}
                        </span>
                        <Badge variant="outline" className="text-xs h-5">{todo.aircraft}</Badge>
                        <span>{todo.faultType}</span>
                      </div>
                    </div>
                    <Link href="/task-management">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 我的模板和参数配置 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 我的模板 */}
          <section>
            <Card className="border border-border h-full">
              <CardHeader className="border-b border-border py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    我的模板
                  </CardTitle>
                  <Link href="/data-management?tab=template">
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                      管理模板
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myTemplates.map((template) => (
                    <Link 
                      key={template.id} 
                      href="/data-management?tab=template"
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-blue-50 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{template.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs h-5">ATA {template.ataChapter}</Badge>
                            <span>{template.coreParameters} 个核心参数</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        上次使用: {template.lastUsed}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* 我的参数配置 */}
          <section>
            <Card className="border border-border h-full">
              <CardHeader className="border-b border-border py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" />
                    我的参数配置
                  </CardTitle>
                  <Link href="/data-management?tab=parameter">
                    <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">
                      管理配置
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border">
                  {myParameterConfigs.map((config) => (
                    <Link 
                      key={config.id} 
                      href="/data-management?tab=parameter"
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center">
                          <Settings className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{config.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className="font-mono">{config.version}</span>
                            <span>|</span>
                            <span>{config.configuredParams} 个已配置参数</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        最后修改: {config.lastModified}
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
