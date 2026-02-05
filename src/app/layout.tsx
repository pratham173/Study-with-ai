import type { Metadata } from "next";
import "@/styles/globals.css";
import AuthProvider from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "Study with AI",
  description: "Transform your study materials into structured notes and flashcards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
