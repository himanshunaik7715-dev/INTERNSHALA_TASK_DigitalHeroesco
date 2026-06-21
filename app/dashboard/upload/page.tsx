"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function UploadPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Upload Resume</h2>
        <p className="text-muted-foreground">
          Upload your resume in PDF or DOCX format to start the analysis.
        </p>
      </div>

      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle>Resume File</CardTitle>
          <CardDescription>
            Drag and drop your file here or click to browse. Max size: 4MB.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <UploadDropzone
            endpoint="resumeUploader"
            onClientUploadComplete={(res) => {
              if (!res || res.length === 0) {
                setToast({ type: "error", message: "Upload failed: No file returned from UploadThing." });
                setIsUploading(false);
                return;
              }

              setToast({ type: "success", message: "Resume uploaded successfully! Processing in background..." });
              setTimeout(() => {
                setIsUploading(false);
                router.push("/dashboard/resumes");
                router.refresh();
              }, 2000);
            }}
            onUploadError={(error: Error) => {
              console.error("UploadThing client error:", error);
              setIsUploading(false);
              setToast({ type: "error", message: `Upload error: ${error.message}` });
            }}
            onUploadBegin={() => {
              setIsUploading(true);
              setToast(null);
            }}
            className="ut-label:text-primary ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
          />
          {isUploading && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-4">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
              <span>Uploading your resume...</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CheckCircle className="h-5 w-5 text-emerald-500 mb-2" />
            <CardTitle className="text-base">ATS Optimized</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Our parser is designed to extract data just like major ATS systems.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <FileText className="h-5 w-5 text-blue-500 mb-2" />
            <CardTitle className="text-base">Format Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Supports both PDF and DOCX formats for maximum flexibility.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <AlertCircle className="h-5 w-5 text-orange-500 mb-2" />
            <CardTitle className="text-base">Privacy First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Your resumes are stored securely and only accessible by you.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Custom Premium Toast Banner */}
      {toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg max-w-sm transition-all duration-300 ${
            toast.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className={`ml-auto text-xs font-bold hover:underline ${
              toast.type === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
