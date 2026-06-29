"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AppShell } from "@/components/app-shell";
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
  Plane,
  ClipboardList,
  Users,
  Database,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";

// 本月统计数据
const monthlyStats = {
  totalFaults: 156,
  completedAnalysis: 98,
  ignoredAnalysis: 32,
  noQarData: 26,
};

// 故障分析任务数据（与任务管理页面保持一致）
const faultTasks = [
  {
    id: "F2024001",
    type: "fault" as const,
    title: "监控发现APU EGT温度高",
    time: "2026-05-17 14:32",
    ata: "72",
    registration: "B-104X",
    location: "北京首都机场",
    status: "completed",
    hasWQAR: true,
  },
  {
    id: "F2024002",
    type: "fault" as const,
    title: "航后检查有APU引气阀故障",
    time: "2026-05-16 09:15",
    ata: "29",
    registration: "B-620D",
    location: "上海浦东机场",
    status: "processing",
    hasWQAR: true,
  },
  {
    id: "F2024003",
    type: "fault" as const,
    title: "短停落地后有刹车降级信息",
    time: "2026-05-15 16:45",
    ata: "24",
    registration: "B-658C",
    location: "广州白云机场",
    status: "completed",
    hasWQAR: false,
  },
  {
    id: "F2024004",
    type: "fault" as const,
    title: "落地滑跑阶段出现刹车不派遣",
    time: "2026-05-14 11:20",
    ata: "73",
    registration: "B-620E",
    location: "深圳宝安机场",
    status: "transferred",
    hasWQAR: true,
  },
  {
    id: "F2024005",
    type: "fault" as const,
    title: "双发启动后出现发动机引气故障",
    time: "2026-01-11 08:55",
    ata: "72",
    registration: "B-657Y",
    location: "成都双流机场",
    status: "processing",
    hasWQAR: false,
  },
];

// 型号任务数据（与任务管理页面保持一致）
const modelTasks = [
  {
    id: "M2024001",
    type: "model" as const,
    title: "完成PRSOV故障诊断模型航线故障统计与参数确认",
    source: "C919",
    deadline: "2026-05-15",
    status: "processing",
  },
  {
    id: "M2024002",
    type: "model" as const,
    title: "完成HPV故障诊断模型原理与模型可行性分析",
    source: "C909",
    deadline: "2026-05-20",
    status: "pending",
  },
  {
    id: "M2024003",
    type: "model" as const,
    title: "完成HPV故障诊断模型开发与部署",
    source: "运行支持",
    deadline: "2026-05-30",
    status: "completed",
  },
  {
    id: "M2024004",
    type: "model" as const,
    title: "完成C919健康管理模型验证流程梳理",
    source: "创新平台",
    deadline: "2026-06-01",
    status: "processing",
  },
  {
    id: "M2024005",
    type: "model" as const,
    title: "完成C919健康管理模型验证评审要求",
    source: "其它",
    deadline: "2026-06-10",
    status: "pending",
  },
];

// 其它任务数据（与任务管理页面保持一致）
const otherTasks = [
  {
    id: "O2024001",
    type: "other" as const,
    title: "完成本月模型开发进展汇报ppt",
    time: "2026-06-16",
    delivery: "PPT报告",
    status: "processing",
  },
  {
    id: "O2024002",
    type: "other" as const,
    title: "完成健康管理与性能监控平台需求分析报告",
    time: "2026-06-18",
    delivery: "Word文档",
    status: "pending",
  },
  {
    id: "O2024003",
    type: "other" as const,
    title: "完成健康管理与性能监控平台技术报告",
    time: "2026-06-10",
    delivery: "Word文档",
    status: "completed",
  },
  {
    id: "O2024004",
    type: "other" as const,
    title: "完成健康管理与性能监控平台原型开发",
    time: "2026-06-20",
    delivery: "系统原型",
    status: "pending",
  },
];

// 获取任务的应完成时间字符串 (YYYY-MM-DD)
function getItemDueDate(item: typeof allTodoItems[number]): string {
  if (item.type === "fault") {
    const datePart = (item as typeof faultTasks[number]).time.split(" ")[0];
    const d = new Date(`${datePart}T00:00:00`);
    d.setDate(d.getDate() + 3);
    return d.toISOString().slice(0, 10);
  }
  if (item.type === "model") {
    return (item as typeof modelTasks[number]).deadline;
  }
  return (item as typeof otherTasks[number]).time;
}

