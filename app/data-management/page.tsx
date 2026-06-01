"use client";

import { useState } from "react";
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
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Upload,
  Download,
  Trash2,
  Edit,
  Eye,
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

const tabs = [
  { id: "api", name: "API 管理", icon: Settings },
  { id: "wqar", name: "WQAR数据管理", icon: Database },
  { id: "template", name: "模板配置", icon: FileText },
  { id: "storage", name: "存储管理", icon: HardDrive },
  { id: "metadata", name: "元数据管理", icon: Tags },
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

export default function DataManagementPage() {
  const [activeTab, setActiveTab] = useState("api");
  const [searchTerm, setSearchTerm] = useState("");

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

        {/* 标签页切换 */}
        <div className="flex gap-2 mb-4 border-b border-border pb-3">
          {tabs.map((tab) => {
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
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-2xl font-semibold text-purple-700">5</div>
                  <div className="text-sm text-purple-600">存储分区</div>
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

        {/* 元数据管理 */}
        {activeTab === "metadata" && (
          <Card className="border border-border">
            <CardHeader className="border-b border-border py-3 px-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tags className="h-4 w-4 text-primary" />
                  元数据管理
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
    </div>
  );
}
