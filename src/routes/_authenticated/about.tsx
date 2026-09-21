import { createFileRoute } from "@tanstack/react-router";
import { Compass, Flag, HandHeart } from "lucide-react";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/about")({
  head: () => ({
    meta: [
      { title: "Our Vision, Mission & Promise — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "The vision, mission and promise of GeoPetCare Foundation: rescue, treat, feed, sterilize and rehome animals with dignity.",
      },
      { property: "og:title", content: "Our Vision, Mission & Promise — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "One World. One Family. Every Pet Counts. What GeoPetCare Foundation stands for.",
      },
    ],
  }),
  component: AboutPage,
});

const blocks = [
  {
    icon: Compass,
    title: "Our Vision",
    points: [
      "A world where no animal suffers alone, unseen or untreated.",
      "One connected system of care across cities, villages and communities.",
      "Every animal identifiable, traceable and protected through GeoPet ID™.",
    ],
  },
  {
    icon: Flag,
    title: "Our Mission",
    points: [
      "Rescue animals in distress and give them immediate medical care.",
      "Feed community animals through organised feeding zones.",
      "Reduce suffering through humane sterilization and vaccination.",
      "Rehome animals through responsible adoption and fostering.",
      "Build compassion through schools, colleges, volunteers and companies.",
    ],
  },
  {
    icon: HandHeart,
    title: "Our Promise",
    points: [
      "Every animal we take in is treated as family, not a case number.",
      "Every rupee contributed is used for animal welfare work.",
      "Every record we publish is real — we never publish numbers we cannot verify.",
      "Every adopter, foster and volunteer is guided and supported.",
    ],
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="One World. One Family. Every Pet Counts."
        title="Our Vision, Mission & Promise"
        description="GeoPetCare Foundation exists for the animals no one else stops for."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {blocks.map(({ icon: Icon, title, points }) => (
            <Card key={title} className="card-soft">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-xl text-primary">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 text-sm text-muted-foreground">
                  {points.map((point) => (
                    <li key={point} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </SiteLayout>
  );
}
