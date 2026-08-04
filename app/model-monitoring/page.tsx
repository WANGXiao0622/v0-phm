"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  Activity,
  Plane,
  TrendingUp,
  TrendingDown,
  Bell,
  ShieldAlert,
  BarChart,
  RefreshCw,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// ─────────────────────────────────────────────
// 数据定义
// ─────────────────────────────────────────────

const airlines = [
  { code: "UEA", name: "成都航空" },
  { code: "CES", name: "东方航空" },
  { code: "CSN", name: "南方航空" },
];

const aircraftByAirline: Record<string, { reg: string; type: string }[]> = {
  UEA: [
    { reg: "B-104X", type: "C909" },
    { reg: "B-102Y", type: "C909" },
    { reg: "B-919A", type: "C919" },
  ],
  CES: [
    { reg: "B-620D", type: "C909" },
    { reg: "B-621E", type: "C919" },
  ],
  CSN: [
    { reg: "B-301F", type: "C909" },
    { reg: "B-302G", type: "C919" },
  ],
};

interface MonitorModel {
  id: number;
  name: string;
  ataChapter: string;
  ataName: string;
  status: "normal" | "warning" | "fault" | "offline";
  alertCount: number;       // 近30天告警次数
  faultCount: number;       // 近30天故障统计
  lastAlertTime: string;
  applicability: string[];  // 适用航司
  version: string;
  accuracy: number;         // 准确率 %
}

const monitorModels: MonitorModel[] = [
  {
    id: 1,
    name: "APU EGT超温预警模型",
    ataChapter: "49",
    ataName: "APU",
    status: "warning",
    alertCount: 12,
    faultCount: 3,
    lastAlertTime: "2026-08-03 16:22",
    applicability: ["UEA", "CES", "CSN"],
    version: "v2.3.1",
    accuracy: 94.2,
  },
  {
    id: 2,
    name: "HPV开关响应诊断模型",
    ataChapter: "36",
    ataName: "引气",
    status: "normal",
    alertCount: 4,
    faultCount: 1,
    lastAlertTime: "2026-07-28 09:10",
    applicability: ["UEA", "CES"],
    version: "v1.8.0",
    accuracy: 97.1,
  },
  {
    id: 3,
    name: "PRSOV开关响应诊断模型",
    ataChapter: "36",
    ataName: "引气",
    status: "fault",
    alertCount: 21,
    faultCount: 8,
    lastAlertTime: "2026-08-04 08:55",
    applicability: ["UEA"],
    version: "v2.0.0-beta",
    accuracy: 88.5,
  },
  {
    id: 4,
    name: "刹车温度不一致检测模型",
    ataChapter: "32",
    ataName: "起落架",
    status: "normal",
    alertCount: 2,
    faultCount: 0,
    lastAlertTime: "2026-07-15 11:30",
    applicability: ["UEA", "CES", "CSN"],
    version: "v1.5.2",
    accuracy: 99.0,
  },
  {
    id: 5,
    name: "液压系统泄漏检测模型",
    ataChapter: "29",
    ataName: "液压",
    status: "warning",
    alertCount: 7,
    faultCount: 2,
    lastAlertTime: "2026-08-02 14:45",
    applicability: ["UEA"],
    version: "v2.0.1",
    accuracy: 91.8,
  },
  {
    id: 6,
    name: "空调组件性能监控模型",
    ataChapter: "21",
    ataName: "空调",
    status: "offline",
    alertCount: 0,
    faultCount: 0,
    lastAlertTime: "-",
    applicability: ["UEA", "CES", "CSN"],
    version: "v1.2.0-beta",
    accuracy: 0,
  },
  {
    id: 7,
    name: "起落架收放异常检测模型",
    ataChapter: "32",
    ataName: "起落架",
    status: "normal",
    alertCount: 1,
    faultCount: 0,
    lastAlertTime: "2026-07-20 19:05",
    applicability: ["UEA", "CES", "CSN"],
    version: "v1.8.5",
    accuracy: 98.4,
  },
];

// 告警记录
interface AlertRecord {
  id: string;
  modelId: number;
  modelName: string;
  airline: string;
  registration: string;
  time: string;
  level: "critical" | "warning" | "info";
  message: string;
  resolved: boolean;
}

