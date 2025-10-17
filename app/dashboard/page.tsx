"use client";

import { useEffect, useState } from "react";
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
import type { DayContentProps } from "react-day-picker";
import { useGetUser } from "@/hooks/useUser";
import { decodeToken } from "@/actions/auth.action";
import { useGetCycle } from "@/hooks/useCycle";

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

// Initial data with multiple months of fake data
const initialCycleData: CycleData = {
  periods: [
    // December 2024
    {
      date: new Date(2024, 11, 15),
      flow: "medium",
      symptoms: ["cramps", "bloating"],
      notes: "First day, moderate flow",
    },
    {
      date: new Date(2024, 11, 16),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      notes: "Heavy flow day",
    },
    {
      date: new Date(2024, 11, 17),
      flow: "heavy",
      symptoms: ["cramps"],
      notes: "Still heavy",
    },
    {
      date: new Date(2024, 11, 18),
      flow: "medium",
      symptoms: ["fatigue"],
      notes: "Getting lighter",
    },
    {
      date: new Date(2024, 11, 19),
      flow: "light",
      symptoms: [],
      notes: "Last day",
    },

    // January 2025
    {
      date: new Date(2025, 0, 12),
      flow: "light",
      symptoms: ["mood swings"],
      notes: "Started light today",
    },
    {
      date: new Date(2025, 0, 13),
      flow: "medium",
      symptoms: ["cramps", "bloating"],
      notes: "Flow increased",
    },
    {
      date: new Date(2025, 0, 14),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      notes: "Heaviest day",
    },
    {
      date: new Date(2025, 0, 15),
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      notes: "Still heavy, very tired",
    },
    {
      date: new Date(2025, 0, 16),
      flow: "medium",
      symptoms: ["bloating"],
      notes: "Getting better",
    },
    {
      date: new Date(2025, 0, 17),
      flow: "light",
      symptoms: [],
      notes: "Almost done",
    },

    // February 2025
    {
      date: new Date(2025, 1, 9),
      flow: "medium",
      symptoms: ["cramps", "acne"],
      notes: "Started today",
    },
    {
      date: new Date(2025, 1, 10),
      flow: "heavy",
      symptoms: ["cramps", "headache", "bloating"],
      notes: "Bad cramps today",
    },
    {
      date: new Date(2025, 1, 11),
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      notes: "Heavy flow continues",
    },
    {
      date: new Date(2025, 1, 12),
      flow: "medium",
      symptoms: ["bloating"],
      notes: "Flow decreasing",
    },
    {
      date: new Date(2025, 1, 13),
      flow: "light",
      symptoms: [],
      notes: "Light day",
    },

    // March 2025
    {
      date: new Date(2025, 2, 8),
      flow: "light",
      symptoms: ["mood swings"],
      notes: "Light start",
    },
    {
      date: new Date(2025, 2, 9),
      flow: "medium",
      symptoms: ["cramps", "bloating"],
      notes: "Normal flow",
    },
    {
      date: new Date(2025, 2, 10),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      notes: "Heavy day",
    },
    {
      date: new Date(2025, 2, 11),
      flow: "heavy",
      symptoms: ["cramps", "fatigue", "bloating"],
      notes: "Worst day this cycle",
    },
    {
      date: new Date(2025, 2, 12),
      flow: "medium",
      symptoms: ["fatigue"],
      notes: "Better today",
    },
    {
      date: new Date(2025, 2, 13),
      flow: "light",
      symptoms: [],
      notes: "Almost finished",
    },

    // April 2025
    {
      date: new Date(2025, 3, 5),
      flow: "medium",
      symptoms: ["cramps", "acne"],
      notes: "Started earlier than expected",
    },
    {
      date: new Date(2025, 3, 6),
      flow: "heavy",
      symptoms: ["cramps", "headache", "bloating"],
      notes: "Heavy flow",
    },
    {
      date: new Date(2025, 3, 7),
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      notes: "Still heavy",
    },
    {
      date: new Date(2025, 3, 8),
      flow: "medium",
      symptoms: ["bloating"],
      notes: "Moderate day",
    },
    {
      date: new Date(2025, 3, 9),
      flow: "light",
      symptoms: [],
      notes: "Light flow",
    },

    // May 2025
    {
      date: new Date(2025, 4, 3),
      flow: "light",
      symptoms: ["mood swings"],
      notes: "Light start",
    },
    {
      date: new Date(2025, 4, 4),
      flow: "medium",
      symptoms: ["cramps", "bloating"],
      notes: "Normal flow",
    },
    {
      date: new Date(2025, 4, 5),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      notes: "Heavy day",
    },
    {
      date: new Date(2025, 4, 6),
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      notes: "Heavy continues",
    },
    {
      date: new Date(2025, 4, 7),
      flow: "medium",
      symptoms: ["bloating"],
      notes: "Getting lighter",
    },
    {
      date: new Date(2025, 4, 8),
      flow: "light",
      symptoms: [],
      notes: "Last day",
    },

    // June 2025 (current/recent)
    {
      date: new Date(2025, 5, 1),
      flow: "medium",
      symptoms: ["cramps", "bloating"],
      notes: "Started today",
    },
    {
      date: new Date(2025, 5, 2),
      flow: "heavy",
      symptoms: ["cramps", "headache"],
      notes: "Heavy flow day",
    },
    {
      date: new Date(2025, 5, 3),
      flow: "heavy",
      symptoms: ["cramps", "fatigue"],
      notes: "Very heavy today",
    },
    {
      date: new Date(2025, 5, 4),
      flow: "medium",
      symptoms: ["bloating"],
      notes: "Flow decreasing",
    },
    {
      date: new Date(2025, 5, 5),
      flow: "light",
      symptoms: [],
      notes: "Light day",
    },
  ],
  symptoms: [
    // December 2024 symptoms
    {
      date: new Date(2024, 11, 10),
      type: "mood",
      intensity: 7,
      notes: "PMS mood swings",
    },
    {
      date: new Date(2024, 11, 11),
      type: "acne",
      intensity: 6,
      notes: "Breakout on forehead",
    },
    {
      date: new Date(2024, 11, 12),
      type: "bloating",
      intensity: 8,
      notes: "Very bloated",
    },
    {
      date: new Date(2024, 11, 20),
      type: "fatigue",
      intensity: 5,
      notes: "Post-period tiredness",
    },

    // January 2025 symptoms
    {
      date: new Date(2025, 0, 7),
      type: "mood",
      intensity: 8,
      notes: "Irritable and anxious",
    },
    {
      date: new Date(2025, 0, 8),
      type: "acne",
      intensity: 7,
      notes: "Chin breakout",
    },
    {
      date: new Date(2025, 0, 9),
      type: "bloating",
      intensity: 9,
      notes: "Extremely bloated",
    },
    {
      date: new Date(2025, 0, 18),
      type: "fatigue",
      intensity: 6,
      notes: "Tired after period",
    },
    {
      date: new Date(2025, 0, 25),
      type: "mood",
      intensity: 4,
      notes: "Feeling better",
    },

    // February 2025 symptoms
    {
      date: new Date(2025, 1, 4),
      type: "mood",
      intensity: 7,
      notes: "PMS starting",
    },
    {
      date: new Date(2025, 1, 5),
      type: "acne",
      intensity: 5,
      notes: "Small breakout",
    },
    {
      date: new Date(2025, 1, 6),
      type: "bloating",
      intensity: 8,
      notes: "Bloated and uncomfortable",
    },
    {
      date: new Date(2025, 1, 14),
      type: "fatigue",
      intensity: 7,
      notes: "Very tired post-period",
    },
    {
      date: new Date(2025, 1, 20),
      type: "headache",
      intensity: 6,
      notes: "Mid-cycle headache",
    },

    // March 2025 symptoms
    {
      date: new Date(2025, 2, 3),
      type: "mood",
      intensity: 6,
      notes: "Mild mood changes",
    },
    {
      date: new Date(2025, 2, 4),
      type: "acne",
      intensity: 8,
      notes: "Bad breakout this month",
    },
    {
      date: new Date(2025, 2, 5),
      type: "bloating",
      intensity: 7,
      notes: "Bloated before period",
    },
    {
      date: new Date(2025, 2, 14),
      type: "fatigue",
      intensity: 5,
      notes: "Tired but manageable",
    },
    {
      date: new Date(2025, 2, 22),
      type: "headache",
      intensity: 4,
      notes: "Light headache",
    },

    // April 2025 symptoms
    {
      date: new Date(2025, 3, 1),
      type: "mood",
      intensity: 9,
      notes: "Very emotional today",
    },
    {
      date: new Date(2025, 3, 2),
      type: "acne",
      intensity: 6,
      notes: "Breakout starting",
    },
    {
      date: new Date(2025, 3, 3),
      type: "bloating",
      intensity: 8,
      notes: "Bloated and crampy",
    },
    {
      date: new Date(2025, 3, 10),
      type: "fatigue",
      intensity: 8,
      notes: "Exhausted after period",
    },
    {
      date: new Date(2025, 3, 18),
      type: "headache",
      intensity: 7,
      notes: "Strong headache",
    },

    // May 2025 symptoms
    {
      date: new Date(2025, 4, 28),
      type: "mood",
      intensity: 6,
      notes: "PMS mood changes",
    },
    {
      date: new Date(2025, 4, 29),
      type: "acne",
      intensity: 5,
      notes: "Minor breakout",
    },
    {
      date: new Date(2025, 4, 30),
      type: "bloating",
      intensity: 7,
      notes: "Bloated before period",
    },
    {
      date: new Date(2025, 4, 9),
      type: "fatigue",
      intensity: 6,
      notes: "Post-period tiredness",
    },
    {
      date: new Date(2025, 4, 15),
      type: "headache",
      intensity: 5,
      notes: "Mid-cycle headache",
    },

    // June 2025 symptoms (recent)
    {
      date: new Date(2025, 5, 6),
      type: "fatigue",
      intensity: 7,
      notes: "Tired after period ended",
    },
    {
      date: new Date(2025, 5, 10),
      type: "headache",
      intensity: 4,
      notes: "Light headache",
    },
    {
      date: new Date(2025, 5, 15),
      type: "mood",
      intensity: 5,
      notes: "Feeling good overall",
    },
    {
      date: new Date(2025, 5, 20),
      type: "acne",
      intensity: 3,
      notes: "Skin looking better",
    },
  ],
};

