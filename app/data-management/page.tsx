"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  ChevronRight,
  Settings,
  Database,
  FileText,
  HardDrive,
  Tags,
  Search,
  Plus,
  RefreshCw,
  MoreHorizontal,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
  Sliders,
  Save,
  Check,
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
  DialogFooter,
} from "@/components/ui/dialog";

// 第一行标签页 - 基本不需要更改的数据
const primaryTabs = [
  { id: "api", name: "API 管理", icon: Settings },
  { id: "wqar", name: "WQAR数据管理", icon: Database },
  { id: "storage", name: "存储管理", icon: HardDrive },
];

// 第二行标签页 - 需要个性化配置的
const secondaryTabs = [
  { id: "parameter", name: "参数配置", icon: Sliders },
  { id: "template", name: "模板配置", icon: FileText },
  { id: "metadata", name: "元数据配置", icon: Tags },
];

// API 数据
const apiData = [
  { id: 1, name: "飞行数据采集API", endpoint: "/api/v1/flight-data", method: "POST", status: "active", calls: 12580, lastCall: "2024-01-15 14:32:00" },
  { id: 2, name: "WQAR数据上传API", endpoint: "/api/v1/wqar/upload", method: "POST", status: "active", calls: 8920, lastCall: "2024-01-15 14:28:00" },
  { id: 3, name: "故障报告查询API", endpoint: "/api/v1/fault-report", method: "GET", status: "active", calls: 5640, lastCall: "2024-01-15 14:25:00" },
  { id: 4, name: "模型预测API", endpoint: "/api/v1/model/predict", method: "POST", status: "inactive", calls: 3200, lastCall: "2024-01-14 18:00:00" },
  { id: 5, name: "数据导出API", endpoint: "/api/v1/export", method: "GET", status: "active", calls: 1890, lastCall: "2024-01-15 12:00:00" },
];

// WQAR 数据
const wqarData = [
  { id: 1, flightNo: "MU5123", registration: "B-1234", date: "2024-01-15", route: "PVG-PEK", fileSize: "256MB", status: "parsed", parameters: 2450 },
  { id: 2, flightNo: "MU5678", registration: "B-5678", date: "2024-01-15", route: "PVG-CAN", fileSize: "189MB", status: "parsing", parameters: 0 },
  { id: 3, flightNo: "MU2234", registration: "B-9012", date: "2024-01-14", route: "PEK-SHA", fileSize: "312MB", status: "parsed", parameters: 3120 },
  { id: 4, flightNo: "MU3345", registration: "B-3456", date: "2024-01-14", route: "CAN-CTU", fileSize: "178MB", status: "error", parameters: 0 },
  { id: 5, flightNo: "MU4456", registration: "B-7890", date: "2024-01-13", route: "SHA-SZX", fileSize: "245MB", status: "parsed", parameters: 2890 },
];

// 模板数据
const templateData = [
  { id: 1, name: "发动机振动分析模板", ataChapter: "72", parameters: 45, version: "v2.3", updatedAt: "2024-01-10", status: "active" },
  { id: 2, name: "燃油系统分析模板", ataChapter: "28", parameters: 32, version: "v1.8", updatedAt: "2024-01-08", status: "active" },
  { id: 3, name: "液压系统分析模板", ataChapter: "29", parameters: 28, version: "v2.0", updatedAt: "2024-01-05", status: "active" },
  { id: 4, name: "电气系统分析模板", ataChapter: "24", parameters: 38, version: "v1.5", updatedAt: "2024-01-03", status: "draft" },
  { id: 5, name: "起落架分析模板", ataChapter: "32", parameters: 22, version: "v1.2", updatedAt: "2024-01-01", status: "active" },
];

