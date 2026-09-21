import { createFileRoute } from "@tanstack/react-router";
import { Ambulance, PawPrint, Scissors, Soup, Stethoscope } from "lucide-react";

import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/programmes")({
  head: () => ({
    meta: [
      { title: "Programmes — Rescue, Medical Care, Feeding, Sterilization, Ambulance" },
      {
        name: "description",
        content:
          "GeoPetCare Foundation programmes: rescue, emergency medical care, community feeding, sterilization and the animal ambulance service.",
      },
      { property: "og:title", content: "Programmes — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Rescue, emergency medical care, community feeding, sterilization and animal ambulance.",
      },
    ],
  }),
  component: ProgrammesPage,
});

const programmes = [
  {
    id: "rescue",
    icon: PawPrint,
    title: "Rescue",
    body: "We respond to reports of animals that are injured, trapped, abandoned or in danger. Each rescue is assessed on site, stabilised and moved to care.",
    points: [
      "Accident and injury rescue",
      "Abandoned puppies, kittens and senior animals",
      "Animals trapped in drains, construction sites and traffic",
      "Case handover to medical care and recovery",
    ],
  },
  {
    id: "emergency-medical-care",
    icon: Stethoscope,
    title: "Emergency Medical Care",
    body: "Rescued animals receive immediate veterinary attention — wound management, treatment for infection and disease, surgery where required, and recovery support until they are fit.",
    points: [
      "First aid and stabilisation",
      "Veterinary treatment and surgery",
      "Medication, dressing and follow-up care",
      "Recovery and rehabilitation tracking",
    ],
  },
  {
    id: "community-feeding",
    icon: Soup,
    title: "Community Feeding",
    body: "Community animals depend on daily kindness. We organise feeding zones so that food reaches the same animals consistently, along with clean water and health observation.",
    points: [
      "Identified and mapped feeding zones",
      "Regular feeding schedules with volunteers",
      "Water points during summer months",
      "Early detection of sick or injured animals while feeding",
    ],
  },
  {
    id: "sterilization-programme",
    icon: Scissors,
    title: "Sterilization Programme",
    body: "Sterilization is the only humane and lasting way to control street animal populations. Animals are sterilized, vaccinated, marked and returned to their own territory after recovery.",
    points: [
      "Catch, sterilize, vaccinate, release protocol",
      "Post-operative observation and after-care",
      "Anti-rabies vaccination",
      "Reduced conflict and healthier community animals",
    ],
  },
  {
    id: "animal-ambulance",
    icon: Ambulance,
    title: "Animal Ambulance",
    body: "An equipped vehicle is the difference between a rescue and a loss. The GeoPet ambulance service supports emergency pick-ups, hospital transfers, sterilization drives and adoption handovers.",
    points: [
      "Emergency transport for critical cases",
      "Transfers to veterinary facilities",
      "Support for sterilization and vaccination drives",
      "Safe transport for adoption and fostering",
    ],
  },
];

function ProgrammesPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our work"
        title="Programmes"
        description="Rescue, emergency medical care, community feeding, sterilization and animal ambulance — one continuous chain of care."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          {programmes.map(({ icon: Icon, title, body, points, id }) => (
            <Card key={id} id={id} className="card-soft scroll-mt-24">
              <CardHeader>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-xl text-primary">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{body}</p>
                <ul className="mt-4 grid gap-2 text-sm">
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
