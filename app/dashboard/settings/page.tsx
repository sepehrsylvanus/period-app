"use client";

import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Progress } from "@/components/ui/progress";
import {
  Download,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  Camera,
  Save,
  Mail,
  Key,
  FileText,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

// Types
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

interface AppSettings {
  theme: "light" | "dark" | "system";
  language: string;
  timezone: string;
  dateFormat: string;
  temperatureUnit: "celsius" | "fahrenheit";
  cycleLength: number;
  periodLength: number;
  lutealPhase: number;
}

interface PrivacySettings {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
  profileVisibility: "private" | "friends" | "public";
  twoFactorAuth: boolean;
  biometricAuth: boolean;
}

interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  periodReminders: boolean;
  ovulationReminders: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  weeklyReports: boolean;
  monthlyReports: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
}

// Default values
const defaultUserProfile: UserProfile = {
  firstName: "Demo",
  lastName: "User",
  email: "demo@example.com",
  dateOfBirth: "",
  phone: "",
  bio: "",
  avatar: "",
};

const defaultAppSettings: AppSettings = {
  theme: "light",
  language: "en",
  timezone: "UTC",
  dateFormat: "MM/dd/yyyy",
  temperatureUnit: "celsius",
  cycleLength: 28,
  periodLength: 5,
  lutealPhase: 14,
};

const defaultPrivacySettings: PrivacySettings = {
  dataSharing: false,
  analytics: true,
  marketing: false,
  profileVisibility: "private",
  twoFactorAuth: false,
  biometricAuth: false,
};

const defaultNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: false,
  smsNotifications: false,
  periodReminders: true,
  ovulationReminders: true,
  appointmentReminders: true,
  medicationReminders: true,
  weeklyReports: false,
  monthlyReports: true,
  quietHoursEnabled: true,
  quietHoursStart: "22:00",
  quietHoursEnd: "07:00",
};