// 存储数据
const storageData = [
  { id: 1, name: "WQAR原始数据", path: "/data/wqar/raw", size: "2.4TB", files: 12580, type: "原始数据", retention: "365天" },
  { id: 2, name: "解析后数据", path: "/data/wqar/parsed", size: "8.6TB", files: 45620, type: "结构化数据", retention: "730天" },
  { id: 3, name: "模型训练数据", path: "/data/model/training", size: "1.2TB", files: 8900, type: "训练数据", retention: "永久" },
  { id: 4, name: "报告文档", path: "/data/reports", size: "156GB", files: 3240, type: "文档", retention: "1095天" },
  { id: 5, name: "日志归档", path: "/data/logs/archive", size: "89GB", files: 15600, type: "日志", retention: "180天" },
];

// 元数据
const metadataData = [
  { id: 1, category: "ATA章节", items: 78, description: "飞机系统ATA章节编码", lastSync: "2024-01-15 08:00:00" },
  { id: 2, category: "机型代码", items: 12, description: "支持的飞机机型代码", lastSync: "2024-01-14 08:00:00" },
  { id: 3, category: "机场代码", items: 456, description: "国内外机场IATA代码", lastSync: "2024-01-15 06:00:00" },
  { id: 4, category: "故障代码", items: 1240, description: "标准故障代码库", lastSync: "2024-01-13 08:00:00" },
  { id: 5, category: "参数定义", items: 3850, description: "WQAR参数标准定义", lastSync: "2024-01-12 08:00:00" },
  { id: 6, category: "维修动作", items: 520, description: "标准维修动作代码", lastSync: "2024-01-11 08:00:00" },
];

// 参数版本数据
interface ParameterVersion {
  id: string;
  code: string;
  airline: string;
  airlineName: string;
  isBase: boolean;
}

const parameterVersions: ParameterVersion[] = [
  { id: "base", code: "311A-ARJ-B01-01", airline: "ARJ", airlineName: "基本版本", isBase: true },
  { id: "cuh", code: "311E-CUH-B01-01", airline: "CUH", airlineName: "幸福航空", isBase: false },
  { id: "ces", code: "3115-CES-B01-01", airline: "CES", airlineName: "中国东方航空", isBase: false },
  { id: "csc", code: "311F-CSC-B01-01", airline: "CSC", airlineName: "中国南方航空", isBase: false },
  { id: "cca", code: "311G-CCA-B01-01", airline: "CCA", airlineName: "中国国际航空", isBase: false },
  { id: "ckk", code: "311H-CKK-B01-01", airline: "CKK", airlineName: "中国货运航空", isBase: false },
];

// 参数配置数据类型
interface ParameterConfig {
  id: number;
  parameterAssignment: string;
  mnemonic: string;
  portName: string;
  signalType: string;
  unit: string;
  // 用户自定义配置
  customName: string;
  customDescription: string;
  ataChapter: string;
}

