"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Sparkles, Check } from "lucide-react";

interface Resume {
  _id: string;
  createdAt: string;
  parsedData: {
    skills: string[];
  };
}

export default function AnalyzePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialResumeId = searchParams.get("resumeId");

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState(initialResumeId || "");
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("/api/resumes");
        const data = await res.json();
        if (data.success) {
          setResumes(data.data);
          if (!selectedResumeId && data.data.length > 0) {
            setSelectedResumeId(data.data[0]._id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch resumes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, [selectedResumeId]);

  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeId: selectedResumeId,
          jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/dashboard/analyses?id=${data.data._id}`);
      } else {
        alert(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis error", error);
      alert("An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analyze Resume</h2>
        <p className="text-muted-foreground">
          Select a resume and provide a job description to get an ATS score and AI improvements.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Select Resume</CardTitle>
              <CardDescription>Choose one of your uploaded resumes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-4">No resumes found.</p>
                  <Button variant="outline" onClick={() => router.push("/dashboard/upload")}>
                    Upload Now
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      onClick={() => setSelectedResumeId(resume._id)}
                      className={`p-3 border rounded-lg cursor-pointer transition flex items-center justify-between ${
                        selectedResumeId === resume._id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className={`h-5 w-5 ${selectedResumeId === resume._id ? "text-primary" : "text-muted-foreground"}`} />
                        <div>
                          <p className="text-sm font-medium">Resume {resume._id.slice(-4)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(resume.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedResumeId === resume._id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Pro Tip
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-700">
                The more detailed the job description, the better our AI can suggest improvements and calculate an accurate score.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>2. Job Description</CardTitle>
              <CardDescription>Paste the full job description text here.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <Textarea
                placeholder="Paste the job requirements, responsibilities, and skills here..."
                className="flex-1 min-h-[400px] resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <Button
                size="lg"
                className="w-full"
                disabled={!selectedResumeId || !jobDescription || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Analyzing with AI...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Run ATS Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
