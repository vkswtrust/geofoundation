import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Users } from "lucide-react";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/schools")({
  head: () => ({
    meta: [
      { title: "Schools & Colleges — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Compassion education, awareness sessions and student volunteering programmes for schools and colleges with GeoPetCare Foundation.",
      },
      { property: "og:title", content: "Schools & Colleges — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Bring animal welfare education and student volunteering to your campus.",
      },
    ],
  }),
  component: SchoolsPage,
});

const offerings = [
  {
    icon: BookOpen,
    title: "Compassion education",
    body: "Interactive sessions on kindness to animals, responsible pet care and community coexistence.",
  },
  {
    icon: Users,
    title: "Student volunteering",
    body: "Structured volunteering in feeding drives, awareness campaigns and adoption events.",
  },
  {
    icon: GraduationCap,
    title: "Campus partnerships",
    body: "Long-term collaboration with NSS units, clubs and departments for animal welfare projects.",
  },
];

function SchoolsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Schools & Colleges"
        title="Raising a generation that chooses kindness"
        description="We work with schools and colleges to build awareness, empathy and practical animal welfare skills among students."
      />

      <Section title="What we offer campuses">
        <div className="grid gap-5 md:grid-cols-3">
          {offerings.map(({ icon: Icon, title, body }) => (
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

      <Section title="Invite us to your campus">
        <EnquiryFormCard
          kind="general"
          title="Schools & colleges enquiry"
          description="Share your institution details and the kind of programme you would like to host."
          fields={[
            { name: "name", label: "Your name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "organisation", label: "School / college name", type: "text", required: true },
            { name: "city", label: "City", type: "text" },
            {
              name: "interest",
              label: "Programme interest",
              type: "select",
              options: [
                "Compassion education session",
                "Student volunteering",
                "Awareness campaign",
                "Campus partnership",
              ],
            },
            { name: "message", label: "Message", type: "textarea" },
          ]}
          submitLabel="Send enquiry"
        />
      </Section>
    </SiteLayout>
  );
}
