import { createFileRoute } from "@tanstack/react-router";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/contact")({
  head: () => ({
    meta: [
      { title: "Contact / Enquiry — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Contact GeoPetCare Foundation about rescue, medical care, feeding, sterilization, adoption, fostering, volunteering or partnerships.",
      },
      { property: "og:title", content: "Contact / Enquiry — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Send us your enquiry and the GeoPetCare Foundation team will get back to you.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Contact / Enquiry"
        title="Talk to the GeoPetCare Foundation team"
        description="Use this form for rescue queries, adoption and fostering questions, volunteering, partnerships or anything else."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]">
          <EnquiryFormCard
            kind="contact"
            title="Send an enquiry"
            description="Your enquiry is saved securely and is visible only to you and the Foundation team."
            fields={[
              { name: "name", label: "Full name", type: "text", required: true },
              { name: "email", label: "Email", type: "email", required: true },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "city", label: "City", type: "text" },
              { name: "subject", label: "Subject", type: "text" },
              { name: "message", label: "Message", type: "textarea", required: true },
            ]}
            submitLabel="Send enquiry"
          />

          <Card className="card-soft">
            <CardContent className="grid gap-4 py-8 text-sm text-muted-foreground">
              <div>
                <p className="font-display text-base font-semibold text-primary">Website</p>
                <p className="mt-1">www.GeoPetCare.org</p>
              </div>
              <div>
                <p className="font-display text-base font-semibold text-primary">Response</p>
                <p className="mt-1">
                  Enquiries are reviewed by the Foundation team and answered by email or phone.
                </p>
              </div>
              <div>
                <p className="font-display text-base font-semibold text-primary">Your privacy</p>
                <p className="mt-1">
                  Only you and the Foundation team can see what you submit. Other users never see your details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>
    </SiteLayout>
  );
}
