import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitEnquiry, type EnquiryKind, type EnquiryPayload } from "@/lib/enquiries";

export interface FieldSpec {
  name: keyof EnquiryPayload;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkboxes";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

export function EnquiryFormCard({
  kind,
  title,
  description,
  fields,
  submitLabel = "Submit",
  defaults,
}: {
  kind: EnquiryKind;
  title: string;
  description?: string;
  fields: FieldSpec[];
  submitLabel?: string;
  defaults?: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>({ ...defaults });
  const [checks, setChecks] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const toggle = (name: string, option: string) =>
    setChecks((c) => {
      const current = c[name] ?? [];
      return {
        ...c,
        [name]: current.includes(option) ? current.filter((o) => o !== option) : [...current, option],
      };
    });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    try {
      const payload: Record<string, unknown> = {};
      for (const field of fields) {
        if (field.type === "checkboxes") {
          const selected = checks[field.name as string] ?? [];
          if (field.required && selected.length === 0) {
            throw new Error(`Please select at least one option for ${field.label}.`);
          }
          payload[field.name as string] = selected.length ? selected : null;
          continue;
        }
        const raw = (values[field.name as string] ?? "").trim();
        if (field.required && !raw) throw new Error(`${field.label} is required.`);
        if (field.type === "email" && raw && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw)) {
          throw new Error("Please enter a valid email address.");
        }
        payload[field.name as string] = raw.length ? raw.slice(0, 2000) : null;
      }
      payload["name"] = (payload["name"] as string | null) ?? (values["name"] ?? "");
      await submitEnquiry(kind, payload as unknown as EnquiryPayload);
      setDone(true);
      toast.success("Thank you — your submission has been received.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not submit. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Submission received</CardTitle>
          <CardDescription>
            Your details have been saved and are now with the GeoPetCare Foundation team. You can view your
            submissions on your profile page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-5 md:grid-cols-2">
          {fields.map((field) => {
            const id = `f-${String(field.name)}`;
            const wide = field.type === "textarea" || field.type === "checkboxes";
            return (
              <div key={String(field.name)} className={wide ? "md:col-span-2" : undefined}>
                <Label htmlFor={id}>
                  {field.label}
                  {field.required ? <span className="text-destructive"> *</span> : null}
                </Label>
                <div className="mt-2">
                  {field.type === "textarea" ? (
                    <Textarea
                      id={id}
                      rows={5}
                      maxLength={2000}
                      placeholder={field.placeholder}
                      value={values[field.name as string] ?? ""}
                      onChange={(e) => set(field.name as string, e.target.value)}
                    />
                  ) : field.type === "select" ? (
                    <Select
                      value={values[field.name as string] ?? ""}
                      onValueChange={(v) => set(field.name as string, v)}
                    >
                      <SelectTrigger id={id}>
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        {(field.options ?? []).map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "checkboxes" ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {(field.options ?? []).map((option) => (
                        <label key={option} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={(checks[field.name as string] ?? []).includes(option)}
                            onCheckedChange={() => toggle(field.name as string, option)}
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <Input
                      id={id}
                      type={field.type}
                      maxLength={255}
                      placeholder={field.placeholder}
                      value={values[field.name as string] ?? ""}
                      onChange={(e) => set(field.name as string, e.target.value)}
                    />
                  )}
                </div>
              </div>
            );
          })}
          <div className="md:col-span-2">
            <Button type="submit" disabled={busy} className="accent-surface">
              {busy ? "Submitting…" : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
