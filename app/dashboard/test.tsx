"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  AlertCircle,
  CalendarIcon,
  Droplet,
  Heart,
  Plus,
  Thermometer,
  Zap,
} from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types
interface PeriodDay {
  date: Date;
  flow: "light" | "medium" | "heavy" | null;
  symptoms: string[];
  notes: string;
}

interface CycleData {
  periods: PeriodDay[];
  symptoms: {
    date: Date;
    type: string;
    intensity: number;
    notes: string;
  }[];
}

// Initial data
const initialCycleData: CycleData = {
  periods: [
    {
      date: new Date(2024, 0, 15),
      flow: "medium" as const,
      symptoms: ["cramps", "bloating"],
      notes: "Moderate flow day",
    },
    {
      date: new Date(2024, 0, 16),
      flow: "heavy" as const,
      symptoms: ["cramps"],
      notes: "Heavy flow day",
    },
    {
      date: new Date(2024, 0, 17),
      flow: "light" as const,
      symptoms: ["fatigue"],
      notes: "Light flow day",
    },
  ],
  symptoms: [
    {
      date: new Date(2025, 5, 3),
      type: "cramps",
      intensity: 7,
      notes: "Severe cramps in the morning",
    },
    {
      date: new Date(2025, 5, 3),
      type: "headache",
      intensity: 5,
      notes: "Mild headache in the afternoon",
    },
    {
      date: new Date(2025, 5, 2),
      type: "cramps",
      intensity: 8,
      notes: "Needed pain medication",
    },
    { date: new Date(2025, 5, 2), type: "bloating", intensity: 6, notes: "" },
    { date: new Date(2025, 5, 1), type: "cramps", intensity: 6, notes: "" },
    {
      date: new Date(2025, 5, 1),
      type: "fatigue",
      intensity: 7,
      notes: "Very tired all day",
    },
    {
      date: new Date(2025, 4, 20),
      type: "mood",
      intensity: 8,
      notes: "Feeling irritable",
    },
    {
      date: new Date(2025, 4, 19),
      type: "mood",
      intensity: 7,
      notes: "Mood swings",
    },
    {
      date: new Date(2025, 4, 18),
      type: "acne",
      intensity: 6,
      notes: "Breakout on chin",
    },
  ],
};

// Symptom data for radar chart
const symptomData = [
  { subject: "Cramps", A: 8, fullMark: 10 },
  { subject: "Headache", A: 5, fullMark: 10 },
  { subject: "Bloating", A: 6, fullMark: 10 },
  { subject: "Fatigue", A: 7, fullMark: 10 },
  { subject: "Mood", A: 8, fullMark: 10 },
  { subject: "Acne", A: 6, fullMark: 10 },
];

// Cycle length data for line chart
const cycleData = [
  { name: "Jan", length: 28 },
  { name: "Feb", length: 29 },
  { name: "Mar", length: 27 },
  { name: "Apr", length: 28 },
  { name: "May", length: 28 },
  { name: "Jun", length: 29 },
];

