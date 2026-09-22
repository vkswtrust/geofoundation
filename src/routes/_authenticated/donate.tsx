import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { HeartHandshake } from "lucide-react";

import { EnquiryFormCard } from "@/components/site/EnquiryFormCard";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { SignedImage } from "@/components/SignedImage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/donate")({
  head: () => ({
    meta: [
      { title: "Sponsor A Life — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Sponsor feeding, vaccination, treatment, rehabilitation, sterilization or a rescue vehicle day with GeoPetCare Foundation.",
      },
      { property: "og:title", content: "Sponsor A Life — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Choose a sponsorship level and support rescue, treatment and feeding of animals in need.",
      },
    ],
  }),
  component: DonatePage,
});

const tiers = [
  { amount: "₹500", body: "Feed an animal" },
  { amount: "₹2,500", body: "Vaccinate or treat an animal" },
  { amount: "₹5,000", body: "One month of rehabilitation" },
  { amount: "₹10,000", body: "Sterilization + complete medical care" },
  { amount: "₹25,000", body: "Support a community feeding zone" },
  { amount: "₹50,000", body: "Run a GeoPet Rescue Vehicle for one day" },
  { amount: "₹1,00,000", body: "Become a City Welfare Partner" },
];

export function useDonationSettings() {
  return useQuery({
    queryKey: ["donation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("donation_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

function DonatePage() {
  const { data: settings } = useDonationSettings();

  const rows: { label: string; value: string | null | undefined }[] = [
    { label: "Account name", value: settings?.account_name },
    { label: "Bank", value: settings?.bank_name },
    { label: "Branch address", value: settings?.bank_address },
    { label: "Account number", value: settings?.account_number },
    { label: "IFSC code", value: settings?.ifsc_code },
    { label: "UPI ID", value: settings?.upi_id },
  ].filter((row) => Boolean(row.value && String(row.value).trim()));

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Sponsor A Life"
        title="Be the reason an animal survives today"
        description="These are suggested sponsorship levels. Every contribution is used for rescue, treatment, feeding, sterilization and rehoming."
      />

      <Section title="Sponsorship levels" description="Suggested amounts only — choose what works for you.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <Card key={tier.amount} className="card-soft">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-primary">{tier.amount}</CardTitle>
                <CardDescription>{tier.body}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Payment details">
        {rows.length === 0 && !settings?.qr_image_url ? (
          <Card className="card-soft">
            <CardContent className="py-10 text-center text-muted-foreground">
              Data will be updated soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_.8fr]">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <HeartHandshake className="h-5 w-5" /> Bank transfer
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {rows.map((row) => (
                  <div key={row.label} className="grid gap-0.5 border-b border-border/60 pb-3 last:border-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{row.label}</p>
                    <p className="text-sm font-medium text-foreground">{row.value}</p>
                  </div>
                ))}
                {settings?.notes ? (
                  <p className="text-sm text-muted-foreground">{settings.notes}</p>
                ) : null}
              </CardContent>
            </Card>

            {settings?.qr_image_url ? (
              <Card className="card-soft">
                <CardHeader>
                  <CardTitle className="text-primary">Scan to pay</CardTitle>
                </CardHeader>
                <CardContent>
                  <SignedImage
                    storageRef={settings.qr_image_url}
                    alt="Payment QR code"
                    className="w-full rounded-xl object-contain"
                  />
                </CardContent>
              </Card>
            ) : null}
          </div>
        )}
      </Section>

      <Section title="Tell us about your sponsorship">
        <EnquiryFormCard
          kind="sponsorship"
          title="Sponsorship enquiry"
          description="Share your details and we will get back to you with sponsorship options and confirmation."
          fields={[
            { name: "name", label: "Full name", type: "text", required: true },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "phone", label: "Phone", type: "tel" },
            { name: "city", label: "City", type: "text" },
            {
              name: "interest",
              label: "Sponsorship level",
              type: "select",
              options: tiers.map((t) => `${t.amount} — ${t.body}`),
            },
            { name: "message", label: "Message", type: "textarea" },
          ]}
          submitLabel="Send sponsorship enquiry"
        />
      </Section>
    </SiteLayout>
  );
}
