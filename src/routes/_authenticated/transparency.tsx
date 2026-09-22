import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { FileCheck2, Lock, ScrollText } from "lucide-react";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/transparency")({
  head: () => ({
    meta: [
      { title: "Transparency — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "How GeoPetCare Foundation handles records, donations and animal data: verified numbers only, private records protected, nothing invented.",
      },
      { property: "og:title", content: "Transparency — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Verified records only. We publish numbers when they exist, not before.",
      },
    ],
  }),
  component: TransparencyPage,
});

const principles = [
  {
    icon: FileCheck2,
    title: "Verified numbers only",
    body: "Impact figures on this website come from records entered by the Foundation. We never publish estimated or promotional numbers.",
  },
  {
    icon: Lock,
    title: "Private data stays private",
    body: "Your account details and your submissions are visible only to you and the Foundation team. No user can see another user's information.",
  },
  {
    icon: ScrollText,
    title: "Documented care",
    body: "Rescue, treatment, vaccination and adoption details are recorded against each animal so care can be verified and continued.",
  },
];

function TransparencyPage() {
  const { data: stats } = useQuery({
    queryKey: ["impact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("id, label, value, display_order")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const published = (stats ?? []).filter((s) => s.value !== null);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Transparency"
        title="We publish only what we can prove"
        description="Trust matters more than numbers. Everything shown on this website is either a stated intention or a record entered by the Foundation."
      />

      <Section title="Our commitments">
        <div className="grid gap-5 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="card-soft h-full">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-lg text-primary">{title}</CardTitle>
                <CardDescription>{body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Published records">
        {published.length === 0 ? (
          <Card className="card-soft">
            <CardContent className="py-10 text-center text-muted-foreground">
              Data will be updated soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {published.map((stat) => (
              <Card key={stat.id} className="card-soft text-center">
                <CardContent className="py-8">
                  <p className="font-display text-3xl font-semibold text-primary">
                    {Number(stat.value).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>
    </SiteLayout>
  );
}
