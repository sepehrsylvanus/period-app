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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";
import { CalendarIcon, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface Symptom {
  id: string;
  date: Date;
  category: string;
  type: string;
  intensity: number;
  notes: string;
}

// Mock data
const initialSymptoms: Symptom[] = [
  {
    id: "1",
    date: new Date(2025, 5, 3),
    category: "physical",
    type: "cramps",
    intensity: 7,
    notes: "Severe cramps in the morning",
  },
  {
    id: "2",
    date: new Date(2025, 5, 3),
    category: "physical",
    type: "headache",
    intensity: 5,
    notes: "Mild headache in the afternoon",
  },
  {
    id: "3",
    date: new Date(2025, 5, 2),
    category: "physical",
    type: "cramps",
    intensity: 8,
    notes: "Needed pain medication",
  },
  {
    id: "4",
    date: new Date(2025, 5, 2),
    category: "physical",
    type: "bloating",
    intensity: 6,
    notes: "",
  },
  {
    id: "5",
    date: new Date(2025, 5, 1),
    category: "physical",
    type: "cramps",
    intensity: 6,
    notes: "",
  },
  {
    id: "6",
    date: new Date(2025, 5, 1),
    category: "physical",
    type: "fatigue",
    intensity: 7,
    notes: "Very tired all day",
  },
  {
    id: "7",
    date: new Date(2025, 4, 20),
    category: "mood",
    type: "irritability",
    intensity: 8,
    notes: "Feeling irritable",
  },
  {
    id: "8",
    date: new Date(2025, 4, 19),
    category: "mood",
    type: "mood swings",
    intensity: 7,
    notes: "Mood swings throughout the day",
  },
  {
    id: "9",
    date: new Date(2025, 4, 18),
    category: "physical",
    type: "acne",
    intensity: 6,
    notes: "Breakout on chin",
  },
  {
    id: "10",
    date: new Date(2025, 4, 15),
    category: "physical",
    type: "breast tenderness",
    intensity: 5,
    notes: "",
  },
];

const symptomCategories = {
  physical: [
    "cramps",
    "headache",
    "bloating",
    "fatigue",
    "breast tenderness",
    "acne",
    "nausea",
    "constipation",
    "diarrhea",
    "migraine",
    "joint pain",
    "muscle pain",
    "hot flashes",
    "cold flashes",
  ],
  mood: [
    "irritability",
    "mood swings",
    "anxiety",
    "depression",
    "restlessness",
    "stress",
    "low energy",
    "difficulty concentrating",
    "emotional sensitivity",
    "crying spells",
  ],
  sleep: [
    "insomnia",
    "restless sleep",
    "oversleeping",
    "vivid dreams",
    "night sweats",
    "difficulty falling asleep",
  ],
  appetite: [
    "increased appetite",
    "decreased appetite",
    "food cravings",
    "nausea",
    "bloating after eating",
    "digestive issues",
  ],
};

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>(initialSymptoms);
  const [isAddSymptomOpen, setIsAddSymptomOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [intensity, setIntensity] = useState<number[]>([5]);
  const [notes, setNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const handleAddSymptom = () => {
    if (!selectedDate || !selectedCategory || !selectedType) return;

    const newSymptom: Symptom = {
      id: Date.now().toString(),
      date: selectedDate,
      category: selectedCategory,
      type: selectedType,
      intensity: intensity[0],
      notes,
    };

    setSymptoms([...symptoms, newSymptom]);
    setIsAddSymptomOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedDate(null);
    setSelectedCategory("");
    setSelectedType("");
    setIntensity([5]);
    setNotes("");
  };

  const filteredSymptoms = symptoms.filter((symptom) => {
    const matchesSearch =
      symptom.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      symptom.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || symptom.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 3) return "bg-green-100 text-green-800 border-green-200";
    if (intensity <= 6)
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physical":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "mood":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "sleep":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "appetite":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Group symptoms by date
  const symptomsByDate = filteredSymptoms.reduce((acc, symptom) => {
    const dateKey = format(symptom.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(symptom);
    return acc;
  }, {} as Record<string, Symptom[]>);

  // Calculate symptom statistics
  const symptomStats = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.type]) {
      acc[symptom.type] = {
        count: 0,
        totalIntensity: 0,
        category: symptom.category,
      };
    }
    acc[symptom.type].count++;
    acc[symptom.type].totalIntensity += symptom.intensity;
    return acc;
  }, {} as Record<string, { count: number; totalIntensity: number; category: string }>);

  const topSymptoms = Object.entries(symptomStats)
    .map(([type, stats]) => ({
      type,
      count: stats.count,
      avgIntensity: stats.totalIntensity / stats.count,
      category: stats.category,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Symptoms</h1>
          <p className="text-muted-foreground">
            Track and analyze your symptoms
          </p>
        </div>
        <Dialog open={isAddSymptomOpen} onOpenChange={setIsAddSymptomOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" /> Log Symptom
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Symptom</DialogTitle>
              <DialogDescription>
                Record a symptom you're experiencing.
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
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="mood">Mood & Emotional</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                    <SelectItem value="appetite">
                      Appetite & Digestion
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedCategory && (
                <div className="grid gap-2">
                  <Label htmlFor="type">Symptom Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select symptom" />
                    </SelectTrigger>
                    <SelectContent>
                      {symptomCategories[
                        selectedCategory as keyof typeof symptomCategories
                      ]?.map((symptom) => (
                        <SelectItem key={symptom} value={symptom}>
                          {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="intensity">Intensity: {intensity[0]}/10</Label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional details..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddSymptomOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={handleAddSymptom}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Symptom Log</CardTitle>
                <CardDescription>
                  Your recorded symptoms over time
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search symptoms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px]"
                  />
                </div>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="mood">Mood</SelectItem>
                    <SelectItem value="sleep">Sleep</SelectItem>
                    <SelectItem value="appetite">Appetite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="timeline">
              <TabsList className="mb-4">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>

              <TabsContent value="timeline" className="space-y-4">
                {Object.entries(symptomsByDate)
                  .sort(
                    ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
                  )
                  .map(([dateKey, daySymptoms]) => (
                    <div key={dateKey} className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">
                        {format(new Date(dateKey), "EEEE, MMMM d, yyyy")}
                      </h3>
                      <div className="grid gap-3">
                        {daySymptoms.map((symptom) => (
                          <div
                            key={symptom.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Badge
                                className={getCategoryColor(symptom.category)}
                              >
                                {symptom.category}
                              </Badge>
                              <div>
                                <p className="font-medium">
                                  {symptom.type.charAt(0).toUpperCase() +
                                    symptom.type.slice(1)}
                                </p>
                                {symptom.notes && (
                                  <p className="text-sm text-muted-foreground">
                                    {symptom.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Badge
                              className={getIntensityColor(symptom.intensity)}
                            >
                              {symptom.intensity}/10
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </TabsContent>

              <TabsContent value="list" className="space-y-3">
                {filteredSymptoms
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((symptom) => (
                    <div
                      key={symptom.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Badge className={getCategoryColor(symptom.category)}>
                          {symptom.category}
                        </Badge>
                        <div>
                          <p className="font-medium">
                            {symptom.type.charAt(0).toUpperCase() +
                              symptom.type.slice(1)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(symptom.date, "MMM d, yyyy")}
                            {symptom.notes && ` • ${symptom.notes}`}
                          </p>
                        </div>
                      </div>
                      <Badge className={getIntensityColor(symptom.intensity)}>
                        {symptom.intensity}/10
                      </Badge>
                    </div>
                  ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Symptoms</CardTitle>
            <CardDescription>Your most frequent symptoms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {topSymptoms.map((symptom, index) => (
              <div
                key={symptom.type}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {symptom.type.charAt(0).toUpperCase() +
                      symptom.type.slice(1)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {symptom.count} times • Avg:{" "}
                    {symptom.avgIntensity.toFixed(1)}/10
                  </p>
                </div>
                <Badge className={getCategoryColor(symptom.category)}>
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Symptom Categories</CardTitle>
            <CardDescription>
              Distribution of your symptoms by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(
                symptoms.reduce((acc, symptom) => {
                  acc[symptom.category] = (acc[symptom.category] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(category)}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Badge>
                  </div>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Intensity Patterns</CardTitle>
            <CardDescription>Average intensity by symptom type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSymptoms.slice(0, 4).map((symptom) => (
                <div key={symptom.type} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      {symptom.type.charAt(0).toUpperCase() +
                        symptom.type.slice(1)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {symptom.avgIntensity.toFixed(1)}/10
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-2 rounded-full",
                        symptom.avgIntensity <= 3
                          ? "bg-green-500"
                          : symptom.avgIntensity <= 6
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      )}
                      style={{ width: `${(symptom.avgIntensity / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
