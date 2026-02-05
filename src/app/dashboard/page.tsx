"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const { data: session } = useSession();

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
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Hello, {session?.user?.name || session?.user?.email}! 
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              The file upload and notes generation features will be implemented in the next phase.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
