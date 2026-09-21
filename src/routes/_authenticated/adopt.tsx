import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { SignedImage } from "@/components/SignedImage";
import { PageHero, Section, SiteLayout } from "@/components/site/SiteLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { submitEnquiry } from "@/lib/enquiries";

export const Route = createFileRoute("/_authenticated/adopt")({
  head: () => ({
    meta: [
      { title: "Adopt. Don't Shop. — GeoPetCare Foundation" },
      {
        name: "description",
        content:
          "Meet the rescued animals listed for adoption by GeoPetCare Foundation and submit an adoption enquiry.",
      },
      { property: "og:title", content: "Adopt. Don't Shop. — GeoPetCare Foundation" },
      {
        property: "og:description",
        content: "Adopt a rescued animal from GeoPetCare Foundation. Every Paw Deserves Love.",
      },
    ],
  }),
  component: AdoptPage,
});

type Animal = {
  id: string;
  name: string;
  species: string | null;
  age: string | null;
  gender: string | null;
  location: string | null;
  rescue_story: string | null;
  health_status: string | null;
  vaccination_status: string | null;
  sterilization_status: string | null;
  behaviour: string | null;
  description: string | null;
  geopet_id: string | null;
  photo_urls: string[];
  status: "available" | "adopted" | "fostered";
};

const statusLabel: Record<Animal["status"], string> = {
  available: "Available",
  adopted: "Adopted",
  fostered: "Fostered",
};

function AdoptPage() {
  const [selected, setSelected] = useState<Animal | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["animals", "public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animals")
        .select(
          "id, name, species, age, gender, location, rescue_story, health_status, vaccination_status, sterilization_status, behaviour, description, geopet_id, photo_urls, status",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Animal[];
    },
  });

  const animals = data ?? [];

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Adoption"
        title="Adopt. Don't Shop."
        description="Every animal listed here was rescued, treated and cared for by GeoPetCare Foundation. Adoption is free of cost and follows a simple screening process."
      />

      <Section>
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : animals.length === 0 ? (
          <Card className="card-soft">
            <CardContent className="py-14 text-center text-muted-foreground">
              No animals are currently listed for adoption. Please check back soon.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {animals.map((animal) => (
              <Card key={animal.id} className="overflow-hidden card-soft">
                {animal.photo_urls[0] ? (
                  <SignedImage
                    storageRef={animal.photo_urls[0]}
                    alt={animal.name}
                    className="h-56 w-full object-cover"
                  />
                ) : null}
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg text-primary">{animal.name}</CardTitle>
                    <Badge variant={animal.status === "available" ? "default" : "secondary"}>
                      {statusLabel[animal.status]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {[animal.species, animal.gender, animal.age, animal.location]
                      .filter(Boolean)
                      .join(" • ") || null}
                  </p>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {animal.description ? (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{animal.description}</p>
                  ) : null}
                  {animal.geopet_id ? (
                    <p className="text-xs text-muted-foreground">GeoPet ID™: {animal.geopet_id}</p>
                  ) : null}
                  <Button className="accent-surface" onClick={() => setSelected(animal)}>
                    Interested in adoption
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <AdoptionDialog animal={selected} onClose={() => setSelected(null)} />
    </SiteLayout>
  );
}

function AdoptionDialog({ animal, onClose }: { animal: Animal | null; onClose: () => void }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!animal) return;
    setBusy(true);
    try {
      await submitEnquiry("adoption", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        city: form.city.trim() || null,
        animal_id: animal.id,
        subject: `Adoption enquiry — ${animal.name}`,
        message: form.message.trim() || null,
      });
      toast.success("Your adoption enquiry has been sent to the Foundation.");
      setForm({ name: "", email: "", phone: "", city: "", message: "" });
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit your enquiry.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={Boolean(animal)} onOpenChange={(open) => (!open ? onClose() : undefined)}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary">Adoption enquiry — {animal?.name}</DialogTitle>
          <DialogDescription>
            Share your details and the team will contact you about the next steps.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4">
          <div>
            <Label htmlFor="a-name">Your name *</Label>
            <Input
              id="a-name"
              required
              className="mt-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="a-email">Email *</Label>
            <Input
              id="a-email"
              type="email"
              required
              className="mt-2"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="a-phone">Phone</Label>
              <Input
                id="a-phone"
                className="mt-2"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="a-city">City</Label>
              <Input
                id="a-city"
                className="mt-2"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="a-message">Tell us about your home</Label>
            <Textarea
              id="a-message"
              rows={4}
              className="mt-2"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
          <Button type="submit" disabled={busy} className="accent-surface">
            {busy ? "Submitting…" : "Send enquiry"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
