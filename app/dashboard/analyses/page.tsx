"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  History, 
  ArrowLeft, 
  Target, 
  Brain, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

interface Analysis {
  _id: string;
  jobDescription: string;
  atsScores: {
    overallScore: number;
    keywordMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    educationMatch: number;
    formattingScore: number;
    readabilityScore: number;
  };
  missingKeywords: string[];
  skillGaps: string[];
  aiSuggestions: string;
  recruiterSimulation: {
    probability: number;
    verdict: string;
  };
  createdAt: string;
}

export default function AnalysesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const analysisId = searchParams.get("id");

  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/analyses");
        const data = await res.json();
        if (data.success) {
          setAnalyses(data.data);
          if (analysisId) {
            const found = data.data.find((a: Analysis) => a._id === analysisId);
            setSelectedAnalysis(found || null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch analyses", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [analysisId]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (analysisId && selectedAnalysis) {
    return (
      <div className="p-8 space-y-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/analyses")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Analysis Results</h2>
            <p className="text-muted-foreground">
              Analyzed on {new Date(selectedAnalysis.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Score Card */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Overall ATS Score
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
              <div className="relative h-40 w-40 flex items-center justify-center">
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    className="text-muted stroke-current"
                    strokeWidth="10"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    className="text-primary stroke-current"
                    strokeWidth="10"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * selectedAnalysis.atsScores.overallScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    r="40"
                    cx="50"
                    cy="50"
                  />
                </svg>
                <span className="absolute text-4xl font-bold">{selectedAnalysis.atsScores.overallScore}%</span>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Your resume matches {selectedAnalysis.atsScores.overallScore}% of the job requirements.
              </p>
            </CardContent>
          </Card>

          {/* Breakdown Card */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Score Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Keyword Match (40%)</span>
                  <span className="font-medium">{selectedAnalysis.atsScores.keywordMatch}%</span>
                </div>
                <Progress value={selectedAnalysis.atsScores.keywordMatch} className="bg-blue-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skills Match (25%)</span>
                  <span className="font-medium">{selectedAnalysis.atsScores.skillsMatch}%</span>
                </div>
                <Progress value={selectedAnalysis.atsScores.skillsMatch} className="bg-emerald-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experience Match (15%)</span>
                  <span className="font-medium">{selectedAnalysis.atsScores.experienceMatch * (100/15)}%</span>
                </div>
                <Progress value={selectedAnalysis.atsScores.experienceMatch * (100/15)} className="bg-orange-100" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Readability & Formatting (10%)</span>
                  <span className="font-medium">{(selectedAnalysis.atsScores.formattingScore + selectedAnalysis.atsScores.readabilityScore) * 10}%</span>
                </div>
                <Progress value={(selectedAnalysis.atsScores.formattingScore + selectedAnalysis.atsScores.readabilityScore) * 10} className="bg-purple-100" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Missing Keywords & Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Missing Keywords & Skills
              </CardTitle>
              <CardDescription>Add these to your resume to increase your score.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAnalysis.missingKeywords.length > 0 ? (
                    selectedAnalysis.missingKeywords.map((kw, i) => (
                      <Badge key={i} variant="destructive">{kw}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No missing keywords detected!</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2">Skill Gaps</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAnalysis.skillGaps.length > 0 ? (
                    selectedAnalysis.skillGaps.map((skill, i) => (
                      <Badge key={i} variant="outline" className="border-red-200 text-red-700 bg-red-50">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No major skill gaps found.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-violet-500" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Specific suggestions from our AI coach.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                  {selectedAnalysis.aiSuggestions}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recruiter Simulation */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Recruiter Simulation
            </CardTitle>
            <CardDescription>How a human recruiter would likely perceive your application.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hiring Probability</span>
              <span className="text-2xl font-bold text-primary">{selectedAnalysis.recruiterSimulation.probability}%</span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-primary/10 italic text-sm text-muted-foreground">
              "{selectedAnalysis.recruiterSimulation.verdict}"
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analysis History</h2>
        <p className="text-muted-foreground">
          View all your previous ATS analyses and improvements.
        </p>
      </div>

      {analyses.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <History className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>No analysis history</CardTitle>
          <CardDescription className="mt-2">
            Run your first ATS analysis to see results here.
          </CardDescription>
          <Link href="/dashboard/analyze" className="mt-4">
            <Button>Start Analysis</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {analyses.map((analysis) => (
            <Card key={analysis._id} className="hover:bg-gray-50 transition cursor-pointer" onClick={() => router.push(`/dashboard/analyses?id=${analysis._id}`)}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{analysis.atsScores.overallScore}%</span>
                    </div>
                    <div>
                      <p className="font-semibold line-clamp-1">
                        Analysis {analysis._id.slice(-4)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(analysis.createdAt).toLocaleDateString()} at {new Date(analysis.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex gap-2">
                      <Badge variant="outline">{analysis.missingKeywords.length} missing keywords</Badge>
                      <Badge variant="outline">{analysis.skillGaps.length} skill gaps</Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
