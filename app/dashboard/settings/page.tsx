import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Zap, Shield, Bell } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account preferences and subscription.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <CardTitle>Subscription Plan</CardTitle>
              </div>
              <Badge>Free Plan</Badge>
            </div>
            <CardDescription>You are currently on the free plan with limited analyses.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
              <div>
                <p className="font-semibold">Upgrade to Premium</p>
                <p className="text-sm text-muted-foreground">Get unlimited resume analyses and advanced AI coaching.</p>
              </div>
              <Link href="/api/stripe/checkout">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-500" />
              <CardTitle>Billing History</CardTitle>
            </div>
            <CardDescription>View your past payments and download invoices.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground py-4 text-center border-t">No billing history found.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure how you want to receive alerts and updates.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex items-center justify-between py-2">
               <span className="text-sm">Email notifications for analysis completion</span>
               <div className="h-5 w-10 bg-gray-200 rounded-full relative">
                 <div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full shadow" />
               </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