const alertRecords: AlertRecord[] = [
  { id: "AL001", modelId: 3, modelName: "PRSOV开关响应诊断模型", airline: "UEA", registration: "B-919A", time: "2026-08-04 08:55", level: "critical", message: "PRSOV响应时间超过阈值 340ms（限制 250ms）", resolved: false },
  { id: "AL002", modelId: 1, modelName: "APU EGT超温预警模型", airline: "CES", registration: "B-621E", time: "2026-08-03 16:22", level: "warning", message: "APU EGT温度趋势上升，当前偏差 +12℃", resolved: false },
  { id: "AL003", modelId: 5, modelName: "液压系统泄漏检测模型", airline: "UEA", registration: "B-104X", time: "2026-08-02 14:45", level: "warning", message: "液压系统泄漏率接近阈值，当前 0.85 ml/h", resolved: false },
  { id: "AL004", modelId: 1, modelName: "APU EGT超温预警模型", airline: "UEA", registration: "B-102Y", time: "2026-08-01 10:30", level: "warning", message: "APU EGT最大温度连续3次超过基线", resolved: true },
  { id: "AL005", modelId: 3, modelName: "PRSOV开关响应诊断模型", airline: "UEA", registration: "B-104X", time: "2026-07-31 22:18", level: "critical", message: "PRSOV卡滞疑似故障，状态转换超时", resolved: true },
  { id: "AL006", modelId: 2, modelName: "HPV开关响应诊断模型", airline: "CES", registration: "B-620D", time: "2026-07-28 09:10", level: "info", message: "HPV响应时间轻微延迟 180ms（基线 150ms）", resolved: true },
];

// ─────────────────────────────────────────────
// 图表数据生成
// ─────────────────────────────────────────────

// 近30天每天告警 + 故障趋势
function generateTrendData(modelId: number, airlineFilter: string, regFilter: string) {
  const seed = modelId * 13 + (airlineFilter === "all" ? 0 : airlineFilter.charCodeAt(0));
  const days = 30;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(2026, 6, 5 + i); // July 5 ~ Aug 3
    const label = `${d.getMonth() + 1}/${d.getDate()}`;
    const alertVal = Math.max(0, Math.round(Math.sin((i + seed) * 0.7) * 2 + 1.5 + (Math.random() * 1.5)));
    const faultVal = Math.max(0, Math.round(alertVal * 0.25 * Math.random()));
    return { date: label, 告警次数: alertVal, 故障次数: faultVal };
  });
}

// 各架机参数值趋势（近20航段）
function generateParamData(modelId: number, reg: string) {
  const seed = modelId * 7 + reg.charCodeAt(reg.length - 1);
  return Array.from({ length: 20 }, (_, i) => {
    const base = 60 + (seed % 30);
    const val = parseFloat((base + Math.sin((i + seed * 0.3) * 0.8) * 8 + Math.random() * 4).toFixed(1));
    const threshold = base + 15;
    return { seg: `S${i + 1}`, 参数值: val, 阈值: threshold };
  });
}

// 故障次数按航司分布
function generateFaultByAirline(modelId: number) {
  const seed = modelId * 5;
  return airlines.map((a) => ({
    airline: a.name,
    故障次数: Math.max(0, Math.round((seed % 5) + Math.random() * 4)),
    告警次数: Math.max(0, Math.round((seed % 8) + Math.random() * 6)),
  }));
}

// ─────────────────────────────────────────────
// 辅助组件
// ─────────────────────────────────────────────

function StatusBadge({ status }: { status: MonitorModel["status"] }) {
  switch (status) {
    case "normal":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />正常
        </Badge>
      );
    case "warning":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <AlertTriangle className="h-3 w-3 mr-1" />告警
        </Badge>
      );
    case "fault":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <XCircle className="h-3 w-3 mr-1" />故障
        </Badge>
      );
    case "offline":
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200">
          <Clock className="h-3 w-3 mr-1" />离线
        </Badge>
      );
  }
}

function AlertLevelBadge({ level }: { level: AlertRecord["level"] }) {
  switch (level) {
    case "critical":
      return <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100" variant="outline">严重</Badge>;
    case "warning":
      return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100" variant="outline">告警</Badge>;
    case "info":
      return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100" variant="outline">提示</Badge>;
  }
}

// ─────────────────────────────────────────────
// 主页面
// ─────────────────────────────────────────────

