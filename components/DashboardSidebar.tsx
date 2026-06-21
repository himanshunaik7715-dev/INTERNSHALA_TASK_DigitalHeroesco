"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Search,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Upload Resume",
    icon: Upload,
    href: "/dashboard/upload",
    color: "text-violet-500",
  },
  {
    label: "My Resumes",
    icon: FileText,
    href: "/dashboard/resumes",
    color: "text-pink-700",
  },
  {
    label: "Analyze Resume",
    icon: Search,
    href: "/dashboard/analyze",
    color: "text-orange-700",
  },
  {
    label: "Analysis History",
    icon: History,
    href: "/dashboard/analyses",
    color: "text-emerald-500",
  },
  {
    label: "Profile",
    icon: User,
    href: "/dashboard/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export const DashboardSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">ResumeMatch AI</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div className="px-3 py-2 border-t border-zinc-800 flex items-center gap-x-2">
        <UserButton afterSignOutUrl="/" />
        <div className="flex flex-col">
          <p className="text-sm font-medium">My Account</p>
        </div>
      </div>
    </div>
  );
};
