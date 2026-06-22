"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronRight,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Activity,
  AlertTriangle,
  Plane,
  ClipboardList,
  Users,
  Database,
  Plus,
} from "lucide-react";
import Link from "next/link";

// 故障分析列表数据
const faultList = [
  {
    id: "F2024001",
    time: "2024-01-15 14:32",
    ata: "72-31",
    registration: "B-1234",
    location: "ZUCK-ZHHH",
    description: "监控发现APU EGT温度高",
    status: "completed",
    hasWQAR: true,
  },
  {
    id: "F2024002",
    time: "2024-01-14 09:15",
    ata: "29-11",
    registration: "B-5678",
    location: "ZLLL-ZUCK",
    description: "航后检查有APU引气阀故障",
    status: "processing",
    hasWQAR: true,
  },
  {
    id: "F2024003",
    time: "2024-01-13 16:45",
    ata: "24-22",
    registration: "B-9012",
    location: "ZWBL-ZWSH",
    description: "短停落地后有刹车降级信息",
    status: "pending",
    hasWQAR: false,
  },
  {
    id: "F2024004",
    time: "2024-01-12 11:20",
    ata: "73-21",
    registration: "B-3456",
    location: "ZSSS-ZLXY",
    description: "落地滑跑阶段出现刹车不派遣",
    status: "transferred",
    hasWQAR: true,
  },
  {
    id: "F2024005",
    time: "2024-01-11 08:55",
    ata: "72-50",
    registration: "B-7890",
    location: "ZSYW-ZGGG",
    description: "双发启动后出现发动机引气故障",
    status: "processing",
    hasWQAR: false,
  },
];

// 型号任务数据
const modelTaskList = [
  {
    id: "M2024001",
    source: "C919",
    taskName: "完成PRSOV故障诊断模型航线故障统计与参数确认",
    deadline: "2024-02-15",
    status: "processing",
  },
  {
    id: "M2024002",
    source: "C909",
    taskName: "完成HPV故障诊断模型原理与模型可行性分析",
    deadline: "2024-02-20",
    status: "pending",
  },
  {
    id: "M2024003",
    source: "运行支持",
    taskName: "完成HPV故障诊断模型开发与部署",
    deadline: "2024-01-30",
    status: "completed",
  },
  {
    id: "M2024004",
    source: "创新平台",
    taskName: "完成C919健康管理模型验证流程梳理",
    deadline: "2024-03-01",
    status: "processing",
  },
  {
    id: "M2024005",
    source: "其它",
    taskName: "完成C919健康管理模型验证评审要求",
    deadline: "2024-02-10",
    status: "pending",
  },
];

// 其它任务数据
const otherTaskList = [
  {
    id: "O2024001",
    time: "2024-01-16",
    description: "完成本月模型开发进展汇报ppt",
    delivery: "PPT报告",
    status: "processing",
  },
  {
    id: "O2024002",
    time: "2024-01-18",
    description: "完成健康管理与性能监控平台需求分析报告",
    delivery: "Word文档",
    status: "pending",
  },
  {
    id: "O2024003",
    time: "2024-01-10",
    description: "完成健康管理与性能监控平台技术报告",
    delivery: "Word文档",
    status: "completed",
  },
  {
    id: "O2024004",
    time: "2024-01-20",
    description: "完成健康管理与性能监控平台原型开发",
    delivery: "系统原型",
    status: "pending",
  },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge variant="outline" className="text-muted-foreground border-muted-foreground/30">
          <Clock className="h-3 w-3 mr-1" />
          待处理
        </Badge>
      );
    case "processing":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-300">
          <Activity className="h-3 w-3 mr-1" />
          处理中
        </Badge>
      );
    case "completed":
      return (
        <Badge variant="outline" className="text-emerald-600 border-emerald-300">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          已完成
        </Badge>
      );
    case "transferred":
      return (
        <Badge variant="outline" className="text-purple-600 border-purple-300">
          <Users className="h-3 w-3 mr-1" />
          已转派
        </Badge>
      );
    default:
      return null;
  }
};

const getSourceBadge = (source: string) => {
  const colorMap: Record<string, string> = {
    C919: "bg-blue-100 text-blue-700 border-blue-200",
    C909: "bg-cyan-100 text-cyan-700 border-cyan-200",
    运行支持: "bg-amber-100 text-amber-700 border-amber-200",
    创新平台: "bg-purple-100 text-purple-700 border-purple-200",
    其它: "bg-gray-100 text-gray-700 border-gray-200",
  };
  return <Badge className={colorMap[source] || colorMap["其它"]}>{source}</Badge>;
};