// Symptom data for radar chart - based on recent months
const symptomData = [
  { subject: "Cramps", A: 8, fullMark: 10 },
  { subject: "Headache", A: 6, fullMark: 10 },
  { subject: "Bloating", A: 8, fullMark: 10 },
  { subject: "Fatigue", A: 7, fullMark: 10 },
  { subject: "Mood", A: 7, fullMark: 10 },
  { subject: "Acne", A: 6, fullMark: 10 },
];

// Cycle length data for line chart - more realistic data
const cycleData = [
  { name: "Dec", length: 29 },
  { name: "Jan", length: 28 },
  { name: "Feb", length: 28 },
  { name: "Mar", length: 27 },
  { name: "Apr", length: 28 },
  { name: "May", length: 30 },
  { name: "Jun", length: 28 },
];

export default function Dashboard() {
  const [userId, setUserId] = useState("");
  const { data: user, refetch: refetchUser } = useGetUser(userId);
  const { data: cycleData, refetch: refetchCycle } = useGetCycle(
    user?._id ?? ""
  );
  useEffect(() => {
    const func = async () => {
      const token = (await decodeToken()) as string;
      setUserId(token);
      refetchUser();
    };
    func();
  }, []);
  useEffect(() => {
    refetchCycle();
  }, [user]);

  console.log({ cycleData });

  const [date, setDate] = useState<Date>(new Date());
  const [cycleDataState, setCycleData] = useLocalStorage<CycleData>(
    "cycle-data",
    cycleData
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

  // Custom day renderer for calendar
  const DayContent = (props: DayContentProps) => {
    const day = props.date;

    // Check if this day is in periods
    const isPeriodDay = cycleDataState.periods.some((p) =>
      isSameDay(new Date(p.date), day)
    );

    // Check if this day is in fertility window
    const isFertileDay =
      day >= fertilityWindowStart &&
      day <= fertilityWindowEnd &&
      day <= new Date();

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
      <div className="relative w-full h-full flex flex-col items-center justify-center py-2">
        <span className="relative z-10">{day.getDate()}</span>

        <div className="absolute bottom-1 flex gap-0.5">
          {/* Period day indicator */}
          {isPeriodDay && (
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                flowIntensity === "light" && "bg-pink-300",
                flowIntensity === "medium" && "bg-pink-500",
                flowIntensity === "heavy" && "bg-pink-700"
              )}
            />
          )}

          {/* Fertility window indicator */}
          {isFertileDay && !isPeriodDay && (
            <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
          )}

          {/* Ovulation day indicator */}
          {isOvulationDay && !isPeriodDay && (
            <div className="h-1.5 w-1.5 rounded-full bg-purple-500" />
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
                        className="w-full justify-start text-left font-normal bg-transparent"
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
                <span className="text-sm">Period (Medium/Heavy)</span>
              </div>
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full bg-pink-300 mr-2"></div>
                <span className="text-sm">Period (Light)</span>
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
              components={{
                DayContent: DayContent,
              }}
              className="rounded-md border"
              modifiers={{
                period: (date) =>
                  cycleDataState.periods.some((p) =>
                    isSameDay(new Date(p.date), date)
                  ),
                fertile: (date) =>
                  date >= fertilityWindowStart &&
                  date <= fertilityWindowEnd &&
                  date <= new Date() &&
                  !cycleDataState.periods.some((p) =>
                    isSameDay(new Date(p.date), date)
                  ),
                ovulation: (date) =>
                  isSameDay(date, ovulationDay) &&
                  !cycleDataState.periods.some((p) =>
                    isSameDay(new Date(p.date), date)
                  ),
              }}
              modifiersClassNames={{
                period: "bg-pink-50 font-semibold",
                fertile: "bg-blue-50",
                ovulation: "bg-purple-50",
              }}
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
              <LineChart data={cycleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[25, 32]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="length"
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
                          {period.flow?.charAt(0).toUpperCase() +
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

      <Card>
        <CardHeader>
          <CardTitle>Selected Date Details</CardTitle>
          <CardDescription>
            Click on a date in the calendar to see detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedDate ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="h-5 w-5 text-blue-500" />
                <span className="font-medium text-lg">
                  {format(selectedDate, "EEEE, MMMM d, yyyy")}
                </span>
              </div>

              {(() => {
                // Find period data for selected date
                const periodData = cycleDataState.periods.find((p) =>
                  isSameDay(new Date(p.date), selectedDate)
                );

                // Find symptoms for selected date
                const symptomsData = cycleDataState.symptoms.filter((s) =>
                  isSameDay(new Date(s.date), selectedDate)
                );

                // Check if it's in fertility window
                const isFertileDay =
                  selectedDate >= fertilityWindowStart &&
                  selectedDate <= fertilityWindowEnd;
                const isOvulationDay = isSameDay(selectedDate, ovulationDay);

                return (
                  <div className="grid gap-4">
                    {/* Period Information */}
                    {periodData ? (
                      <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Droplet
                            className={cn(
                              "h-5 w-5",
                              periodData.flow === "light" && "text-pink-300",
                              periodData.flow === "medium" && "text-pink-500",
                              periodData.flow === "heavy" && "text-pink-700"
                            )}
                          />
                          <span className="font-medium text-pink-800">
                            Period Day
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Flow:</strong>{" "}
                            {periodData.flow?.charAt(0).toUpperCase() +
                              periodData.flow?.slice(1)}{" "}
                            flow
                          </p>
                          {periodData.symptoms.length > 0 && (
                            <p>
                              <strong>Symptoms:</strong>{" "}
                              {periodData.symptoms.join(", ")}
                            </p>
                          )}
                          {periodData.notes && (
                            <p>
                              <strong>Notes:</strong> {periodData.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarIcon className="h-5 w-5 text-gray-500" />
                          <span className="font-medium text-gray-700">
                            No Period Data
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          No period recorded for this date
                        </p>
                      </div>
                    )}

                    {/* Symptoms Information */}
                    {symptomsData.length > 0 && (
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Thermometer className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Symptoms Logged
                          </span>
                        </div>
                        <div className="space-y-2">
                          {symptomsData.map((symptom, index) => (
                            <div key={index} className="text-sm">
                              <p>
                                <strong>
                                  {symptom.type.charAt(0).toUpperCase() +
                                    symptom.type.slice(1)}
                                  :
                                </strong>{" "}
                                Intensity {symptom.intensity}/10
                              </p>
                              {symptom.notes && (
                                <p className="text-blue-700 italic">
                                  "{symptom.notes}"
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Fertility Information */}
                    {(isFertileDay || isOvulationDay) && (
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="flex items-center gap-2 mb-2">
                          {isOvulationDay ? (
                            <>
                              <Zap className="h-5 w-5 text-purple-600" />
                              <span className="font-medium text-purple-800">
                                Ovulation Day
                              </span>
                            </>
                          ) : (
                            <>
                              <Heart className="h-5 w-5 text-purple-600" />
                              <span className="font-medium text-purple-800">
                                Fertile Window
                              </span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-purple-700">
                          {isOvulationDay
                            ? "This is your predicted ovulation day - highest fertility!"
                            : "You're in your fertile window - good time for conception if trying to get pregnant."}
                        </p>
                      </div>
                    )}

                    {/* Empty state when no data */}
                    {!periodData &&
                      symptomsData.length === 0 &&
                      !isFertileDay &&
                      !isOvulationDay && (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                          <p className="text-gray-600">
                            No data recorded for this date
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Click "Log Period" or "Log Symptoms" to add
                            information
                          </p>
                        </div>
                      )}
                  </div>
                );
              })()}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">
                Select a date from the calendar
              </p>
              <p className="text-sm text-gray-500">
                Click on any date to see detailed information
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
