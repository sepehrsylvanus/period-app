"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Target,
  Download,
  Share2,
  BarChart3,
  LineChartIcon,
} from "lucide-react";
import { format, addDays } from "date-fns";

// Mock data for analytics
const cycleData = [
  { month: "Jan", length: 28, flow: 5, symptoms: 8 },
  { month: "Feb", length: 29, flow: 4, symptoms: 6 },
  { month: "Mar", length: 27, flow: 6, symptoms: 9 },
  { month: "Apr", length: 28, flow: 5, symptoms: 7 },
  { month: "May", length: 28, flow: 4, symptoms: 5 },
  { month: "Jun", length: 29, flow: 5, symptoms: 8 },
  { month: "Jul", length: 27, flow: 6, symptoms: 9 },
  { month: "Aug", length: 28, flow: 4, symptoms: 6 },
  { month: "Sep", length: 29, flow: 5, symptoms: 7 },
  { month: "Oct", length: 28, flow: 5, symptoms: 8 },
  { month: "Nov", length: 27, flow: 6, symptoms: 9 },
  { month: "Dec", length: 28, flow: 4, symptoms: 6 },
];

const symptomTrendsData = [
  { date: "Week 1", cramps: 8, headache: 3, bloating: 5, fatigue: 6, mood: 4 },
  { date: "Week 2", cramps: 2, headache: 1, bloating: 2, fatigue: 3, mood: 2 },
  { date: "Week 3", cramps: 1, headache: 2, bloating: 3, fatigue: 4, mood: 6 },
  { date: "Week 4", cramps: 6, headache: 5, bloating: 7, fatigue: 8, mood: 8 },
];

const flowIntensityData = [
  { name: "Light", value: 25, color: "#fecaca" },
  { name: "Medium", value: 50, color: "#f87171" },
  { name: "Heavy", value: 25, color: "#dc2626" },
];

const symptomCategoryData = [
  { name: "Physical", value: 45, color: "#3b82f6" },
  { name: "Emotional", value: 30, color: "#8b5cf6" },
  { name: "Sleep", value: 15, color: "#06b6d4" },
  { name: "Appetite", value: 10, color: "#f59e0b" },
];

const cyclePhaseData = [
  { phase: "Menstrual", days: "1-5", symptoms: 8, energy: 3, mood: 4 },
  { phase: "Follicular", days: "6-13", symptoms: 3, energy: 7, mood: 7 },
  { phase: "Ovulation", days: "14-16", symptoms: 4, energy: 8, mood: 8 },
  { phase: "Luteal", days: "17-28", symptoms: 7, energy: 4, mood: 5 },
];

const monthlyComparisonData = [
  { metric: "Cycle Length", current: 28, previous: 29, average: 28.2 },
  { metric: "Flow Days", current: 5, previous: 4, average: 4.8 },
  { metric: "Symptom Intensity", current: 6.2, previous: 7.1, average: 6.8 },
  { metric: "PMS Days", current: 3, previous: 4, average: 3.5 },
];