// 判断逾期状态
type DueState = "overdue" | "urgent" | "normal" | "done";
function getDueState(dueDate: string, status: string): DueState {
  if (status === "completed") return "done";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return "overdue";
  if (diffDays <= 3) return "urgent";
  return "normal";
}

// 相对时间描述
function relativeDue(dueDate: string, status: string): string {
  if (status === "completed") return "已完成";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(`${dueDate}T00:00:00`);
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / 86400000);
  if (diffDays < 0) return `逾期 ${Math.abs(diffDays)} 天`;
  if (diffDays === 0) return "今天到期";
  if (diffDays === 1) return "明天到期";
  return `还剩 ${diffDays} 天`;
}

// 合并所有待办任务
type TodoItem =
  | (typeof faultTasks[number])
  | (typeof modelTasks[number])
  | (typeof otherTasks[number]);

const allTodoItems: TodoItem[] = [...faultTasks, ...modelTasks, ...otherTasks];

// 我的模板数据
const myTemplates = [
  { id: 1, name: "APU EGT超温", ataChapter: "49", coreParameters: 12, lastUsed: "2026-01-14" },
  { id: 2, name: "HPV开关响应", ataChapter: "36", coreParameters: 8, lastUsed: "2026-01-12" },
  { id: 3, name: "刹车温度不一致", ataChapter: "32", coreParameters: 16, lastUsed: "2026-01-10" },
];

// 我的参数配置数据
const myParameterConfigs = [
  { id: 1, version: "311A-ARJ-B01-01", name: "基本版本", configuredParams: 45, lastModified: "2026-01-10" },
  { id: 2, version: "311E-CUH-B01-01", name: "成都航空", configuredParams: 52, lastModified: "2026-01-12" },
  { id: 3, version: "3115-CES-B01-01", name: "东方航空", configuredParams: 48, lastModified: "2026-01-08" },
];

