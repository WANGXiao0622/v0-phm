"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import GridLayout from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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
  Filter,
  Calendar,
  FolderDown,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  Play,
  Copy,
  Globe,
  Key,
  LayoutGrid,
  Move,
  Maximize2,
  Minimize2,
  GripVertical,
  Cpu,
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// 第一行标签页 - 基本不需要更改的数据
const primaryTabs = [
  { id: "api", name: "API 管理", icon: Settings },
  { id: "wqar", name: "WQAR数据管理", icon: Database },
  { id: "lru", name: "LRU管理", icon: Cpu },
  { id: "storage", name: "存储管理", icon: HardDrive },
];

// LRU 数据类型
interface LruItem {
  id: number;
  aircraftType: string;
  lru: string;
  ataChapter: string;
  partNumber: string;
  relatedModel: string;
}

// LRU 模拟数据
const lruData: LruItem[] = [
  { id: 1, aircraftType: "C909", lru: "APU引气阀", ataChapter: "49", partNumber: "11CB67", relatedModel: "APU引气阀性能监控模型" },
  { id: 2, aircraftType: "C919", lru: "刹车控制阀", ataChapter: "32", partNumber: "39-967", relatedModel: "刹车控制阀故障预测与性能评估模型" },
  { id: 3, aircraftType: "C919", lru: "刹车切断阀", ataChapter: "32", partNumber: "138-025-01", relatedModel: "SOV故障预测与性能监控模型" },
  { id: 4, aircraftType: "C909", lru: "前起落架收放作动筒", ataChapter: "32", partNumber: "6243A0000-02", relatedModel: "" },
];

// 第二行标签页 - 需要个性化配置的
const secondaryTabs = [
  { id: "parameter", name: "参数配置", icon: Sliders },
  { id: "template", name: "模板配置", icon: FileText },
  { id: "metadata", name: "元数据配置", icon: Tags },
  { id: "fault", name: "故障统计", icon: AlertTriangle },
];

// API 数据类型
interface ApiConfig {
  id: number;
  name: string;
  endpoint: string;
  method: string;
  status: string;
  calls: number;
  lastCall: string;
  description?: string;
  authType?: string;
  timeout?: number;
  retryCount?: number;
  headers?: string;
}

// API 数据
const initialApiData: ApiConfig[] = [
  { id: 1, name: "飞行数据采集API", endpoint: "/api/v1/flight-data", method: "POST", status: "active", calls: 12580, lastCall: "2024-01-15 14:32:00", description: "用于采集飞行数据", authType: "Bearer Token", timeout: 30000, retryCount: 3 },
  { id: 2, name: "WQAR数据上传API", endpoint: "/api/v1/wqar/upload", method: "POST", status: "active", calls: 8920, lastCall: "2024-01-15 14:28:00", description: "用于上传WQAR原始数据", authType: "API Key", timeout: 60000, retryCount: 2 },
  { id: 3, name: "故障报告查询API", endpoint: "/api/v1/fault-report", method: "GET", status: "active", calls: 5640, lastCall: "2024-01-15 14:25:00", description: "查询故障报告记录", authType: "Bearer Token", timeout: 15000, retryCount: 3 },
  { id: 4, name: "模型预测API", endpoint: "/api/v1/model/predict", method: "POST", status: "inactive", calls: 3200, lastCall: "2024-01-14 18:00:00", description: "调用模型进行故障预测", authType: "Bearer Token", timeout: 45000, retryCount: 1 },
  { id: 5, name: "数据导出API", endpoint: "/api/v1/export", method: "GET", status: "active", calls: 1890, lastCall: "2024-01-15 12:00:00", description: "导出分析报告和数据", authType: "API Key", timeout: 120000, retryCount: 2 },
];

// WQAR 数据
const wqarData = [
  { id: 1, flightNo: "MU5123", registration: "B-1234", date: "2024-01-15 14:32:45", route: "PVG-PEK", fileSize: "256MB", status: "parsed", parameters: 2450 },
  { id: 2, flightNo: "MU5678", registration: "B-5678", date: "2024-01-15 10:15:22", route: "PVG-CAN", fileSize: "189MB", status: "parsing", parameters: 0 },
  { id: 3, flightNo: "MU2234", registration: "B-9012", date: "2024-01-14 18:45:33", route: "PEK-SHA", fileSize: "312MB", status: "parsed", parameters: 3120 },
  { id: 4, flightNo: "MU3345", registration: "B-3456", date: "2024-01-14 09:20:18", route: "CAN-CTU", fileSize: "178MB", status: "error", parameters: 0 },
  { id: 5, flightNo: "MU4456", registration: "B-7890", date: "2024-01-13 16:08:55", route: "SHA-SZX", fileSize: "245MB", status: "parsed", parameters: 2890 },
  { id: 6, flightNo: "MU6789", registration: "B-1234", date: "2024-01-13 08:30:12", route: "PEK-CAN", fileSize: "278MB", status: "parsed", parameters: 2680 },
  { id: 7, flightNo: "MU7890", registration: "B-5678", date: "2024-01-12 22:15:40", route: "SHA-PEK", fileSize: "198MB", status: "parsed", parameters: 2150 },
  { id: 8, flightNo: "MU8901", registration: "B-9012", date: "2024-01-12 14:50:28", route: "CAN-SHA", fileSize: "265MB", status: "parsed", parameters: 2780 },
];

// 模板数据类型
interface TemplateConfig {
  id: number;
  name: string;
  ataChapter: string;
  coreParameters: number;
  description: string;
  lru: string;
  version: string;
  updatedAt: string;
  status: string;
  selectedParameters: string[]; // 存储选中的参数MNEMONIC
}

// 初始模板数据
const initialTemplateData: TemplateConfig[] = [
  { id: 1, name: "APU EGT超温", ataChapter: "49", coreParameters: 12, description: "监控APU排气温度超限情况，用于预测APU性能衰退", lru: "APU", version: "v2.3", updatedAt: "2024-01-10", status: "active", selectedParameters: ["EGT_1", "EGT_2", "N1_1", "N2_1"] },
  { id: 2, name: "HPV开关响应", ataChapter: "36", coreParameters: 8, description: "监控高压活门开关响应时间及状态，检测气源系统异常", lru: "HPV, PRSOV", version: "v1.8", updatedAt: "2024-01-08", status: "active", selectedParameters: ["N1_1", "N1_2", "FF_1", "FF_2"] },
  { id: 3, name: "PRSOV开关响应", ataChapter: "36", coreParameters: 10, description: "监控引气预冷器出口活门响应，评估活门健康状态", lru: "PRSOV, FAV", version: "v2.0", updatedAt: "2024-01-05", status: "active", selectedParameters: ["N2_1", "N2_2", "OIP_1", "OIT_1"] },
  { id: 4, name: "刹车温度不一致", ataChapter: "32", coreParameters: 16, description: "监控各轮刹车温度差异，识别刹车磨损不均或传感器故障", lru: "BSCU, 刹车组件", version: "v1.5", updatedAt: "2024-01-03", status: "active", selectedParameters: ["ALT", "IAS", "MACH"] },
];

// 存储数据
const storageData = [
  { id: 1, name: "WQAR原始数据", path: "/data/wqar/raw", size: "2.4TB", files: 12580, type: "原始数据", retention: "365天" },
  { id: 2, name: "解析后数据", path: "/data/wqar/parsed", size: "8.6TB", files: 45620, type: "结构化数据", retention: "730天" },
  { id: 3, name: "模型训练数据", path: "/data/model/training", size: "1.2TB", files: 8900, type: "训练数据", retention: "永久" },
  { id: 4, name: "报告文档", path: "/data/reports", size: "156GB", files: 3240, type: "文档", retention: "1095天" },
  { id: 5, name: "日志归档", path: "/data/logs/archive", size: "89GB", files: 15600, type: "日志", retention: "180天" },
];