const predictiveData = [
  { month: "Jan", actual: 28, predicted: 28 },
  { month: "Feb", actual: 29, predicted: 28 },
  { month: "Mar", actual: 27, predicted: 29 },
  { month: "Apr", actual: 28, predicted: 27 },
  { month: "May", actual: 28, predicted: 28 },
  { month: "Jun", actual: 29, predicted: 28 },
  { month: "Jul", actual: null, predicted: 29 },
  { month: "Aug", actual: null, predicted: 28 },
  { month: "Sep", actual: null, predicted: 28 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6months");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [chartType, setChartType] = useState("line");

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "3months":
        return "Last 3 Months";
      case "6months":
        return "Last 6 Months";
      case "1year":
        return "Last Year";
      case "all":
        return "All Time";
      default:
        return "Last 6 Months";
    }
  };

  const getFilteredData = (data: any[], range: string) => {
    switch (range) {
      case "3months":
        return data.slice(-3);
      case "6months":
        return data.slice(-6);
      case "1year":
        return data.slice(-12);
      default:
        return data;
    }
  };

  const filteredCycleData = getFilteredData(cycleData, timeRange);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your menstrual health patterns
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Cycle Length
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28.2 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +0.2 from last period
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Cycle Regularity
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% this month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Flow Duration
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 days</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.3 from average
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Symptom Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.2/10</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                -0.9 improvement
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cycles">Cycles</TabsTrigger>
          <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Cycle Length Trends</CardTitle>
                    <CardDescription>
                      Your cycle length over{" "}
                      {getTimeRangeLabel(timeRange).toLowerCase()}
                    </CardDescription>
                  </div>
                  <Select value={chartType} onValueChange={setChartType}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">
                        <LineChartIcon className="h-4 w-4" />
                      </SelectItem>
                      <SelectItem value="area">
                        <BarChart3 className="h-4 w-4" />
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "line" ? (
                    <LineChart data={filteredCycleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[25, 32]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="length"
                        stroke="#ec4899"
                        strokeWidth={2}
                      />
                    </LineChart>
                  ) : (
                    <AreaChart data={filteredCycleData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[25, 32]} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="length"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Flow Intensity Distribution</CardTitle>
                <CardDescription>
                  Breakdown of your flow intensity patterns
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={flowIntensityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {flowIntensityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>
                Compare your current cycle with previous cycles and averages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyComparisonData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="font-medium">{item.metric}</div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Current
                        </div>
                        <div className="font-bold">{item.current}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Previous
                        </div>
                        <div className="font-bold">{item.previous}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">
                          Average
                        </div>
                        <div className="font-bold">{item.average}</div>
                      </div>
                      <Badge
                        variant={
                          item.current > item.previous
                            ? "destructive"
                            : "default"
                        }
                        className={
                          item.current > item.previous
                            ? ""
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {item.current > item.previous ? "↑" : "↓"}{" "}
                        {Math.abs(
                          ((item.current - item.previous) / item.previous) * 100
                        ).toFixed(1)}
                        %
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cycles" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Cycle Phases Analysis</CardTitle>
                <CardDescription>
                  Average symptoms and energy levels by cycle phase
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={cyclePhaseData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="phase" />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar
                      name="Symptoms"
                      dataKey="symptoms"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Energy"
                      dataKey="energy"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Mood"
                      dataKey="mood"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cycle Metrics Over Time</CardTitle>
                <CardDescription>
                  Track multiple cycle metrics simultaneously
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredCycleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="length"
                      stroke="#ec4899"
                      name="Cycle Length"
                    />
                    <Line
                      type="monotone"
                      dataKey="flow"
                      stroke="#3b82f6"
                      name="Flow Days"
                    />
                    <Line
                      type="monotone"
                      dataKey="symptoms"
                      stroke="#ef4444"
                      name="Symptom Score"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cycle Regularity Analysis</CardTitle>
              <CardDescription>
                Detailed breakdown of your cycle patterns and regularity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">
                    Regularity Score
                  </div>
                  <div className="text-xs mt-2">
                    Your cycles are very regular
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">±1.2</div>
                  <div className="text-sm text-muted-foreground">
                    Average Variation
                  </div>
                  <div className="text-xs mt-2">Days from your average</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    27-30
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Typical Range
                  </div>
                  <div className="text-xs mt-2">Your normal cycle length</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Symptom Trends by Week</CardTitle>
                <CardDescription>
                  How your symptoms change throughout your cycle
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={symptomTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="cramps"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                    />
                    <Area
                      type="monotone"
                      dataKey="headache"
                      stackId="1"
                      stroke="#f97316"
                      fill="#f97316"
                    />
                    <Area
                      type="monotone"
                      dataKey="bloating"
                      stackId="1"
                      stroke="#eab308"
                      fill="#eab308"
                    />
                    <Area
                      type="monotone"
                      dataKey="fatigue"
                      stackId="1"
                      stroke="#22c55e"
                      fill="#22c55e"
                    />
                    <Area
                      type="monotone"
                      dataKey="mood"
                      stackId="1"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptom Categories</CardTitle>
                <CardDescription>
                  Distribution of symptoms by category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={symptomCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {symptomCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Symptoms Analysis</CardTitle>
              <CardDescription>
                Your most frequent symptoms and their patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Cramps",
                    frequency: 85,
                    avgIntensity: 7.2,
                    trend: "stable",
                  },
                  {
                    name: "Fatigue",
                    frequency: 72,
                    avgIntensity: 6.8,
                    trend: "improving",
                  },
                  {
                    name: "Mood Changes",
                    frequency: 68,
                    avgIntensity: 6.5,
                    trend: "worsening",
                  },
                  {
                    name: "Bloating",
                    frequency: 61,
                    avgIntensity: 5.9,
                    trend: "stable",
                  },
                  {
                    name: "Headache",
                    frequency: 45,
                    avgIntensity: 5.2,
                    trend: "improving",
                  },
                ].map((symptom, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{symptom.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {symptom.frequency}% frequency • Avg intensity:{" "}
                        {symptom.avgIntensity}/10
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          symptom.trend === "improving"
                            ? "default"
                            : symptom.trend === "worsening"
                            ? "destructive"
                            : "secondary"
                        }
                        className={
                          symptom.trend === "improving"
                            ? "bg-green-100 text-green-800"
                            : symptom.trend === "worsening"
                            ? ""
                            : ""
                        }
                      >
                        {symptom.trend === "improving" && "↓ Improving"}
                        {symptom.trend === "worsening" && "↑ Worsening"}
                        {symptom.trend === "stable" && "→ Stable"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prediction Accuracy</CardTitle>
              <CardDescription>
                How accurate our predictions have been for your cycles
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={predictiveData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[25, 32]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#22c55e"
                    strokeWidth={2}
                    name="Actual Cycle Length"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Predicted Cycle Length"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Prediction Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94%</div>
                  <div className="text-sm text-muted-foreground">
                    Overall accuracy
                  </div>
                  <div className="text-xs mt-2">Based on last 12 cycles</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Average Error</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">±0.8</div>
                  <div className="text-sm text-muted-foreground">
                    Days off target
                  </div>
                  <div className="text-xs mt-2">Very accurate predictions</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Confidence Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">High</div>
                  <div className="text-sm text-muted-foreground">
                    Prediction confidence
                  </div>
                  <div className="text-xs mt-2">Based on data quality</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Predictions</CardTitle>
              <CardDescription>
                Your predicted cycle events for the next 3 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    event: "Next Period",
                    date: format(addDays(new Date(), 7), "MMM d, yyyy"),
                    confidence: "95%",
                    type: "period",
                  },
                  {
                    event: "Ovulation",
                    date: format(addDays(new Date(), 21), "MMM d, yyyy"),
                    confidence: "92%",
                    type: "ovulation",
                  },
                  {
                    event: "PMS Start",
                    date: format(addDays(new Date(), 4), "MMM d, yyyy"),
                    confidence: "88%",
                    type: "pms",
                  },
                  {
                    event: "Following Period",
                    date: format(addDays(new Date(), 35), "MMM d, yyyy"),
                    confidence: "90%",
                    type: "period",
                  },
                ].map((prediction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          prediction.type === "period"
                            ? "bg-pink-500"
                            : prediction.type === "ovulation"
                            ? "bg-purple-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{prediction.event}</div>
                        <div className="text-sm text-muted-foreground">
                          {prediction.date}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline">
                      {prediction.confidence} confident
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Personalized Insights</CardTitle>
                <CardDescription>
                  AI-powered insights based on your data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium text-blue-900">
                      Cycle Pattern
                    </div>
                    <div className="text-sm text-blue-700 mt-1">
                      Your cycles are very regular with minimal variation. This
                      indicates good hormonal balance.
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="font-medium text-green-900">
                      Symptom Improvement
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      Your symptom intensity has decreased by 15% over the last
                      3 months. Great progress!
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="font-medium text-yellow-900">
                      PMS Pattern
                    </div>
                    <div className="text-sm text-yellow-700 mt-1">
                      You typically experience PMS symptoms 3-4 days before your
                      period. Plan accordingly.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Recommendations</CardTitle>
                <CardDescription>
                  Personalized tips based on your patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Exercise Timing</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Your energy levels are highest during days 6-16. Schedule
                      intense workouts during this time.
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Nutrition Focus</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Increase iron intake during your period and magnesium
                      before PMS to reduce symptoms.
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="font-medium">Sleep Schedule</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Prioritize 8+ hours of sleep during your luteal phase to
                      manage mood and energy.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Health Score Breakdown</CardTitle>
              <CardDescription>
                Your overall menstrual health score and contributing factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    8.4/10
                  </div>
                  <div className="text-lg font-medium">
                    Overall Health Score
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Excellent menstrual health
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      category: "Cycle Regularity",
                      score: 9.2,
                      color: "bg-green-500",
                    },
                    {
                      category: "Symptom Management",
                      score: 7.8,
                      color: "bg-yellow-500",
                    },
                    {
                      category: "Flow Consistency",
                      score: 8.5,
                      color: "bg-green-500",
                    },
                    {
                      category: "Prediction Accuracy",
                      score: 9.4,
                      color: "bg-green-500",
                    },
                    {
                      category: "Overall Wellness",
                      score: 8.1,
                      color: "bg-green-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {item.category}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.score}/10
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${item.color}`}
                          style={{ width: `${(item.score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
