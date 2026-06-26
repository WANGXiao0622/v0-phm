"use client";

import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronRight,
  User,
  Link2,
  MessageSquare,
  Eye,
  ClipboardCheck,
  Layers,
} from "lucide-react";

// ─── 类型 ───────────────────────────────────────────────────────────────────
type RequirementStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "responded";

interface Requirement {
  id: string;
  title: string;
  submitter: string;
  submittedAt: string;
  status: RequirementStatus;
  priority: "high" | "medium" | "low";
  source: string;
  description: string;
  typicalCase: string;
  solution: string;
  dataResource: string;
  impactAnalysis: string;
  // 审批
  approvalComment?: string;
  approvedBy?: string;
  approvedAt?: string;
  // 响应
  linkedModelId?: number;
  linkedModelName?: string;
  responseNote?: string;
  respondedBy?: string;
  respondedAt?: string;
}

// ─── 模型清单（与 model-management 保持同步） ───────────────────────────────
const availableModels = [
  { id: 1, name: "APU EGT超温预警模型", ataChapter: "ATA 49 - APU", version: "v2.3.1" },
  { id: 2, name: "HPV开关响应诊断模型", ataChapter: "ATA 36 - 引气", version: "v1.8.0" },
  { id: 3, name: "起落架收放时间监控模型", ataChapter: "ATA 32 - 起落架", version: "v3.1.0" },
  { id: 4, name: "飞控系统舵面偏转分析模型", ataChapter: "ATA 27 - 飞控", version: "v2.0.4" },
  { id: 5, name: "发动机振动趋势预测模型", ataChapter: "ATA 72 - 发动机", version: "v1.5.2" },
  { id: 6, name: "液压系统压力衰减检测模型", ataChapter: "ATA 29 - 液压", version: "v1.2.0" },
];

// ─── 初始数据 ──────────────────────────────────────────────────────────────
const initialRequirements: Requirement[] = [
  {
    id: "REQ-2024-001",
    title: "APU启动失败预测模型需求",
    submitter: "张工",
    submittedAt: "2024-01-10",
    status: "responded",
    priority: "high",
    source: "运营维护",
    description: "当前APU启动失败事件频发，需要通过历史数据建立预测模型，提前识别APU可能存在的启动失败风险。",
    typicalCase: "2023年12月某航班APU三次启动失败，延误2小时，造成较大经济损失。",
    solution: "基于WQAR数据中的EGT、N速度、启动时序等参数，建立多元回归或时序分析模型。",
    dataResource: "需要近3年APU启动数据，包含正常和异常样本各不少于500条。",
    impactAnalysis: "可减少APU启动失败导致的航班延误约60%，预计年节省成本200万元。",
    approvalComment: "需求合理，数据可获取，优先级高，批准立项。",
    approvedBy: "李总",
    approvedAt: "2024-01-12",
    linkedModelId: 1,
    linkedModelName: "APU EGT超温预警模型",
    responseNote: "关联现有APU EGT超温预警模型，扩展启动失败场景。将在v2.4.0版本中新增启动失败预测逻辑。",
    respondedBy: "研发团队",
    respondedAt: "2024-01-15",
  },
  {
    id: "REQ-2024-002",
    title: "起落架收放异常早期预警需求",
    submitter: "王工",
    submittedAt: "2024-01-14",
    status: "approved",
    priority: "medium",
    source: "航线维护",
    description: "起落架收放时间异常是结构故障的重要前兆，需要建立早期预警机制。",
    typicalCase: "2024年1月某机型连续3个航班起落架收起时间超标，后发现液压系统渗漏。",
    solution: "采集收放时间序列，与基线对比，超出动态阈值时触发预警。",
    dataResource: "需近2年起落架WQAR数据，含收放时序参数。",
    impactAnalysis: "预计可将起落架相关AOG事件减少40%。",
    approvalComment: "数据充足，方案可行，同意立项。",
    approvedBy: "李总",
    approvedAt: "2024-01-16",
  },
  {
    id: "REQ-2024-003",
    title: "引气系统泄漏检测需求",
    submitter: "陈工",
    submittedAt: "2024-01-18",
    status: "pending",
    priority: "high",
    source: "质量安全",
    description: "引气系统泄漏难以在飞行中及时发现，需要基于温度压力参数建立实时检测模型。",
    typicalCase: "2023年11月某航班引气泄漏导致客舱温度异常，备降处置。",
    solution: "通过温度压差异常检测，结合PRSOV阀位信号进行综合判断。",
    dataResource: "需要引气系统全参数WQAR数据，含温度、压力、阀位等。",
    impactAnalysis: "可显著提升引气系统健康监控覆盖率，减少因引气故障导致的备降率。",
  },
  {
    id: "REQ-2024-004",
    title: "电源系统电压波动分析需求",
    submitter: "刘工",
    submittedAt: "2024-01-20",
    status: "draft",
    priority: "low",
    source: "工程技术",
    description: "电源系统电压频繁波动影响航电设备稳定性，需要建立波动分析与根因定位模型。",
    typicalCase: "近期多架飞机出现航电设备偶发性失效，初步判断与电压波动相关。",
    solution: "分析WQAR中的电压参数时序，识别异常波动模式并关联故障信息。",
    dataResource: "需要电源系统WQAR参数及对应MEL/PIREP记录。",
    impactAnalysis: "有助于减少航电设备故障率，提升飞行安全裕度。",
  },
];

