import { createFileRoute } from "@tanstack/react-router";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/foster")({
  head: () => ({
    meta: [
      { title: "Foster Programme — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Foster a recovering rescued animal with GeoPetCare Foundation. Temporary homes save lives while animals heal.",
      },
      { property: "og:title", content: "Foster Programme — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Open your home temporarily to a rescued animal in recovery.",
      },
    ],
  }),
  component: FosterPage,
});

function FosterPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Temporary homes, permanent impact"
        title="Foster Programme"
        description="A foster home gives a healing animal quiet, safety and attention that a shelter cannot. Fostering is temporary, guided, and always supported by our team."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-primary">What fostering involves</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {[
                  "A safe indoor space for the animal during recovery",
                  "Feeding and medication as advised by our veterinary team",
                  "Regular updates to the Foundation on recovery progress",
                  "Support from our team throughout the fostering period",
                  "Handover to a screened adopter when the animal is ready",
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <EnquiryFormCard
            kind="foster"
            title="Foster application"
            description="Tell us about your home and how you can help."
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "city", label: "City / Area", type: "text" },
              {
                name: "interest",
                label: "Type of animal you can foster",
                type: "select",
                options: ["Puppies / Kittens", "Adult dog", "Adult cat", "Senior animal", "Recovering / medical case", "Any"],
              },
              {
                name: "message",
                label: "About your home and availability",
                type: "textarea",
                placeholder: "Home type, family members, other pets, how long you can foster",
              },
            ]}
            submitLabel="Submit foster application"
          />
        </div>
      </Section>
    </SiteLayout>
  );
}
