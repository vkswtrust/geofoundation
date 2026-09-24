import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

import logo from "@/assets/geopetcare-logo.jpg.asset.json";
import { AnimalsPanel } from "@/components/admin/AnimalsPanel";
import {
  DonationSettingsPanel,
  DonationsPanel,
  EnquiriesPanel,
  ImpactPanel,
  UsersPanel,
} from "@/components/admin/panels";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — GeoPetCare Foundation" },
      { name: "description", content: "Restricted administration area of GeoPetCare Foundation." },
      { property: "og:title", content: "Admin Dashboard — GeoPetCare Foundation" },
      { property: "og:description", content: "Restricted administration area." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const tabs = [
  "Overview",
  "Users",
  "Enquiries",
  "Volunteer Applications",
  "CSR Enquiries",
  "Adoption Enquiries",
  "Donations",
  "Donation Details",
  "Adoption Animals",
  "Impact Statistics",
  "Settings",
] as const;
type Tab = (typeof tabs)[number];

function Overview() {
  const { data } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async () => {
      const count = async (t: "profiles" | "enquiries" | "animals" | "donations", f?: [string, string]) => {
        let q = supabase.from(t).select("id", { count: "exact", head: true });
        if (f) q = q.eq(f[0], f[1]);
        const { count } = await q;
        return count ?? 0;
      };
      return {
        Users: await count("profiles"),
        Enquiries: await count("enquiries"),
        "New enquiries": await count("enquiries", ["status", "new"]),
        Animals: await count("animals"),
        "Donation records": await count("donations"),
      };
    },
  });
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {Object.entries(data ?? {}).map(([k, v]) => (
        <Card key={k} className="card-soft">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">{k}</CardTitle></CardHeader>
          <CardContent className="text-3xl font-semibold text-primary">{v}</CardContent>
        </Card>
      ))}
    </div>
  );
}

function AdminPage() {
  const { loading, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Overview");

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (loading)
    return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  if (!isAdmin)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-semibold">Access denied</h1>
        <p className="text-muted-foreground">This area is restricted to the administrator.</p>
        <Button asChild><Link to="/home">Back to website</Link></Button>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="hero-surface flex items-center justify-between px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="GeoPetCare" className="h-10 w-10 rounded-md object-cover" />
          <div>
            <p className="font-display font-semibold">Admin Dashboard</p>
            <p className="text-xs opacity-80">{user?.email}</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={() => void logout()}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </header>
      <div className="flex flex-col md:flex-row">
        <nav className="flex gap-1 overflow-x-auto border-b p-2 md:w-60 md:flex-col md:border-b-0 md:border-r">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-2 text-left text-sm",
                tab === t ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </nav>
        <main className="min-w-0 flex-1 p-4 md:p-8">
          {tab === "Overview" && <Overview />}
          {tab === "Users" && <UsersPanel />}
          {tab === "Enquiries" && (
            <EnquiriesPanel kinds={["general", "foster", "sponsorship", "contact"]} title="Enquiries" description="General, foster, sponsorship and contact enquiries." showKind />
          )}
          {tab === "Volunteer Applications" && (
            <EnquiriesPanel kinds={["volunteer"]} title="Volunteer Applications" description="Applications submitted by users." />
          )}
          {tab === "CSR Enquiries" && (
            <EnquiriesPanel kinds={["csr"]} title="CSR Enquiries" description="Corporate CSR enquiries." />
          )}
          {tab === "Adoption Enquiries" && (
            <EnquiriesPanel kinds={["adoption"]} title="Adoption Enquiries" description="Interest in listed animals." />
          )}
          {tab === "Donations" && <DonationsPanel />}
          {tab === "Donation Details" && <DonationSettingsPanel />}
          {tab === "Adoption Animals" && <AnimalsPanel />}
          {tab === "Impact Statistics" && <ImpactPanel />}
          {tab === "Settings" && (
            <Card className="card-soft">
              <CardHeader><CardTitle>Settings</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>Administrator account: {user?.email}</p>
                <p>Admin registration is disabled. Only this account has administrator access.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
