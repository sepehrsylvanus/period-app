import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Shield,
  Calendar,
  LineChart,
  BookOpen,
  Bell,
  Heart,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <header className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            <h1 className="text-2xl font-bold text-pink-700">PeriodTracker</h1>
          </div>
          <div className="flex gap-4">
            {typeof window !== "undefined" && localStorage.getItem("user") ? (
              <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button className="bg-pink-600 hover:bg-pink-700" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-pink-800">
            Track Your Cycle, Understand Your Body
          </h1>
          <p className="text-lg mb-8 text-gray-700">
            A comprehensive period tracking app designed to help you monitor
            your menstrual cycle, track symptoms, predict future periods, and
            gain valuable insights about your health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-pink-600 hover:bg-pink-700" asChild>
              <Link href="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard/demo">Try Demo</Link>
            </Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Calendar className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Period Tracking</CardTitle>
              <CardDescription>
                Track your cycle with precision and get accurate predictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Record your period dates, flow intensity, and get smart
                predictions for your next cycle. Our algorithm adapts to your
                unique patterns, even with irregular cycles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Symptom Tracking</CardTitle>
              <CardDescription>
                Monitor physical and emotional symptoms throughout your cycle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Track a wide range of symptoms including mood changes, cramps,
                headaches, energy levels, and more to identify patterns and
                better understand your body.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BookOpen className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Fertility Insights</CardTitle>
              <CardDescription>
                Understand your fertility window and ovulation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Whether planning or preventing pregnancy, get accurate
                predictions of your fertility window, ovulation days, and
                personalized insights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <LineChart className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Analytics & Reports</CardTitle>
              <CardDescription>
                Visualize your data with comprehensive charts and insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Access detailed charts and reports about your cycle length,
                symptoms patterns, and health trends. Generate shareable reports
                for your healthcare provider.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Smart Reminders</CardTitle>
              <CardDescription>
                Never be caught unprepared with customizable notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Set personalized reminders for upcoming periods, fertile days,
                medication, doctor appointments, and daily symptom logging.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Shield className="h-8 w-8 text-pink-500 mb-2" />
              <CardTitle>Privacy & Security</CardTitle>
              <CardDescription>
                Your data is protected with industry-leading security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We prioritize your privacy with password protection, biometric
                authentication, and a strict privacy policy that keeps your
                sensitive data secure.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-pink-800">
            Ready to Take Control of Your Cycle?
          </h2>
          <p className="text-lg mb-8 text-gray-700">
            Join thousands of users who have discovered the power of
            understanding their bodies better.
          </p>
          <Button size="lg" className="bg-pink-600 hover:bg-pink-700" asChild>
            <Link href="/register">Create Free Account</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-50 py-12 mt-20">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Heart className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-bold text-pink-700">PeriodTracker</h2>
          </div>
          <p className="mb-6">Empowering you with knowledge about your body</p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <Link href="#" className="text-gray-600 hover:text-pink-600">
              About
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600">
              Terms of Service
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600">
              Contact
            </Link>
            <Link href="#" className="text-gray-600 hover:text-pink-600">
              Help Center
            </Link>
          </div>
          <p>
            © {new Date().getFullYear()} PeriodTracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