export default function Dashboard() {
  const [date, setDate] = useState<Date>(new Date());
  const [cycleDataState, setCycleData] = useLocalStorage<CycleData>(
    "cycle-data",
    initialCycleData
  );
  const [isAddPeriodOpen, setIsAddPeriodOpen] = useState(false);
  const [newPeriodFlow, setNewPeriodFlow] = useState<
    "light" | "medium" | "heavy"
  >("medium");
  const [newPeriodSymptoms, setNewPeriodSymptoms] = useState<string[]>([]);
  const [newPeriodNotes, setNewPeriodNotes] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Calculate next period (simple 28-day cycle prediction)
  const lastPeriod = cycleDataState.periods.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )[0];

  const nextPeriodStart = lastPeriod
    ? addDays(new Date(lastPeriod.date), 28)
    : addDays(new Date(), 28);
  const daysUntilNextPeriod = Math.round(
    (nextPeriodStart.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate fertility window (simple estimation)
  const ovulationDay = addDays(nextPeriodStart, -14);
  const fertilityWindowStart = addDays(ovulationDay, -5);
  const fertilityWindowEnd = addDays(ovulationDay, 1);

  // Handle adding a new period day
  const handleAddPeriod = () => {
    if (!selectedDate) return;

    const newPeriodDay: PeriodDay = {
      date: selectedDate,
      flow: newPeriodFlow,
      symptoms: newPeriodSymptoms,
      notes: newPeriodNotes,
    };

    // Check if we already have this date
    const existingIndex = cycleDataState.periods.findIndex((p) =>
      isSameDay(new Date(p.date), selectedDate)
    );

    if (existingIndex >= 0) {
      // Update existing entry
      const updatedPeriods = [...cycleDataState.periods];
      updatedPeriods[existingIndex] = newPeriodDay;
      setCycleData({ ...cycleDataState, periods: updatedPeriods });
    } else {
      // Add new entry
      setCycleData({
        ...cycleDataState,
        periods: [...cycleDataState.periods, newPeriodDay],
      });
    }

    setIsAddPeriodOpen(false);
    resetPeriodForm();
  };

  const resetPeriodForm = () => {
    setNewPeriodFlow("medium");
    setNewPeriodSymptoms([]);
    setNewPeriodNotes("");
  };

  // Calendar day rendering
  const renderDay = (day: Date) => {
    // Check if this day is in periods
    const isPeriodDay = cycleDataState.periods.some((p) =>
      isSameDay(new Date(p.date), day)
    );

    // Check if this day is in fertility window
    const isFertileDay =
      day >= fertilityWindowStart && day <= fertilityWindowEnd;

    // Check if this day is ovulation day
    const isOvulationDay = isSameDay(day, ovulationDay);

    // Get flow intensity if it's a period day
    let flowIntensity: "light" | "medium" | "heavy" | null = null;
    if (isPeriodDay) {
      const periodDay = cycleDataState.periods.find((p) =>
        isSameDay(new Date(p.date), day)
      );
      flowIntensity = periodDay?.flow || null;
    }

    return (
      <div className="relative w-full h-full">
        <div
          className={cn(
            "h-full w-full flex items-center justify-center",
            isPeriodDay && "relative"
          )}
        >
          {day.getDate()}

          {isPeriodDay && (
            <div
              className={cn(
                "absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full",
                flowIntensity === "light" && "bg-pink-300",
                flowIntensity === "medium" && "bg-pink-500",
                flowIntensity === "heavy" && "bg-pink-700"
              )}
            />
          )}

          {isFertileDay && !isPeriodDay && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-blue-400" />
          )}

          {isOvulationDay && (
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-purple-500" />
          )}
        </div>
      </div>
    );
  };

  const data = {
    periods: [
      {
        date: new Date(2024, 0, 15),
        flow: "medium" as const,
        symptoms: ["cramps", "bloating"],
        notes: "Moderate flow day",
      },
      {
        date: new Date(2024, 0, 16),
        flow: "heavy" as const,
        symptoms: ["cramps"],
        notes: "Heavy flow day",
      },
      {
        date: new Date(2024, 0, 17),
        flow: "light" as const,
        symptoms: ["fatigue"],
        notes: "Light flow day",
      },
    ],
  };

  const chartData = data.periods.map((period, index) => ({
    day: index + 1,
    flow:
      period.flow === "light"
        ? 1
        : period.flow === "medium"
        ? 2
        : period.flow === "heavy"
        ? 3
        : 0,
  }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Track your cycle and symptoms</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddPeriodOpen} onOpenChange={setIsAddPeriodOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700">
                <Plus className="mr-2 h-4 w-4" /> Log Period
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Period Day</DialogTitle>
                <DialogDescription>
                  Record your period details for{" "}
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : "today"}
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate || undefined}
                        onSelect={(date) => setSelectedDate(date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="flow">Flow Intensity</Label>
                  <RadioGroup
                    defaultValue={newPeriodFlow}
                    onValueChange={(value) =>
                      setNewPeriodFlow(value as "light" | "medium" | "heavy")
                    }
                    className="flex"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="flow-light" />
                      <Label htmlFor="flow-light" className="cursor-pointer">
                        Light
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 mx-4">
                      <RadioGroupItem value="medium" id="flow-medium" />
                      <Label htmlFor="flow-medium" className="cursor-pointer">
                        Medium
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="heavy" id="flow-heavy" />
                      <Label htmlFor="flow-heavy" className="cursor-pointer">
                        Heavy
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="symptoms">Common Symptoms</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "cramps",
                      "headache",
                      "bloating",
                      "fatigue",
                      "mood swings",
                      "acne",
                    ].map((symptom) => (
                      <Badge
                        key={symptom}
                        variant={
                          newPeriodSymptoms.includes(symptom)
                            ? "default"
                            : "outline"
                        }
                        className={cn(
                          "cursor-pointer",
                          newPeriodSymptoms.includes(symptom)
                            ? "bg-pink-500 hover:bg-pink-600"
                            : ""
                        )}
                        onClick={() => {
                          if (newPeriodSymptoms.includes(symptom)) {
                            setNewPeriodSymptoms(
                              newPeriodSymptoms.filter((s) => s !== symptom)
                            );
                          } else {
                            setNewPeriodSymptoms([
                              ...newPeriodSymptoms,
                              symptom,
                            ]);
                          }
                        }}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any additional notes here..."
                    value={newPeriodNotes}
                    onChange={(e) => setNewPeriodNotes(e.target.value)}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddPeriodOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-pink-600 hover:bg-pink-700"
                  onClick={handleAddPeriod}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Log Symptoms
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Cycle Calendar</CardTitle>
            <CardDescription>
              Track your period and fertility window
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-3">
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-500 mr-2"></div>
                <span className="text-sm">Period</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-blue-400 mr-2"></div>
                <span className="text-sm">Fertile Window</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm">Ovulation</span>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={selectedDate || undefined}
              onSelect={(date) => setSelectedDate(date || null)}
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Insights</CardTitle>
            <CardDescription>Your upcoming cycle predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center p-4 bg-pink-50 rounded-lg">
              <Droplet className="h-8 w-8 text-pink-500 mr-3" />
              <div>
                <p className="font-medium">Next Period</p>
                <p className="text-sm text-muted-foreground">
                  {format(nextPeriodStart, "MMMM d")} ({daysUntilNextPeriod}{" "}
                  days)
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-blue-50 rounded-lg">
              <Heart className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <p className="font-medium">Fertility Window</p>
                <p className="text-sm text-muted-foreground">
                  {format(fertilityWindowStart, "MMM d")} -{" "}
                  {format(fertilityWindowEnd, "MMM d")}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-purple-50 rounded-lg">
              <Zap className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <p className="font-medium">Ovulation Day</p>
                <p className="text-sm text-muted-foreground">
                  {format(ovulationDay, "MMMM d")}
                </p>
              </div>
            </div>

            <div className="flex items-center p-4 bg-amber-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-amber-500 mr-3" />
              <div>
                <p className="font-medium">PMS Alert</p>
                <p className="text-sm text-muted-foreground">
                  {format(addDays(nextPeriodStart, -7), "MMM d")} -{" "}
                  {format(addDays(nextPeriodStart, -1), "MMM d")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Symptom Analysis</CardTitle>
            <CardDescription>
              Your most common symptoms this cycle
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={symptomData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0, 10]} />
                <Radar
                  name="Symptoms"
                  dataKey="A"
                  stroke="#ec4899"
                  fill="#ec4899"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cycle Length Trends</CardTitle>
            <CardDescription>
              Your cycle length over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="flow"
                  stroke="#ec4899"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>
              Your recent period and symptom logs
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="period">
              <TabsList className="mb-4">
                <TabsTrigger value="period">Period</TabsTrigger>
                <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
              </TabsList>
              <TabsContent value="period" className="space-y-4">
                {cycleDataState.periods
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((period, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="mr-4 p-2 rounded-full bg-pink-50">
                        <Droplet
                          className={cn(
                            "h-5 w-5",
                            period.flow === "light" && "text-pink-300",
                            period.flow === "medium" && "text-pink-500",
                            period.flow === "heavy" && "text-pink-700"
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {format(new Date(period.date), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {period.flow?.charAt(0).toUpperCase()! +
                            period.flow?.slice(1) || "No flow"}{" "}
                          flow
                          {period.symptoms.length > 0 &&
                            ` • ${period.symptoms.join(", ")}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
              <TabsContent value="symptoms" className="space-y-4">
                {cycleDataState.symptoms
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((symptom, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border rounded-lg"
                    >
                      <div className="mr-4 p-2 rounded-full bg-blue-50">
                        <Thermometer className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {format(new Date(symptom.date), "MMMM d, yyyy")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {symptom.type.charAt(0).toUpperCase() +
                            symptom.type.slice(1)}{" "}
                          • Intensity: {symptom.intensity}/10
                          {symptom.notes && ` • ${symptom.notes}`}
                        </p>
                      </div>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2>Selected Date Details</h2>
        {selectedDate ? (
          <div>
            <p>
              Symptoms:
              {(() => {
                const foundPeriod = data.periods?.find(
                  (p) => p.date.toDateString() === selectedDate.toDateString()
                );
                return (
                  foundPeriod?.symptoms?.join(", ") || "No symptoms recorded"
                );
              })()}
            </p>
            <p>
              Notes:
              {(() => {
                const foundPeriod = data.periods?.find(
                  (p) => p.date.toDateString() === selectedDate.toDateString()
                );
                return foundPeriod?.notes || "No notes recorded";
              })()}
            </p>
          </div>
        ) : (
          <p>No date selected</p>
        )}
      </div>
    </div>
  );
}
