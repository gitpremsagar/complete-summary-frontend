"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/auth-provider";

export default function Home() {
  const { user, isLoading } = useAuth();

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-6 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-semibold tracking-tight">Pod</h1>
        <p className="text-muted-foreground">Sign in or create an account to continue.</p>
      </div>
      {!isLoading && (
        <div className="flex gap-3">
          {user ? (
            <Button asChild size="lg">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>
      )}
    </main>
  );
}
