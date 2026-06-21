"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Trash2, Search, ExternalLink, Plus } from "lucide-react";
import Link from "next/link";

interface Resume {
  _id: string;
  originalText: string;
  fileUrl?: string;
  fileName?: string;
  parsedData: {
    skills: string[];
  };
  createdAt: string;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchResumes = async () => {
    try {
      const res = await fetch("/api/resumes");
      const data = await res.json();
      console.log("[DEBUG] Resume fetch result:", data);
      if (data.success) {
        setResumes(data.data);
      }
    } catch (error) {
      console.error("[DEBUG] Failed to fetch resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;

    try {
      const res = await fetch(`/api/resumes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setResumes(resumes.filter((r) => r._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete resume", error);
    }
  };

  const filteredResumes = resumes.filter((resume) => 
    resume.parsedData.skills.some(skill => 
      skill.toLowerCase().includes(searchQuery.toLowerCase())
    ) || 
    new Date(resume.createdAt).toLocaleDateString().includes(searchQuery)
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Resumes</h2>
          <p className="text-muted-foreground">
            Manage your uploaded resumes and their parsed data.
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload New
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by skill or date..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredResumes.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle>No resumes found</CardTitle>
          <CardDescription className="mt-2">
            {searchQuery ? "Try a different search term." : "Upload your first resume to get started."}
          </CardDescription>
          {!searchQuery && (
            <Link href="/dashboard/upload" className="mt-4">
              <Button variant="outline">Upload Now</Button>
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredResumes.map((resume) => (
            <Card key={resume._id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <Badge variant="secondary">
                    {new Date(resume.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
                <CardTitle className="mt-4 text-lg truncate" title={resume.fileName || `Resume ${resume._id.slice(-4)}`}>
                  {resume.fileName || `Resume ${resume._id.slice(-4)}`}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {resume.originalText.slice(0, 100)}...
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-1 mt-2">
                  {resume.parsedData.skills.slice(0, 5).map((skill, i) => (
                    <Badge key={i} variant="outline" className="text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                  {resume.parsedData.skills.length > 5 && (
                    <Badge variant="outline" className="text-[10px]">
                      +{resume.parsedData.skills.length - 5} more
                    </Badge>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <div className="flex gap-2">
                  {resume.fileUrl && (
                    <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View File
                      </Button>
                    </a>
                  )}
                  <Link href={`/dashboard/analyze?resumeId=${resume._id}`}>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700 hover:bg-orange-50">
                      Analyze
                    </Button>
                  </Link>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(resume._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
