"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  FileText,
  BarChart3,
  ChevronRight,
  Play,
  RefreshCw,
  Cpu,
  ChevronDown,
  ChevronUp,
  Save,
  Send,
  Users,
  Activity,
  ChevronLeft,
  Plane,
  Plus,
  Link2,
  Clock,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import Link from "next/link";

// ATA章节与推荐模板的映射
const ataTemplateMapping: Record<string, string> = {
  "71": "template1", // 动力装置 -> 发动机振动分析
  "72": "template1", // 发动机 -> 发动机振动分析
  "73": "template2", // 燃油系统 -> 燃油系统分析
  "28": "template2", // 燃油 -> 燃油系统分析
  "29": "template3", // 液压 -> 液压系统分析
  "24": "template4", // 电气 -> 电气系统分析
  "33": "template4", // 灯光 -> 电气系统分析
};

// 模板数据
const templates = [
  { id: "template1", name: "APU EGT超温", params: ["N1", "N2", "EGT", "VIB"] },
  { id: "template2", name: "刹车系统降级", params: ["FF", "FQT", "FP", "FOT"] },
  { id: "template3", name: "HPV开关响应", params: ["HYD_P", "HYD_Q", "HYD_T"] },
  { id: "template4", name: "PRSOV故障", params: ["V_AC", "V_DC", "FREQ", "LOAD"] },
];

// 模型数据
const models = [
  { id: "model1", name: "APU防喘阀性能监控模型" },
  { id: "model2", name: "刹车系统控制性能监控模型" },
  { id: "model3", name: "HPV性能监控模型" },
  { id: "model4", name: "PRSOV故障诊断预测模型" },
];

// 模拟参数图表数据 - 用于多图展示
const generateChartData = (segmentIndex: number = 0) => {
  const baseN1 = 85 + segmentIndex * 2;
  const baseN2 = 88 + segmentIndex * 1.5;
  return Array.from({ length: 20 }, (_, i) => ({
    time: `T${i + 1}`,
    N1: baseN1 + Math.random() * 10,
    N2: baseN2 + Math.random() * 8,
    EGT: 650 + segmentIndex * 10 + Math.random() * 50,
    VIB: 1.2 + Math.random() * 0.8,
  }));
};

// 生成EGT专项图表数据
const generateEGTChartData = (segmentIndex: number = 0) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `T${i + 1}`,
    EGT1: 640 + segmentIndex * 8 + Math.random() * 40,
    EGT2: 645 + segmentIndex * 8 + Math.random() * 35,
    limit: 700,
  }));
};

// 生成综合趋势图表数据
const generateTrendChartData = (segmentIndex: number = 0) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: `T${i + 1}`,
    performance: 92 - segmentIndex * 2 + Math.random() * 5,
    baseline: 95,
    trend: 90 - segmentIndex * 1.5 - (i * 0.1),
  }));
};

// 模拟航段数据
const flightSegments = [
  { id: "seg1", registration: "B-104X", startTime: "2026-05-20 07:56:21", departure: "PEK", arrival: "SHA", filename: "B-104X_20260520_075621.csv" },
  { id: "seg2", registration: "B-104X", startTime: "2026-05-20 10:32:15", departure: "SHA", arrival: "CAN", filename: "B-104X_20260520_103215.csv" },
  { id: "seg3", registration: "B-104X", startTime: "2026-05-20 14:18:42", departure: "CAN", arrival: "PEK", filename: "B-104X_20260520_141842.csv" },
  { id: "seg4", registration: "B-104Y", startTime: "2026-05-21 08:05:33", departure: "PEK", arrival: "CTU", filename: "B-104Y_20260521_080533.csv" },
  { id: "seg5", registration: "B-104Y", startTime: "2026-05-21 12:45:18", departure: "CTU", arrival: "SHA", filename: "B-104Y_20260521_124518.csv" },
];

// 模拟模型分析图表数据 - 用于多图展示
const generateModelChartData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i + 1}:00`,
    actual: 75 + Math.random() * 15,
    predicted: 78 + Math.random() * 12,
    threshold: 90,
  }));
};

// 生成模型健康指数数据
const generateHealthIndexData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i + 1}:00`,
    healthIndex: 85 + Math.random() * 10,
    warning: 80,
    critical: 70,
  }));
};

