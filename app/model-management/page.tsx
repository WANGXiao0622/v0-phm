"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ChevronRight,
  ChevronDown,
  Cpu,
  Search,
  Plus,
  RefreshCw,
  Edit,
  Eye,
  Settings,
  Layers,
  GitBranch,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Wrench,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

// ATA章节分类
const ataChapters = [
  { id: "all", name: "全部", count: 12 },
  { id: "21", name: "ATA 21 - 空调", count: 2 },
  { id: "24", name: "ATA 24 - 电源", count: 1 },
  { id: "27", name: "ATA 27 - 飞控", count: 2 },
  { id: "29", name: "ATA 29 - 液压", count: 1 },
  { id: "32", name: "ATA 32 - 起落架", count: 2 },
  { id: "36", name: "ATA 36 - 引气", count: 2 },
  { id: "49", name: "ATA 49 - APU", count: 1 },
  { id: "72", name: "ATA 72 - 发动机", count: 1 },
];

// 模型数据
interface ModelData {
  id: number;
  name: string;
  ataChapter: string;
  ataName: string;
  lru: string;
  description: string;
  applicability: string;
  status: "active" | "testing" | "inactive" | "deprecated";
  version: string;
  updatedAt: string;
  accuracy: number;
  // 详细信息
  developmentApproach: string;
  parameters: { name: string; type: string; description: string; required: boolean }[];
  applicabilityDetail: { airline: string; aircraftType: string; enabled: boolean }[];
  parameterMapping: { modelParam: string; wqarParam: string; transformation: string }[];
}

