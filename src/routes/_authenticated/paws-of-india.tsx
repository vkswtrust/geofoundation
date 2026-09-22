import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, PawPrint, ShieldCheck } from "lucide-react";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/paws-of-india")({
  head: () => ({
    meta: [
      { title: "Paws of India™ — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Paws of India™ is GeoPetCare Foundation's nationwide vision for city-by-city animal welfare networks, rescue response and community care.",
      },
      { property: "og:title", content: "Paws of India™ — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "A nationwide network for rescue, feeding, sterilization and care of community animals.",
      },
    ],
  }),
  component: PawsOfIndiaPage,
});

const pillars = [
  {
    icon: MapPin,
    title: "City by city",
    body: "Building local welfare networks of rescuers, feeders, veterinarians and volunteers in every city we enter.",
  },
  {
    icon: PawPrint,
    title: "Community animals first",
    body: "Street animals receive the same standard of rescue, treatment and follow-up care as any pet.",
  },
  {
    icon: ShieldCheck,
    title: "Accountable records",
    body: "Every animal we help is documented, so care can be verified and continued by anyone in the network.",
  },
];

function PawsOfIndiaPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Paws of India™"
        title="One country. One family. Every paw counted."
        description="Paws of India™ is our long-term initiative to extend rescue, medical care, feeding and sterilization support into more cities through local welfare networks."
      />

      <Section title="How the initiative works">
        <div className="grid gap-5 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, body }) => (
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

      <Section>
        <div className="grid gap-6 rounded-2xl bg-primary-deep p-8 text-primary-foreground md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-2xl font-semibold md:text-3xl">Bring Paws of India™ to your city</h2>
            <p className="mt-3 max-w-xl text-sm opacity-90">
              Volunteers, veterinarians, feeders and companies can all be part of building the network where
              you live.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild className="accent-surface h-11">
              <Link to="/volunteer">Volunteer With Us</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              <Link to="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
