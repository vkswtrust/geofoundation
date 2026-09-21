import { createFileRoute } from "@tanstack/react-router";
import { QrCode } from "lucide-react";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/geopet-id")({
  head: () => ({
    meta: [
      { title: "GeoPet ID™ — A digital identity for every animal" },
      {
        name: "description",
        content:
          "GeoPet ID™ gives a rescued animal a unique QR identity linking its medical record, vaccination history, rescue history and adoption status.",
      },
      { property: "og:title", content: "GeoPet ID™ — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "A unique QR identity carrying an animal's medical, vaccination, rescue and adoption record.",
      },
    ],
  }),
  component: GeoPetIdPage,
});

const features = [
  { title: "Unique QR Identity", body: "Each animal receives a GeoPet ID™ that can be scanned to reach its verified record." },
  { title: "Medical Record", body: "Treatments, surgeries and medication history recorded by the Foundation." },
  { title: "Vaccination History", body: "Vaccination dates and due dates maintained against the animal's identity." },
  { title: "Rescue History", body: "Where, when and in what condition the animal was rescued." },
  { title: "Adoption Status", body: "Whether the animal is available, fostered or adopted." },
  { title: "Sponsor Information", body: "Recorded where a sponsor has supported the animal's care." },
  { title: "Recovery Timeline", body: "Progress of healing and rehabilitation over time." },
];

function GeoPetIdPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Technology for welfare"
        title="GeoPet ID™"
        description="An animal without identity is an animal without history. GeoPet ID™ gives every rescued animal a traceable, verifiable record of care."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[auto_1fr] lg:items-start">
          <Card className="card-soft lg:w-72">
            <CardContent className="flex flex-col items-center py-10 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <QrCode className="h-10 w-10" />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                Records are visible only where the Foundation has marked them public. Private case details are
                never exposed.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature) => (
              <Card key={feature.title} className="card-soft">
                <CardHeader>
                  <CardTitle className="text-base text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{feature.body}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </SiteLayout>
  );
}