const modelData: ModelData[] = [
  {
    id: 1,
    name: "APU EGT超温预警模型",
    ataChapter: "49",
    ataName: "APU",
    lru: "APU, EGT传感器",
    description: "基于EGT温度趋势分析，预测APU性能衰退和超温风险",
    applicability: "ARJ21全系列",
    status: "active",
    version: "v2.3.1",
    updatedAt: "2024-01-10",
    accuracy: 94.5,
    developmentApproach: "采用时序分析方法，基于历史EGT数据建立基线模型，通过滑动窗口检测温度异常趋势。模型结合了统计过程控制(SPC)和机器学习方法，能够识别渐进性衰退和突发性异常。",
    parameters: [
      { name: "egt_threshold", type: "float", description: "EGT温度阈值(℃)", required: true },
      { name: "trend_window", type: "int", description: "趋势分析窗口大小(航段数)", required: true },
      { name: "warning_level", type: "float", description: "预警等级阈值", required: false },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "南方航空", aircraftType: "ARJ21-700", enabled: false },
    ],
    parameterMapping: [
      { modelParam: "EGT_VALUE", wqarParam: "EGT_1", transformation: "直接映射" },
      { modelParam: "N1_SPEED", wqarParam: "N1_1", transformation: "百分比转换" },
      { modelParam: "ALTITUDE", wqarParam: "ALT", transformation: "单位转换(ft->m)" },
    ],
  },
  {
    id: 2,
    name: "HPV开关响应诊断模型",
    ataChapter: "36",
    ataName: "引气",
    lru: "HPV, PRSOV",
    description: "监控高压活门开关响应时间，检测气源系统异常和活门卡滞",
    applicability: "ARJ21全系列",
    status: "active",
    version: "v1.8.0",
    updatedAt: "2024-01-08",
    accuracy: 91.2,
    developmentApproach: "基于物理机理建模，结合活门开关指令与实际位置反馈的时间差分析。采用阈值检测和趋势分析相结合的方法，识别响应延迟和卡滞故障的早期征兆。",
    parameters: [
      { name: "response_threshold", type: "float", description: "响应时间阈值(ms)", required: true },
      { name: "stuck_threshold", type: "float", description: "卡滞判定阈值", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "HPV_CMD", wqarParam: "HPV_COMMAND", transformation: "布尔转换" },
      { modelParam: "HPV_POS", wqarParam: "HPV_POSITION", transformation: "直接映射" },
    ],
  },
  {
    id: 3,
    name: "PRSOV开关响应诊断模型",
    ataChapter: "36",
    ataName: "引气",
    lru: "PRSOV, FAV",
    description: "监控引气预冷器出口活门响应，评估活门健康状态",
    applicability: "ARJ21全系列",
    status: "testing",
    version: "v2.0.0-beta",
    updatedAt: "2024-01-05",
    accuracy: 88.7,
    developmentApproach: "采用状态机模型描述活门工作过程，通过监控状态转换时间和异常状态识别潜在故障。结合历史故障数据进行模式识别，提高诊断准确率。",
    parameters: [
      { name: "state_timeout", type: "int", description: "状态转换超时(ms)", required: true },
      { name: "anomaly_threshold", type: "float", description: "异常检测阈值", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "PRSOV_STATE", wqarParam: "PRSOV_STATUS", transformation: "状态编码" },
      { modelParam: "BLEED_TEMP", wqarParam: "BLEED_AIR_TEMP", transformation: "直接映射" },
    ],
  },
  {
    id: 4,
    name: "刹车温度不一致检测模型",
    ataChapter: "32",
    ataName: "起落架",
    lru: "BSCU, 刹车组件",
    description: "监控各轮刹车温度差异，识别刹车磨损不均或传感器故障",
    applicability: "ARJ21全系列",
    status: "active",
    version: "v1.5.2",
    updatedAt: "2024-01-03",
    accuracy: 92.8,
    developmentApproach: "基于统计分析方法，建立各轮刹车温度的正常差异范围。通过对比分析和趋势跟踪，识别异常温升和温度不对称问题。",
    parameters: [
      { name: "temp_diff_threshold", type: "float", description: "温差阈值(℃)", required: true },
      { name: "trend_sensitivity", type: "float", description: "趋势敏感度", required: false },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "南方航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "BRAKE_TEMP_L1", wqarParam: "BRK_TEMP_L1", transformation: "直接映射" },
      { modelParam: "BRAKE_TEMP_R1", wqarParam: "BRK_TEMP_R1", transformation: "直接映射" },
    ],
  },
  {
    id: 5,
    name: "发动机振动异常检测模型",
    ataChapter: "72",
    ataName: "发动机",
    lru: "发动机, 振动传感器",
    description: "基于振动频谱分析，检测发动机异常振动和潜在故障",
    applicability: "ARJ21-700",
    status: "active",
    version: "v3.1.0",
    updatedAt: "2024-01-12",
    accuracy: 96.3,
    developmentApproach: "采用FFT频谱分析和小波变换方法，提取振动信号的特征频率。结合机器学习分类器，识别不同类型的振动异常模式。",
    parameters: [
      { name: "vib_threshold", type: "float", description: "振动阈值(IPS)", required: true },
      { name: "freq_bands", type: "array", description: "监控频段范围", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "VIB_N1", wqarParam: "ENG_VIB_N1", transformation: "直接映射" },
      { modelParam: "VIB_N2", wqarParam: "ENG_VIB_N2", transformation: "直接映射" },
    ],
  },
  {
    id: 6,
    name: "液压系统泄漏检测模型",
    ataChapter: "29",
    ataName: "液压",
    lru: "液压泵, 蓄压器",
    description: "通过液压油量和压力变化趋势，检测液压系统内部泄漏",
    applicability: "ARJ21全系列",
    status: "active",
    version: "v2.0.1",
    updatedAt: "2024-01-06",
    accuracy: 89.5,
    developmentApproach: "基于质量守恒原理建立液压系统模型，通过监控油量消耗率和压力变化识别泄漏。采用卡尔曼滤波处理测量噪声，提高检测灵敏度。",
    parameters: [
      { name: "leak_rate_threshold", type: "float", description: "泄漏率阈值(ml/h)", required: true },
      { name: "pressure_drop_threshold", type: "float", description: "压降阈值(psi)", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "HYD_QTY", wqarParam: "HYD_FLUID_QTY", transformation: "直接映射" },
      { modelParam: "HYD_PRESS", wqarParam: "HYD_SYS_PRESS", transformation: "直接映射" },
    ],
  },
  {
    id: 7,
    name: "空调组件包性能监控模型",
    ataChapter: "21",
    ataName: "空调",
    lru: "组件包, 涡轮",
    description: "监控空调组件包效率和性能衰退趋势",
    applicability: "ARJ21全系列",
    status: "testing",
    version: "v1.2.0-beta",
    updatedAt: "2024-01-02",
    accuracy: 85.2,
    developmentApproach: "基于热力学原理建立组件包性能模型，通过进出口温度差和流量计算效率。采用趋势分析方法跟踪性能衰退。",
    parameters: [
      { name: "efficiency_threshold", type: "float", description: "效率阈值(%)", required: true },
      { name: "degradation_rate", type: "float", description: "衰退率阈值", required: false },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "PACK_IN_TEMP", wqarParam: "PACK_INLET_TEMP", transformation: "直接映射" },
      { modelParam: "PACK_OUT_TEMP", wqarParam: "PACK_OUTLET_TEMP", transformation: "直接映射" },
    ],
  },
  {
    id: 8,
    name: "空调温度控制异常模型",
    ataChapter: "21",
    ataName: "空调",
    lru: "温控器, 混合活门",
    description: "检测座舱温度控制异常和温控系统故障",
    applicability: "ARJ21全系列",
    status: "inactive",
    version: "v1.0.0",
    updatedAt: "2023-12-15",
    accuracy: 78.5,
    developmentApproach: "基于PID控制原理分析温度控制回路，通过监控设定温度与实际温度的偏差识别控制异常。",
    parameters: [
      { name: "temp_error_threshold", type: "float", description: "温度偏差阈值(℃)", required: true },
    ],
    applicabilityDetail: [],
    parameterMapping: [
      { modelParam: "CABIN_TEMP", wqarParam: "CABIN_ZONE_TEMP", transformation: "直接映射" },
    ],
  },
  {
    id: 9,
    name: "飞控作动器健康监控模型",
    ataChapter: "27",
    ataName: "飞控",
    lru: "作动器, PCU",
    description: "监控飞控作动器响应特性和健康状态",
    applicability: "ARJ21-700",
    status: "active",
    version: "v2.5.0",
    updatedAt: "2024-01-11",
    accuracy: 93.8,
    developmentApproach: "基于系统辨识方法建立作动器动态模型，通过比较实际响应与模型预测识别性能偏差。采用自适应阈值提高检测鲁棒性。",
    parameters: [
      { name: "response_lag", type: "float", description: "响应滞后阈值(ms)", required: true },
      { name: "position_error", type: "float", description: "位置误差阈值(deg)", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "ACTUATOR_CMD", wqarParam: "FLT_CTRL_CMD", transformation: "角度转换" },
      { modelParam: "ACTUATOR_POS", wqarParam: "FLT_CTRL_POS", transformation: "角度转换" },
    ],
  },
  {
    id: 10,
    name: "飞控传感器偏差检测模型",
    ataChapter: "27",
    ataName: "飞控",
    lru: "ADC, AHRS",
    description: "检测飞控传感器数据偏差和故障",
    applicability: "ARJ21全系列",
    status: "deprecated",
    version: "v1.0.0",
    updatedAt: "2023-06-20",
    accuracy: 72.0,
    developmentApproach: "基于冗余传感器数据交叉验证，检测单个传感器的偏差和故障。已被新版本模型替代。",
    parameters: [
      { name: "sensor_deviation", type: "float", description: "偏差阈值", required: true },
    ],
    applicabilityDetail: [],
    parameterMapping: [
      { modelParam: "ALT_1", wqarParam: "ALTITUDE_1", transformation: "直接映射" },
    ],
  },
  {
    id: 11,
    name: "起落架收放异常检测模型",
    ataChapter: "32",
    ataName: "起落架",
    lru: "起落架作动筒, 位置传感器",
    description: "监控起落架收放时间和位置传感器状态",
    applicability: "ARJ21全系列",
    status: "active",
    version: "v1.8.5",
    updatedAt: "2024-01-09",
    accuracy: 95.1,
    developmentApproach: "基于状态机模型监控起落架收放过程，通过时序分析识别异常收放时间和中间状态卡滞。",
    parameters: [
      { name: "retract_time_limit", type: "int", description: "收起时间限制(s)", required: true },
      { name: "extend_time_limit", type: "int", description: "放下时间限制(s)", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "东方航空", aircraftType: "ARJ21-700", enabled: true },
      { airline: "南方航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "GEAR_CMD", wqarParam: "LDG_GEAR_CMD", transformation: "布尔转换" },
      { modelParam: "GEAR_POS", wqarParam: "LDG_GEAR_POS", transformation: "状态编码" },
    ],
  },
  {
    id: 12,
    name: "电源系统负载异常模型",
    ataChapter: "24",
    ataName: "电源",
    lru: "发电机, EPCU",
    description: "监控电源系统负载分配和异常功耗",
    applicability: "ARJ21-700",
    status: "testing",
    version: "v1.1.0-beta",
    updatedAt: "2024-01-04",
    accuracy: 86.4,
    developmentApproach: "基于功率平衡原理建立电源负载模型，通过对比预期负载与实际负载识别异常功耗设备。",
    parameters: [
      { name: "load_imbalance", type: "float", description: "负载不平衡阈值(%)", required: true },
      { name: "overload_threshold", type: "float", description: "过载阈值(kW)", required: true },
    ],
    applicabilityDetail: [
      { airline: "幸福航空", aircraftType: "ARJ21-700", enabled: true },
    ],
    parameterMapping: [
      { modelParam: "GEN_LOAD", wqarParam: "GEN_POWER_OUT", transformation: "直接映射" },
      { modelParam: "BUS_VOLT", wqarParam: "DC_BUS_VOLTAGE", transformation: "直接映射" },
    ],
  },
];

