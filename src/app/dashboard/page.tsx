"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, BookOpen } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <Button onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign Out
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome to Study with AI</CardTitle>
            <CardDescription>
              Hello, {session?.user?.name || session?.user?.email}!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Upload your study materials and let AI help you generate comprehensive notes.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:border-primary transition-colors cursor-pointer" onClick={() => router.push("/dashboard/upload")}>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl">Upload Files</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload PDF, DOCX, TXT, or PPT files to extract and analyze content
              </CardDescription>
              <Button className="mt-4 w-full" onClick={() => router.push("/dashboard/upload")}>
                Upload Now
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">My Notes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                View and manage your generated study notes
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-xl">Study Sessions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Interactive learning sessions powered by AI
              </CardDescription>
              <Button className="mt-4 w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