export default function WorkspacePage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [dueSort, setDueSort] = useState<"asc" | "desc" | null>(null);

  const toggleTodo = (id: string) => {
    setCompletedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleDueSort = () => {
    setDueSort(prev => prev === "asc" ? "desc" : prev === "desc" ? null : "asc");
  };

  const sortedTodoItems = dueSort
    ? [...allTodoItems].sort((a, b) => {
        const da = getItemDueDate(a);
        const db = getItemDueDate(b);
        return dueSort === "asc" ? da.localeCompare(db) : db.localeCompare(da);
      })
    : allTodoItems;

  // 获取任务来源标签
  const getSourceBadge = (item: TodoItem) => {
    if (item.type === "fault") {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
          <AlertTriangle className="h-3 w-3 mr-1" />
          故障分析
        </Badge>
      );
    }
    if (item.type === "model") {
      return (
        <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
          <Plane className="h-3 w-3 mr-1" />
          型号任务
        </Badge>
      );
    }
    return (
      <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
        <ClipboardList className="h-3 w-3 mr-1" />
        其它任务
      </Badge>
    );
  };

  // 获取状态标签
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30 text-xs">
            <Clock className="h-3 w-3 mr-1" />
            待处理
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-300 text-xs">
            <Activity className="h-3 w-3 mr-1" />
            处理中
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300 text-xs">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            已完成
          </Badge>
        );
      case "transferred":
        return (
          <Badge variant="outline" className="text-purple-600 border-purple-300 text-xs">
            <Users className="h-3 w-3 mr-1" />
            已转派
          </Badge>
        );
      default:
        return null;
    }
  };

  // 获取任务详情信息（不含时间，时间已单独列出）
  const getTaskDetails = (item: TodoItem) => {
    if (item.type === "fault") {
      const faultItem = item as typeof faultTasks[number];
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs h-5">ATA {faultItem.ata}</Badge>
          <Badge variant="outline" className="text-xs h-5">{faultItem.registration}</Badge>
          {faultItem.hasWQAR ? (
            <Badge className="bg-emerald-50 text-emerald-600 border-emerald-200 text-xs h-5">
              <Database className="h-3 w-3 mr-1" />
              有QAR
            </Badge>
          ) : (
            <Badge className="bg-gray-50 text-gray-500 border-gray-200 text-xs h-5">
              <Database className="h-3 w-3 mr-1" />
              无QAR
            </Badge>
          )}
        </div>
      );
    }
    if (item.type === "model") {
      const modelItem = item as typeof modelTasks[number];
      return (
        <Badge variant="outline" className="text-xs h-5">{modelItem.source}</Badge>
      );
    }
    const otherItem = item as typeof otherTasks[number];
    return (
      <Badge variant="outline" className="text-xs h-5">{otherItem.delivery}</Badge>
    );
  };

  // 渲染应完成时间单元格
  const renderDueCell = (item: TodoItem) => {
    const isCompleted = completedIds.includes(item.id) || item.status === "completed";
    const dueDate = getItemDueDate(item);
    const state = getDueState(dueDate, isCompleted ? "completed" : item.status);
    const relative = relativeDue(dueDate, isCompleted ? "completed" : item.status);

    if (state === "done") {
      return (
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-mono text-muted-foreground">{dueDate}</span>
          <span className="text-xs text-emerald-600 font-medium">{relative}</span>
        </div>
      );
    }
    if (state === "overdue") {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
            <span className="text-xs font-mono font-semibold text-red-600">{dueDate}</span>
          </div>
          <span className="text-xs text-red-500 font-semibold">{relative}</span>
        </div>
      );
    }
    if (state === "urgent") {
      return (
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
            <span className="text-xs font-mono font-semibold text-amber-600">{dueDate}</span>
          </div>
          <span className="text-xs text-amber-500 font-semibold">{relative}</span>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
          <span className="text-xs font-mono text-foreground">{dueDate}</span>
        </div>
        <span className="text-xs text-muted-foreground">{relative}</span>
      </div>
    );
  };

  // 获取任务链接
  const getTaskLink = (item: TodoItem) => {
    if (item.type === "fault") {
      return `/task-management/fault-analysis/${item.id}`;
    }
    return "/task-management";
  };

  // 计算待处理任务数量
  const pendingCount = allTodoItems.filter(t => t.status !== "completed" && !completedIds.includes(t.id)).length;

  const completionRate = Math.round((monthlyStats.completedAnalysis / monthlyStats.totalFaults) * 100);

  return (
    <AppShell>
      {/* 顶部导航 */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Activity className="h-4 w-4 text-amber-600" />
              </div>
              <h1 className="text-lg font-semibold text-foreground">个人工作台</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>2026年1月</span>
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
                  <Badge variant="outline" className="ml-2">{pendingCount} 项待处理</Badge>
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
              {/* 表头 */}
              <div className="grid grid-cols-[32px_1fr_100px_140px_160px_90px_40px] gap-x-3 px-4 py-2 bg-secondary/50 text-xs text-muted-foreground border-b border-border items-center">
                <div />
                <div>任务描述</div>
                <div>任务来源</div>
                <div>详情信息</div>
                <div>
                  <button
                    type="button"
                    onClick={toggleDueSort}
                    className={`flex items-center gap-1 hover:text-foreground transition-colors ${dueSort ? "text-primary font-medium" : ""}`}
                  >
                    <CalendarClock className="h-3 w-3" />
                    应完成时间
                    {dueSort === "asc" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : dueSort === "desc" ? (
                      <ArrowDown className="h-3 w-3" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 opacity-40" />
                    )}
                  </button>
                </div>
                <div>状态</div>
                <div />
              </div>
              {/* 任务列表 */}
              <div className="divide-y divide-border max-h-[440px] overflow-y-auto">
                {sortedTodoItems.map((item) => {
                  const isCompleted = completedIds.includes(item.id) || item.status === "completed";
                  return (
                    <div
                      key={item.id}
                      className={`grid grid-cols-[32px_1fr_100px_140px_160px_90px_40px] gap-x-3 px-4 py-3 hover:bg-muted/50 transition-colors items-center ${isCompleted ? "opacity-50 bg-muted/20" : ""}`}
                    >
                      <div>
                        <Checkbox
                          checked={isCompleted}
                          onCheckedChange={() => toggleTodo(item.id)}
                        />
                      </div>
                      <div>
                        <span className={`text-sm font-medium leading-relaxed ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {item.title}
                        </span>
                      </div>
                      <div>
                        {getSourceBadge(item)}
                      </div>
                      <div>
                        {getTaskDetails(item)}
                      </div>
                      <div>
                        {renderDueCell(item)}
                      </div>
                      <div>
                        {getStatusBadge(item.status)}
                      </div>
                      <div>
                        <Link href={getTaskLink(item)}>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
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
    </AppShell>
  );
}