// 状态徽章
const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-emerald-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          运行中
        </Badge>
      );
    case "testing":
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
          <Clock className="h-3 w-3 mr-1" />
          测试中
        </Badge>
      );
    case "inactive":
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
          <XCircle className="h-3 w-3 mr-1" />
          已停用
        </Badge>
      );
    case "deprecated":
      return (
        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          已弃用
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function ModelManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAta, setSelectedAta] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedModel, setSelectedModel] = useState<ModelData | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // 筛选模型数据
  const filteredModels = modelData.filter((model) => {
    // ATA筛选
    if (selectedAta !== "all" && model.ataChapter !== selectedAta) {
      return false;
    }
    // 状态筛选
    if (statusFilter !== "all" && model.status !== statusFilter) {
      return false;
    }
    // 搜索筛选
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        model.name.toLowerCase().includes(search) ||
        model.lru.toLowerCase().includes(search) ||
        model.description.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // 打开模型详情
  const openModelDetail = (model: ModelData) => {
    setSelectedModel(model);
    setDetailDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Activity className="h-4 w-4" />
              首页
            </Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              模型管理
            </span>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* 左侧ATA章节导航 */}
          <div className="w-56 flex-shrink-0">
            <Card className="border border-border sticky top-20">
              <CardHeader className="py-3 px-4 border-b border-border">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  ATA章节
                </CardTitle>
              </CardHeader>
              <CardContent className="p-2">
                <div className="space-y-1">
                  {ataChapters.map((chapter) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedAta(chapter.id)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                        selectedAta === chapter.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "hover:bg-muted text-foreground"
                      }`}
                    >
                      <span>{chapter.name}</span>
                      <Badge variant="outline" className="text-xs h-5">
                        {chapter.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧模型列表 */}
          <div className="flex-1">
            <Card className="border border-border">
              <CardHeader className="border-b border-border py-3 px-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-primary" />
                    模型列表
                    <Badge variant="outline" className="ml-2">
                      {filteredModels.length} 个模型
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="搜索模型名称/LRU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 w-[200px]"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[120px] h-8">
                        <SelectValue placeholder="状态筛选" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">全部状态</SelectItem>
                        <SelectItem value="active">运行中</SelectItem>
                        <SelectItem value="testing">测试中</SelectItem>
                        <SelectItem value="inactive">已停用</SelectItem>
                        <SelectItem value="deprecated">已弃用</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline" className="gap-1">
                      <RefreshCw className="h-4 w-4" />
                      刷新
                    </Button>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      新增模型
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[220px]">模型名称</TableHead>
                      <TableHead className="w-[100px]">ATA章节</TableHead>
                      <TableHead className="w-[140px]">LRU部件</TableHead>
                      <TableHead>模型描述</TableHead>
                      <TableHead className="w-[120px]">适用性</TableHead>
                      <TableHead className="w-[80px]">准确率</TableHead>
                      <TableHead className="w-[100px]">状态</TableHead>
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredModels.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          没有找到匹配的模型
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredModels.map((model) => (
                        <TableRow
                          key={model.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => openModelDetail(model)}
                        >
                          <TableCell className="font-medium">{model.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              ATA {model.ataChapter}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {model.lru.split(", ").map((part, idx) => (
                                <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                                  {part}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate" title={model.description}>
                            {model.description}
                          </TableCell>
                          <TableCell className="text-sm">{model.applicability}</TableCell>
                          <TableCell>
                            <span className={`font-medium ${model.accuracy >= 90 ? "text-emerald-600" : model.accuracy >= 80 ? "text-amber-600" : "text-red-600"}`}>
                              {model.accuracy}%
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(model.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openModelDetail(model);
                                }}
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* 模型详情对话框 */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="!max-w-[1000px] w-[90vw] h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  {selectedModel?.name}
                </DialogTitle>
                <DialogDescription className="mt-1">
                  {selectedModel?.description}
                </DialogDescription>
              </div>
              <div className="flex items-center gap-2">
                {selectedModel && getStatusBadge(selectedModel.status)}
                <Badge variant="outline">{selectedModel?.version}</Badge>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <Tabs defaultValue="basic" className="h-full flex flex-col">
              <TabsList className="w-full justify-start border-b rounded-none h-10 bg-transparent p-0">
                <TabsTrigger value="basic" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  基本信息
                </TabsTrigger>
                <TabsTrigger value="development" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  开发思路
                </TabsTrigger>
                <TabsTrigger value="parameters" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  模型参数
                </TabsTrigger>
                <TabsTrigger value="applicability" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  适用性配置
                </TabsTrigger>
                <TabsTrigger value="mapping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent">
                  参数适配关系
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1 pt-4">
                {/* 基本信息 */}
                <TabsContent value="basic" className="m-0 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">模型名称</Label>
                        <p className="font-medium mt-1">{selectedModel?.name}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">ATA章节</Label>
                        <p className="font-medium mt-1">ATA {selectedModel?.ataChapter} - {selectedModel?.ataName}</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">LRU部件</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedModel?.lru.split(", ").map((part, idx) => (
                            <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700">
                              <Wrench className="h-3 w-3 mr-1" />
                              {part}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">版本信息</Label>
                        <p className="font-medium mt-1 flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          {selectedModel?.version}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">模型准确率</Label>
                        <p className={`font-medium mt-1 text-lg ${
                          (selectedModel?.accuracy || 0) >= 90 ? "text-emerald-600" : 
                          (selectedModel?.accuracy || 0) >= 80 ? "text-amber-600" : "text-red-600"
                        }`}>
                          {selectedModel?.accuracy}%
                        </p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-lg border">
                        <Label className="text-muted-foreground text-xs">最后更新</Label>
                        <p className="font-medium mt-1">{selectedModel?.updatedAt}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <Label className="text-muted-foreground text-xs">模型描述</Label>
                    <p className="mt-2 text-sm">{selectedModel?.description}</p>
                  </div>
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <Label className="text-muted-foreground text-xs">适用性说明</Label>
                    <p className="mt-2 text-sm">{selectedModel?.applicability}</p>
                  </div>
                </TabsContent>

                {/* 开发思路 */}
                <TabsContent value="development" className="m-0">
                  <div className="p-6 bg-muted/30 rounded-lg border">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Settings className="h-4 w-4 text-primary" />
                      模型开发思路
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {selectedModel?.developmentApproach}
                    </p>
                  </div>
                </TabsContent>

                {/* 模型参数 */}
                <TabsContent value="parameters" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">参数名称</TableHead>
                        <TableHead className="w-[100px]">类型</TableHead>
                        <TableHead>描述</TableHead>
                        <TableHead className="w-[80px]">必填</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedModel?.parameters.map((param, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm font-medium">{param.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{param.type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{param.description}</TableCell>
                          <TableCell>
                            {param.required ? (
                              <Badge variant="outline" className="bg-red-50 text-red-600">必填</Badge>
                            ) : (
                              <Badge variant="outline" className="bg-gray-50 text-gray-600">可选</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* 适用性配置 */}
                <TabsContent value="applicability" className="m-0">
                  {selectedModel?.applicabilityDetail.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      暂无适用性配置
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">航司</TableHead>
                          <TableHead className="w-[200px]">机型</TableHead>
                          <TableHead className="w-[100px]">启用状态</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedModel?.applicabilityDetail.map((item, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-medium">{item.airline}</TableCell>
                            <TableCell>{item.aircraftType}</TableCell>
                            <TableCell>
                              {item.enabled ? (
                                <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  已启用
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-50 text-gray-600">
                                  <XCircle className="h-3 w-3 mr-1" />
                                  未启用
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </TabsContent>

                {/* 参数适配关系 */}
                <TabsContent value="mapping" className="m-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">模型参数</TableHead>
                        <TableHead className="w-[200px]">WQAR参数</TableHead>
                        <TableHead>转换方式</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedModel?.parameterMapping.map((mapping, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-sm font-medium text-blue-600">{mapping.modelParam}</TableCell>
                          <TableCell className="font-mono text-sm">{mapping.wqarParam}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{mapping.transformation}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