// ─── 状态配置 ─────────────────────────────────────────────────────────────
const statusConfig: Record<
  RequirementStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }
> = {
  draft: { label: "草稿", variant: "secondary", icon: FileText },
  pending: { label: "待审批", variant: "outline", icon: Clock },
  approved: { label: "已批准", variant: "default", icon: CheckCircle2 },
  rejected: { label: "已驳回", variant: "destructive", icon: XCircle },
  responded: { label: "已响应", variant: "default", icon: ClipboardCheck },
};

const priorityConfig: Record<
  "high" | "medium" | "low",
  { label: string; className: string }
> = {
  high: { label: "高", className: "text-red-600 bg-red-50 border-red-200" },
  medium: { label: "中", className: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "低", className: "text-emerald-600 bg-emerald-50 border-emerald-200" },
};

// ─── 空表单 ────────────────────────────────────────────────────────────────
const emptyForm = {
  title: "",
  source: "",
  priority: "medium" as "high" | "medium" | "low",
  description: "",
  typicalCase: "",
  solution: "",
  dataResource: "",
  impactAnalysis: "",
};

// ─── 主组件 ────────────────────────────────────────────────────────────────
export default function RequirementManagementPage() {
  const [requirements, setRequirements] = useState<Requirement[]>(initialRequirements);
  const [searchKeyword, setSearchKeyword] = useState("");

  // 新建需求
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyForm);

  // 详情/审批/响应 Dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

  // 审批表单
  const [approvalComment, setApprovalComment] = useState("");

  // 响应表单
  const [linkedModelId, setLinkedModelId] = useState<string>("");
  const [responseNote, setResponseNote] = useState("");

  // ── 筛选 ────────────────────────────────────────────────────────────────
  const filtered = requirements.filter(
    (r) =>
      r.title.includes(searchKeyword) ||
      r.submitter.includes(searchKeyword) ||
      r.id.includes(searchKeyword)
  );

  const byStatus = (status: RequirementStatus) =>
    filtered.filter((r) => r.status === status);

  const pendingCount = requirements.filter((r) => r.status === "pending").length;
  const approvedCount = requirements.filter((r) => r.status === "approved" || r.status === "responded").length;

  // ── 打开详情 ──────────────────────────────────────────────────────────
  const openDetail = (req: Requirement) => {
    setSelectedReq(req);
    setApprovalComment(req.approvalComment ?? "");
    setLinkedModelId(req.linkedModelId ? String(req.linkedModelId) : "");
    setResponseNote(req.responseNote ?? "");
    setDetailDialogOpen(true);
  };

  // ── 提交需求 ──────────────────────────────────────────────────────────
  const handleSubmitCreate = (asDraft: boolean) => {
    const newReq: Requirement = {
      id: `REQ-2024-00${requirements.length + 1}`,
      ...createForm,
      submitter: "当前用户",
      submittedAt: new Date().toISOString().split("T")[0],
      status: asDraft ? "draft" : "pending",
    };
    setRequirements((prev) => [newReq, ...prev]);
    setCreateForm(emptyForm);
    setCreateDialogOpen(false);
  };

  // ── 审批 ──────────────────────────────────────────────────────────────
  const handleApproval = (approved: boolean) => {
    if (!selectedReq) return;
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: approved ? "approved" : "rejected",
              approvalComment,
              approvedBy: "审批人",
              approvedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    setDetailDialogOpen(false);
  };

  // ── 响应 ──────────────────────────────────────────────────────────────
  const handleResponse = () => {
    if (!selectedReq || !linkedModelId) return;
    const model = availableModels.find((m) => m.id === Number(linkedModelId));
    setRequirements((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? {
              ...r,
              status: "responded",
              linkedModelId: Number(linkedModelId),
              linkedModelName: model?.name ?? "",
              responseNote,
              respondedBy: "研发团队",
              respondedAt: new Date().toISOString().split("T")[0],
            }
          : r
      )
    );
    setDetailDialogOpen(false);
  };

  // ── 需求列表表格 ──────────────────────────────────────────────────────
  const RequirementTable = ({ items }: { items: Requirement[] }) => (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-[130px] text-xs">需求编号</TableHead>
            <TableHead className="text-xs">需求标题</TableHead>
            <TableHead className="w-[80px] text-xs">优先级</TableHead>
            <TableHead className="w-[80px] text-xs">提交人</TableHead>
            <TableHead className="w-[100px] text-xs">提交时间</TableHead>
            <TableHead className="w-[90px] text-xs">状态</TableHead>
            <TableHead className="w-[80px] text-xs text-center">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground py-10 text-sm">
                暂无数据
              </TableCell>
            </TableRow>
          )}
          {items.map((req) => {
            const sc = statusConfig[req.status];
            const pc = priorityConfig[req.priority];
            const Icon = sc.icon;
            return (
              <TableRow key={req.id} className="hover:bg-muted/30">
                <TableCell className="font-mono text-xs text-muted-foreground">{req.id}</TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-foreground">{req.title}</span>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{req.description}</p>
                </TableCell>
                <TableCell>
                  <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${pc.className}`}>
                    {pc.label}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-foreground">{req.submitter}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{req.submittedAt}</TableCell>
                <TableCell>
                  <Badge variant={sc.variant} className="gap-1 text-xs">
                    <Icon className="h-3 w-3" />
                    {sc.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs gap-1"
                    onClick={() => openDetail(req)}
                  >
                    <Eye className="h-3 w-3" />
                    详情
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <AppShell>
      {/* 页头 */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">需求管理</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-4">
        {/* 统计卡片 */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "全部需求", value: requirements.length, color: "text-primary", bg: "bg-primary/10" },
            { label: "待审批", value: pendingCount, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "已批准/响应", value: approvedCount, color: "text-emerald-600", bg: "bg-emerald-50" },
            {
              label: "已驳回",
              value: requirements.filter((r) => r.status === "rejected").length,
              color: "text-red-600",
              bg: "bg-red-50",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 搜索栏 */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索需求编号/标题/提交人..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* 三大模块 Tabs */}
        <Tabs defaultValue="submit" className="space-y-4">
          <div className="flex items-center justify-between">
            <TabsList className="h-10">
              <TabsTrigger value="submit" className="text-base gap-1.5 px-5">
                <FileText className="h-4 w-4" />
                需求提出
                <span className="ml-1 text-xs bg-muted rounded px-1">
                  {filtered.filter((r) => r.status === "draft" || r.status === "pending").length}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approval" className="text-base gap-1.5 px-5">
                <ClipboardCheck className="h-4 w-4" />
                需求审批
                {pendingCount > 0 && (
                  <span className="ml-1 text-xs bg-amber-100 text-amber-700 rounded px-1">
                    {pendingCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="response" className="text-base gap-1.5 px-5">
                <Layers className="h-4 w-4" />
                需求响应
                <span className="ml-1 text-xs bg-muted rounded px-1">
                  {filtered.filter((r) => r.status === "approved" || r.status === "responded").length}
                </span>
              </TabsTrigger>
            </TabsList>

            <Button size="sm" className="gap-2" onClick={() => setCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              提出需求
            </Button>
          </div>

          {/* ── 需求提出 ───────────────────────────────────────────────────── */}
          <TabsContent value="submit" className="space-y-3">
            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  需求列表（草稿 / 待审批）
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <RequirementTable
                  items={filtered.filter(
                    (r) => r.status === "draft" || r.status === "pending"
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── 需求审批 ───────────────────────────────────────────────────── */}
          <TabsContent value="approval" className="space-y-3">
            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  待审批需求
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <RequirementTable items={byStatus("pending")} />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  已审批记录
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <RequirementTable
                  items={filtered.filter(
                    (r) => r.status === "approved" || r.status === "rejected" || r.status === "responded"
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── 需求响应 ───────────────────────────────────────────────────── */}
          <TabsContent value="response" className="space-y-3">
            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  待响应需求（已批准）
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <RequirementTable items={byStatus("approved")} />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Link2 className="h-4 w-4 text-primary" />
                  已响应需求
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                {/* 已响应的展示关联模型信息 */}
                <div className="rounded-md border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[130px] text-xs">需求编号</TableHead>
                        <TableHead className="text-xs">需求标题</TableHead>
                        <TableHead className="text-xs">关联模型</TableHead>
                        <TableHead className="w-[100px] text-xs">响应时间</TableHead>
                        <TableHead className="w-[80px] text-xs text-center">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {byStatus("responded").length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                            暂无已响应需求
                          </TableCell>
                        </TableRow>
                      )}
                      {byStatus("responded").map((req) => (
                        <TableRow key={req.id} className="hover:bg-muted/30">
                          <TableCell className="font-mono text-xs text-muted-foreground">{req.id}</TableCell>
                          <TableCell className="text-sm font-medium text-foreground">{req.title}</TableCell>
                          <TableCell>
                            {req.linkedModelName ? (
                              <div className="flex items-center gap-1.5">
                                <Layers className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                                <span className="text-xs text-foreground">{req.linkedModelName}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground">{req.respondedAt ?? "—"}</TableCell>
                          <TableCell className="text-center">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1"
                              onClick={() => openDetail(req)}
                            >
                              <Eye className="h-3 w-3" />
                              详情
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* ════════════════════════════════════════════════════════════════════
          新建需求 Dialog
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[88vh] flex flex-col p-0 gap-0">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              新建需求
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-5 py-1">
              {/* 需求基本信息 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">1</span>
                  需求基本信息
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground">需求标题 *</Label>
                    <Input
                      placeholder="请输入需求标题"
                      value={createForm.title}
                      onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">优先级 *</Label>
                    <Select
                      value={createForm.priority}
                      onValueChange={(v) =>
                        setCreateForm((p) => ({ ...p, priority: v as "high" | "medium" | "low" }))
                      }
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">高</SelectItem>
                        <SelectItem value="medium">中</SelectItem>
                        <SelectItem value="low">低</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground">提交人</Label>
                    <div className="flex items-center gap-2 h-9 px-3 rounded-md border border-border bg-muted/30">
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">当前用户</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 需求来源 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">2</span>
                  需求来源
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">来源部门/场景 *</Label>
                  <Select
                    value={createForm.source}
                    onValueChange={(v) => setCreateForm((p) => ({ ...p, source: v }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="请选择来源" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="运营维护">运营维护</SelectItem>
                      <SelectItem value="航线维护">航线维护</SelectItem>
                      <SelectItem value="质量安全">质量安全</SelectItem>
                      <SelectItem value="工程技术">工程技术</SelectItem>
                      <SelectItem value="飞行运行">飞行运行</SelectItem>
                      <SelectItem value="客户服务">客户服务</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>

              {/* 需求描述 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">3</span>
                  需求描述
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">详细描述 *</Label>
                  <Textarea
                    placeholder="请详细描述需求背景、目的和预期效果..."
                    value={createForm.description}
                    onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                    className="min-h-[80px] text-sm resize-y"
                  />
                </div>
              </section>

              {/* 典型案例 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">4</span>
                  典型案例
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">相关典型案例或事件</Label>
                  <Textarea
                    placeholder="请描述相关典型案例、事件经过及影响..."
                    value={createForm.typicalCase}
                    onChange={(e) => setCreateForm((p) => ({ ...p, typicalCase: e.target.value }))}
                    className="min-h-[70px] text-sm resize-y"
                  />
                </div>
              </section>

              {/* 初步解决思路 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">5</span>
                  初步解决思路
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">解决方案初步想法</Label>
                  <Textarea
                    placeholder="请描述初步解决思路、技术方案方向..."
                    value={createForm.solution}
                    onChange={(e) => setCreateForm((p) => ({ ...p, solution: e.target.value }))}
                    className="min-h-[70px] text-sm resize-y"
                  />
                </div>
              </section>

              {/* 数据与资源需求 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">6</span>
                  数据与资源需求
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">所需数据及资源说明</Label>
                  <Textarea
                    placeholder="请说明实现此需求所需的数据类型、数量、时间范围及计算资源等..."
                    value={createForm.dataResource}
                    onChange={(e) => setCreateForm((p) => ({ ...p, dataResource: e.target.value }))}
                    className="min-h-[70px] text-sm resize-y"
                  />
                </div>
              </section>

              {/* 影响分析 */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 border-b border-border pb-1.5">
                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">7</span>
                  影响分析
                </h3>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">预期影响与收益分析</Label>
                  <Textarea
                    placeholder="请分析该需求实现后的预期效益、风险及影响范围..."
                    value={createForm.impactAnalysis}
                    onChange={(e) => setCreateForm((p) => ({ ...p, impactAnalysis: e.target.value }))}
                    className="min-h-[70px] text-sm resize-y"
                  />
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="gap-2 px-6 py-4 border-t border-border flex-shrink-0">
            <Button variant="outline" size="sm" onClick={() => setCreateDialogOpen(false)}>
              取消
            </Button>
            <Button variant="secondary" size="sm" onClick={() => handleSubmitCreate(true)}>
              保存草稿
            </Button>
            <Button size="sm" onClick={() => handleSubmitCreate(false)}>
              提交审核
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ════════════════════════════════════════════════════════════════════
          详情 / 审批 / 响应 Dialog
      ════════════════════════════════════════════════════════════════════ */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[88vh] flex flex-col p-0 gap-0">
          {selectedReq && (
            <>
              <DialogHeader className="px-6 pt-5 pb-4 border-b border-border flex-shrink-0">
                <DialogTitle className="flex items-center gap-2 text-base">
                  <span className="font-mono text-sm text-muted-foreground">{selectedReq.id}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  {selectedReq.title}
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-5 py-1">
                  {/* 基本信息摘要 */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "提交人", value: selectedReq.submitter },
                      { label: "提交时间", value: selectedReq.submittedAt },
                      { label: "需求来源", value: selectedReq.source },
                    ].map((item) => (
                      <div key={item.label} className="bg-muted/40 rounded-md px-3 py-2">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-medium text-foreground mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* 详情各节 */}
                  {[
                    { label: "需求描述", value: selectedReq.description },
                    { label: "典型案例", value: selectedReq.typicalCase },
                    { label: "初步解决思路", value: selectedReq.solution },
                    { label: "数据与资源需求", value: selectedReq.dataResource },
                    { label: "影响分析", value: selectedReq.impactAnalysis },
                  ].map((sec) => (
                    <section key={sec.label} className="space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {sec.label}
                      </p>
                      <p className="text-sm text-foreground bg-muted/30 rounded-md px-3 py-2.5 leading-relaxed">
                        {sec.value || "—"}
                      </p>
                    </section>
                  ))}

                  {/* ── 审批环节 ─────────────────────────────────────────── */}
                  <section className="space-y-2 border-t border-border pt-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <ClipboardCheck className="h-4 w-4 text-primary" />
                      审批环节
                    </h3>

                    {/* 已有审批结果 */}
                    {(selectedReq.status === "approved" ||
                      selectedReq.status === "rejected" ||
                      selectedReq.status === "responded") && (
                      <div
                        className={`rounded-md px-3 py-2.5 text-sm space-y-1 border ${
                          selectedReq.status === "rejected"
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        }`}
                      >
                        <div className="flex items-center gap-2 font-medium">
                          {selectedReq.status === "rejected" ? (
                            <XCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          {selectedReq.status === "rejected" ? "已驳回" : "已批准"}
                          <span className="text-xs font-normal opacity-70 ml-auto">
                            {selectedReq.approvedBy} · {selectedReq.approvedAt}
                          </span>
                        </div>
                        <p className="text-xs opacity-80">{selectedReq.approvalComment}</p>
                      </div>
                    )}

                    {/* 待审批时显示审批操作 */}
                    {selectedReq.status === "pending" && (
                      <div className="space-y-2">
                        <div className="space-y-1.5">
                          <Label className="text-xs text-muted-foreground">审批意见 *</Label>
                          <Textarea
                            placeholder="请填写审批意见..."
                            value={approvalComment}
                            onChange={(e) => setApprovalComment(e.target.value)}
                            className="min-h-[70px] text-sm resize-y"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="gap-1.5"
                            onClick={() => handleApproval(false)}
                            disabled={!approvalComment.trim()}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            驳回
                          </Button>
                          <Button
                            size="sm"
                            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={() => handleApproval(true)}
                            disabled={!approvalComment.trim()}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            批准
                          </Button>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* ── 需求响应环节 ──────────────────────────────────────── */}
                  {(selectedReq.status === "approved" || selectedReq.status === "responded") && (
                    <section className="space-y-2 border-t border-border pt-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-primary" />
                        需求响应
                      </h3>

                      {/* 已有响应结果 */}
                      {selectedReq.status === "responded" ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-md px-3 py-2.5 space-y-2">
                          <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
                            <Layers className="h-4 w-4" />
                            关联模型：{selectedReq.linkedModelName}
                            <span className="text-xs font-normal opacity-70 ml-auto">
                              {selectedReq.respondedBy} · {selectedReq.respondedAt}
                            </span>
                          </div>
                          <p className="text-xs text-blue-600 leading-relaxed">{selectedReq.responseNote}</p>
                        </div>
                      ) : (
                        /* 待响应，显示响应操作 */
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">关联模型清单 *</Label>
                            <Select value={linkedModelId} onValueChange={setLinkedModelId}>
                              <SelectTrigger className="text-sm">
                                <SelectValue placeholder="请选择关联模型" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableModels.map((m) => (
                                  <SelectItem key={m.id} value={String(m.id)}>
                                    <div className="flex flex-col">
                                      <span className="font-medium">{m.name}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {m.ataChapter} · {m.version}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-xs text-muted-foreground">响应说明 *</Label>
                            <Textarea
                              placeholder="请说明如何通过关联模型响应此需求，包括扩展计划、版本说明等..."
                              value={responseNote}
                              onChange={(e) => setResponseNote(e.target.value)}
                              className="min-h-[80px] text-sm resize-y"
                            />
                          </div>
                          <Button
                            size="sm"
                            className="gap-1.5"
                            onClick={handleResponse}
                            disabled={!linkedModelId || !responseNote.trim()}
                          >
                            <Link2 className="h-3.5 w-3.5" />
                            提交响应
                          </Button>
                        </div>
                      )}
                    </section>
                  )}
                </div>
              </div>

              <DialogFooter className="px-6 py-4 border-t border-border flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => setDetailDialogOpen(false)}>
                  关闭
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
