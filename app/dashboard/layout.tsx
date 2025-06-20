"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  LineChart,
  BarChart3,
  Settings,
  Bell,
  Heart,
  Menu,
  X,
  LogOut,
  Home,
  Loader,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useGetUser } from "@/hooks/useUser";
import { decodeToken } from "@/actions/auth.action";
import { signOut } from "next-auth/react";
import Cookie from "js-cookie";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const {
    data: currentUser,
    refetch: currentUserRefetch,
    isLoading: currentUserLoading,
  } = useGetUser(userId);
  console.log("🚀 ~ currentUser:", currentUser);
  useEffect(() => {
    const func = async () => {
      const token = (await decodeToken()) as string;
      setUserId(token);
      currentUserRefetch();
    };
    func();
  }, []);

  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    await Cookie.remove("token");
    toast.success("User signed out successfully");
    window.location.href = "/";
  };
  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/calendar",
      label: "Calendar",
      icon: Calendar,
      active: pathname === "/dashboard/calendar",
    },
    {
      href: "/dashboard/symptoms",
      label: "Symptoms",
      icon: BarChart3,
      active: pathname === "/dashboard/symptoms",
    },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: LineChart,
      active: pathname === "/dashboard/analytics",
    },
    {
      href: "/dashboard/reminders",
      label: "Reminders",
      icon: Bell,
      active: pathname === "/dashboard/reminders",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      active: pathname === "/dashboard/settings",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <h1 className="text-xl font-bold text-pink-700">PeriodTracker</h1>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                route.active
                  ? "bg-pink-50 text-pink-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5",
                  route.active ? "text-pink-500" : "text-gray-500"
                )}
              />
              {route.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          {currentUserLoading ? (
            <div className="flex justify-center">
              <Loader className="text-[#DB2777] animate-spin" />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <div className="flex items-center gap-3 mb-4 animate-in">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-pink-100 text-pink-700">
                    {`${currentUser?.firstName[0]}${currentUser?.lastName[0]}`}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start gap-2"
                onClick={() => handleSignOut()}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          )}
        </div>
      </aside>

      {/* Mobile navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <h1 className="text-xl font-bold text-pink-700">PeriodTracker</h1>
          </Link>
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <Heart className="h-6 w-6 text-pink-500" />
                    <h1 className="text-xl font-bold text-pink-700">
                      PeriodTracker
                    </h1>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close menu</span>
                  </Button>
                </div>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setIsMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                      route.active
                        ? "bg-pink-50 text-pink-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                  >
                    <route.icon
                      className={cn(
                        "h-5 w-5",
                        route.active ? "text-pink-500" : "text-gray-500"
                      )}
                    />
                    {route.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="bg-pink-100 text-pink-700">
                      {`${currentUser?.firstName[0]}${currentUser?.lastName[0]}`}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{`${currentUser?.firstName} ${currentUser?.lastName}`}</p>
                    <p className="text-xs text-gray-500">
                      {currentUser?.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => handleSignOut()}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-0 md:pt-0">
        <div className="md:hidden h-16"></div> {/* Spacer for mobile header */}
        {children}
      </main>
    </div>
  );
}
