"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(window.location.search);
  const callbackUrl = searchParams.get("callbackUrl") || "/manage/dashboard";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Clear browser history before redirecting
        if (typeof window !== "undefined") {
          window.history.pushState({}, "", callbackUrl);
        }
        router.replace(callbackUrl);
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      {error && <div className="text-sm text-red-500 text-center">{error}</div>}
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            name="email"
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-xs underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>
          <Input name="password" id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
}
