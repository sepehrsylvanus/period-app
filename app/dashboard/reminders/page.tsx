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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format, addDays, isToday, isTomorrow, isAfter } from "date-fns";
import { cn } from "@/lib/utils";
import { useLocalStorage } from "@/hooks/use-local-storage";
import {
  Bell,
  CalendarIcon,
  Clock,
  Droplet,
  Edit,
  Heart,
  Plus,
  Pill,
  Stethoscope,
  Trash2,
} from "lucide-react";

// Types
interface Reminder {
  id: string;
  title: string;
  type: "period" | "medication" | "appointment" | "ovulation" | "custom";
  date: Date;
  time?: string;
  notes?: string;
  repeat?: "none" | "daily" | "weekly" | "monthly";
  notifyBefore?: number; // minutes
  enabled: boolean;
}

// Initial reminders data
const initialReminders: Reminder[] = [
  {
    id: "1",
    title: "Period Start",
    type: "period",
    date: addDays(new Date(), 7),
    time: "08:00",
    notes: "Predicted start date for next period",
    repeat: "monthly",
    notifyBefore: 1440, // 24 hours
    enabled: true,
  },
  {
    id: "2",
    title: "Take Iron Supplement",
    type: "medication",
    date: new Date(),
    time: "09:00",
    notes: "Take with food",
    repeat: "daily",
    notifyBefore: 15,
    enabled: true,
  },
  {
    id: "3",
    title: "Gynecologist Appointment",
    type: "appointment",
    date: addDays(new Date(), 14),
    time: "14:30",
    notes: "Annual checkup",
    repeat: "none",
    notifyBefore: 1440, // 24 hours
    enabled: true,
  },
  {
    id: "4",
    title: "Ovulation Day",
    type: "ovulation",
    date: addDays(new Date(), 3),
    time: "12:00",
    notes: "Predicted ovulation day",
    repeat: "monthly",
    notifyBefore: 1440, // 24 hours
    enabled: true,
  },
  {
    id: "5",
    title: "Log Symptoms",
    type: "custom",
    date: new Date(),
    time: "20:00",
    notes: "Remember to log today's symptoms",
    repeat: "daily",
    notifyBefore: 0,
    enabled: true,
  },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useLocalStorage<Reminder[]>(
    "reminders",
    initialReminders
  );
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [isEditReminderOpen, setIsEditReminderOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(
    null
  );
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: "",
    type: "period",
    date: new Date(),
    time: "09:00",
    notes: "",
    repeat: "none",
    notifyBefore: 15,
    enabled: true,
  });
  const [activeTab, setActiveTab] = useState("all");

  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.date) return;

    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      type: newReminder.type as
        | "period"
        | "medication"
        | "appointment"
        | "ovulation"
        | "custom",
      date: newReminder.date,
      time: newReminder.time,
      notes: newReminder.notes,
      repeat: newReminder.repeat as "none" | "daily" | "weekly" | "monthly",
      notifyBefore: newReminder.notifyBefore,
      enabled: true,
    };

    setReminders([...reminders, reminder]);
    setIsAddReminderOpen(false);
    resetReminderForm();
  };

  const handleEditReminder = () => {
    if (!selectedReminder || !selectedReminder.title || !selectedReminder.date)
      return;

    const updatedReminders = reminders.map((reminder) =>
      reminder.id === selectedReminder.id ? selectedReminder : reminder
    );

    setReminders(updatedReminders);
    setIsEditReminderOpen(false);
    setSelectedReminder(null);
  };

  const handleDeleteReminder = (id: string) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);
  };

  const handleToggleReminder = (id: string, enabled: boolean) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, enabled } : reminder
    );
    setReminders(updatedReminders);
  };

  const resetReminderForm = () => {
    setNewReminder({
      title: "",
      type: "period",
      date: new Date(),
      time: "09:00",
      notes: "",
      repeat: "none",
      notifyBefore: 15,
      enabled: true,
    });
  };

  const openEditDialog = (reminder: Reminder) => {
    setSelectedReminder({ ...reminder });
    setIsEditReminderOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "period":
        return <Droplet className="h-4 w-4" />;
      case "medication":
        return <Pill className="h-4 w-4" />;
      case "appointment":
        return <Stethoscope className="h-4 w-4" />;
      case "ovulation":
        return <Heart className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "period":
        return "bg-pink-100 text-pink-800 border-pink-200";
      case "medication":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "appointment":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "ovulation":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRepeatText = (repeat: string) => {
    switch (repeat) {
      case "daily":
        return "Every day";
      case "weekly":
        return "Every week";
      case "monthly":
        return "Every month";
      default:
        return "One time";
    }
  };

  const getDateText = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "MMM d, yyyy");
    }
  };

  const getNotifyBeforeText = (minutes: number | undefined) => {
    if (!minutes) return "At time of event";
    if (minutes === 15) return "15 minutes before";
    if (minutes === 30) return "30 minutes before";
    if (minutes === 60) return "1 hour before";
    if (minutes === 1440) return "1 day before";
    if (minutes === 2880) return "2 days before";
    return `${minutes} minutes before`;
  };

  const filteredReminders = reminders.filter((reminder) => {
    if (activeTab === "all") return true;
    if (activeTab === "today") return isToday(new Date(reminder.date));
    if (activeTab === "upcoming")
      return (
        isAfter(new Date(reminder.date), new Date()) &&
        !isToday(new Date(reminder.date))
      );
    return reminder.type === activeTab;
  });

  // Sort reminders by date (closest first)
  const sortedReminders = [...filteredReminders].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reminders</h1>
          <p className="text-muted-foreground">
            Set up and manage your reminders
          </p>
        </div>
        <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-pink-600 hover:bg-pink-700">
              <Plus className="mr-2 h-4 w-4" /> Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
              <DialogDescription>
                Create a new reminder for your health tracking
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newReminder.title}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, title: e.target.value })
                  }
                  placeholder="Enter reminder title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newReminder.type}
                  onValueChange={(value) =>
                    setNewReminder({ ...newReminder, type: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="period">Period</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="ovulation">Ovulation</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newReminder.date
                          ? format(newReminder.date, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newReminder.date}
                        onSelect={(date) =>
                          date && setNewReminder({ ...newReminder, date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) =>
                      setNewReminder({ ...newReminder, time: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="repeat">Repeat</Label>
                <Select
                  value={newReminder.repeat}
                  onValueChange={(value) =>
                    setNewReminder({ ...newReminder, repeat: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select repeat option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">One time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notifyBefore">Notification</Label>
                <Select
                  value={newReminder.notifyBefore?.toString()}
                  onValueChange={(value) =>
                    setNewReminder({
                      ...newReminder,
                      notifyBefore: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">At time of event</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                    <SelectItem value="2880">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={newReminder.notes}
                  onChange={(e) =>
                    setNewReminder({ ...newReminder, notes: e.target.value })
                  }
                  placeholder="Add any additional notes"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddReminderOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-pink-600 hover:bg-pink-700"
                onClick={handleAddReminder}
              >
                Add Reminder
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-2 md:grid-cols-6 lg:w-[600px]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="period">Period</TabsTrigger>
          <TabsTrigger value="medication">Medication</TabsTrigger>
          <TabsTrigger value="appointment">Appointments</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === "all"
                ? "All Reminders"
                : activeTab === "today"
                ? "Today's Reminders"
                : activeTab === "upcoming"
                ? "Upcoming Reminders"
                : `${
                    activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
                  } Reminders`}
            </CardTitle>
            <CardDescription>
              {activeTab === "all"
                ? "Manage all your reminders"
                : activeTab === "today"
                ? "Reminders scheduled for today"
                : activeTab === "upcoming"
                ? "Your upcoming reminders"
                : `Manage your ${activeTab} reminders`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sortedReminders.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No reminders found
                </h3>
                <p className="text-gray-500">
                  {activeTab === "all"
                    ? "You don't have any reminders yet"
                    : `You don't have any ${
                        activeTab === "today"
                          ? "reminders for today"
                          : activeTab === "upcoming"
                          ? "upcoming reminders"
                          : `${activeTab} reminders`
                      }`}
                </p>
                <Button
                  className="mt-4 bg-pink-600 hover:bg-pink-700"
                  onClick={() => setIsAddReminderOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Your First Reminder
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg",
                      !reminder.enabled && "opacity-60"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          "p-2 rounded-full",
                          reminder.type === "period" && "bg-pink-50",
                          reminder.type === "medication" && "bg-blue-50",
                          reminder.type === "appointment" && "bg-purple-50",
                          reminder.type === "ovulation" && "bg-red-50",
                          reminder.type === "custom" && "bg-gray-50"
                        )}
                      >
                        {getTypeIcon(reminder.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{reminder.title}</h3>
                          <Badge className={getTypeColor(reminder.type)}>
                            {reminder.type}
                          </Badge>
                          {reminder.repeat !== "none" && (
                            <Badge variant="outline">
                              {getRepeatText(reminder.repeat || "none")}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <CalendarIcon className="h-3 w-3" />
                          <span>{getDateText(new Date(reminder.date))}</span>
                          {reminder.time && (
                            <>
                              <span className="mx-1">•</span>
                              <Clock className="h-3 w-3" />
                              <span>{reminder.time}</span>
                            </>
                          )}
                        </div>
                        {reminder.notes && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {reminder.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.enabled}
                        onCheckedChange={(checked) =>
                          handleToggleReminder(reminder.id, checked)
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this reminder?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-red-600 hover:bg-red-700"
                              onClick={() => handleDeleteReminder(reminder.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Tabs>

      {/* Edit Reminder Dialog */}
      <Dialog open={isEditReminderOpen} onOpenChange={setIsEditReminderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Reminder</DialogTitle>
            <DialogDescription>Update your reminder details</DialogDescription>
          </DialogHeader>

          {selectedReminder && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={selectedReminder.title}
                  onChange={(e) =>
                    setSelectedReminder({
                      ...selectedReminder,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter reminder title"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select
                  value={selectedReminder.type}
                  onValueChange={(value) =>
                    setSelectedReminder({
                      ...selectedReminder,
                      type: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="period">Period</SelectItem>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="appointment">Appointment</SelectItem>
                    <SelectItem value="ovulation">Ovulation</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedReminder.date
                          ? format(new Date(selectedReminder.date), "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(selectedReminder.date)}
                        onSelect={(date) =>
                          date &&
                          setSelectedReminder({ ...selectedReminder, date })
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="edit-time">Time</Label>
                  <Input
                    id="edit-time"
                    type="time"
                    value={selectedReminder.time}
                    onChange={(e) =>
                      setSelectedReminder({
                        ...selectedReminder,
                        time: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-repeat">Repeat</Label>
                <Select
                  value={selectedReminder.repeat}
                  onValueChange={(value) =>
                    setSelectedReminder({
                      ...selectedReminder,
                      repeat: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select repeat option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">One time</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-notifyBefore">Notification</Label>
                <Select
                  value={selectedReminder.notifyBefore?.toString()}
                  onValueChange={(value) =>
                    setSelectedReminder({
                      ...selectedReminder,
                      notifyBefore: Number.parseInt(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select notification timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">At time of event</SelectItem>
                    <SelectItem value="15">15 minutes before</SelectItem>
                    <SelectItem value="30">30 minutes before</SelectItem>
                    <SelectItem value="60">1 hour before</SelectItem>
                    <SelectItem value="1440">1 day before</SelectItem>
                    <SelectItem value="2880">2 days before</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes (optional)</Label>
                <Textarea
                  id="edit-notes"
                  value={selectedReminder.notes}
                  onChange={(e) =>
                    setSelectedReminder({
                      ...selectedReminder,
                      notes: e.target.value,
                    })
                  }
                  placeholder="Add any additional notes"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditReminderOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700"
              onClick={handleEditReminder}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>Configure how you receive reminders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications on your device
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive reminders via email
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Quiet Hours</Label>
                <p className="text-sm text-muted-foreground">
                  Don't send notifications during these hours
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input type="time" className="w-24" defaultValue="22:00" />
                <span>to</span>
                <Input type="time" className="w-24" defaultValue="07:00" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
