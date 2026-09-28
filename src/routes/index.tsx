import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import logo from "@/assets/geopetcare-logo.jpg.asset.json";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { recordLogin } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Sign in to GeoPetCare Foundation. One World. One Family. Every Pet Counts. Rescue, medical care, feeding, sterilization and adoption for animals in need.",
      },
      { property: "og:title", content: "Sign in — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Every Life Matters. Every Paw Deserves Love. Sign in to the GeoPetCare Foundation portal.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [adminBusy, setAdminBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let active = true;
    const go = async (userId: string) => {
      await recordLogin(userId);
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      navigate({ to: data ? "/admin" : "/home", replace: true });
    };

    void supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) void go(data.user.id);
      else setChecking(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) void go(session.user.id);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const googleSignIn = async () => {
    setGoogleBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setGoogleBusy(false);
      toast.error("Google sign-in could not be completed. Please try again.");
      return;
    }
    if (result.redirected) return;
  };

  const adminSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setAdminBusy(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.user) {
      setAdminBusy(false);
      toast.error("Invalid credentials.");
      return;
    }
    const { data: role } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) {
      await supabase.auth.signOut();
      setAdminBusy(false);
      toast.error("This account does not have administrator access.");
      return;
    }
    await recordLogin(data.user.id);
    navigate({ to: "/admin", replace: true });
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      <div className="hero-surface flex flex-col justify-between px-6 py-12 md:px-14">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="GeoPetCare Foundation" className="h-14 w-14 rounded-lg object-cover" />
          <div>
            <p className="font-display text-lg font-semibold">GeoPetCare Foundation</p>
            <p className="text-xs opacity-80">www.GeoPetCare.org</p>
          </div>
        </div>

        <div className="py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-soft">
            One World. One Family. Every Pet Counts.
          </p>
          <h1 className="mt-4 max-w-xl text-3xl font-semibold leading-tight md:text-5xl">
            Every Life Matters. Every Paw Deserves Love.
          </h1>
          <p className="mt-5 max-w-lg text-sm opacity-90 md:text-base">
            Sign in to access rescue, emergency medical care, community feeding, sterilization, GeoPet ID™,
            adoption, fostering and volunteering programmes of GeoPetCare Foundation.
          </p>
        </div>

        <p className="text-xs opacity-70">
          Your account is used only to identify your own profile and your own submissions.
        </p>
      </div>

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Tabs defaultValue="user">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User login</TabsTrigger>
              <TabsTrigger value="admin">Admin login</TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="mt-5">
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="text-primary">Welcome</CardTitle>
                  <CardDescription>
                    Continue with your Google account to enter the GeoPetCare Foundation website.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Button
                    onClick={() => void googleSignIn()}
                    disabled={googleBusy}
                    className="h-11 w-full"
                    variant="outline"
                  >
                    {googleBusy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                        <path
                          fill="#4285F4"
                          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3a7.2 7.2 0 0 1-10.7-3.8h-4v3.1A12 12 0 0 0 12 24Z"
                        />
                        <path fill="#FBBC05" d="M5.3 14.3a7.2 7.2 0 0 1 0-4.6V6.6h-4a12 12 0 0 0 0 10.8l4-3.1Z" />
                        <path
                          fill="#EA4335"
                          d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5A12 12 0 0 0 1.3 6.6l4 3.1A7.2 7.2 0 0 1 12 4.8Z"
                        />
                      </svg>
                    )}
                    Continue with Google
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    We store only your name and email address.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admin" className="mt-5">
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="h-5 w-5" /> Administrator
                  </CardTitle>
                  <CardDescription>
                    Restricted access. Administrator accounts cannot be self-registered.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={adminSignIn} className="grid gap-4">
                    <div>
                      <Label htmlFor="admin-email">Admin email</Label>
                      <Input
                        id="admin-email"
                        type="email"
                        autoComplete="username"
                        className="mt-2"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="admin-password">Password</Label>
                      <Input
                        id="admin-password"
                        type="password"
                        autoComplete="current-password"
                        className="mt-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" disabled={adminBusy} className="h-11">
                      {adminBusy ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <LockKeyhole className="mr-2 h-4 w-4" />
                      )}
                      Sign in as admin
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