// 元数据 - 业务元数��表
const metadataData = [
  { id: 1, tableName: "fleet_meta", displayName: "机队元数据表", description: "存储机队基本信息，包括机型、注册号、机龄等", records: 156, fields: 28, lastSync: "2024-01-15 08:00:00" },
  { id: 2, tableName: "flight_info", displayName: "航班信息表", description: "存储航班基本信息，包括航班号、航线、起降时间等", records: 125840, fields: 42, lastSync: "2024-01-15 14:30:00" },
  { id: 3, tableName: "fault_report", displayName: "故障报告表", description: "存储故障报告信息，包括故障代码、描述、处理措施等", records: 8920, fields: 35, lastSync: "2024-01-15 12:00:00" },
  { id: 4, tableName: "maintenance_record", displayName: "维修记录表", description: "存储维修工作记录，包括工卡号、维修动作、工时等", records: 45620, fields: 38, lastSync: "2024-01-14 18:00:00" },
  { id: 5, tableName: "part_change_log", displayName: "部件更换记录表", description: "存储部件更换历史，包括件号、序号、装机位置等", records: 12350, fields: 25, lastSync: "2024-01-15 10:00:00" },
  { id: 6, tableName: "parameter_definition", displayName: "参数定义表", description: "存储WQAR参数定义，包括参数名、单位、采样率等", records: 3850, fields: 18, lastSync: "2024-01-12 08:00:00" },
];

// 故障统计数据
interface FaultRecord {
  id: number;
  faultCode: string;
  cmsMessage: string;
  registration: string;
  airline: string;
  airlineCode: string;
  ataChapter: string;
  faultDate: string;
  flightNo: string;
  route: string;
  severity: "high" | "medium" | "low";
  status: "analyzed" | "pending" | "ignored" | "no_qar";
  analysisId?: string; // 如果已分析，关联的分析ID
}

const faultData: FaultRecord[] = [
  { id: 1, faultCode: "2100-01", cmsMessage: "PACK 1 FAULT", registration: "B-1234", airline: "成都航空", airlineCode: "UEA", ataChapter: "21", faultDate: "2024-01-15 14:32:00", flightNo: "UEA5123", route: "PVG-PEK", severity: "high", status: "analyzed", analysisId: "FA-2024-0156" },
  { id: 2, faultCode: "3600-05", cmsMessage: "BLEED 1 OVHT", registration: "B-5678", airline: "东方航空", airlineCode: "CES", ataChapter: "36", faultDate: "2024-01-15 10:15:00", flightNo: "MU5678", route: "PVG-CAN", severity: "high", status: "pending" },
  { id: 3, faultCode: "2700-12", cmsMessage: "ELAC 1 FAULT", registration: "B-9012", airline: "成都航空", airlineCode: "UEA", ataChapter: "27", faultDate: "2024-01-14 18:45:00", flightNo: "UEA2234", route: "PEK-SHA", severity: "medium", status: "analyzed", analysisId: "FA-2024-0148" },
  { id: 4, faultCode: "3200-08", cmsMessage: "BRAKE TEMP HI", registration: "B-3456", airline: "南方航空", airlineCode: "CSN", ataChapter: "32", faultDate: "2024-01-14 09:20:00", flightNo: "CZ3345", route: "CAN-CTU", severity: "medium", status: "no_qar" },
  { id: 5, faultCode: "4900-03", cmsMessage: "APU EGT OVLM", registration: "B-7890", airline: "东方航空", airlineCode: "CES", ataChapter: "49", faultDate: "2024-01-13 16:08:00", flightNo: "MU4456", route: "SHA-SZX", severity: "high", status: "analyzed", analysisId: "FA-2024-0142" },
  { id: 6, faultCode: "7200-15", cmsMessage: "ENG 1 VIB HI", registration: "B-1234", airline: "成都航空", airlineCode: "UEA", ataChapter: "72", faultDate: "2024-01-13 08:30:00", flightNo: "UEA6789", route: "PEK-CAN", severity: "high", status: "pending" },
  { id: 7, faultCode: "2900-06", cmsMessage: "HYD SYS 1 LO PR", registration: "B-5678", airline: "东方航空", airlineCode: "CES", ataChapter: "29", faultDate: "2024-01-12 22:15:00", flightNo: "MU7890", route: "SHA-PEK", severity: "medium", status: "ignored" },
  { id: 8, faultCode: "2400-09", cmsMessage: "GEN 1 FAULT", registration: "B-9012", airline: "成都航空", airlineCode: "UEA", ataChapter: "24", faultDate: "2024-01-12 14:50:00", flightNo: "UEA8901", route: "CAN-SHA", severity: "low", status: "analyzed", analysisId: "FA-2024-0135" },
  { id: 9, faultCode: "3600-02", cmsMessage: "PRSOV 1 FAULT", registration: "B-3456", airline: "南方航空", airlineCode: "CSN", ataChapter: "36", faultDate: "2024-01-12 10:30:00", flightNo: "CZ9012", route: "CTU-PVG", severity: "medium", status: "pending" },
  { id: 10, faultCode: "2100-08", cmsMessage: "DUCT OVHT", registration: "B-7890", airline: "东方航空", airlineCode: "CES", ataChapter: "21", faultDate: "2024-01-11 15:45:00", flightNo: "MU1234", route: "PEK-CAN", severity: "high", status: "no_qar" },
  { id: 11, faultCode: "3200-03", cmsMessage: "LGCIU 1 FAULT", registration: "B-1234", airline: "成都航空", airlineCode: "UEA", ataChapter: "32", faultDate: "2024-01-11 09:20:00", flightNo: "UEA5678", route: "SHA-PEK", severity: "low", status: "analyzed", analysisId: "FA-2024-0128" },
  { id: 12, faultCode: "4900-07", cmsMessage: "APU FIRE DET", registration: "B-5678", airline: "东方航空", airlineCode: "CES", ataChapter: "49", faultDate: "2024-01-10 18:00:00", flightNo: "MU2345", route: "CAN-PVG", severity: "high", status: "analyzed", analysisId: "FA-2024-0122" },
];

// 航司列表
const airlineList = [
  { code: "UEA", name: "成都航空" },
  { code: "CES", name: "东方航空" },
  { code: "CSN", name: "南方航空" },
  { code: "CCA", name: "中国国际航空" },
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
  { id: "ces", code: "3115-CES-B01-01", airline: "CES", airlineName: "中国东方航空", isBase: false },
  { id: "csc", code: "311F-CSC-B01-01", airline: "CSC", airlineName: "中国南方航空", isBase: false },
  { id: "cca", code: "311G-CCA-B01-01", airline: "CCA", airlineName: "中国国际航空", isBase: false },
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
  { id: 1, parameterAssignment: "001", mnemonic: "N1_1", portName: "ENG1_N1", signalType: "BNR", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 2, parameterAssignment: "002", mnemonic: "N2_1", portName: "ENG1_N2", signalType: "BNR", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 3, parameterAssignment: "003", mnemonic: "EGT_1", portName: "ENG1_EGT", signalType: "BNR", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 4, parameterAssignment: "004", mnemonic: "FF_1", portName: "ENG1_FF", signalType: "BNR", unit: "kg/h", customName: "", customDescription: "", ataChapter: "" },
  { id: 5, parameterAssignment: "005", mnemonic: "OIP_1", portName: "ENG1_OIL_PRESS", signalType: "BNR", unit: "PSI", customName: "", customDescription: "", ataChapter: "" },
  { id: 6, parameterAssignment: "006", mnemonic: "OIT_1", portName: "ENG1_OIL_TEMP", signalType: "BNR", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 7, parameterAssignment: "007", mnemonic: "VIB_N1_1", portName: "ENG1_VIB_N1", signalType: "BNR", unit: "mil", customName: "", customDescription: "", ataChapter: "" },
  { id: 8, parameterAssignment: "008", mnemonic: "VIB_N2_1", portName: "ENG1_VIB_N2", signalType: "BNR", unit: "mil", customName: "", customDescription: "", ataChapter: "" },
  { id: 9, parameterAssignment: "009", mnemonic: "N1_2", portName: "ENG2_N1", signalType: "BNR", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 10, parameterAssignment: "010", mnemonic: "N2_2", portName: "ENG2_N2", signalType: "BNR", unit: "%", customName: "", customDescription: "", ataChapter: "" },
  { id: 11, parameterAssignment: "011", mnemonic: "EGT_2", portName: "ENG2_EGT", signalType: "BNR", unit: "°C", customName: "", customDescription: "", ataChapter: "" },
  { id: 12, parameterAssignment: "012", mnemonic: "FF_2", portName: "ENG2_FF", signalType: "BNR", unit: "kg/h", customName: "", customDescription: "", ataChapter: "" },
  { id: 13, parameterAssignment: "013", mnemonic: "ALT", portName: "ALTITUDE", signalType: "DIS", unit: "ft", customName: "", customDescription: "", ataChapter: "" },
  { id: 14, parameterAssignment: "014", mnemonic: "IAS", portName: "IND_AIRSPEED", signalType: "DIS", unit: "kts", customName: "", customDescription: "", ataChapter: "" },
  { id: 15, parameterAssignment: "015", mnemonic: "MACH", portName: "MACH_NUMBER", signalType: "INT", unit: "", customName: "", customDescription: "", ataChapter: "" },
];