// 基本参数配置数据 - 所有航司共享的基础数据
const baseParameterData: ParameterConfig[] = [
  { id: 1, parameterAssignment: "001", mnemonic: "N1_1", portName: "ENG1_N1", signalType: "ANALOG", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 2, parameterAssignment: "002", mnemonic: "N2_1", portName: "ENG1_N2", signalType: "ANALOG", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 3, parameterAssignment: "003", mnemonic: "EGT_1", portName: "ENG1_EGT", signalType: "ANALOG", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 4, parameterAssignment: "004", mnemonic: "FF_1", portName: "ENG1_FF", signalType: "ANALOG", unit: "kg/h", customName: "", customDescription: "", ataChapter: "" },
  { id: 5, parameterAssignment: "005", mnemonic: "OIP_1", portName: "ENG1_OIL_PRESS", signalType: "ANALOG", unit: "PSI", customName: "", customDescription: "", ataChapter: "" },
  { id: 6, parameterAssignment: "006", mnemonic: "OIT_1", portName: "ENG1_OIL_TEMP", signalType: "ANALOG", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 7, parameterAssignment: "007", mnemonic: "VIB_N1_1", portName: "ENG1_VIB_N1", signalType: "ANALOG", unit: "mil", customName: "", customDescription: "", ataChapter: "" },
  { id: 8, parameterAssignment: "008", mnemonic: "VIB_N2_1", portName: "ENG1_VIB_N2", signalType: "ANALOG", unit: "mil", customName: "", customDescription: "", ataChapter: "" },
  { id: 9, parameterAssignment: "009", mnemonic: "N1_2", portName: "ENG2_N1", signalType: "ANALOG", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 10, parameterAssignment: "010", mnemonic: "N2_2", portName: "ENG2_N2", signalType: "ANALOG", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 11, parameterAssignment: "011", mnemonic: "EGT_2", portName: "ENG2_EGT", signalType: "ANALOG", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 12, parameterAssignment: "012", mnemonic: "FF_2", portName: "ENG2_FF", signalType: "ANALOG", unit: "kg/h", customName: "", customDescription: "", ataChapter: "" },
  { id: 13, parameterAssignment: "013", mnemonic: "ALT", portName: "ALTITUDE", signalType: "DIGITAL", unit: "ft", customName: "", customDescription: "", ataChapter: "" },
  { id: 14, parameterAssignment: "014", mnemonic: "IAS", portName: "IND_AIRSPEED", signalType: "DIGITAL", unit: "kts", customName: "", customDescription: "", ataChapter: "" },
  { id: 15, parameterAssignment: "015", mnemonic: "MACH", portName: "MACH_NUMBER", signalType: "DIGITAL", unit: "", customName: "", customDescription: "", ataChapter: "" },
];

// 各航司的自定义配置数据
type AirlineParameterConfigs = {
  [key: string]: ParameterConfig[];
};