export default function TaskManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"fault" | "model" | "other">("fault");

  // 新增型号任务对话框状态
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [newModelTask, setNewModelTask] = useState({
    source: "",
    taskName: "",
    deadline: "",
  });

  // 新增其它任务对话框状态
  const [otherDialogOpen, setOtherDialogOpen] = useState(false);
  const [newOtherTask, setNewOtherTask] = useState({
    time: "",
    description: "",
    delivery: "",
  });

  const filteredFaults = faultList.filter(
    (fault) =>
      fault.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fault.ata.includes(searchTerm) ||
      fault.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fault.description.includes(searchTerm)
  );

  const filteredModelTasks = modelTaskList.filter(
    (task) =>
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.taskName.includes(searchTerm) ||
      task.source.includes(searchTerm)
  );

  const filteredOtherTasks = otherTaskList.filter(
    (task) =>
      task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.includes(searchTerm)
  );

  const handleAddModelTask = () => {
    // 这里可以添加实际的任务创建逻辑
    console.log("新增型号任务:", newModelTask);
    setModelDialogOpen(false);
    setNewModelTask({ source: "", taskName: "", deadline: "" });
  };

  const handleAddOtherTask = () => {
    // 这里可以添加实际的任务创建逻辑
    console.log("新增其它任务:", newOtherTask);
    setOtherDialogOpen(false);
    setNewOtherTask({ time: "", description: "", delivery: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary-foreground" />
              </div>
            </Link>
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
      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            首页
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">任务管理</span>
        </div>

        {/* 分类标签 */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={activeTab === "fault" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("fault")}
            className="gap-1"
          >
            <AlertTriangle className="h-4 w-4" />
            故障分析列表
          </Button>
          <Button
            variant={activeTab === "model" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("model")}
            className="gap-1"
          >
            <Plane className="h-4 w-4" />
            型号任务
          </Button>
          <Button
            variant={activeTab === "other" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab("other")}
            className="gap-1"
          >
            <ClipboardList className="h-4 w-4" />
            其它任务
          </Button>
        </div>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-3 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">
                {activeTab === "fault" && "故障分析列表"}
                {activeTab === "model" && "型号任务"}
                {activeTab === "other" && "其它任务"}
              </CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[240px] h-8"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-1" />
                  筛选
                </Button>

                {/* 型号任务新增按钮 */}
                {activeTab === "model" && (
                  <Dialog open={modelDialogOpen} onOpenChange={setModelDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        新增任务
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle>新增型号任务</DialogTitle>
                        <DialogDescription>
                          填写任务信息，创建新的型号任务
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="source">任务来源</Label>
                          <Select
                            value={newModelTask.source}
                            onValueChange={(value) =>
                              setNewModelTask({ ...newModelTask, source: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择任务来源" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="C919">C919</SelectItem>
                              <SelectItem value="C909">C909</SelectItem>
                              <SelectItem value="运行支持">运行支持</SelectItem>
                              <SelectItem value="创新平台">创新平台</SelectItem>
                              <SelectItem value="其它">其它</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="taskName">任务名称</Label>
                          <Input
                            id="taskName"
                            value={newModelTask.taskName}
                            onChange={(e) =>
                              setNewModelTask({ ...newModelTask, taskName: e.target.value })
                            }
                            placeholder="请输入任务名称"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="deadline">完成时间</Label>
                          <Input
                            id="deadline"
                            type="date"
                            value={newModelTask.deadline}
                            onChange={(e) =>
                              setNewModelTask({ ...newModelTask, deadline: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setModelDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleAddModelTask}>确认创建</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}

                {/* 其它任务新增按钮 */}
                {activeTab === "other" && (
                  <Dialog open={otherDialogOpen} onOpenChange={setOtherDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="gap-1">
                        <Plus className="h-4 w-4" />
                        新增任务
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[480px]">
                      <DialogHeader>
                        <DialogTitle>新增其它任务</DialogTitle>
                        <DialogDescription>
                          填写任务信息，创建临时安排的科室内部任务
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="time">时间</Label>
                          <Input
                            id="time"
                            type="date"
                            value={newOtherTask.time}
                            onChange={(e) =>
                              setNewOtherTask({ ...newOtherTask, time: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">任务描述</Label>
                          <Textarea
                            id="description"
                            value={newOtherTask.description}
                            onChange={(e) =>
                              setNewOtherTask({ ...newOtherTask, description: e.target.value })
                            }
                            placeholder="请输入任务描述"
                            rows={3}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="delivery">交付方式</Label>
                          <Select
                            value={newOtherTask.delivery}
                            onValueChange={(value) =>
                              setNewOtherTask({ ...newOtherTask, delivery: value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="选择交付方式" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PPT报告">PPT报告</SelectItem>
                              <SelectItem value="Word文档">Word文档</SelectItem>
                              <SelectItem value="Excel表格">Excel表格</SelectItem>
                              <SelectItem value="会议纪要">会议纪要</SelectItem>
                              <SelectItem value="培训文档">培训文档</SelectItem>
                              <SelectItem value="其它">其它</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setOtherDialogOpen(false)}>
                          取消
                        </Button>
                        <Button onClick={handleAddOtherTask}>确认创建</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* 故障分析列表 */}
            {activeTab === "fault" && (
              <>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-secondary/50 text-xs text-muted-foreground border-b border-border">
                  <div className="col-span-2">故障时间</div>
                  <div className="col-span-1">ATA章节</div>
                  <div className="col-span-1">注册号</div>
                  <div className="col-span-2">起降机场</div>
                  <div className="col-span-2">故障描述</div>
                  <div className="col-span-1">状态</div>
                  <div className="col-span-2">WQAR数据</div>
                  <div className="col-span-1">操作</div>
                </div>
                {filteredFaults.map((fault) => (
                  <div
                    key={fault.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-border hover:bg-secondary/30 transition-colors items-center"
                  >
                    <div className="col-span-2 text-muted-foreground">{fault.time}</div>
                    <div className="col-span-1 font-medium text-foreground">{fault.ata}</div>
                    <div className="col-span-1 text-muted-foreground">{fault.registration}</div>
                    <div className="col-span-2 text-muted-foreground truncate">{fault.location}</div>
                    <div className="col-span-2 text-muted-foreground truncate">{fault.description}</div>
                    <div className="col-span-1">{getStatusBadge(fault.status)}</div>
                    <div className="col-span-2">
                      {fault.hasWQAR ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                          <Database className="h-3 w-3 mr-1" />
                          有数据
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-500 border-gray-200">
                          <Database className="h-3 w-3 mr-1" />
                          无数据
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Link href={`/task-management/fault-analysis/${fault.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          分析
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {filteredFaults.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>没有找到匹配的故障记录</p>
                  </div>
                )}
              </>
            )}

            {/* 型号任务列表 */}
            {activeTab === "model" && (
              <>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-secondary/50 text-xs text-muted-foreground border-b border-border">
                  <div className="col-span-2">任务来源</div>
                  <div className="col-span-5">任务名</div>
                  <div className="col-span-2">完成时间</div>
                  <div className="col-span-2">状态</div>
                  <div className="col-span-1">操作</div>
                </div>
                {filteredModelTasks.map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-border hover:bg-secondary/30 transition-colors items-center"
                  >
                    <div className="col-span-2">{getSourceBadge(task.source)}</div>
                    <div className="col-span-5 text-foreground">{task.taskName}</div>
                    <div className="col-span-2 text-muted-foreground">{task.deadline}</div>
                    <div className="col-span-2">{getStatusBadge(task.status)}</div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        详情
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredModelTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>没有找到匹配的型号任务</p>
                  </div>
                )}
              </>
            )}

            {/* 其它任务列表 */}
            {activeTab === "other" && (
              <>
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-secondary/50 text-xs text-muted-foreground border-b border-border">
                  <div className="col-span-2">时间</div>
                  <div className="col-span-5">任务描述</div>
                  <div className="col-span-2">交付方式</div>
                  <div className="col-span-2">状态</div>
                  <div className="col-span-1">操作</div>
                </div>
                {filteredOtherTasks.map((task) => (
                  <div
                    key={task.id}
                    className="grid grid-cols-12 gap-2 px-4 py-3 text-sm border-b border-border hover:bg-secondary/30 transition-colors items-center"
                  >
                    <div className="col-span-2 text-muted-foreground">{task.time}</div>
                    <div className="col-span-5 text-foreground">{task.description}</div>
                    <div className="col-span-2">
                      <Badge variant="outline">{task.delivery}</Badge>
                    </div>
                    <div className="col-span-2">{getStatusBadge(task.status)}</div>
                    <div className="col-span-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2">
                        详情
                        <ChevronRight className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredOtherTasks.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Search className="h-8 w-8 mb-2 opacity-50" />
                    <p>没有找到匹配的任务</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