// 生成模型异常检测数据
const generateAnomalyData = () => {
  return Array.from({ length: 15 }, (_, i) => ({
    time: `${i + 1}:00`,
    score: Math.random() * 100,
    anomalyThreshold: 75,
  }));
};

// 当前故障的ATA章节（模拟数据）
const currentATA = "72";

// 模拟故障关联列表数据（参考故障统计列表结构）
const relatedFaults = [
  { 
    id: "FA-2024-0156", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2024-01-12 14:30:00", 
    route: "PVG-PEK", 
    status: "analyzed" as const,
    // 故障基本信息
    basicInfo: {
      partNumber: "11CB67",
      component: "APU",
      eicas: "暂无",
      description: "航后检查发现CMS信息：APU BLEED SERVO VALVE。",
      newInfo: "更换引气伺服阀后，测试正常。"
    },
    // 分析结果
    analysisResult: {
      conclusion: "引气伺服阀内部密封圈老化，导致阀门响应迟缓。",
      rootCause: "部件使用时间超过建议更换周期，密封材料性能下降。",
      recommendation: "建议按照维护手册要求，定期更换密封圈，周期为3000飞行小时。",
      analyst: "张工",
      analyzeDate: "2024-01-13 16:20:00"
    }
  },
  { 
    id: "FA-2024-0148", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2024-01-10 09:15:00", 
    route: "PEK-SHA", 
    status: "analyzed" as const,
    basicInfo: {
      partNumber: "11CB67",
      component: "APU",
      eicas: "暂无",
      description: "起飞前检查发现APU引气异常。",
      newInfo: "复位后恢复正常，持续监控。"
    },
    analysisResult: {
      conclusion: "瞬态信号干扰导致误报警。",
      rootCause: "电磁环境干扰。",
      recommendation: "持续监控，如再次发生则需检查线路屏蔽。",
      analyst: "李工",
      analyzeDate: "2024-01-11 10:30:00"
    }
  },
  { 
    id: "FA-2024-0142", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2024-01-05 16:45:00", 
    route: "SHA-CAN", 
    status: "pending" as const,
    basicInfo: {
      partNumber: "11CB67",
      component: "APU",
      eicas: "暂无",
      description: "落地后发现CMS记录。",
      newInfo: ""
    },
    analysisResult: null
  },
  { 
    id: "FA-2023-0098", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2023-12-28 11:20:00", 
    route: "CAN-PEK", 
    status: "analyzed" as const,
    basicInfo: {
      partNumber: "11CB65",
      component: "APU",
      eicas: "APU FAULT",
      description: "航中出现APU故障告警。",
      newInfo: "落地后检查发现引气阀卡滞。"
    },
    analysisResult: {
      conclusion: "引气伺服阀机械卡滞。",
      rootCause: "阀芯表面有异物附着。",
      recommendation: "清洁阀芯并进行功能测试。",
      analyst: "王工",
      analyzeDate: "2023-12-29 14:00:00"
    }
  },
  { 
    id: "FA-2023-0092", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2023-12-20 08:30:00", 
    route: "PEK-CAN", 
    status: "analyzed" as const,
    basicInfo: {
      partNumber: "11CB65",
      component: "APU",
      eicas: "暂无",
      description: "例行检查发现历史CMS记录。",
      newInfo: "检查确认阀门工作正常。"
    },
    analysisResult: {
      conclusion: "间歇性信号问题，阀门本身无故障。",
      rootCause: "连接器接触不良。",
      recommendation: "清洁并紧固连接器。",
      analyst: "赵工",
      analyzeDate: "2023-12-21 11:00:00"
    }
  },
  { 
    id: "FA-2023-0085", 
    cmsMessage: "APU BLEED SERVO VALVE", 
    registration: "B-104X", 
    ataChapter: "49", 
    faultDate: "2023-12-15 15:10:00", 
    route: "SHA-CTU", 
    status: "analyzed" as const,
    basicInfo: {
      partNumber: "11CB65",
      component: "APU",
      eicas: "暂无",
      description: "滑行期间出现CMS信息。",
      newInfo: "地面测试未能复现。"
    },
    analysisResult: {
      conclusion: "低温环境下阀门响应延迟。",
      rootCause: "润滑脂在低温下粘度增加。",
      recommendation: "更换低温润滑脂。",
      analyst: "张工",
      analyzeDate: "2023-12-16 09:30:00"
    }
  },
];

