import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Ambulance,
  HeartHandshake,
  PawPrint,
  QrCode,
  Scissors,
  Soup,
  Stethoscope,
  Truck,
} from "lucide-react";

import logo from "@/assets/geopetcare-logo.jpg.asset.json";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "GeoPetCare Foundation — One World. One Family. Every Pet Counts." },
      {
        name: "description",
        content:
          "GeoPetCare Foundation works on rescue, emergency medical care, community feeding, sterilization, GeoPet ID™, adoption and fostering for animals in need.",
      },
      { property: "og:title", content: "GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "One World. One Family. Every Pet Counts. Every Life Matters. Every Paw Deserves Love.",
      },
    ],
  }),
  component: HomePage,
});

const pillars = [
  { icon: PawPrint, title: "Rescue", body: "Responding to reports of injured, abandoned and distressed animals.", to: "/programmes" },
  { icon: Stethoscope, title: "Emergency Medical Care", body: "Immediate treatment, wound care and recovery support for rescued animals.", to: "/programmes" },
  { icon: Soup, title: "Community Feeding", body: "Regular feeding support for community animals in identified zones.", to: "/programmes" },
  { icon: Scissors, title: "Sterilization Programme", body: "Humane population control through sterilization and after-care.", to: "/programmes" },
  { icon: Ambulance, title: "Animal Ambulance", body: "Transport for emergency cases, treatment visits and rehoming.", to: "/programmes" },
  { icon: QrCode, title: "GeoPet ID™", body: "A unique QR identity that carries an animal's medical and rescue record.", to: "/geopet-id" },
];

export function useImpactStats() {
  return useQuery({
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
}

function HomePage() {
  const { data: stats } = useImpactStats();
  const published = (stats ?? []).filter((s) => s.value !== null);

  return (
    <SiteLayout>
      <section className="hero-surface">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:py-24 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-soft">
              One World. One Family. Every Pet Counts.
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">
              Every Life Matters. Every Paw Deserves Love.
            </h1>
            <p className="mt-5 max-w-xl text-sm opacity-90 md:text-base">
              GeoPetCare Foundation is built around one idea: every animal deserves rescue when hurt, care
              when sick, food when hungry, and a family when alone. Our programmes cover rescue, emergency
              medical care, feeding, sterilization, fostering and adoption.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild className="accent-surface h-11">
                <Link to="/donate">Sponsor A Life</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/volunteer">Volunteer With Us</Link>
              </Button>
              <Button asChild variant="outline" className="h-11 border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/adopt">Adopt. Don't Shop.</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="rounded-3xl bg-white/95 p-6 card-lift">
              <img
                src={logo.url}
                alt="GeoPetCare Foundation logo"
                className="w-full max-w-sm rounded-2xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <Section title="What we do" description="Six connected programmes that carry an animal from rescue to a permanent home.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body, to }) => (
            <Link key={title} to={to}>
              <Card className="h-full card-soft transition-transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 text-lg text-primary">{title}</CardTitle>
                  <CardDescription>{body}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="Our impact" description="We publish only verified numbers entered by the Foundation.">
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

      <Section>
        <div className="grid gap-6 rounded-2xl bg-primary-deep p-8 text-primary-foreground md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <HeartHandshake className="h-8 w-8 text-accent-soft" />
            <h2 className="mt-4 text-2xl font-semibold md:text-3xl">Be the reason an animal survives today</h2>
            <p className="mt-3 max-w-xl text-sm opacity-90">
              Sponsor a life, foster a recovering animal, volunteer your hours, or bring your company into our
              CSR programme.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="accent-surface h-11">
              <Link to="/donate">Sponsor A Life</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 border-white/40 bg-white/10 text-white hover:bg-white/20">
              <Link to="/csr">
                <Truck className="mr-2 h-4 w-4" /> Corporate CSR
              </Link>
            </Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}

export { PageHero };
