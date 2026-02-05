"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, XCircle, Loader2, FileSpreadsheet } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

interface UploadResponse {
  success: boolean;
  content?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  error?: string;
}

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [generatingNotes, setGeneratingNotes] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["PDF", "DOCX", "TXT", "PPT", "PPTX", "JPG", "PNG"];

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadResult(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      // Check if response is OK before parsing JSON
      if (!response.ok) {
        const text = await response.text();
        let errorMessage = "Failed to upload file";
        try {
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch {
          errorMessage = text || `Server error: ${response.status}`;
        }
        setUploadResult({ success: false, error: errorMessage });
        return;
      }

      const data: UploadResponse = await response.json();
      setUploadResult(data);

      if (data.success) {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: error instanceof Error ? error.message : "Failed to upload file",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleGenerateNotes = async () => {
    if (!uploadResult?.success || !uploadResult.content) return;

    setGeneratingNotes(true);

    try {
      const response = await fetch("/api/generate/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: uploadResult.content,
          title: uploadResult.fileName || "Untitled Note",
          fileName: uploadResult.fileName,
          fileType: uploadResult.fileType,
        }),
      });

      const data = await response.json();

      if (data.success && data.note) {
        router.push(`/dashboard/notes/${data.note.id}`);
      } else {
        alert(data.error || "Failed to generate notes");
      }
    } catch (error) {
      console.error("Error generating notes:", error);
      alert("Failed to generate notes. Please try again.");
    } finally {
      setGeneratingNotes(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">Upload Study Material</h1>
            <p className="text-muted-foreground mt-2">
              Upload your documents to extract and analyze content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <Button variant="outline" onClick={() => window.history.back()}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>File Upload</CardTitle>
            <CardDescription>
              Supported formats: {allowedTypes.join(", ")} • Max size: 10MB
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleChange}
                accept=".pdf,.docx,.txt,.ppt,.pptx,.jpg,.jpeg,.png"
              />
              
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-medium">
                    Drag and drop your file here
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">or</p>
                </div>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {file && (
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="min-w-[120px]"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Upload & Parse"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {uploadResult && (
              <Card
                className={
                  uploadResult.success
                    ? "border-green-500/50 bg-green-500/5"
                    : "border-destructive/50 bg-destructive/5"
                }
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {uploadResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">
                        {uploadResult.success
                          ? "File uploaded successfully!"
                          : "Upload failed"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {uploadResult.success
                          ? `Extracted ${uploadResult.content?.length.toLocaleString()} characters from ${uploadResult.fileName}`
                          : uploadResult.error}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {uploadResult?.success && uploadResult.content && (
          <Card>
            <CardHeader>
              <CardTitle>Extracted Content Preview</CardTitle>
              <CardDescription>
                First 500 characters of the parsed content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted rounded-lg p-4 max-h-64 overflow-y-auto">
                <pre className="text-sm whitespace-pre-wrap font-mono">
                  {uploadResult.content.substring(0, 500)}
                  {uploadResult.content.length > 500 && "..."}
                </pre>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Total length: {uploadResult.content.length.toLocaleString()}{" "}
                  characters
                </p>
                <Button 
                  onClick={handleGenerateNotes}
                  disabled={generatingNotes}
                  size="sm"
                >
                  {generatingNotes ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Generate Notes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