export default function FaultAnalysisPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [modelTimeRange, setModelTimeRange] = useState("24h");
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [templateChartData, setTemplateChartData] = useState<ReturnType<typeof generateChartData>>([]);
  const [egtChartData, setEgtChartData] = useState<ReturnType<typeof generateEGTChartData>>([]);
  const [trendChartData, setTrendChartData] = useState<ReturnType<typeof generateTrendChartData>>([]);
  const [modelChartData, setModelChartData] = useState<ReturnType<typeof generateModelChartData>>([]);
  const [healthIndexData, setHealthIndexData] = useState<ReturnType<typeof generateHealthIndexData>>([]);
  const [anomalyData, setAnomalyData] = useState<ReturnType<typeof generateAnomalyData>>([]);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // 航段筛选相关状态
  const [showSegmentFilter, setShowSegmentFilter] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(2); // 当前航段索引（故障发生航段）
  const [loadedSegments, setLoadedSegments] = useState<number[]>([]); // 已加载的航段索引列表
  
  // 关联故障展开状态
  const [isRelatedFaultsExpanded, setIsRelatedFaultsExpanded] = useState(false);
  
  // 关联故障详情弹窗状态
  const [selectedRelatedFault, setSelectedRelatedFault] = useState<typeof relatedFaults[number] | null>(null);
  const [relatedFaultDialogOpen, setRelatedFaultDialogOpen] = useState(false);

  // 分析结果各小标题内容（可手动输入并暂存）
  const [analysisResultForm, setAnalysisResultForm] = useState({
    faultSegmentDescription: "",
    dataAnalysis: "",
    previousSegmentAnomaly: "",
    modelAnalysis: "",
    lruReplacement: "",
    conclusion: "",
  });

  // 获取推荐的模板ID
  const recommendedTemplateId = ataTemplateMapping[currentATA] || null;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowSegmentFilter(true);
    setIsLoadingTemplate(true);
    // 初始加载当前航段
    setLoadedSegments([currentSegmentIndex]);
    setTimeout(() => {
      setTemplateChartData(generateChartData(currentSegmentIndex));
      setEgtChartData(generateEGTChartData(currentSegmentIndex));
      setTrendChartData(generateTrendChartData(currentSegmentIndex));
      setIsLoadingTemplate(false);
    }, 1000);
  };

  // 加载前一个航段（向后按钮）
  const loadPreviousSegment = () => {
    if (currentSegmentIndex > 0) {
      const newIndex = currentSegmentIndex - 1;
      if (!loadedSegments.includes(newIndex)) {
        setLoadedSegments(prev => [...prev, newIndex].sort((a, b) => a - b));
      }
      setCurrentSegmentIndex(newIndex);
      setIsLoadingTemplate(true);
      setTimeout(() => {
        setTemplateChartData(generateChartData(newIndex));
        setEgtChartData(generateEGTChartData(newIndex));
        setTrendChartData(generateTrendChartData(newIndex));
        setIsLoadingTemplate(false);
      }, 800);
    }
  };

  // 加载后一个航段（向前按钮）
  const loadNextSegment = () => {
    if (currentSegmentIndex < flightSegments.length - 1) {
      const newIndex = currentSegmentIndex + 1;
      if (!loadedSegments.includes(newIndex)) {
        setLoadedSegments(prev => [...prev, newIndex].sort((a, b) => a - b));
      }
      setCurrentSegmentIndex(newIndex);
      setIsLoadingTemplate(true);
      setTimeout(() => {
        setTemplateChartData(generateChartData(newIndex));
        setEgtChartData(generateEGTChartData(newIndex));
        setTrendChartData(generateTrendChartData(newIndex));
        setIsLoadingTemplate(false);
      }, 800);
    }
  };

  const handleModelLoad = () => {
    if (!selectedModel) return;
    setIsLoadingModel(true);
    setTimeout(() => {
      setModelChartData(generateModelChartData());
      setHealthIndexData(generateHealthIndexData());
      setAnomalyData(generateAnomalyData());
      setIsLoadingModel(false);
    }, 1500);
  };

  // 获取模板按钮的样式
  const getTemplateButtonStyle = (templateId: string) => {
    if (selectedTemplate === templateId) {
      // 选中状态 - 暗绿色
      return "bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-700";
    }
    if (recommendedTemplateId === templateId) {
      // 推荐状态 - 浅绿色
      return "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300";
    }
    // 默认状态
    return "";
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

      <main className="max-w-6xl mx-auto px-6 py-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            首页
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/task-management" className="hover:text-foreground">
            任务管理
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">故障分析</span>
        </div>

        <div className="flex flex-col gap-4">
        {/* 第一部分：故障基本信息（紧凑版） */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <AlertCircle className="h-4 w-4 text-primary" />
              故障基本信息
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            {/* 第一排：ATA章节、注册号、日期、起降机场、部件、件号 */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-sm">
              <div>
                <Label className="text-muted-foreground text-xs">ATA章节</Label>
                <Input
                  value="49"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">注册号</Label>
                <Input
                  value="B-104X"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">日期</Label>
                <Input
                  value="2024-01-15"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">起降机场</Label>
                <Input
                  value="PEK - SHA"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">部件</Label>
                <Input
                  value="APU"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">件号</Label>
                <Input
                  value="11CB67"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
            </div>

            {/* 第二排：CMS信息、EICAS信息 */}
            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
              <div>
                <Label className="text-muted-foreground text-xs">CMS信息</Label>
                <Input
                  value="APU BLEED SERVO VALVE"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">EICAS信息</Label>
                <Input
                  value="暂无"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
            </div>

            {/* 可折叠的故障描述 */}
            <div className="mt-3">
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-xs">故障描述</span>
                {isDescriptionExpanded ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
              {isDescriptionExpanded && (
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>报送时间: 2024-01-15 14:32:00</span>
                  </div>
                  <Textarea
                    value="航后检查发现有历史CMS信息：APU BLEED SERVO VALVE。"
                    disabled
                    className="bg-input border-border text-foreground text-sm min-h-[50px]"
                  />
                  <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                    <span className="text-orange-700 font-medium">新增信息：</span>
                    <span className="text-orange-600">拆下件号4952545，序号：9BV19（原装机件）。</span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 故障关联列表 */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <Link2 className="h-4 w-4 text-primary" />
              故障关联列表
              <Badge variant="outline" className="ml-2 text-xs">
                基于 APU BLEED SERVO VALVE & B-104X 匹配
              </Badge>
              <Badge className="ml-1 bg-blue-100 text-blue-700 border-blue-200 text-xs">
                {relatedFaults.length} 条相关记录
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {/* 默认显示前3条 */}
              {relatedFaults.slice(0, 3).map((fault) => (
                <div 
                  key={fault.id} 
                  className={`flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors ${fault.status === "analyzed" ? "cursor-pointer" : ""}`}
                  onClick={() => {
                    if (fault.status === "analyzed") {
                      setSelectedRelatedFault(fault);
                      setRelatedFaultDialogOpen(true);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{fault.cmsMessage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{fault.faultDate.split(" ")[0]}</span>
                    <Badge variant="outline" className="text-xs">{fault.route}</Badge>
                    <Badge 
                      variant="outline" 
                      className={fault.status === "analyzed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}
                    >
                      {fault.status === "analyzed" ? "已分析" : "待分析"}
                    </Badge>
                    {fault.status === "analyzed" && (
                      <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              ))}
              
              {/* 可展开的更多记录 */}
              {relatedFaults.length > 3 && (
                <>
                  {isRelatedFaultsExpanded && (
                    <div className="space-y-2">
                      {relatedFaults.slice(3).map((fault) => (
                        <div 
                          key={fault.id} 
                          className={`flex items-center justify-between p-2 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors ${fault.status === "analyzed" ? "cursor-pointer" : ""}`}
                          onClick={() => {
                            if (fault.status === "analyzed") {
                              setSelectedRelatedFault(fault);
                              setRelatedFaultDialogOpen(true);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-sm">{fault.cmsMessage}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{fault.faultDate.split(" ")[0]}</span>
                            <Badge variant="outline" className="text-xs">{fault.route}</Badge>
                            <Badge 
                              variant="outline" 
                              className={fault.status === "analyzed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}
                            >
                              {fault.status === "analyzed" ? "已分析" : "待分析"}
                            </Badge>
                            {fault.status === "analyzed" && (
                              <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => setIsRelatedFaultsExpanded(!isRelatedFaultsExpanded)}
                    className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors w-full justify-center py-2"
                  >
                    {isRelatedFaultsExpanded ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        收起更多记录
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        展开更多 {relatedFaults.length - 3} 条记录
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 第二部分：模板参数分析 */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <FileText className="h-4 w-4 text-primary" />
              模板参数分析
              {recommendedTemplateId && (
                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                  根据ATA章节推荐
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap gap-3">
              {templates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`min-w-[140px] ${getTemplateButtonStyle(template.id)}`}
                >
                  {template.name}
                  {recommendedTemplateId === template.id && selectedTemplate !== template.id && (
                    <span className="ml-1 text-xs">(推荐)</span>
                  )}
                </Button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">已加载参数:</span>
                  <span className="text-foreground">
                    {templates.find(t => t.id === selectedTemplate)?.params.join(", ")}
                  </span>
                </div>

                {/* 航段筛选模块 */}
                {showSegmentFilter && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-border">
                    <div className="flex items-center gap-2">
                      <Plane className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">航段筛选</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadPreviousSegment}
                        disabled={currentSegmentIndex === 0 || isLoadingTemplate}
                        className="h-8"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        向后
                      </Button>
                      
                      <div className="px-4 py-2 bg-background border rounded-md min-w-[280px] text-center">
                        <div className="text-sm font-medium">
                          {flightSegments[currentSegmentIndex].startTime}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flightSegments[currentSegmentIndex].departure} - {flightSegments[currentSegmentIndex].arrival}
                        </div>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadNextSegment}
                        disabled={currentSegmentIndex === flightSegments.length - 1 || isLoadingTemplate}
                        className="h-8"
                      >
                        向前
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>

                    <div className="ml-auto flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground whitespace-nowrap">已加载航段:</span>
                      <div className="flex flex-wrap gap-1">
                        {loadedSegments.map((idx) => (
                          <Badge 
                            key={idx} 
                            variant={idx === currentSegmentIndex ? "default" : "outline"}
                            className="text-xs cursor-pointer font-mono"
                            onClick={() => {
                              setCurrentSegmentIndex(idx);
                              setIsLoadingTemplate(true);
                              setTimeout(() => {
                                setTemplateChartData(generateChartData(idx));
                                setEgtChartData(generateEGTChartData(idx));
                                setTrendChartData(generateTrendChartData(idx));
                                setIsLoadingTemplate(false);
                              }, 500);
                            }}
                          >
                            {flightSegments[idx].filename}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {isLoadingTemplate ? (
                  <div className="flex items-center justify-center h-[200px] bg-secondary/50 rounded-lg">
                    <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground text-sm">加载参数数据中...</span>
                  </div>
                ) : templateChartData.length > 0 ? (
                  <div className="space-y-3">
                    {/* 第一排：两张并排图表 */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* 图表1: N1/N2转速 */}
                      <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                          N1/N2 转速趋势
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                          <LineChart data={templateChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                            <YAxis stroke="#6b7280" fontSize={10} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "11px",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                            <Line type="monotone" dataKey="N1" stroke="#3b82f6" strokeWidth={2} dot={false} name="N1%" />
                            <Line type="monotone" dataKey="N2" stroke="#10b981" strokeWidth={2} dot={false} name="N2%" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* 图表2: EGT温度 */}
                      <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                        <div className="text-sm font-medium mb-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                          EGT 排气温度
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                          <AreaChart data={egtChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                            <YAxis stroke="#6b7280" fontSize={10} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #e5e7eb",
                                borderRadius: "6px",
                                fontSize: "11px",
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: "11px" }} />
                            <Area type="monotone" dataKey="EGT1" stroke="#f97316" fill="#f97316" fillOpacity={0.2} name="EGT1" />
                            <Area type="monotone" dataKey="EGT2" stroke="#ea580c" fill="#ea580c" fillOpacity={0.2} name="EGT2" />
                            <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeDasharray="5 5" name="限制值" dot={false} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* 第二排：一张图表 */}
                    <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                      <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        性能指标
                      </div>
                      <ResponsiveContainer width="100%" height={180}>
                        <AreaChart data={trendChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                          <YAxis stroke="#6b7280" fontSize={10} domain={[60, 100]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "#fff",
                              border: "1px solid #e5e7eb",
                              borderRadius: "6px",
                              fontSize: "11px",
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: "11px" }} />
                          <Area type="monotone" dataKey="performance" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.2} name="性能指数" />
                          <Line type="monotone" dataKey="baseline" stroke="#22c55e" strokeDasharray="5 5" name="基线" dot={false} />
                          <Line type="monotone" dataKey="trend" stroke="#ef4444" strokeWidth={2} name="趋势线" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ) : null}
              </div>
            )}

            {!selectedTemplate && (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground bg-secondary/30 rounded-lg">
                <FileText className="h-6 w-6 mb-2 opacity-50" />
                <p className="text-sm">请选择一个分析模板</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 第三部分：模型分析 */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <Cpu className="h-4 w-4 text-primary" />
              模型分析
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              {models.map((model) => (
                <Button
                  key={model.id}
                  variant={selectedModel === model.id ? "default" : "outline"}
                  onClick={() => setSelectedModel(model.id)}
                  size="sm"
                >
                  {model.name}
                </Button>
              ))}

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">时间:</span>
                <div className="flex gap-1">
                  {["1h", "6h", "24h", "7d", "自定义"].map((range) => (
                    <Button
                      key={range}
                      variant={modelTimeRange === range ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (range === "自定义") {
                          // 切换自定义时间选择器的显示状态
                          setModelTimeRange(modelTimeRange === "自定义" ? "24h" : "自定义");
                        } else {
                          setModelTimeRange(range);
                        }
                      }}
                      className="px-2"
                    >
                      {range}
                    </Button>
                  ))}
                </div>

                {modelTimeRange === "自定义" && (
                  <div className="flex items-center gap-2">
                    <Input
                      type="datetime-local"
                      className="h-8 w-[160px] text-xs"
                      placeholder="开始时间"
                    />
                    <span className="text-muted-foreground text-sm">至</span>
                    <Input
                      type="datetime-local"
                      className="h-8 w-[160px] text-xs"
                      placeholder="结束时间"
                    />
                  </div>
                )}

                <Button
                  onClick={handleModelLoad}
                  disabled={!selectedModel || isLoadingModel}
                  size="sm"
                  className="ml-2"
                >
                  {isLoadingModel ? (
                    <>
                      <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                      加载中
                    </>
                  ) : (
                    <>
                      <Play className="mr-1 h-3 w-3" />
                      模型加载
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isLoadingModel ? (
              <div className="flex items-center justify-center h-[200px] bg-secondary/50 rounded-lg">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground text-sm">模型分析中...</span>
              </div>
            ) : modelChartData.length > 0 ? (
              <div className="space-y-3">
                {/* 第一排：两张并排图表 */}
                <div className="grid grid-cols-2 gap-3">
                  {/* 图表1 */}
                  <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      xxx
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={modelChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "11px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Area type="monotone" dataKey="actual" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} name="实际值" />
                        <Area type="monotone" dataKey="predicted" stroke="#10b981" fill="#10b981" fillOpacity={0.2} name="预测值" />
                        <Line type="monotone" dataKey="threshold" stroke="#ef4444" strokeDasharray="5 5" name="阈值" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  {/* 图表2 */}
                  <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      xxx
                    </div>
                    <ResponsiveContainer width="100%" height={180}>
                      <AreaChart data={healthIndexData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                        <YAxis stroke="#6b7280" fontSize={10} domain={[50, 100]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            fontSize: "11px",
                          }}
                        />
                        <Legend wrapperStyle={{ fontSize: "11px" }} />
                        <Area type="monotone" dataKey="healthIndex" stroke="#10b981" fill="#10b981" fillOpacity={0.3} name="健康指数" />
                        <Line type="monotone" dataKey="warning" stroke="#f59e0b" strokeDasharray="5 5" name="警告线" dot={false} />
                        <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeDasharray="5 5" name="临界线" dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 第二排：一张图表 */}
                <div className="bg-secondary/30 rounded-lg p-3 border border-border">
                  <div className="text-sm font-medium mb-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                    xxx
                  </div>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={anomalyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={10} />
                      <YAxis stroke="#6b7280" fontSize={10} domain={[0, 100]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #e5e7eb",
                          borderRadius: "6px",
                          fontSize: "11px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "11px" }} />
                      <Area type="monotone" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="异常得分" />
                      <Line type="monotone" dataKey="anomalyThreshold" stroke="#ef4444" strokeDasharray="5 5" name="异常阈值" dot={false} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground bg-secondary/30 rounded-lg">
                <Cpu className="h-6 w-6 mb-2 opacity-50" />
                <p className="text-sm">选择模型和时间后，点击「模型加载」</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 第四部分：分析结果 */}
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="border-b border-border py-2 px-4">
            <CardTitle className="flex items-center gap-2 text-foreground text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              分析结果
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-3">
            <div className="space-y-1.5">
              <Textarea
                value={analysisResultForm.faultSegmentDescription}
                onChange={(e) =>
                  setAnalysisResultForm((prev) => ({
                    ...prev,
                    faultSegmentDescription: e.target.value,
                  }))
                }
                placeholder={"请填写分析结果，建议包含以下内容：\n1. 故障航段描述\n2. 数据分析\n3. 前序航段异常\n4. 模型分析\n5. LRU拆换信息\n6. 结论"}
                className="bg-input border-border text-foreground text-sm min-h-[220px] resize-y"
              />
            </div>

            <div className="flex justify-end gap-3 pt-1">
              <Button variant="outline" size="sm">
                <Save className="mr-1 h-3 w-3" />
                暂存
              </Button>
              <Button variant="outline" size="sm">
                <Users className="mr-1 h-3 w-3" />
                转派
              </Button>
              <Button size="sm">
                <Send className="mr-1 h-3 w-3" />
                提交
              </Button>
            </div>
          </CardContent>
        </Card>
        </div>
      </main>

      {/* 关联故障详情弹窗 */}
      <Dialog open={relatedFaultDialogOpen} onOpenChange={setRelatedFaultDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-3">
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              故障分析详情 - {selectedRelatedFault?.id}
            </DialogTitle>
            <DialogDescription>
              {selectedRelatedFault?.cmsMessage} | {selectedRelatedFault?.faultDate}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            {selectedRelatedFault && (
              <div className="space-y-4 py-4">
                {/* 故障基本信息 */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    故障基本信息
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground text-xs">ATA章节</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.ataChapter}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">注册号</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.registration}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">日期</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.faultDate.split(" ")[0]}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">起降机场</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.route}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">部件</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.basicInfo.component}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">件号</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.basicInfo.partNumber}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-muted-foreground text-xs">CMS信息</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.cmsMessage}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground text-xs">EICAS信息</Label>
                      <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.basicInfo.eicas}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">故障描述</Label>
                    <div className="mt-1 px-3 py-2 bg-secondary/50 rounded border text-sm">{selectedRelatedFault.basicInfo.description}</div>
                  </div>
                  {selectedRelatedFault.basicInfo.newInfo && (
                    <div className="p-2 bg-orange-50 border border-orange-200 rounded text-sm">
                      <span className="text-orange-700 font-medium">新增信息：</span>
                      <span className="text-orange-600">{selectedRelatedFault.basicInfo.newInfo}</span>
                    </div>
                  )}
                </div>

                {/* 分析结果 */}
                {selectedRelatedFault.analysisResult && (
                  <div className="space-y-3 pt-2 border-t">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      分析结果
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <Label className="text-muted-foreground text-xs">故障诊断结论</Label>
                        <div className="mt-1 px-3 py-2 bg-secondary/50 rounded border">{selectedRelatedFault.analysisResult.conclusion}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">根本原因</Label>
                        <div className="mt-1 px-3 py-2 bg-secondary/50 rounded border">{selectedRelatedFault.analysisResult.rootCause}</div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground text-xs">维修建议</Label>
                        <div className="mt-1 px-3 py-2 bg-secondary/50 rounded border">{selectedRelatedFault.analysisResult.recommendation}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label className="text-muted-foreground text-xs">分析人员</Label>
                          <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border">{selectedRelatedFault.analysisResult.analyst}</div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground text-xs">分析时间</Label>
                          <div className="mt-1 px-3 py-1.5 bg-secondary/50 rounded border">{selectedRelatedFault.analysisResult.analyzeDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
