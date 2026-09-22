import { createFileRoute } from "@tanstack/react-router";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/roadmap")({
  head: () => ({
    meta: [
      { title: "Our Roadmap — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "The GeoPetCare Foundation roadmap: strengthening rescue response, medical care, feeding zones, sterilization, GeoPet ID™ and city networks.",
      },
      { property: "og:title", content: "Our Roadmap — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "How we plan to grow rescue, care and rehoming capacity, step by step.",
      },
    ],
  }),
  component: RoadmapPage,
});

const stages = [
  {
    stage: "Stage 1",
    title: "Strong rescue foundation",
    body: "Reliable rescue response, emergency medical care and a documented record for every animal we help.",
  },
  {
    stage: "Stage 2",
    title: "Community care at scale",
    body: "Regular feeding zones, sterilization drives and vaccination camps run with local volunteers.",
  },
  {
    stage: "Stage 3",
    title: "Adoption and fostering network",
    body: "A trusted foster network and careful adoption process so recovered animals move into permanent homes.",
  },
  {
    stage: "Stage 4",
    title: "GeoPet ID™ everywhere",
    body: "A QR identity for every animal under our care, carrying medical, vaccination and rescue history.",
  },
  {
    stage: "Stage 5",
    title: "Paws of India™",
    body: "Extending the model city by city through local welfare partners, campuses and CSR collaborations.",
  },
];

function RoadmapPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Roadmap"
        title="Where we are going"
        description="Our roadmap describes the direction of our work. Progress figures are published only once they are recorded and verified by the Foundation."
      />

      <Section>
        <div className="grid gap-5">
          {stages.map((item) => (
            <Card key={item.stage} className="card-soft">
              <CardHeader className="md:grid md:grid-cols-[140px_1fr] md:gap-6">
                <p className="font-display text-sm font-semibold uppercase tracking-wider text-accent">
                  {item.stage}
                </p>
                <div>
                  <CardTitle className="text-lg text-primary">{item.title}</CardTitle>
                  <CardDescription className="mt-2">{item.body}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
