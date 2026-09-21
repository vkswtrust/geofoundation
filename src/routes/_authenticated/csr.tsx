import { createFileRoute } from "@tanstack/react-router";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/csr")({
  head: () => ({
    meta: [
      { title: "Corporate CSR — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Partner with GeoPetCare Foundation through corporate CSR: sterilization drives, feeding zones, ambulance support, medical camps and employee volunteering.",
      },
      { property: "og:title", content: "Corporate CSR — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Bring your organisation into measurable animal welfare work.",
      },
    ],
  }),
  component: CsrPage,
});

const areas = [
  "Sterilization and vaccination drives",
  "Community feeding zones",
  "Animal ambulance support",
  "Emergency medical and rescue support",
  "GeoPet ID™ identity programme",
  "Employee volunteering and awareness sessions",
];

function CsrPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Partnerships"
        title="Corporate CSR"
        description="Structured, reportable animal welfare programmes your organisation can support — with clear activity records."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="text-primary">Areas of partnership</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-3 text-sm text-muted-foreground">
                {areas.map((area) => (
                  <li key={area} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {area}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <EnquiryFormCard
            kind="csr"
            title="CSR enquiry"
            description="Share your organisation's details and our team will respond with a proposal."
            fields={[
              { name: "organisation", label: "Organisation / Company name", type: "text", required: true },
              { name: "contact_person", label: "Contact person", type: "text", required: true },
              { name: "name", label: "Name for our records", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "interest", label: "CSR interest", type: "select", options: areas },
              { name: "message", label: "Message", type: "textarea" },
            ]}
            submitLabel="Submit CSR enquiry"
          />
        </div>
      </Section>
    </SiteLayout>
  );
}