// 各航司的自定义配置数据
type AirlineParameterConfigs = {
  [key: string]: ParameterConfig[];
};

const initialAirlineConfigs: AirlineParameterConfigs = {
  base: baseParameterData.map(p => ({ ...p })),
  ces: baseParameterData.map(p => ({ 
    ...p,
    customName: p.mnemonic === "N1_1" ? "发动机1低压转子转速" : (p.mnemonic === "EGT_1" ? "发动机1排气温度" : ""),
    customDescription: p.mnemonic === "N1_1" ? "1号发动机低压转子转速百分比" : (p.mnemonic === "EGT_1" ? "1号发动机排气温度监测" : ""),
    ataChapter: p.mnemonic === "N1_1" ? "72-00" : (p.mnemonic === "EGT_1" ? "72-50" : "")
  })),
  csc: baseParameterData.map(p => ({ ...p })),
  cca: baseParameterData.map(p => ({ ...p })),
};

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState("api");
  const [searchTerm, setSearchTerm] = useState("");
  const [lruSearchTerm, setLruSearchTerm] = useState("");
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

  // 模板编辑状态
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<TemplateConfig[]>(initialTemplateData);
  const [editingTemplate, setEditingTemplate] = useState<TemplateConfig | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: "",
    ataChapter: "",
    description: "",
    lru: "",
    selectedParameters: [] as string[],
    dashboards: [] as {
      id: string;
      name: string;
      parameters: string[];
      width: number; // 1-4 表示占几列
      height: number; // 1-2 表示占几行
      x: number;
      y: number;
    }[]
  });
  const [parameterSearchTerm, setParameterSearchTerm] = useState("");
  const [parameterFilterType, setParameterFilterType] = useState<"all" | "mnemonic" | "customName" | "customDescription" | "ataChapter">("all");
  const [ataChapterFilter, setAtaChapterFilter] = useState("");
  
  // Dashboard 编辑状态
  const [activeDashboardId, setActiveDashboardId] = useState<string | null>(null);
  const [dashboardEditMode, setDashboardEditMode] = useState<"select" | "preview">("select");

  // WQAR下载对话框状态
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [downloadFilters, setDownloadFilters] = useState({
    startDate: "",
    endDate: "",
    registration: ""
  });
  
  // WQAR筛选状态
  const [wqarFilters, setWqarFilters] = useState({
    registration: "",
    startDate: "",
    endDate: ""
  });

  // 故障筛选状态
  const [faultFilters, setFaultFilters] = useState({
    startDate: "",
    endDate: "",
    airline: "",
    registration: "",
    cmsMessage: "",
    status: "",
    ata: ""
  });

  // API 管理状态
  const [apiList, setApiList] = useState<ApiConfig[]>(initialApiData);
  const [apiDialogOpen, setApiDialogOpen] = useState(false);
  const [apiDialogMode, setApiDialogMode] = useState<"create" | "edit" | "view">("create");
  const [selectedApi, setSelectedApi] = useState<ApiConfig | null>(null);
  const [apiForm, setApiForm] = useState({
    name: "",
    endpoint: "",
    method: "GET",
    description: "",
    authType: "Bearer Token",
    timeout: 30000,
    retryCount: 3,
    headers: ""
  });
  const [apiTestResult, setApiTestResult] = useState<{ status: "idle" | "loading" | "success" | "error"; message: string }>({ status: "idle", message: "" });

  // 打开新增API弹窗
  const openCreateApiDialog = () => {
    setApiDialogMode("create");
    setSelectedApi(null);
    setApiForm({
      name: "",
      endpoint: "",
      method: "GET",
      description: "",
      authType: "Bearer Token",
      timeout: 30000,
      retryCount: 3,
      headers: ""
    });
    setApiTestResult({ status: "idle", message: "" });
    setApiDialogOpen(true);
  };

  // 打开查看/编辑API弹窗
  const openApiDialog = (api: ApiConfig, mode: "view" | "edit") => {
    setApiDialogMode(mode);
    setSelectedApi(api);
    setApiForm({
      name: api.name,
      endpoint: api.endpoint,
      method: api.method,
      description: api.description || "",
      authType: api.authType || "Bearer Token",
      timeout: api.timeout || 30000,
      retryCount: api.retryCount || 3,
      headers: api.headers || ""
    });
    setApiTestResult({ status: "idle", message: "" });
    setApiDialogOpen(true);
  };

  // 保存API配置
  const saveApiConfig = () => {
    if (apiDialogMode === "create") {
      const newApi: ApiConfig = {
        id: Math.max(...apiList.map(a => a.id)) + 1,
        name: apiForm.name,
        endpoint: apiForm.endpoint,
        method: apiForm.method,
        status: "active",
        calls: 0,
        lastCall: "-",
        description: apiForm.description,
        authType: apiForm.authType,
        timeout: apiForm.timeout,
        retryCount: apiForm.retryCount,
        headers: apiForm.headers
      };
      setApiList([...apiList, newApi]);
    } else if (apiDialogMode === "edit" && selectedApi) {
      setApiList(apiList.map(api => 
        api.id === selectedApi.id 
          ? { ...api, ...apiForm }
          : api
      ));
    }
    setApiDialogOpen(false);
  };

  // 测试API连接
  const testApiConnection = () => {
    setApiTestResult({ status: "loading", message: "正在测试连接..." });
    // 模拟API测试
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setApiTestResult({ status: "success", message: `连接成功! 响应时间: ${Math.floor(Math.random() * 500 + 100)}ms` });
      } else {
        setApiTestResult({ status: "error", message: "连接失败: 服务器无响应或超时" });
      }
    }, 1500);
  };

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

  // 打开新增模板对话框
  const openNewTemplateDialog = () => {
    setEditingTemplate(null);
    setTemplateForm({
      name: "",
      ataChapter: "",
      description: "",
      lru: "",
      selectedParameters: [],
      dashboards: []
    });
    setParameterSearchTerm("");
    setActiveDashboardId(null);
    setDashboardEditMode("select");
    setTemplateDialogOpen(true);
  };

  // 打开编辑模板对话框
  const openEditTemplateDialog = (template: TemplateConfig) => {
    setEditingTemplate(template);
    // 模拟从模板加载dashboards配置（实际应用中应从数据库获取）
    const mockDashboards = template.selectedParameters.length > 0 ? [
      {
        id: "db-1",
        name: "Dashboard 1",
        parameters: template.selectedParameters.slice(0, Math.min(3, template.selectedParameters.length)),
        width: 2,
        height: 1,
        x: 0,
        y: 0
      }
    ] : [];
    setTemplateForm({
      name: template.name,
      ataChapter: template.ataChapter,
      description: template.description,
      lru: template.lru,
      selectedParameters: [...template.selectedParameters],
      dashboards: mockDashboards
    });
    setParameterSearchTerm("");
    setActiveDashboardId(null);
    setDashboardEditMode("select");
    setTemplateDialogOpen(true);
  };

  // 保存模板
  const saveTemplate = () => {
    if (editingTemplate) {
      // 编辑现有模板
      setTemplates(prev => prev.map(t => 
        t.id === editingTemplate.id 
          ? {
              ...t,
              name: templateForm.name,
              ataChapter: templateForm.ataChapter,
              description: templateForm.description,
              lru: templateForm.lru,
              selectedParameters: templateForm.selectedParameters,
              coreParameters: templateForm.selectedParameters.length,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : t
      ));
    } else {
      // 新增模板
      const newTemplate: TemplateConfig = {
        id: Math.max(...templates.map(t => t.id)) + 1,
        name: templateForm.name,
        ataChapter: templateForm.ataChapter,
        description: templateForm.description,
        lru: templateForm.lru,
        selectedParameters: templateForm.selectedParameters,
        coreParameters: templateForm.selectedParameters.length,
        version: "v1.0",
        updatedAt: new Date().toISOString().split('T')[0],
        status: "active"
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setTemplateDialogOpen(false);
  };

  // 切换参数选择
  const toggleParameterSelection = (mnemonic: string) => {
    setTemplateForm(prev => ({
      ...prev,
      selectedParameters: prev.selectedParameters.includes(mnemonic)
        ? prev.selectedParameters.filter(p => p !== mnemonic)
        : [...prev.selectedParameters, mnemonic]
    }));
  };

  // Dashboard 操作函数
  const addDashboard = () => {
    const newId = `db-${Date.now()}`;
    const newDashboard = {
      id: newId,
      name: `Dashboard ${templateForm.dashboards.length + 1}`,
      parameters: [] as string[],
      width: 2,
      height: 1,
      x: 0,
      y: templateForm.dashboards.length
    };
    setTemplateForm(prev => ({
      ...prev,
      dashboards: [...prev.dashboards, newDashboard]
    }));
    setActiveDashboardId(newId);
  };

  const removeDashboard = (id: string) => {
    setTemplateForm(prev => ({
      ...prev,
      dashboards: prev.dashboards.filter(d => d.id !== id)
    }));
    if (activeDashboardId === id) {
      setActiveDashboardId(null);
    }
  };

  const updateDashboard = (id: string, updates: Partial<typeof templateForm.dashboards[number]>) => {
    setTemplateForm(prev => ({
      ...prev,
      dashboards: prev.dashboards.map(d => 
        d.id === id ? { ...d, ...updates } : d
      )
    }));
  };

  const addParameterToDashboard = (dashboardId: string, mnemonic: string) => {
    setTemplateForm(prev => ({
      ...prev,
      dashboards: prev.dashboards.map(d => 
        d.id === dashboardId && !d.parameters.includes(mnemonic)
          ? { ...d, parameters: [...d.parameters, mnemonic] }
          : d
      )
    }));
  };

  const removeParameterFromDashboard = (dashboardId: string, mnemonic: string) => {
    setTemplateForm(prev => ({
      ...prev,
      dashboards: prev.dashboards.map(d => 
        d.id === dashboardId
          ? { ...d, parameters: d.parameters.filter(p => p !== mnemonic) }
          : d
      )
    }));
  };

  const resizeDashboard = (id: string, direction: 'width' | 'height', delta: number) => {
    setTemplateForm(prev => ({
      ...prev,
      dashboards: prev.dashboards.map(d => {
        if (d.id !== id) return d;
        if (direction === 'width') {
          const newWidth = Math.max(1, Math.min(4, d.width + delta));
          return { ...d, width: newWidth };
        } else {
          const newHeight = Math.max(1, Math.min(2, d.height + delta));
          return { ...d, height: newHeight };
        }
      })
    }));
  };

  // 生成简单的示意曲线数据
  const generateMockChartData = (paramName: string) => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      points.push({
        x: i,
        y: 50 + Math.sin(i * 0.5 + paramName.charCodeAt(0)) * 30 + Math.random() * 10
      });
    }
    return points;
  };

  // 过滤参数列表用于模板选择 - 支持多种筛选方式
  const filteredParametersForTemplate = baseParameterData.filter(param => {
    const searchLower = parameterSearchTerm.toLowerCase();
    const ataFilterLower = ataChapterFilter.toLowerCase();
    
    // ATA章节筛选
    if (ataFilterLower && !param.ataChapter.toLowerCase().includes(ataFilterLower)) {
      return false;
    }
    
    // 搜索词筛选
    if (!searchLower) return true;
    
    switch (parameterFilterType) {
      case "mnemonic":
        return param.mnemonic.toLowerCase().includes(searchLower) ||
               param.portName.toLowerCase().includes(searchLower);
      case "customName":
        return param.customName.toLowerCase().includes(searchLower);
      case "customDescription":
        return param.customDescription.toLowerCase().includes(searchLower);
      case "ataChapter":
        return param.ataChapter.toLowerCase().includes(searchLower);
      case "all":
      default:
        return param.mnemonic.toLowerCase().includes(searchLower) ||
               param.portName.toLowerCase().includes(searchLower) ||
               param.customName.toLowerCase().includes(searchLower) ||
               param.customDescription.toLowerCase().includes(searchLower) ||
               param.ataChapter.toLowerCase().includes(searchLower);
    }
  });

  // WQAR数据筛选
  const filteredWqarData = wqarData.filter(item => {
    // 注册号筛选
    if (wqarFilters.registration && !item.registration.toLowerCase().includes(wqarFilters.registration.toLowerCase())) {
      return false;
    }
    // 时间范围筛选
    const itemDate = item.date.split(" ")[0];
    if (wqarFilters.startDate && itemDate < wqarFilters.startDate) {
      return false;
    }
    if (wqarFilters.endDate && itemDate > wqarFilters.endDate) {
      return false;
    }
    // 搜索词筛选
    if (searchTerm && activeTab === "wqar") {
      return item.flightNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.registration.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // 计算下载数据统计
  const calculateDownloadStats = () => {
    const filtered = wqarData.filter(item => {
      if (downloadFilters.registration && !item.registration.toLowerCase().includes(downloadFilters.registration.toLowerCase())) {
        return false;
      }
      const itemDate = item.date.split(" ")[0];
      if (downloadFilters.startDate && itemDate < downloadFilters.startDate) {
        return false;
      }
      if (downloadFilters.endDate && itemDate > downloadFilters.endDate) {
        return false;
      }
      return true;
    });
    
    const totalSize = filtered.reduce((acc, item) => {
      const size = parseInt(item.fileSize.replace("MB", ""));
      return acc + size;
    }, 0);
    
    return {
      count: filtered.length,
      totalSize: totalSize >= 1024 ? `${(totalSize / 1024).toFixed(2)} GB` : `${totalSize} MB`
    };
  };

  // 获取所有注册号列表
  const registrationList = [...new Set(wqarData.map(item => item.registration))];

  // 故障数据筛选
  const filteredFaultData = faultData.filter(item => {
    // 时间范围筛选
    const itemDate = item.faultDate.split(" ")[0];
    if (faultFilters.startDate && itemDate < faultFilters.startDate) return false;
    if (faultFilters.endDate && itemDate > faultFilters.endDate) return false;
    // 航司筛选
    if (faultFilters.airline && item.airlineCode !== faultFilters.airline) return false;
    // 注册号筛选
    if (faultFilters.registration && !item.registration.toLowerCase().includes(faultFilters.registration.toLowerCase())) return false;
    // CMS信息筛选
    if (faultFilters.cmsMessage && !item.cmsMessage.toLowerCase().includes(faultFilters.cmsMessage.toLowerCase())) return false;
    // 状态筛选
    if (faultFilters.status && item.status !== faultFilters.status) return false;
    // ATA筛选
    if (faultFilters.ata && item.ataChapter !== faultFilters.ata) return false;
    return true;
  });

  // 故障统计计算
  const faultStats = {
    total: filteredFaultData.length,
    analyzed: filteredFaultData.filter(f => f.status === "analyzed").length,
    pending: filteredFaultData.filter(f => f.status === "pending").length,
    ignored: filteredFaultData.filter(f => f.status === "ignored").length,
    noQar: filteredFaultData.filter(f => f.status === "no_qar").length,
  };

  // 获取故障注册号列表
  const faultRegistrationList = [...new Set(faultData.map(item => item.registration))];

  // 获取故障ATA列表
  const faultAtaList = [...new Set(faultData.map(item => item.ataChapter))].sort();

  // 故障状态徽章
  const getFaultStatusBadge = (status: string) => {
    switch (status) {
      case "analyzed":
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">已分析</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">待分析</Badge>;
      case "ignored":
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">已忽略</Badge>;
      case "no_qar":
        return <Badge className="bg-red-100 text-red-700 border-red-200">暂无QAR</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 故障严重程度徽章
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge className="bg-red-100 text-red-700 border-red-200">高</Badge>;
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">中</Badge>;
      case "low":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">低</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };
  
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
                  <Button size="sm" className="gap-1" onClick={openCreateApiDialog}>
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
                  {apiList.map((api) => (
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
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openApiDialog(api, "view")}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openApiDialog(api, "edit")}>
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
                  <Button size="sm" className="gap-1" onClick={() => setDownloadDialogOpen(true)}>
                    <Download className="h-4 w-4" />
                    下载数据
                  </Button>
                </div>
              </div>
              
              {/* 筛选区域 */}
              <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">筛选:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">注册号:</Label>
                  <Select value={wqarFilters.registration} onValueChange={(v) => setWqarFilters(prev => ({ ...prev, registration: v === " " ? "" : v }))}>
                    <SelectTrigger className="w-[120px] h-8">
                      <SelectValue placeholder="全部" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=" ">全部</SelectItem>
                      {registrationList.map(reg => (
                        <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">开始日期:</Label>
                  <Input
                    type="date"
                    value={wqarFilters.startDate}
                    onChange={(e) => setWqarFilters(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-[140px] h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground">结束日期:</Label>
                  <Input
                    type="date"
                    value={wqarFilters.endDate}
                    onChange={(e) => setWqarFilters(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-[140px] h-8"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setWqarFilters({ registration: "", startDate: "", endDate: "" })}
                >
                  <X className="h-4 w-4 mr-1" />
                  清除筛选
                </Button>
                <div className="ml-auto text-sm text-muted-foreground">
                  共 {filteredWqarData.length} 条记录
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">航班号</TableHead>
                    <TableHead className="w-[100px]">注册号</TableHead>
                    <TableHead className="w-[160px]">日期时间</TableHead>
                    <TableHead className="w-[120px]">航线</TableHead>
                    <TableHead className="w-[80px]">文件大小</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">参数数量</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWqarData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.flightNo}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          {item.registration}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{item.date}</TableCell>
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

        {/* LRU管理 */}
        {activeTab === "lru" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-primary" />
                  LRU管理
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索机型、LRU、件号..."
                      value={lruSearchTerm}
                      onChange={(e) => setLruSearchTerm(e.target.value)}
                      className="pl-8 h-9 w-64"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <Plus className="h-4 w-4" />
                    新增 LRU
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-[140px]">机型</TableHead>
                      <TableHead className="w-[200px]">LRU</TableHead>
                      <TableHead className="w-[120px]">ATA章节</TableHead>
                      <TableHead className="w-[140px]">件号</TableHead>
                      <TableHead>关联模型</TableHead>
                      <TableHead className="w-[100px] text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lruData
                      .filter((item) => {
                        if (!lruSearchTerm) return true;
                        const term = lruSearchTerm.toLowerCase();
                        return (
                          item.aircraftType.toLowerCase().includes(term) ||
                          item.lru.toLowerCase().includes(term) ||
                          item.partNumber.toLowerCase().includes(term) ||
                          item.ataChapter.toLowerCase().includes(term) ||
                          item.relatedModel.toLowerCase().includes(term)
                        );
                      })
                      .map((item) => (
                        <TableRow key={item.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{item.aircraftType}</TableCell>
                          <TableCell>{item.lru}</TableCell>
                          <TableCell>
                            <Badge variant="outline">ATA {item.ataChapter}</Badge>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{item.partNumber}</TableCell>
                          <TableCell>
                            <span className="text-primary">{item.relatedModel}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <div className="text-xs text-muted-foreground mt-3">
                共 {lruData.filter((item) => {
                  if (!lruSearchTerm) return true;
                  const term = lruSearchTerm.toLowerCase();
                  return (
                    item.aircraftType.toLowerCase().includes(term) ||
                    item.lru.toLowerCase().includes(term) ||
                    item.partNumber.toLowerCase().includes(term) ||
                    item.ataChapter.toLowerCase().includes(term) ||
                    item.relatedModel.toLowerCase().includes(term)
                  );
                }).length} 条 LRU 记录
              </div>
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
              {/* 存储总览 */}
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
<Badge variant="outline" className={
                                  param.signalType === "BNR" ? "bg-amber-50 text-amber-600" : 
                                  param.signalType === "DIS" ? "bg-sky-50 text-sky-600" : 
                                  "bg-purple-50 text-purple-600"
                                }>
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
                  <Button size="sm" className="gap-1" onClick={openNewTemplateDialog}>
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
                    <TableHead className="w-[180px]">模板名称</TableHead>
                    <TableHead className="w-[100px]">ATA章节</TableHead>
                    <TableHead className="w-[250px]">模板描述</TableHead>
                    <TableHead className="w-[140px]">LRU</TableHead>
                    <TableHead className="w-[100px]">核心参数</TableHead>
                    <TableHead className="w-[80px]">版本</TableHead>
                    <TableHead className="w-[120px]">更新时间</TableHead>
                    <TableHead className="w-[80px]">状态</TableHead>
                    <TableHead className="w-[100px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          ATA {item.ataChapter}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {item.lru.split(", ").map((part, idx) => (
                            <Badge key={idx} variant="outline" className="bg-amber-50 text-amber-700 text-xs">
                              {part}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                          {item.coreParameters}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.version}</TableCell>
                      <TableCell className="text-muted-foreground">{item.updatedAt}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditTemplateDialog(item)}>
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

        {/* 元数据列表 */}
        {activeTab === "metadata" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tags className="h-4 w-4 text-primary" />
                  元数据列表
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索表名..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 h-8 w-[200px]"
                    />
                  </div>
                  <Button size="sm" variant="outline" className="gap-1">
                    <RefreshCw className="h-4 w-4" />
                    同步全部
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">表名</TableHead>
                    <TableHead className="w-[160px]">显示名称</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead className="w-[100px]">记录数</TableHead>
                    <TableHead className="w-[80px]">字段数</TableHead>
                    <TableHead className="w-[160px]">最后同步</TableHead>
                    <TableHead className="w-[120px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {metadataData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-sm font-medium text-blue-600">{item.tableName}</TableCell>
                      <TableCell className="font-medium">{item.displayName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{item.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                          {item.records.toLocaleString()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.fields}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{item.lastSync}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="查看表结构">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="查询数据">
                            <Search className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="同步">
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

        {/* 故障统计 */}
        {activeTab === "fault" && (
          <div className="space-y-4">
            {/* 统计卡片 */}
            <div className="grid grid-cols-5 gap-4">
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">所有故障</p>
                      <p className="text-2xl font-bold mt-1">{faultStats.total}</p>
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
                      <p className="text-2xl font-bold mt-1 text-emerald-600">{faultStats.analyzed}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Check className="h-5 w-5 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">待分析</p>
                      <p className="text-2xl font-bold mt-1 text-amber-600">{faultStats.pending}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-amber-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">已忽略</p>
                      <p className="text-2xl font-bold mt-1 text-gray-600">{faultStats.ignored}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <X className="h-5 w-5 text-gray-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">暂无QAR数据</p>
                      <p className="text-2xl font-bold mt-1 text-red-600">{faultStats.noQar}</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <Database className="h-5 w-5 text-red-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 故障列表 */}
            <Card className="border border-border">
              <CardHeader className="border-b border-border py-3 px-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      故障统计
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      共 {filteredFaultData.length} 条记录
                    </span>
                    {(faultFilters.startDate || faultFilters.endDate || faultFilters.airline || faultFilters.registration || faultFilters.cmsMessage || faultFilters.status || faultFilters.ata) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setFaultFilters({ startDate: "", endDate: "", airline: "", registration: "", cmsMessage: "", status: "", ata: "" })}
                      >
                        <X className="h-3 w-3 mr-1" />
                        清除筛选
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Download className="h-4 w-4" />
                      导出
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1">
                      <RefreshCw className="h-4 w-4" />
                      刷新
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {/* CMS信息 - 文本搜索筛选 */}
                      <TableHead className="w-[160px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              CMS信息
                              <ChevronDown className={`h-3 w-3 ${faultFilters.cmsMessage ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-3" align="start">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">搜索CMS信息</Label>
                              <Input
                                placeholder="输入关键词..."
                                value={faultFilters.cmsMessage}
                                onChange={(e) => setFaultFilters(prev => ({ ...prev, cmsMessage: e.target.value }))}
                                className="h-8"
                              />
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      {/* 注册号 - 直接选项列表 */}
                      <TableHead className="w-[80px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              注册号
                              <ChevronDown className={`h-3 w-3 ${faultFilters.registration ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[100px] p-1" align="start">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${!faultFilters.registration ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, registration: "" }))}
                              >
                                全部
                              </Button>
                              {faultRegistrationList.map(reg => (
                                <Button
                                  key={reg}
                                  variant="ghost"
                                  size="sm"
                                  className={`justify-start h-8 px-2 ${faultFilters.registration === reg ? "bg-accent" : ""}`}
                                  onClick={() => setFaultFilters(prev => ({ ...prev, registration: reg }))}
                                >
                                  {reg}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      {/* 航司 - 直接选项列表 */}
                      <TableHead className="w-[140px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              航司
                              <ChevronDown className={`h-3 w-3 ${faultFilters.airline ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[120px] p-1" align="start">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${!faultFilters.airline ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, airline: "" }))}
                              >
                                全部
                              </Button>
                              {airlineList.map(a => (
                                <Button
                                  key={a.code}
                                  variant="ghost"
                                  size="sm"
                                  className={`justify-start h-8 px-2 ${faultFilters.airline === a.code ? "bg-accent" : ""}`}
                                  onClick={() => setFaultFilters(prev => ({ ...prev, airline: a.code }))}
                                >
                                  {a.name}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      {/* ATA - 直接选项列表 */}
                      <TableHead className="w-[80px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              ATA
                              <ChevronDown className={`h-3 w-3 ${faultFilters.ata ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[90px] p-1" align="start">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${!faultFilters.ata ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, ata: "" }))}
                              >
                                全部
                              </Button>
                              {faultAtaList.map(ata => (
                                <Button
                                  key={ata}
                                  variant="ghost"
                                  size="sm"
                                  className={`justify-start h-8 px-2 ${faultFilters.ata === ata ? "bg-accent" : ""}`}
                                  onClick={() => setFaultFilters(prev => ({ ...prev, ata: ata }))}
                                >
                                  ATA {ata}
                                </Button>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      {/* 故障时间 - 日期范围筛选 */}
                      <TableHead className="w-[150px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              故障时间
                              <ChevronDown className={`h-3 w-3 ${faultFilters.startDate || faultFilters.endDate ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[220px] p-3" align="start">
                            <div className="space-y-3">
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">开始日期</Label>
                                <Input
                                  type="date"
                                  value={faultFilters.startDate}
                                  onChange={(e) => setFaultFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs text-muted-foreground">结束日期</Label>
                                <Input
                                  type="date"
                                  value={faultFilters.endDate}
                                  onChange={(e) => setFaultFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                  className="h-8"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      <TableHead className="w-[100px]">航班号</TableHead>
                      <TableHead className="w-[100px]">航线</TableHead>
                      
                      {/* 状态 - 直接选项列表 */}
                      <TableHead className="w-[90px]">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" className="h-auto p-0 font-medium hover:bg-transparent flex items-center gap-1">
                              状态
                              <ChevronDown className={`h-3 w-3 ${faultFilters.status ? "text-primary" : "text-muted-foreground"}`} />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[100px] p-1" align="start">
                            <div className="flex flex-col">
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${!faultFilters.status ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, status: "" }))}
                              >
                                全部
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${faultFilters.status === "analyzed" ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, status: "analyzed" }))}
                              >
                                已分析
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${faultFilters.status === "pending" ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, status: "pending" }))}
                              >
                                待分析
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${faultFilters.status === "ignored" ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, status: "ignored" }))}
                              >
                                已忽略
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className={`justify-start h-8 px-2 ${faultFilters.status === "no_qar" ? "bg-accent" : ""}`}
                                onClick={() => setFaultFilters(prev => ({ ...prev, status: "no_qar" }))}
                              >
                                暂无QAR
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableHead>
                      
                      <TableHead className="w-[80px]">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredFaultData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          没有找到匹配的故障记录
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredFaultData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.cmsMessage}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-600">
                              {item.registration}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm">{item.airline}（{item.airlineCode}）</span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-50 text-purple-600">
                              {item.ataChapter}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-mono text-sm">{item.faultDate}</TableCell>
                          <TableCell>{item.flightNo}</TableCell>
                          <TableCell>{item.route}</TableCell>
                          <TableCell>{getFaultStatusBadge(item.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.status === "analyzed" && item.analysisId ? (
                                <Link href={`/task-management?analysisId=${item.analysisId}`}>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="查看分析详情">
                                    <ExternalLink className="h-3.5 w-3.5 text-blue-600" />
                                  </Button>
                                </Link>
                              ) : (
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="查看详情">
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              )}
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
        )}
      </main>

      {/* API配置对话框 */}
      <Dialog open={apiDialogOpen} onOpenChange={setApiDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {apiDialogMode === "create" ? "新增API" : apiDialogMode === "edit" ? "编辑API" : "查看API详情"}
            </DialogTitle>
            <DialogDescription>
              {apiDialogMode === "create" ? "配置新的API接口信息" : apiDialogMode === "edit" ? "修改API配置参数" : "查看API配置详情和测试连接"}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-1">
            <div className="space-y-4 py-4">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  基本信息
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-name">API名称 *</Label>
                    <Input
                      id="api-name"
                      value={apiForm.name}
                      onChange={(e) => setApiForm({ ...apiForm, name: e.target.value })}
                      placeholder="如: 飞行数据采集API"
                      disabled={apiDialogMode === "view"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-method">请求方法 *</Label>
                    <Select 
                      value={apiForm.method} 
                      onValueChange={(v) => setApiForm({ ...apiForm, method: v })}
                      disabled={apiDialogMode === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-endpoint">API端点 *</Label>
                  <Input
                    id="api-endpoint"
                    value={apiForm.endpoint}
                    onChange={(e) => setApiForm({ ...apiForm, endpoint: e.target.value })}
                    placeholder="如: /api/v1/flight-data"
                    className="font-mono"
                    disabled={apiDialogMode === "view"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="api-description">描述</Label>
                  <Textarea
                    id="api-description"
                    value={apiForm.description}
                    onChange={(e) => setApiForm({ ...apiForm, description: e.target.value })}
                    placeholder="描述此API的用途和功能"
                    rows={2}
                    disabled={apiDialogMode === "view"}
                  />
                </div>
              </div>

              {/* 认证配置 */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  认证配置
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-auth">认证方式</Label>
                    <Select 
                      value={apiForm.authType} 
                      onValueChange={(v) => setApiForm({ ...apiForm, authType: v })}
                      disabled={apiDialogMode === "view"}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">无认证</SelectItem>
                        <SelectItem value="Bearer Token">Bearer Token</SelectItem>
                        <SelectItem value="API Key">API Key</SelectItem>
                        <SelectItem value="Basic Auth">Basic Auth</SelectItem>
                        <SelectItem value="OAuth 2.0">OAuth 2.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="api-timeout">超时时间 (ms)</Label>
                    <Input
                      id="api-timeout"
                      type="number"
                      value={apiForm.timeout}
                      onChange={(e) => setApiForm({ ...apiForm, timeout: parseInt(e.target.value) || 30000 })}
                      disabled={apiDialogMode === "view"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-retry">重试次数</Label>
                    <Input
                      id="api-retry"
                      type="number"
                      value={apiForm.retryCount}
                      onChange={(e) => setApiForm({ ...apiForm, retryCount: parseInt(e.target.value) || 0 })}
                      min={0}
                      max={10}
                      disabled={apiDialogMode === "view"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>自定义Headers</Label>
                    <Textarea
                      value={apiForm.headers}
                      onChange={(e) => setApiForm({ ...apiForm, headers: e.target.value })}
                      placeholder='{"Content-Type": "application/json"}'
                      rows={2}
                      className="font-mono text-xs"
                      disabled={apiDialogMode === "view"}
                    />
                  </div>
                </div>
              </div>

              {/* API测试 */}
              <div className="space-y-4 pt-2 border-t">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Play className="h-4 w-4 text-muted-foreground" />
                  连接测试
                </h4>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="outline" 
                    onClick={testApiConnection}
                    disabled={apiTestResult.status === "loading" || !apiForm.endpoint}
                    className="gap-2"
                  >
                    {apiTestResult.status === "loading" ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                    测试连接
                  </Button>
                  {apiTestResult.status !== "idle" && (
                    <div className={`flex items-center gap-2 text-sm ${
                      apiTestResult.status === "success" ? "text-emerald-600" : 
                      apiTestResult.status === "error" ? "text-red-600" : 
                      "text-muted-foreground"
                    }`}>
                      {apiTestResult.status === "success" && <Check className="h-4 w-4" />}
                      {apiTestResult.status === "error" && <X className="h-4 w-4" />}
                      {apiTestResult.message}
                    </div>
                  )}
                </div>
              </div>

              {/* 如果是查看模式，显示调用统计 */}
              {apiDialogMode === "view" && selectedApi && (
                <div className="space-y-4 pt-2 border-t">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    调用统计
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-primary">{selectedApi.calls.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">总调用次数</div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold">{selectedApi.status === "active" ? "运行中" : "已停用"}</div>
                      <div className="text-xs text-muted-foreground">当前状态</div>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium">{selectedApi.lastCall}</div>
                      <div className="text-xs text-muted-foreground">最后调用时间</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setApiDialogOpen(false)}>
              {apiDialogMode === "view" ? "关闭" : "取��"}
            </Button>
            {apiDialogMode === "view" ? (
              <Button onClick={() => setApiDialogMode("edit")} className="gap-1">
                <Edit className="h-4 w-4" />
                编辑
              </Button>
            ) : (
              <Button 
                onClick={saveApiConfig} 
                disabled={!apiForm.name || !apiForm.endpoint}
                className="gap-1"
              >
                <Save className="h-4 w-4" />
                保存
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

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

      {/* WQAR数据下载对话框 */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderDown className="h-5 w-5 text-primary" />
              下载WQAR数据
            </DialogTitle>
            <DialogDescription>
              选择下载数据的范围和条件
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {/* 注册号选择 */}
            <div className="space-y-2">
              <Label>注册号</Label>
              <Select 
                value={downloadFilters.registration} 
                onValueChange={(v) => setDownloadFilters(prev => ({ ...prev, registration: v === " " ? "" : v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="全部注册号" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=" ">全部注册号</SelectItem>
                  {registrationList.map(reg => (
                    <SelectItem key={reg} value={reg}>{reg}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 时间范围 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>开始日期</Label>
                <Input
                  type="date"
                  value={downloadFilters.startDate}
                  onChange={(e) => setDownloadFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>结束日期</Label>
                <Input
                  type="date"
                  value={downloadFilters.endDate}
                  onChange={(e) => setDownloadFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            {/* 统计信息 */}
            <div className="p-4 bg-muted/50 rounded-lg border space-y-3">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                数据统计
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">数据条数:</span>
                  <span className="font-medium">{calculateDownloadStats().count} 条</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">数据大小:</span>
                  <span className="font-medium">{calculateDownloadStats().totalSize}</span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">下载位置:</span>
                  <span className="font-mono text-xs bg-muted px-2 py-1 rounded">/data/WQAR/C919</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadDialogOpen(false)}>
              取消
            </Button>
            <Button 
              className="gap-1"
              disabled={calculateDownloadStats().count === 0}
              onClick={() => {
                // 模拟下载
                setDownloadDialogOpen(false);
                setDownloadFilters({ startDate: "", endDate: "", registration: "" });
              }}
            >
              <Download className="h-4 w-4" />
              开始下载
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 模板编辑对话框 */}
      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="!max-w-[1600px] w-[95vw] h-[92vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingTemplate ? "编辑模板" : "新增模板"}</DialogTitle>
            <DialogDescription>
              配置模板基本信息并选择核心参数
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-4 space-y-6">
            {/* 基本信�� */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">模板名称</Label>
                <Input
                  id="template-name"
                  value={templateForm.name}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：APU EGT超温"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-ata">ATA章节</Label>
                <Input
                  id="template-ata"
                  value={templateForm.ataChapter}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, ataChapter: e.target.value }))}
                  placeholder="例如：49"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-lru">LRU（涉及部件）</Label>
                <Input
                  id="template-lru"
                  value={templateForm.lru}
                  onChange={(e) => setTemplateForm(prev => ({ ...prev, lru: e.target.value }))}
                  placeholder="例如：APU, EGT传感器"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-description">模板描述</Label>
              <Textarea
                id="template-description"
                value={templateForm.description}
                onChange={(e) => setTemplateForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="描述模板的用途和监控目标..."
                rows={2}
              />
            </div>

            {/* 核心参数选择 */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">核心参数配置</Label>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600">
                  已选择 {templateForm.selectedParameters.length} 个参数
                </Badge>
              </div>
              
              {/* 筛选区域 */}
              <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
                <div className="flex items-center gap-2">
                    <Label className="text-sm text-muted-foreground whitespace-nowrap">筛选方式:</Label>
                  <Select value={parameterFilterType} onValueChange={(v: typeof parameterFilterType) => setParameterFilterType(v)}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部字段</SelectItem>
                      <SelectItem value="mnemonic">MNEMONIC</SelectItem>
                      <SelectItem value="customName">参数名</SelectItem>
                      <SelectItem value="customDescription">参数释义</SelectItem>
                      <SelectItem value="ataChapter">ATA章节</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索参数..."
                    value={parameterSearchTerm}
                    onChange={(e) => setParameterSearchTerm(e.target.value)}
                    className="pl-8 h-8"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-sm text-muted-foreground whitespace-nowrap">ATA章节:</Label>
                  <Input
                    placeholder="如: 72"
                    value={ataChapterFilter}
                    onChange={(e) => setAtaChapterFilter(e.target.value)}
                    className="w-[100px] h-8"
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8"
                  onClick={() => {
                    setParameterSearchTerm("");
                    setAtaChapterFilter("");
                    setParameterFilterType("all");
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  清除筛选
                </Button>
              </div>

              {/* 已选参数标签 */}
              {templateForm.selectedParameters.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <span className="text-sm text-muted-foreground mr-2">已选参数:</span>
                  {templateForm.selectedParameters.map((mnemonic) => (
                    <Badge
                      key={mnemonic}
                      variant="secondary"
                      className="gap-1 cursor-pointer hover:bg-destructive/10 hover:text-destructive transition-colors"
                      onClick={() => toggleParameterSelection(mnemonic)}
                    >
                      {mnemonic}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              )}

              {/* 参数列表 */}
              <div className="border rounded-lg overflow-hidden">
                <ScrollArea className="h-[380px]">
                  <Table className="w-full table-fixed">
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[60px] sticky top-0 bg-muted/50">选择</TableHead>
                        <TableHead className="w-[12%] sticky top-0 bg-muted/50">MNEMONIC</TableHead>
                        <TableHead className="w-[18%] sticky top-0 bg-muted/50">PORT NAME</TableHead>
                        <TableHead className="w-[10%] sticky top-0 bg-muted/50">信号类型</TableHead>
                        <TableHead className="w-[8%] sticky top-0 bg-muted/50">单位</TableHead>
                        <TableHead className="w-[14%] sticky top-0 bg-muted/50 text-blue-600">参数名</TableHead>
                        <TableHead className="w-[26%] sticky top-0 bg-muted/50 text-blue-600">参数释义</TableHead>
                        <TableHead className="w-[8%] sticky top-0 bg-muted/50 text-blue-600">ATA章节</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredParametersForTemplate.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                            没有找到匹配的参数
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredParametersForTemplate.map((param) => (
                          <TableRow
                            key={param.id}
                            className={`cursor-pointer hover:bg-muted/50 transition-colors ${
                              templateForm.selectedParameters.includes(param.mnemonic) ? "bg-primary/5" : ""
                            }`}
                            onClick={() => toggleParameterSelection(param.mnemonic)}
                          >
                            <TableCell>
                              <Checkbox
                                checked={templateForm.selectedParameters.includes(param.mnemonic)}
                                onCheckedChange={() => toggleParameterSelection(param.mnemonic)}
                              />
                            </TableCell>
                            <TableCell className="font-mono text-sm font-medium">{param.mnemonic}</TableCell>
                            <TableCell className="font-mono text-xs text-muted-foreground">{param.portName}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {param.signalType}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{param.unit || "-"}</TableCell>
                            <TableCell className="text-blue-600 font-medium truncate">{param.customName || "-"}</TableCell>
                            <TableCell className="text-sm text-muted-foreground truncate" title={param.customDescription}>
                              {param.customDescription || "-"}
                            </TableCell>
                            <TableCell>
                              {param.ataChapter ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 text-xs">
                                  {param.ataChapter}
                                </Badge>
                              ) : "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <div className="text-xs text-muted-foreground">
                共 {filteredParametersForTemplate.length} 条参数 {parameterSearchTerm || ataChapterFilter ? `（已筛选，总共 ${baseParameterData.length} 条）` : ""}
              </div>
            </div>

            {/* Dashboard 配置区域 */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-primary" />
                  <Label className="text-base font-medium">Dashboard 布局配置</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={dashboardEditMode === "select" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDashboardEditMode("select")}
                  >
                    配置参数
                  </Button>
                  <Button
                    variant={dashboardEditMode === "preview" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDashboardEditMode("preview")}
                  >
                    预览布局
                  </Button>
                  <Button size="sm" variant="outline" onClick={addDashboard} className="gap-1">
                    <Plus className="h-4 w-4" />
                    添加 Dashboard
                  </Button>
                </div>
              </div>

              {templateForm.dashboards.length === 0 ? (
                <div className="border-2 border-dashed rounded-lg p-8 text-center text-muted-foreground">
                  <LayoutGrid className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>暂无 Dashboard 配置</p>
                  <p className="text-sm mt-1">点击上方按钮添加 Dashboard，配置参数曲线展示</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {dashboardEditMode === "select" ? (
                    // 参数配置模式
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {templateForm.dashboards.map((dashboard, index) => (
                        <div 
                          key={dashboard.id}
                          className={`border rounded-lg p-4 transition-all ${
                            activeDashboardId === dashboard.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                              <Input
                                value={dashboard.name}
                                onChange={(e) => updateDashboard(dashboard.id, { name: e.target.value })}
                                className="h-8 w-40 font-medium"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span>尺寸:</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => resizeDashboard(dashboard.id, 'width', -1)}
                                  disabled={dashboard.width <= 1}
                                >
                                  <Minimize2 className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{dashboard.width}x{dashboard.height}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => resizeDashboard(dashboard.id, 'width', 1)}
                                  disabled={dashboard.width >= 4}
                                >
                                  <Maximize2 className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                                onClick={() => removeDashboard(dashboard.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* 已添加的参数 */}
                          <div className="mb-3">
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              已添加参数 ({dashboard.parameters.length})
                            </Label>
                            <div className="flex flex-wrap gap-1 min-h-[32px] p-2 bg-muted/30 rounded border">
                              {dashboard.parameters.length === 0 ? (
                                <span className="text-xs text-muted-foreground">点击下方参数添加到此Dashboard</span>
                              ) : (
                                dashboard.parameters.map(param => (
                                  <Badge 
                                    key={param}
                                    variant="secondary"
                                    className="gap-1 cursor-pointer hover:bg-destructive/10"
                                    onClick={() => removeParameterFromDashboard(dashboard.id, param)}
                                  >
                                    {param}
                                    <X className="h-3 w-3" />
                                  </Badge>
                                ))
                              )}
                            </div>
                          </div>

                          {/* 可添加的参数 */}
                          <div>
                            <Label className="text-xs text-muted-foreground mb-2 block">
                              点击添加参数（已选核心参数）
                            </Label>
                            <div className="flex flex-wrap gap-1 max-h-[80px] overflow-y-auto p-2 bg-secondary/30 rounded border">
                              {templateForm.selectedParameters.filter(p => !dashboard.parameters.includes(p)).map(param => (
                                <Badge 
                                  key={param}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-primary/10 transition-colors"
                                  onClick={() => addParameterToDashboard(dashboard.id, param)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  {param}
                                </Badge>
                              ))}
                              {templateForm.selectedParameters.filter(p => !dashboard.parameters.includes(p)).length === 0 && (
                                <span className="text-xs text-muted-foreground">所有参数已添加</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    // 预览布局模式 - 使用 react-grid-layout 实现自由拖拽
                    <div className="border rounded-lg p-4 bg-muted/20 min-h-[500px]">
                      <GridLayout
                        className="layout"
                        layout={templateForm.dashboards.map(d => ({
                          i: d.id,
                          x: d.x,
                          y: d.y,
                          w: d.width,
                          h: d.height,
                          minW: 1,
                          maxW: 4,
                          minH: 1,
                          maxH: 3
                        }))}
                        cols={4}
                        rowHeight={150}
                        width={1200}
                        onLayoutChange={(layout) => {
                          setTemplateForm(prev => ({
                            ...prev,
                            dashboards: prev.dashboards.map(d => {
                              const layoutItem = layout.find(l => l.i === d.id);
                              if (layoutItem) {
                                return {
                                  ...d,
                                  x: layoutItem.x,
                                  y: layoutItem.y,
                                  width: layoutItem.w,
                                  height: layoutItem.h
                                };
                              }
                              return d;
                            })
                          }));
                        }}
                        draggableHandle=".drag-handle"
                        isResizable={true}
                        isDraggable={true}
                      >
                        {templateForm.dashboards.map((dashboard) => (
                          <div
                            key={dashboard.id}
                            className="bg-card border rounded-lg shadow-sm overflow-hidden flex flex-col"
                          >
                            <div className="drag-handle flex items-center justify-between px-3 py-2 border-b bg-muted/30 cursor-move">
                              <div className="flex items-center gap-2">
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium text-sm">{dashboard.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {dashboard.parameters.length} 参数
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {dashboard.width}x{dashboard.height}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex-1 p-3 relative overflow-hidden">
                              {dashboard.parameters.length === 0 ? (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
                                  暂无参数曲线
                                </div>
                              ) : (
                                <svg 
                                  viewBox="0 0 200 100" 
                                  className="w-full h-full"
                                  preserveAspectRatio="none"
                                >
                                  {/* 网格线 */}
                                  <defs>
                                    <pattern id={`grid-${dashboard.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/20" />
                                    </pattern>
                                  </defs>
                                  <rect width="200" height="100" fill={`url(#grid-${dashboard.id})`} />
                                  
                                  {/* 示意曲线 */}
                                  {dashboard.parameters.map((param, idx) => {
                                    const data = generateMockChartData(param);
                                    const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6'];
                                    const color = colors[idx % colors.length];
                                    const pathD = data.map((p, i) => 
                                      `${i === 0 ? 'M' : 'L'} ${p.x * 10} ${100 - p.y}`
                                    ).join(' ');
                                    return (
                                      <path
                                        key={param}
                                        d={pathD}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="2"
                                        className="opacity-80"
                                      />
                                    );
                                  })}
                                </svg>
                              )}
                              {/* 参数图例 */}
                              {dashboard.parameters.length > 0 && (
                                <div className="absolute bottom-1 left-1 flex flex-wrap gap-1">
                                  {dashboard.parameters.slice(0, 4).map((param, idx) => {
                                    const colors = ['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-amber-500', 'bg-purple-500'];
                                    return (
                                      <div key={param} className="flex items-center gap-1 text-[10px] bg-background/80 px-1 rounded">
                                        <div className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`} />
                                        <span>{param}</span>
                                      </div>
                                    );
                                  })}
                                  {dashboard.parameters.length > 4 && (
                                    <span className="text-[10px] text-muted-foreground">+{dashboard.parameters.length - 4}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </GridLayout>
                      {templateForm.dashboards.length === 0 && (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                          添加 Dashboard 后在此预览布局效果
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground">
                    提示：在配置模式下编辑各 Dashboard 的参数。在预览模式下，可以自由拖动 Dashboard 标题栏改变位置，拖动边框调整大小。
                  </div>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={saveTemplate}
              disabled={!templateForm.name || !templateForm.ataChapter || templateForm.selectedParameters.length === 0}
            >
              <Save className="h-4 w-4 mr-2" />
              保存模板
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