export default function ModelMonitoringPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedModel, setSelectedModel] = useState<MonitorModel | null>(null);

  // 图表筛选
  const [selectedAirline, setSelectedAirline] = useState("all");
  const [selectedReg, setSelectedReg] = useState("all");

  // 可选架机列表
  const availableAircraft = useMemo(() => {
    if (selectedAirline === "all") {
      return Object.values(aircraftByAirline).flat();
    }
    return aircraftByAirline[selectedAirline] ?? [];
  }, [selectedAirline]);

  // 统计数据
  const totalAlert = monitorModels.reduce((s, m) => s + m.alertCount, 0);
  const totalFault = monitorModels.reduce((s, m) => s + m.faultCount, 0);
  const warningModels = monitorModels.filter((m) => m.status === "warning" || m.status === "fault").length;
  const unresolvedAlerts = alertRecords.filter((a) => !a.resolved).length;

  // 过滤模型列表
  const filteredModels = monitorModels.filter((m) => {
    if (statusFilter !== "all" && m.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return m.name.toLowerCase().includes(s) || m.ataName.includes(s);
    }
    return true;
  });

  // 图表数据
  const trendData = selectedModel
    ? generateTrendData(selectedModel.id, selectedAirline, selectedReg)
    : [];
  const paramData = selectedModel
    ? generateParamData(selectedModel.id, selectedReg === "all" ? "B-ALL" : selectedReg)
    : [];
  const faultByAirlineData = selectedModel
    ? generateFaultByAirline(selectedModel.id)
    : [];

  const handleSelectModel = (model: MonitorModel) => {
    setSelectedModel(model);
    setSelectedAirline("all");
    setSelectedReg("all");
  };

  const handleAirlineChange = (val: string) => {
    setSelectedAirline(val);
    setSelectedReg("all");
  };

  // ─── 详情视图 ───
  if (selectedModel) {
    const modelAlerts = alertRecords.filter((a) => a.modelId === selectedModel.id);
    return (
      <AppShell>
        <header className="border-b border-border bg-card sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5"
              onClick={() => setSelectedModel(null)}
            >
              <ChevronLeft className="h-4 w-4" />
              返回
            </Button>
            <div className="h-4 w-px bg-border" />
            <BarChart2 className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">{selectedModel.name}</h1>
            <StatusBadge status={selectedModel.status} />
            <span className="ml-auto text-xs text-muted-foreground">{selectedModel.version}</span>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
          {/* 筛选条件 */}
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">筛选条件</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground whitespace-nowrap">航司</label>
                  <Select value={selectedAirline} onValueChange={handleAirlineChange}>
                    <SelectTrigger className="w-36 h-8 text-sm">
                      <SelectValue placeholder="全部航司" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部航司</SelectItem>
                      {airlines.map((a) => (
                        <SelectItem key={a.code} value={a.code}>
                          {a.name}（{a.code}）
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-muted-foreground whitespace-nowrap">架机</label>
                  <Select value={selectedReg} onValueChange={setSelectedReg}>
                    <SelectTrigger className="w-36 h-8 text-sm">
                      <SelectValue placeholder="全部架机" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部架机</SelectItem>
                      {availableAircraft.map((ac) => (
                        <SelectItem key={ac.reg} value={ac.reg}>
                          {ac.reg}（{ac.type}）
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" className="gap-1.5 ml-auto">
                  <RefreshCw className="h-3.5 w-3.5" />
                  刷新
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 统计卡片 */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">近30天告警</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{selectedModel.alertCount}</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Bell className="h-4 w-4 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">近30天故障</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{selectedModel.faultCount}</p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                    <ShieldAlert className="h-4 w-4 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">模型准确率</p>
                    <p className="text-2xl font-bold text-foreground mt-1">
                      {selectedModel.accuracy > 0 ? `${selectedModel.accuracy}%` : "-"}
                    </p>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-blue-100 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">当前状态</p>
                    <div className="mt-2">
                      <StatusBadge status={selectedModel.status} />
                    </div>
                  </div>
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-2 gap-5">
            {/* 告警/故障趋势 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">近30天告警与故障趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trendData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      interval={4}
                    />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--border)" }}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line type="monotone" dataKey="告警次数" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="故障次数" stroke="var(--color-chart-4)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 故障分布 by 航司 */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">各航司故障与告警分布</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <ReBarChart data={faultByAirlineData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="airline" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--border)" }} />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="告警次数" fill="var(--color-chart-3)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="故障次数" fill="var(--color-chart-4)" radius={[3, 3, 0, 0]} />
                  </ReBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 参数趋势图（按架机） */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">
                核心参数趋势
                {selectedReg !== "all" && (
                  <span className="ml-2 text-muted-foreground font-normal">— {selectedReg}</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={paramData} margin={{ top: 4, right: 12, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="seg" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: "1px solid var(--border)" }} />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <ReferenceLine y={paramData[0]?.阈值} stroke="var(--color-chart-4)" strokeDasharray="4 3" label={{ value: "阈值", fontSize: 10, fill: "var(--color-chart-4)" }} />
                  <Line type="monotone" dataKey="参数值" stroke="var(--color-chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 告警记录 */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">告警记录</CardTitle>
                <span className="text-xs text-muted-foreground">{modelAlerts.length} 条记录</span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-6">告警ID</TableHead>
                    <TableHead>时间</TableHead>
                    <TableHead>航司</TableHead>
                    <TableHead>架机</TableHead>
                    <TableHead>级别</TableHead>
                    <TableHead>告警信息</TableHead>
                    <TableHead>状态</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {modelAlerts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        暂无告警记录
                      </TableCell>
                    </TableRow>
                  ) : (
                    modelAlerts.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="pl-6 font-mono text-xs">{a.id}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{a.time}</TableCell>
                        <TableCell className="text-xs">{a.airline}</TableCell>
                        <TableCell className="text-xs font-mono">{a.registration}</TableCell>
                        <TableCell><AlertLevelBadge level={a.level} /></TableCell>
                        <TableCell className="text-xs max-w-xs">{a.message}</TableCell>
                        <TableCell>
                          {a.resolved ? (
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">已解决</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs">未解决</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </AppShell>
    );
  }

  // ─── 列表视图 ───
  return (
    <AppShell>
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold text-foreground">模型监控</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* 总览统计 */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">监控模型总数</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{monitorModels.length}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">异常模型</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{warningModels}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">近30天告警</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{totalAlert}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">未处理告警</p>
                  <p className="text-2xl font-bold text-red-600 mt-1">{unresolvedAlerts}</p>
                </div>
                <div className="h-9 w-9 rounded-lg bg-red-100 flex items-center justify-center">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 近期未处理告警 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                近期未处理告警
              </CardTitle>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {unresolvedAlerts} 条待处理
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">告警ID</TableHead>
                  <TableHead>时间</TableHead>
                  <TableHead>模型</TableHead>
                  <TableHead>航司</TableHead>
                  <TableHead>架机</TableHead>
                  <TableHead>级别</TableHead>
                  <TableHead>告警信息</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertRecords
                  .filter((a) => !a.resolved)
                  .map((a) => (
                    <TableRow
                      key={a.id}
                      className="cursor-pointer hover:bg-muted/40"
                      onClick={() => {
                        const m = monitorModels.find((m) => m.id === a.modelId);
                        if (m) handleSelectModel(m);
                      }}
                    >
                      <TableCell className="pl-6 font-mono text-xs">{a.id}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{a.time}</TableCell>
                      <TableCell className="text-xs font-medium">{a.modelName}</TableCell>
                      <TableCell className="text-xs">{a.airline}</TableCell>
                      <TableCell className="text-xs font-mono">{a.registration}</TableCell>
                      <TableCell><AlertLevelBadge level={a.level} /></TableCell>
                      <TableCell className="text-xs max-w-xs text-muted-foreground">{a.message}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 模型清单 */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-sm font-semibold">模型清单</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="搜索模型..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-sm w-52"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-28 h-8 text-sm">
                    <SelectValue placeholder="全部状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="normal">正常</SelectItem>
                    <SelectItem value="warning">告警</SelectItem>
                    <SelectItem value="fault">故障</SelectItem>
                    <SelectItem value="offline">离线</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">模型名称</TableHead>
                  <TableHead>ATA章节</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>近30天告警</TableHead>
                  <TableHead>近30天故障</TableHead>
                  <TableHead>准确率</TableHead>
                  <TableHead>最近告警</TableHead>
                  <TableHead>适用航司</TableHead>
                  <TableHead>版本</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredModels.map((m) => (
                  <TableRow
                    key={m.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => handleSelectModel(m)}
                  >
                    <TableCell className="pl-6 font-medium text-sm">{m.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      ATA {m.ataChapter} · {m.ataName}
                    </TableCell>
                    <TableCell><StatusBadge status={m.status} /></TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${m.alertCount > 10 ? "text-amber-600" : "text-foreground"}`}>
                        {m.alertCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-semibold ${m.faultCount > 3 ? "text-red-600" : "text-foreground"}`}>
                        {m.faultCount}
                      </span>
                    </TableCell>
                    <TableCell>
                      {m.accuracy > 0 ? (
                        <div className="flex items-center gap-1">
                          {m.accuracy >= 95 ? (
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          <span className="text-sm">{m.accuracy}%</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{m.lastAlertTime}</TableCell>
                    <TableCell>
                      <div className="flex gap-1 flex-wrap">
                        {m.applicability.map((code) => (
                          <Badge key={code} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {code}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{m.version}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </AppShell>
  );
}
