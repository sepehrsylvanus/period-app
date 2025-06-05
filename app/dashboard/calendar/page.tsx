"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, addDays, isSameDay, isSameMonth, addMonths } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Droplet,
  Heart,
  Info,
  Zap,
} from "lucide-react";

// Define types for period data
interface PeriodData {
  date: Date;
  flow: "light" | "medium" | "heavy";
  predicted?: boolean;
}

// Mock data for periods and predictions
const periodDays: PeriodData[] = [
  ...Array.from({ length: 5 }).map((_, i) => ({
    date: addDays(new Date(2025, 5, 4), -i),
    flow: (i === 0 ? "light" : i === 1 || i === 2 ? "medium" : "heavy") as
      | "light"
      | "medium"
      | "heavy",
  })),
  ...Array.from({ length: 6 }).map((_, i) => ({
    date: addDays(new Date(2025, 4, 7), -i),
    flow: (i === 0 || i === 5
      ? "light"
      : i === 1 || i === 4
      ? "medium"
      : "heavy") as "light" | "medium" | "heavy",
  })),
  ...Array.from({ length: 5 }).map((_, i) => ({
    date: addDays(new Date(2025, 3, 10), -i),
    flow: (i === 0 || i === 4
      ? "light"
      : i === 1 || i === 3
      ? "medium"
      : "heavy") as "light" | "medium" | "heavy",
  })),
];

// Calculate next periods (simple 28-day cycle prediction)
const lastPeriod = periodDays.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
)[0];

const nextPeriods: PeriodData[] = Array.from({ length: 3 }).flatMap((_, i) => {
  const startDate = addDays(new Date(lastPeriod.date), 28 * (i + 1));
  return Array.from({ length: 5 }).map((_, j) => ({
    date: addDays(startDate, -j),
    flow: (j === 0 || j === 4
      ? "light"
      : j === 1 || j === 3
      ? "medium"
      : "heavy") as "light" | "medium" | "heavy",
    predicted: true,
  }));
});

// Calculate fertility windows and ovulation days
const fertilityWindows = Array.from({ length: 4 }).map((_, i) => {
  const periodStart =
    i === 0
      ? new Date(lastPeriod.date)
      : addDays(new Date(lastPeriod.date), 28 * i);

  const ovulationDay = addDays(periodStart, 14);
  return {
    start: addDays(ovulationDay, -5),
    end: addDays(ovulationDay, 1),
    ovulation: ovulationDay,
  };
});

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [view, setView] = useState<"month" | "year">("month");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Combine actual and predicted periods
  const allPeriods = [...periodDays, ...nextPeriods];

  // Calendar day rendering
  const renderDay = (day: Date) => {
    // Check if this day is in periods
    const periodDay = allPeriods.find((p) => isSameDay(new Date(p.date), day));
    const isPeriodDay = !!periodDay;

    // Check if this day is in fertility windows
    const fertilityWindow = fertilityWindows.find(
      (fw) => day >= fw.start && day <= fw.end
    );
    const isFertileDay = !!fertilityWindow;

    // Check if this day is an ovulation day
    const isOvulationDay = fertilityWindows.some((fw) =>
      isSameDay(day, fw.ovulation)
    );

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
                periodDay?.flow === "light" && "bg-pink-300",
                periodDay?.flow === "medium" && "bg-pink-500",
                periodDay?.flow === "heavy" && "bg-pink-700",
                periodDay?.predicted && "opacity-60"
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

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">View and plan your cycle</p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={view}
            onValueChange={(value) => setView(value as "month" | "year")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="year">Year View</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[240px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(currentMonth, "MMMM yyyy")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentMonth}
                onSelect={(date) => date && setCurrentMonth(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center">
          <div className="space-y-1.5">
            <CardTitle>Cycle Calendar</CardTitle>
            <CardDescription>
              Track your period, fertility window, and ovulation
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-wrap gap-4">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-pink-500 mr-2"></div>
              <span className="text-sm">Period</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-pink-500 opacity-60 mr-2"></div>
              <span className="text-sm">Predicted Period</span>
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
            month={currentMonth}
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border"
            components={{
              Day: ({ date: dayDate, ...props }) => (
                <Button
                  variant="ghost"
                  {...props}
                  className={cn(
                    "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    !isSameMonth(dayDate, currentMonth) &&
                      "text-muted-foreground opacity-50",
                    isSameDay(dayDate, new Date()) && "bg-pink-50 text-pink-700"
                  )}
                >
                  {renderDay(dayDate)}
                </Button>
              ),
            }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Droplet className="h-5 w-5 text-pink-500 mr-2" />
              Period Forecast
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => {
              const periodStart = addDays(
                new Date(lastPeriod.date),
                28 * (i + 1)
              );
              return (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {format(periodStart, "MMMM d, yyyy")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expected duration: 5 days
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-pink-500 border-pink-200 bg-pink-50"
                  >
                    {i === 0 ? "Next" : i === 1 ? "In 2 cycles" : "In 3 cycles"}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="h-5 w-5 text-blue-500 mr-2" />
              Fertility Windows
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fertilityWindows.slice(0, 3).map((window, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {format(window.start, "MMM d")} -{" "}
                    {format(window.end, "MMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">7 days</p>
                </div>
                <Badge
                  variant="outline"
                  className="text-blue-500 border-blue-200 bg-blue-50"
                >
                  {i === 0
                    ? "Current"
                    : i === 1
                    ? "Next cycle"
                    : `In ${i} cycles`}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 text-purple-500 mr-2" />
              Ovulation Days
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {fertilityWindows.slice(0, 3).map((window, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {format(window.ovulation, "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Peak fertility
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="text-purple-500 border-purple-200 bg-purple-50"
                >
                  {i === 0
                    ? "Current"
                    : i === 1
                    ? "Next cycle"
                    : `In ${i} cycles`}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex items-start">
          <div className="space-y-1.5">
            <CardTitle>Understanding Your Cycle</CardTitle>
            <CardDescription>
              Learn about the different phases of your menstrual cycle
            </CardDescription>
          </div>
          <Info className="h-5 w-5 text-muted-foreground ml-auto" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-pink-50 border border-pink-100">
              <h3 className="font-medium text-pink-700 mb-2">
                Menstrual Phase
              </h3>
              <p className="text-sm text-muted-foreground">Days 1-5</p>
              <p className="text-sm mt-2">
                The first day of your period marks the beginning of your cycle.
                During this phase, the uterine lining sheds.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-100">
              <h3 className="font-medium text-amber-700 mb-2">
                Follicular Phase
              </h3>
              <p className="text-sm text-muted-foreground">Days 1-13</p>
              <p className="text-sm mt-2">
                Overlaps with menstruation. Follicles in the ovary develop and
                estrogen levels rise to thicken the uterine lining.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <h3 className="font-medium text-purple-700 mb-2">
                Ovulation Phase
              </h3>
              <p className="text-sm text-muted-foreground">Day 14 (approx.)</p>
              <p className="text-sm mt-2">
                A mature egg is released from the ovary. This is when you're
                most fertile and can conceive.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <h3 className="font-medium text-blue-700 mb-2">Luteal Phase</h3>
              <p className="text-sm text-muted-foreground">Days 15-28</p>
              <p className="text-sm mt-2">
                The egg travels through the fallopian tube. If not fertilized,
                hormone levels drop and the cycle begins again.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
