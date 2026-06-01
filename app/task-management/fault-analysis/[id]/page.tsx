"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-sm">
              <div>
                <Label className="text-muted-foreground text-xs">ATA章节</Label>
                <Input
                  value="72-xxx"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">注册号</Label>
                <Input
                  value="B-xxxx"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">日期</Label>
                <Input
                  value="2024-xx-xx"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">地点</Label>
                <Input
                  value="xxx机场"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">CMS信息</Label>
                <Input
                  value="CMS-xxx-xxx"
                  disabled
                  className="h-8 bg-input border-border text-foreground mt-1"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">EICAS信息</Label>
                <Input
                  value="EICAS-xxx"
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
                <Textarea
                  value="xxx故障描述内容xxx，详细记录故障现象、发生时间、环境条件等相关信息..."
                  disabled
                  className="bg-input border-border text-foreground mt-2 text-sm min-h-[60px]"
                />
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
            <div className="bg-secondary/30 rounded-lg p-3 space-y-3 text-sm">
              <div className="space-y-1">
                <h3 className="text-foreground font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500"></span>
                  故障诊断结论
                </h3>
                <p className="text-muted-foreground leading-relaxed pl-4 text-xs">
                  根据参数分析和模型预测，发动机 N1 转速在 T12-T15 时间段出现异常波动，
                  振动参数 VIB 超过正常阈值。结合 CMS 报告和 EICAS 信息，初步判断为
                  发动机压气机叶片磨损导致的性能衰退。建议进行孔探检查确认故障原因。
                </p>
              </div>

              <div className="space-y-1">
                <h3 className="text-foreground font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  维修建议
                </h3>
                <ul className="text-muted-foreground space-y-0.5 pl-4 text-xs">
                  <li>1. 执行发动机孔探检查，检查压气机叶片状态</li>
                  <li>2. 监控 N1、N2 转速差值变化趋势</li>
                  <li>3. 必要时更换受损叶片或进行发动机翻修</li>
                </ul>
              </div>

              <div className="space-y-1">
                <h3 className="text-foreground font-medium flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  参考文档
                </h3>
                <p className="text-muted-foreground pl-4 text-xs">
                  AMM 72-00-00, TSM 72-21-00, SB 72-0123
                </p>
              </div>
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
    </div>
  );
}
