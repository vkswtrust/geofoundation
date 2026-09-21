import { createFileRoute } from "@tanstack/react-router";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/_authenticated/volunteer")({
  head: () => ({
    meta: [
      { title: "Volunteer With Us — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Volunteer with GeoPetCare Foundation as an animal rescuer, foster parent, feeding volunteer, event volunteer, veterinary volunteer, student volunteer or CSR volunteer.",
      },
      { property: "og:title", content: "Volunteer With Us — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Give your time to animals in need. Choose the volunteer role that fits you.",
      },
    ],
  }),
  component: VolunteerPage,
});

function VolunteerPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Get involved"
        title="Volunteer With Us"
        description="Rescue work runs on people. Choose one or more roles and our team will guide you from there."
      />
      <Section>
        <EnquiryFormCard
          kind="volunteer"
          title="Volunteer application"
          description="Select the roles you are interested in and tell us about your availability."
          fields={[
            { name: "name", label: "Full name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "city", label: "City / Area", type: "text" },
            {
              name: "roles",
              label: "Volunteer roles",
              type: "checkboxes",
              required: true,
              options: [
                "Animal Rescuer",
                "Foster Parent",
                "Feeding Volunteer",
                "Event Volunteer",
                "Veterinary Volunteer",
                "Student Volunteer",
                "CSR Volunteer",
              ],
            },
            {
              name: "message",
              label: "Availability and anything you would like us to know",
              type: "textarea",
              placeholder: "Days and hours you are free, skills, experience with animals",
            },
          ]}
          submitLabel="Submit volunteer application"
        />
      </Section>
    </SiteLayout>
  );
}
