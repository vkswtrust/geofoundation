import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { displayName, useAuth } from "@/lib/auth";
import { enquiryKindLabels, type EnquiryKind } from "@/lib/enquiries";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — GeoPetCare Foundation" },
      {
        name: "description",
        content: "View your GeoPetCare Foundation account details and the enquiries you have submitted.",
      },
      { property: "og:title", content: "My Profile — GeoPetCare Foundation" },
      { property: "og:description", content: "Your account details and your own submissions." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const name = displayName(profile, user);

  const { data: mine } = useQuery({
    queryKey: ["my-enquiries", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("id, kind, subject, message, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <SiteLayout>
      <PageHero eyebrow="My profile" title={name} description="Your account details and your own submissions." />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-primary">Account</CardTitle>
              <CardDescription>Only you and the Foundation team can see this.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-14 w-14 border border-border">
                  {profile?.avatar_url ? <AvatarImage src={profile.avatar_url} alt={name} /> : null}
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{name}</p>
                  <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
                </div>
              </div>
              <div className="grid gap-2 text-sm">
                <p className="text-muted-foreground">
                  User ID: <span className="font-mono text-xs text-foreground">{user?.id}</span>
                </p>
                {profile?.created_at ? (
                  <p className="text-muted-foreground">
                    Registered: {new Date(profile.created_at).toLocaleString("en-IN")}
                  </p>
                ) : null}
                {profile?.last_login_at ? (
                  <p className="text-muted-foreground">
                    Last login: {new Date(profile.last_login_at).toLocaleString("en-IN")}
                  </p>
                ) : null}
                {isAdmin ? <Badge className="w-fit">Administrator</Badge> : null}
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-primary">My submissions</CardTitle>
              <CardDescription>Every form you have submitted on this website.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-6 text-sm text-muted-foreground">Loading…</p>
              ) : (mine ?? []).length === 0 ? (
                <p className="py-6 text-sm text-muted-foreground">
                  You have not submitted any forms yet.
                </p>
              ) : (
                <div className="grid gap-3">
                  {(mine ?? []).map((row) => (
                    <div key={row.id} className="rounded-xl border border-border/70 p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{enquiryKindLabels[row.kind as EnquiryKind]}</Badge>
                        <Badge variant="outline">{row.status.replace("_", " ")}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(row.created_at).toLocaleString("en-IN")}
                        </span>
                      </div>
                      {row.subject ? (
                        <p className="mt-2 text-sm font-medium text-foreground">{row.subject}</p>
                      ) : null}
                      {row.message ? (
                        <p className="mt-1 whitespace-pre-line text-sm text-muted-foreground">{row.message}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </Section>
    </SiteLayout>
  );
}
