"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Search, 
  TrendingUp, 
  Clock,
  Upload
} from "lucide-react";
import Link from "next/link";

interface Stats {
  totalResumes: number;
  totalAnalyses: number;
  averageScore: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalResumes: 0,
    totalAnalyses: 0,
    averageScore: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resumesRes, analysesRes] = await Promise.all([
          fetch("/api/resumes"),
          fetch("/api/analyses")
        ]);

        const resumesData = await resumesRes.json();
        const analysesData = await analysesRes.json();

        if (resumesData.success && analysesData.success) {
          const analyses = analysesData.data;
          const avgScore = analyses.length > 0 
            ? Math.round(analyses.reduce((acc: number, curr: any) => acc + curr.atsScores.overallScore, 0) / analyses.length)
            : 0;

          setStats({
            totalResumes: resumesData.data.length,
            totalAnalyses: analyses.length,
            averageScore: avgScore,
            recentActivity: analyses.slice(0, 5),
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResumes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnalyses}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. ATS Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentActivity.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {stats.recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent analyses found.</p>
              ) : (
                stats.recentActivity.map((analysis) => (
                  <div key={analysis._id} className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Score: {analysis.atsScores.overallScore}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto font-medium">
                      <Link 
                        href={`/dashboard/analyses?id=${analysis._id}`}
                        className="text-blue-500 hover:underline text-sm"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link 
              href="/dashboard/upload"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <Upload className="h-5 w-5 mr-3 text-violet-500" />
              <span className="text-sm font-medium">Upload New Resume</span>
            </Link>
            <Link 
              href="/dashboard/analyze"
              className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <Search className="h-5 w-5 mr-3 text-orange-500" />
              <span className="text-sm font-medium">Start New Analysis</span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
