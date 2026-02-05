import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">Study with AI</h1>
        <p className="text-xl text-muted-foreground">
          Transform your study materials into structured notes and flashcards
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link href="/login">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