const initialAirlineConfigs: AirlineParameterConfigs = {
  base: baseParameterData.map(p => ({ ...p })),
  cuh: baseParameterData.map(p => ({ 
    ...p, 
    customName: p.mnemonic === "N1_1" ? "发动机1低压转子转速" : "",
    customDescription: p.mnemonic === "N1_1" ? "1号发动机低压转子转速百分比" : "",
    ataChapter: p.mnemonic === "N1_1" ? "72-00" : ""
  })),
  ces: baseParameterData.map(p => ({ 
    ...p,
    customName: p.mnemonic === "N1_1" ? "发动机1低压转子转速" : (p.mnemonic === "EGT_1" ? "发动机1排气温度" : ""),
    customDescription: p.mnemonic === "N1_1" ? "1号发动机低压转子转速百分比" : (p.mnemonic === "EGT_1" ? "1号发动机排气温度监测" : ""),
    ataChapter: p.mnemonic === "N1_1" ? "72-00" : (p.mnemonic === "EGT_1" ? "72-50" : "")
  })),
  csc: baseParameterData.map(p => ({ ...p })),
  cca: baseParameterData.map(p => ({ ...p })),
  ckk: baseParameterData.map(p => ({ ...p })),
};

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState("api");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVersion, setSelectedVersion] = useState("base");
  const [airlineConfigs, setAirlineConfigs] = useState<AirlineParameterConfigs>(initialAirlineConfigs);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<{customName: string; customDescription: string; ataChapter: string}>({
    customName: "",
    customDescription: "",
    ataChapter: ""
  });
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncInfo, setSyncInfo] = useState<{parameterId: number; mnemonic: string; affectedAirlines: string[]}>({ parameterId: 0, mnemonic: "", affectedAirlines: [] });

  const isPrimaryTab = primaryTabs.some(t => t.id === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "parsed":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">正常</Badge>;
      case "inactive":
      case "draft":
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">停用</Badge>;
      case "parsing":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">处理中</Badge>;
      case "error":
        return <Badge className="bg-red-100 text-red-700 border-red-200">异常</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const currentVersionInfo = parameterVersions.find(v => v.id === selectedVersion);
  const currentParameters = airlineConfigs[selectedVersion] || [];

  // 开始编辑行
  const startEditing = (param: ParameterConfig) => {
    setEditingRow(param.id);
    setEditValues({
      customName: param.customName,
      customDescription: param.customDescription,
      ataChapter: param.ataChapter
    });
  };

  // 取消编辑
  const cancelEditing = () => {
    setEditingRow(null);
    setEditValues({ customName: "", customDescription: "", ataChapter: "" });
  };

  // 保存编辑 - 检查是否需要同步到其他航司
  const saveEditing = (param: ParameterConfig) => {
    // 找出其他航司中有相同MNEMONIC的配置
    const affectedAirlines: string[] = [];
    
    Object.keys(airlineConfigs).forEach(airlineId => {
      if (airlineId !== selectedVersion) {
        const hasMatchingParam = airlineConfigs[airlineId].some(
          p => p.mnemonic === param.mnemonic
        );
        if (hasMatchingParam) {
          const airlineInfo = parameterVersions.find(v => v.id === airlineId);
          if (airlineInfo) {
            affectedAirlines.push(airlineInfo.airlineName);
          }
        }
      }
    });

    if (affectedAirlines.length > 0 && (editValues.customName || editValues.customDescription || editValues.ataChapter)) {
      // 弹出同步确认对话框
      setSyncInfo({
        parameterId: param.id,
        mnemonic: param.mnemonic,
        affectedAirlines
      });
      setSyncDialogOpen(true);
    } else {
      // 直接保存，不需要同步
      doSave(param.id, param.mnemonic, false);
    }
  };

  // 执行保存
  const doSave = (parameterId: number, mnemonic: string, syncToOthers: boolean) => {
    const newConfigs = { ...airlineConfigs };
    
    // 更新当前航司的配置
    newConfigs[selectedVersion] = newConfigs[selectedVersion].map(p => 
      p.id === parameterId 
        ? { ...p, ...editValues }
        : p
    );

    // 如果需要同步到其他航司
    if (syncToOthers) {
      Object.keys(newConfigs).forEach(airlineId => {
        if (airlineId !== selectedVersion) {
          newConfigs[airlineId] = newConfigs[airlineId].map(p => 
            p.mnemonic === mnemonic
              ? { ...p, ...editValues }
              : p
          );
        }
      });
    }

    setAirlineConfigs(newConfigs);
    setEditingRow(null);
    setEditValues({ customName: "", customDescription: "", ataChapter: "" });
    setSyncDialogOpen(false);
  };

  // 过滤参数数据
  const filteredParameters = currentParameters.filter(param =>
    param.mnemonic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.portName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.customName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部标题栏 */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
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

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* 面包屑导航 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground">
            首页
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">数据管理</span>
        </div>

        {/* 第一行标签页 - 基本不需要更改的数据 */}
        <div className="mb-2">
          <div className="text-xs text-muted-foreground mb-1.5">基础数据管理</div>
          <div className="flex gap-2 border-b border-border pb-3">
            {primaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 第二行标签页 - 需要个性化配置的 */}
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1.5">个性化配置</div>
          <div className="flex gap-2 border-b border-border pb-3">
            {secondaryTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="gap-2"
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* API 管理 */}
        {activeTab === "api" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4 text-primary" />
                  API 管理
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索API..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 w-[200px]"
                    />
                  </div>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    新增API
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">API名称</TableHead>
                    <TableHead>端点</TableHead>
                    <TableHead className="w-[80px]">方法</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">调用次数</TableHead>
                    <TableHead className="w-[160px]">最后调用</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiData.map((api) => (
                    <TableRow key={api.id}>
                      <TableCell className="font-medium">{api.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{api.endpoint}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={api.method === "POST" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}>
                          {api.method}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(api.status)}</TableCell>
                      <TableCell>{api.calls.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{api.lastCall}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* WQAR数据管理 */}
        {activeTab === "wqar" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Database className="h-4 w-4 text-primary" />
                  WQAR数据管理
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索航班号/注册号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 w-[200px]"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    刷新
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Upload className="h-4 w-4" />
                    上传数据
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">航班号</TableHead>
                    <TableHead className="w-[100px]">注册号</TableHead>
                    <TableHead className="w-[100px]">日期</TableHead>
                    <TableHead className="w-[120px]">航线</TableHead>
                    <TableHead className="w-[80px]">文件大小</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">参数数量</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wqarData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.flightNo}</TableCell>
                      <TableCell>{item.registration}</TableCell>
                      <TableCell className="text-muted-foreground">{item.date}</TableCell>
                      <TableCell>{item.route}</TableCell>
                      <TableCell>{item.fileSize}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.parameters > 0 ? item.parameters.toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 存储管理 */}
        {activeTab === "storage" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  存储管理
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    刷新统计
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* 存储概览 */}
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-blue-700">12.5 TB</div>
                  <div className="text-sm text-blue-600">总存储量</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-emerald-700">85,940</div>
                  <div className="text-sm text-emerald-600">文件总数</div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-amber-700">78%</div>
                  <div className="text-sm text-amber-600">存储使用率</div>
                </div>
                <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-sky-700">5</div>
                  <div className="text-sm text-sky-600">存储分区</div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[160px]">存储名称</TableHead>
                    <TableHead>路径</TableHead>
                    <TableHead className="w-[100px]">大小</TableHead>
                    <TableHead className="w-[100px]">文件数</TableHead>
                    <TableHead className="w-[100px]">类型</TableHead>
                    <TableHead className="w-[100px]">保留期限</TableHead>
                    <TableHead className="w-[80px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {storageData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{item.path}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell>{item.files.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.type}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.retention}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 参数配置 */}
        {activeTab === "parameter" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-primary" />
                    参数配置
                  </CardTitle>
                  {/* 版本选择器 */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">参数版本:</span>
                    <Select value={selectedVersion} onValueChange={setSelectedVersion}>
                      <SelectTrigger className="w-[280px] h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {parameterVersions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{version.code}</span>
                              <span className="text-muted-foreground">-</span>
                              <span>{version.airlineName}</span>
                              {version.isBase && (
                                <Badge variant="outline" className="ml-1 text-xs bg-blue-50 text-blue-600">基准</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索参数..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 w-[200px]"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Download className="h-4 w-4" />
                    导出
                  </Button>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Upload className="h-4 w-4" />
                    导入
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* 当前版本信息 */}
              {currentVersionInfo && (
                <div className="px-4 py-2 bg-muted/30 border-b border-border">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">当前版本:</span>
                    <span className="font-mono font-medium">{currentVersionInfo.code}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">航司:</span>
                    <span className="font-medium">{currentVersionInfo.airlineName}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">参数总数:</span>
                    <Badge variant="outline">{currentParameters.length}</Badge>
                  </div>
                </div>
              )}
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px] text-xs">PARAMETER ASSIGNMENT</TableHead>
                      <TableHead className="w-[100px] text-xs">MNEMONIC</TableHead>
                      <TableHead className="w-[140px] text-xs">PORT NAME</TableHead>
                      <TableHead className="w-[100px] text-xs">SIGNAL TYPE</TableHead>
                      <TableHead className="w-[80px] text-xs">UNIT</TableHead>
                      <TableHead className="w-[1px] bg-primary/20"></TableHead>
                      <TableHead className="w-[140px] text-xs bg-blue-50/50">参数名 (自定义)</TableHead>
                      <TableHead className="w-[200px] text-xs bg-blue-50/50">参数释义 (自定义)</TableHead>
                      <TableHead className="w-[100px] text-xs bg-blue-50/50">ATA章节 (自定义)</TableHead>
                      <TableHead className="w-[80px] text-xs">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredParameters.map((param) => (
                      <TableRow key={param.id} className={editingRow === param.id ? "bg-blue-50/30" : ""}>
                        <TableCell className="font-mono text-xs">{param.parameterAssignment}</TableCell>
                        <TableCell className="font-mono text-xs font-medium">{param.mnemonic}</TableCell>
                        <TableCell className="font-mono text-xs text-muted-foreground">{param.portName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={param.signalType === "ANALOG" ? "bg-amber-50 text-amber-600" : "bg-sky-50 text-sky-600"}>
                            {param.signalType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{param.unit || "-"}</TableCell>
                        <TableCell className="w-[1px] bg-primary/10 p-0"></TableCell>
                        {editingRow === param.id ? (
                          <>
                            <TableCell className="bg-blue-50/30">
                              <Input
                                value={editValues.customName}
                                onChange={(e) => setEditValues(prev => ({ ...prev, customName: e.target.value }))}
                                className="h-7 text-xs"
                                placeholder="输入参数名"
                              />
                            </TableCell>
                            <TableCell className="bg-blue-50/30">
                              <Input
                                value={editValues.customDescription}
                                onChange={(e) => setEditValues(prev => ({ ...prev, customDescription: e.target.value }))}
                                className="h-7 text-xs"
                                placeholder="输入参数释义"
                              />
                            </TableCell>
                            <TableCell className="bg-blue-50/30">
                              <Input
                                value={editValues.ataChapter}
                                onChange={(e) => setEditValues(prev => ({ ...prev, ataChapter: e.target.value }))}
                                className="h-7 text-xs"
                                placeholder="如: 72-00"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-emerald-600 hover:text-emerald-700" onClick={() => saveEditing(param)}>
                                  <Check className="h-3.5 w-3.5" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500 hover:text-red-600" onClick={cancelEditing}>
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell className="text-xs bg-blue-50/30">
                              {param.customName || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="text-xs bg-blue-50/30">
                              {param.customDescription || <span className="text-muted-foreground">-</span>}
                            </TableCell>
                            <TableCell className="text-xs bg-blue-50/30">
                              {param.ataChapter ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600">
                                  ATA {param.ataChapter}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => startEditing(param)}>
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 模板配置 */}
        {activeTab === "template" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  模板配置
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索模板..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 w-[200px]"
                    />
                  </div>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    新增模板
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">模板名称</TableHead>
                    <TableHead className="w-[100px]">ATA章节</TableHead>
                    <TableHead className="w-[100px]">参数数量</TableHead>
                    <TableHead className="w-[80px]">版本</TableHead>
                    <TableHead className="w-[120px]">更新时间</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templateData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          ATA {item.ataChapter}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.parameters}</TableCell>
                      <TableCell className="text-muted-foreground">{item.version}</TableCell>
                      <TableCell className="text-muted-foreground">{item.updatedAt}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* 元数据配置 */}
        {activeTab === "metadata" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tags className="h-4 w-4 text-primary" />
                  元数据配置
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    同步全部
                  </Button>
                  <Button size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    新增类别
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">类别</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="w-[100px]">条目数</TableHead>
                    <TableHead className="w-[180px]">最后同步</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadataData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-muted-foreground">{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          {item.items.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <RefreshCw className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>

      {/* 同步确认对话框 */}
      <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>同步配置到其他航司</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              检测到参数 <span className="font-mono font-medium text-foreground">{syncInfo.mnemonic}</span> 在以下航司的参数表中也存在，是否将您的配置同步到这些航司？
            </p>
            <div className="flex flex-wrap gap-2">
              {syncInfo.affectedAirlines.map((airline, idx) => (
                <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-600">
                  {airline}
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => doSave(syncInfo.parameterId, syncInfo.mnemonic, false)}>
              仅保存当前航司
            </Button>
            <Button onClick={() => doSave(syncInfo.parameterId, syncInfo.mnemonic, true)}>
              同步到所有航司
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