export default function SettingsPage() {
  const [userProfile, setUserProfile] =
    useState<UserProfile>(defaultUserProfile);
  const [appSettings, setAppSettings] =
    useState<AppSettings>(defaultAppSettings);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>(
    defaultPrivacySettings
  );
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationSettings>(defaultNotificationSettings);

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [isExportDataOpen, setIsExportDataOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedUserProfile = localStorage.getItem("user-profile");
      const savedAppSettings = localStorage.getItem("app-settings");
      const savedPrivacySettings = localStorage.getItem("privacy-settings");
      const savedNotificationSettings = localStorage.getItem(
        "notification-settings"
      );

      if (savedUserProfile) {
        try {
          setUserProfile(JSON.parse(savedUserProfile));
        } catch (error) {
          console.error("Error parsing user profile:", error);
        }
      }

      if (savedAppSettings) {
        try {
          setAppSettings(JSON.parse(savedAppSettings));
        } catch (error) {
          console.error("Error parsing app settings:", error);
        }
      }

      if (savedPrivacySettings) {
        try {
          setPrivacySettings(JSON.parse(savedPrivacySettings));
        } catch (error) {
          console.error("Error parsing privacy settings:", error);
        }
      }

      if (savedNotificationSettings) {
        try {
          setNotificationSettings(JSON.parse(savedNotificationSettings));
        } catch (error) {
          console.error("Error parsing notification settings:", error);
        }
      }
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user-profile", JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app-settings", JSON.stringify(appSettings));
    }
  }, [appSettings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("privacy-settings", JSON.stringify(privacySettings));
    }
  }, [privacySettings]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "notification-settings",
        JSON.stringify(notificationSettings)
      );
    }
  }, [notificationSettings]);

  const handleProfileUpdate = () => {
    // In a real app, this would make an API call
    console.log("Profile updated:", userProfile);
    // Show success message
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords don't match");
      return;
    }
    // In a real app, this would make an API call
    console.log("Password changed");
    setIsChangePasswordOpen(false);
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleExportData = () => {
    // In a real app, this would generate and download user data
    const userData = {
      profile: userProfile,
      settings: {
        app: appSettings,
        privacy: privacySettings,
        notifications: notificationSettings,
      },
      // Add other user data like periods, symptoms, etc.
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "period-tracker-data.json";
    link.click();
    URL.revokeObjectURL(url);
    setIsExportDataOpen(false);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userProfile.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-pink-100 text-pink-700 text-lg">
                    {userProfile.firstName.charAt(0)}
                    {userProfile.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={userProfile.firstName}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={userProfile.lastName}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, email: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={userProfile.dateOfBirth || ""}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        dateOfBirth: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={userProfile.phone || ""}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, phone: e.target.value })
                    }
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userProfile.bio || ""}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, bio: e.target.value })
                  }
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleProfileUpdate}
                className="bg-pink-600 hover:bg-pink-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Last changed 3 months ago
                  </p>
                </div>
                <Dialog
                  open={isChangePasswordOpen}
                  onOpenChange={setIsChangePasswordOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new one
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                currentPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                newPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) =>
                              setPasswordForm({
                                ...passwordForm,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsChangePasswordOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePasswordChange}
                        className="bg-pink-600 hover:bg-pink-700"
                      >
                        Change Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={privacySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      twoFactorAuth: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Biometric Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Use fingerprint or face recognition
                  </p>
                </div>
                <Switch
                  checked={privacySettings.biometricAuth}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      biometricAuth: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={appSettings.language}
                  onValueChange={(value) =>
                    setAppSettings({ ...appSettings, language: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="fa">فارسی</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={appSettings.dateFormat}
                  onValueChange={(value) =>
                    setAppSettings({ ...appSettings, dateFormat: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature Unit</Label>
                <Select
                  value={appSettings.temperatureUnit}
                  onValueChange={(value) =>
                    setAppSettings({
                      ...appSettings,
                      temperatureUnit: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="celsius">Celsius (°C)</SelectItem>
                    <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cycle Settings</CardTitle>
              <CardDescription>
                Configure your default cycle parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycleLength">Average Cycle Length (days)</Label>
                <Input
                  id="cycleLength"
                  type="number"
                  min="21"
                  max="35"
                  value={appSettings.cycleLength}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      cycleLength: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Typical range: 21-35 days
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodLength">
                  Average Period Length (days)
                </Label>
                <Input
                  id="periodLength"
                  type="number"
                  min="3"
                  max="8"
                  value={appSettings.periodLength}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      periodLength: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Typical range: 3-8 days
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="lutealPhase">Luteal Phase Length (days)</Label>
                <Input
                  id="lutealPhase"
                  type="number"
                  min="10"
                  max="16"
                  value={appSettings.lutealPhase}
                  onChange={(e) =>
                    setAppSettings({
                      ...appSettings,
                      lutealPhase: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Typical range: 10-16 days
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications on your device
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via text message
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Reminder Types</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Period Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified before your period starts
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.periodReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        periodReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Ovulation Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about your fertile window
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.ovulationReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        ovulationReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming appointments
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        appointmentReminders: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Medication Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified to take your medications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.medicationReminders}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        medicationReminders: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Reports</h4>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly cycle summaries
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.weeklyReports}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        weeklyReports: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Monthly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive monthly cycle analysis
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.monthlyReports}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        monthlyReports: checked,
                      })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Don't send notifications during these hours
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.quietHoursEnabled}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        quietHoursEnabled: checked,
                      })
                    }
                  />
                </div>

                {notificationSettings.quietHoursEnabled && (
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quietStart">From</Label>
                      <Input
                        id="quietStart"
                        type="time"
                        value={notificationSettings.quietHoursStart}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            quietHoursStart: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quietEnd">To</Label>
                      <Input
                        id="quietEnd"
                        type="time"
                        value={notificationSettings.quietHoursEnd}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            quietHoursEnd: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is used and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Share anonymized data to help improve the app for everyone
                  </p>
                </div>
                <Switch
                  checked={privacySettings.dataSharing}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      dataSharing: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Analytics</Label>
                  <p className="text-sm text-muted-foreground">
                    Help us understand how you use the app
                  </p>
                </div>
                <Switch
                  checked={privacySettings.analytics}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      analytics: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing Communications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive tips, updates, and promotional content
                  </p>
                </div>
                <Switch
                  checked={privacySettings.marketing}
                  onCheckedChange={(checked) =>
                    setPrivacySettings({
                      ...privacySettings,
                      marketing: checked,
                    })
                  }
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Profile Visibility</Label>
                <Select
                  value={privacySettings.profileVisibility}
                  onValueChange={(value) =>
                    setPrivacySettings({
                      ...privacySettings,
                      profileVisibility: value as any,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private">
                      Private - Only you can see your profile
                    </SelectItem>
                    <SelectItem value="friends">
                      Friends - Only your friends can see your profile
                    </SelectItem>
                    <SelectItem value="public">
                      Public - Anyone can see your profile
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Rights</CardTitle>
              <CardDescription>
                Learn about your rights regarding your personal data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Your Rights Include:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Right to access your personal data</li>
                  <li>• Right to correct inaccurate data</li>
                  <li>• Right to delete your data</li>
                  <li>• Right to data portability</li>
                  <li>• Right to object to processing</li>
                </ul>
              </div>
              <Button variant="outline" className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Privacy Policy
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>
                Export, import, or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Export Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Download all your data in JSON format for backup or
                      transfer
                    </p>
                  </div>
                  <Dialog
                    open={isExportDataOpen}
                    onOpenChange={setIsExportDataOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Export Your Data</DialogTitle>
                        <DialogDescription>
                          This will download all your personal data including
                          profile, settings, cycle data, and symptoms.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-medium text-blue-900">
                            What's included:
                          </h4>
                          <ul className="text-sm text-blue-700 mt-2 space-y-1">
                            <li>• Profile information</li>
                            <li>• App settings and preferences</li>
                            <li>• Period and cycle data</li>
                            <li>• Symptom logs</li>
                            <li>• Reminders and notifications</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsExportDataOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleExportData}
                          className="bg-pink-600 hover:bg-pink-700"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download Data
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label className="text-base">Import Data</Label>
                    <p className="text-sm text-muted-foreground">
                      Upload a previously exported data file to restore your
                      information
                    </p>
                  </div>
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="space-y-0.5">
                    <Label className="text-base text-red-900">
                      Delete Account
                    </Label>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                  <AlertDialog
                    open={isDeleteAccountOpen}
                    onOpenChange={setIsDeleteAccountOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your account and remove all your data from our
                          servers including:
                          <br />
                          <br />• All period and cycle data
                          <br />• Symptom logs and analytics
                          <br />• Reminders and settings
                          <br />• Profile information
                          <br />
                          <br />
                          Consider exporting your data first if you want to keep
                          a backup.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Storage Usage</CardTitle>
              <CardDescription>
                See how much storage your data is using
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Period Data</span>
                  <span>2.3 MB</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Symptom Logs</span>
                  <span>1.8 MB</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Photos & Media</span>
                  <span>0.5 MB</span>
                </div>
                <Progress value={5} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Settings & Preferences</span>
                  <span>0.1 MB</span>
                </div>
                <Progress value={1} className="h-2" />
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total Usage</span>
                <span>4.7 MB</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>
                Get help with your account and data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Terms of Service
                <ExternalLink className="h-4 w-4 ml-auto" />
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
