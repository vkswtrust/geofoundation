import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SignedImage } from "@/components/SignedImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { EnquiryKind } from "@/lib/enquiries";
import { uploadFile } from "@/lib/storage";

function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-10 text-center text-sm text-muted-foreground">
        {text}
      </TableCell>
    </TableRow>
  );
}

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

/* ---------------------------------- Users --------------------------------- */

export function UsersPanel() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, created_at, last_login_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const rows = (data ?? []).filter((row) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${row.full_name ?? ""} ${row.email ?? ""} ${row.id}`.toLowerCase().includes(q);
  });

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="text-primary">Registered users</CardTitle>
        <CardDescription>
          Account details captured at sign-in. Passwords are never stored or shown here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search by name, email or user ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4 max-w-sm"
        />
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <EmptyRow colSpan={5} text="Loading…" />
              ) : rows.length === 0 ? (
                <EmptyRow colSpan={5} text="No users found." />
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          {row.avatar_url ? <AvatarImage src={row.avatar_url} alt="" /> : null}
                          <AvatarFallback className="text-[10px]">
                            {(row.full_name ?? row.email ?? "U").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{row.full_name ?? "—"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{row.email ?? "—"}</TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">{row.id}</TableCell>
                    <TableCell className="text-xs">{formatDate(row.created_at)}</TableCell>
                    <TableCell className="text-xs">{formatDate(row.last_login_at)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------- Enquiries ------------------------------- */

const statuses = ["new", "in_progress", "closed"] as const;
type Status = (typeof statuses)[number];

const statusLabels: Record<Status, string> = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
};

export function EnquiriesPanel({
  kinds,
  title,
  description,
  showKind = false,
}: {
  kinds: EnquiryKind[];
  title: string;
  description: string;
  showKind?: boolean;
}) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "enquiries", kinds.join(",")],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .in("kind", kinds)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("enquiries").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "enquiries"] });
    },
    onError: () => toast.error("Could not update the status."),
  });

  const rows = (data ?? []).filter((row) => {
    if (statusFilter !== "all" && row.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return `${row.name} ${row.email} ${row.phone ?? ""} ${row.organisation ?? ""} ${row.subject ?? ""} ${row.message ?? ""}`
      .toLowerCase()
      .includes(q);
  });

  return (
    <Card className="card-soft">
      <CardHeader>
        <CardTitle className="text-primary">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-3">
          <Input
            placeholder="Search submissions"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | Status)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <p className="py-10 text-center text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No submissions yet.</p>
        ) : (
          <div className="grid gap-4">
            {rows.map((row) => (
              <div key={row.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-base font-semibold text-primary">{row.name}</p>
                    <p className="text-sm text-muted-foreground">{row.email}</p>
                    {row.phone ? <p className="text-sm text-muted-foreground">{row.phone}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {showKind ? <Badge variant="secondary">{row.kind}</Badge> : null}
                    <Select
                      value={row.status}
                      onValueChange={(v) => update.mutate({ id: row.id, status: v as Status })}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-3 grid gap-1 text-sm text-muted-foreground">
                  {row.city ? <p>City: {row.city}</p> : null}
                  {row.organisation ? <p>Organisation: {row.organisation}</p> : null}
                  {row.contact_person ? <p>Contact person: {row.contact_person}</p> : null}
                  {row.interest ? <p>Interest: {row.interest}</p> : null}
                  {row.roles && row.roles.length > 0 ? <p>Roles: {row.roles.join(", ")}</p> : null}
                  {row.amount != null ? <p>Amount indicated: ₹{Number(row.amount).toLocaleString("en-IN")}</p> : null}
                  {row.subject ? <p>Subject: {row.subject}</p> : null}
                  {row.message ? <p className="whitespace-pre-wrap text-foreground/90">{row.message}</p> : null}
                </div>

                <p className="mt-3 text-[11px] text-muted-foreground">
                  User ID: <span className="font-mono">{row.user_id ?? "—"}</span> · {formatDate(row.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* -------------------------------- Donations ------------------------------- */

export function DonationsPanel() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    amount: "",
    method: "",
    reference: "",
    purpose: "",
    received_on: "",
    notes: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "donations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const add = useMutation({
    mutationFn: async () => {
      if (!form.donor_name.trim() || !form.amount.trim()) {
        throw new Error("Donor name and amount are required.");
      }
      const amount = Number(form.amount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Enter a valid amount.");
      const { error } = await supabase.from("donations").insert({
        donor_name: form.donor_name.trim(),
        donor_email: form.donor_email.trim() || null,
        donor_phone: form.donor_phone.trim() || null,
        amount,
        method: form.method.trim() || null,
        reference: form.reference.trim() || null,
        purpose: form.purpose.trim() || null,
        received_on: form.received_on || null,
        notes: form.notes.trim() || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Donation record saved.");
      setForm({
        donor_name: "",
        donor_email: "",
        donor_phone: "",
        amount: "",
        method: "",
        reference: "",
        purpose: "",
        received_on: "",
        notes: "",
      });
      void queryClient.invalidateQueries({ queryKey: ["admin", "donations"] });
    },
    onError: (error: Error) => toast.error(error.message || "Could not save the donation."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("donations").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Donation record removed.");
      void queryClient.invalidateQueries({ queryKey: ["admin", "donations"] });
    },
    onError: () => toast.error("Could not remove the record."),
  });

  const total = (data ?? []).reduce((sum, row) => sum + Number(row.amount ?? 0), 0);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Record a received donation</CardTitle>
          <CardDescription>Only real, received donations should be recorded here.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {(
            [
              ["donor_name", "Donor name *", "text"],
              ["donor_email", "Donor email", "email"],
              ["donor_phone", "Donor phone", "tel"],
              ["amount", "Amount (₹) *", "number"],
              ["method", "Method (UPI / bank / cash)", "text"],
              ["reference", "Reference / transaction ID", "text"],
              ["purpose", "Purpose", "text"],
              ["received_on", "Received on", "date"],
            ] as const
          ).map(([name, label, type]) => (
            <div key={name}>
              <Label htmlFor={`don-${name}`}>{label}</Label>
              <Input
                id={`don-${name}`}
                type={type}
                className="mt-1.5"
                value={form[name]}
                onChange={(e) => setForm((prev) => ({ ...prev, [name]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="don-notes">Notes</Label>
            <Textarea
              id="don-notes"
              className="mt-1.5"
              value={form.notes}
              onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            {add.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Save donation
          </Button>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Donation records</CardTitle>
          <CardDescription>
            {data && data.length > 0
              ? `${data.length} record(s) · ₹${total.toLocaleString("en-IN")} recorded`
              : "No donations recorded yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Received</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <EmptyRow colSpan={5} text="Loading…" />
              ) : (data ?? []).length === 0 ? (
                <EmptyRow colSpan={5} text="No donation records." />
              ) : (
                (data ?? []).map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{row.donor_name}</p>
                      <p className="text-xs text-muted-foreground">{row.donor_email ?? row.donor_phone ?? ""}</p>
                    </TableCell>
                    <TableCell className="text-sm">₹{Number(row.amount).toLocaleString("en-IN")}</TableCell>
                    <TableCell className="text-sm">{row.method ?? "—"}</TableCell>
                    <TableCell className="text-xs">{row.received_on ?? formatDate(row.created_at)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => remove.mutate(row.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ---------------------------- Donation settings --------------------------- */

const settingFields = [
  ["account_name", "Account name"],
  ["bank_name", "Bank name"],
  ["bank_address", "Bank branch / address"],
  ["account_number", "Account number"],
  ["ifsc_code", "IFSC code"],
  ["upi_id", "UPI ID"],
] as const;

export function DonationSettingsPanel() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Record<string, string> | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["donation-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("donation_settings").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const value = (key: string) =>
    (draft ? draft[key] : undefined) ?? (data as Record<string, string | null> | null)?.[key] ?? "";

  const set = (key: string, next: string) => setDraft((prev) => ({ ...(prev ?? {}), [key]: next }));

  const save = useMutation({
    mutationFn: async (extra?: Record<string, string | null>) => {
      const payload: Record<string, string | null> = { id: true as unknown as string };
      for (const [key] of settingFields) payload[key] = value(key).trim() || null;
      payload["notes"] = value("notes").trim() || null;
      payload["qr_image_url"] =
        extra?.["qr_image_url"] ?? ((data as { qr_image_url?: string | null } | null)?.qr_image_url ?? null);
      const { error } = await supabase
        .from("donation_settings")
        .upsert({ ...payload, id: true } as never, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Donation details saved. They now appear on the Sponsor A Life page.");
      setDraft(null);
      void queryClient.invalidateQueries({ queryKey: ["donation-settings"] });
    },
    onError: () => toast.error("Could not save the donation details."),
  });

  const onUpload = async (file: File) => {
    setUploading(true);
    try {
      const ref = await uploadFile("site-assets", file, "donation-qr/");
      await save.mutateAsync({ qr_image_url: ref });
    } catch {
      toast.error("Could not upload the QR image.");
    } finally {
      setUploading(false);
    }
  };

  const qr = (data as { qr_image_url?: string | null } | null)?.qr_image_url ?? null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Donation details</CardTitle>
          <CardDescription>
            Whatever you save here is shown on the Sponsor A Life page. Leave a field empty to hide it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {settingFields.map(([key, label]) => (
            <div key={key}>
              <Label htmlFor={`ds-${key}`}>{label}</Label>
              <Input
                id={`ds-${key}`}
                className="mt-1.5"
                value={value(key)}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
          <div>
            <Label htmlFor="ds-notes">Notes shown to donors</Label>
            <Textarea
              id="ds-notes"
              className="mt-1.5"
              value={value("notes")}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>
          <Button onClick={() => save.mutate(undefined)} disabled={save.isPending}>
            {save.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save details
          </Button>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Payment QR image</CardTitle>
          <CardDescription>Upload the QR code image donors should scan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {qr ? (
            <SignedImage storageRef={qr} alt="Payment QR code" className="w-full rounded-lg border border-border" />
          ) : (
            <p className="text-sm text-muted-foreground">No QR image uploaded yet.</p>
          )}
          <Label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {qr ? "Replace QR image" : "Upload QR image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onUpload(file);
              }}
            />
          </Label>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------ Impact stats ------------------------------ */

export function ImpactPanel() {
  const queryClient = useQueryClient();
  const [label, setLabel] = useState("");
  const [statValue, setStatValue] = useState("");

  const { data } = useQuery({
    queryKey: ["impact-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["impact-stats"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      if (!label.trim()) throw new Error("Enter a label.");
      const numeric = statValue.trim() === "" ? null : Number(statValue);
      if (numeric != null && !Number.isFinite(numeric)) throw new Error("Enter a valid number.");
      const { error } = await supabase.from("impact_stats").insert({
        label: label.trim(),
        value: numeric,
        display_order: (data?.length ?? 0) + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statistic added.");
      setLabel("");
      setStatValue("");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Could not add the statistic."),
  });

  const update = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const numeric = next.trim() === "" ? null : Number(next);
      if (numeric != null && !Number.isFinite(numeric)) throw new Error("Enter a valid number.");
      const { error } = await supabase
        .from("impact_stats")
        .update({ value: numeric, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statistic updated.");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Could not update the statistic."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("impact_stats").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Statistic removed.");
      invalidate();
    },
    onError: () => toast.error("Could not remove the statistic."),
  });

  return (
    <div className="grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Add a statistic</CardTitle>
          <CardDescription>
            Leave the number empty to show “Data will be updated soon.” on the website.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div>
            <Label htmlFor="stat-label">Label</Label>
            <Input
              id="stat-label"
              className="mt-1.5"
              placeholder="Animals rescued"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="stat-value">Number (optional)</Label>
            <Input
              id="stat-value"
              type="number"
              className="mt-1.5"
              value={statValue}
              onChange={(e) => setStatValue(e.target.value)}
            />
          </div>
          <Button onClick={() => add.mutate()} disabled={add.isPending}>
            <Plus className="mr-2 h-4 w-4" /> Add statistic
          </Button>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Impact statistics</CardTitle>
          <CardDescription>Only statistics with a number are shown as figures on the website.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          {(data ?? []).length === 0 ? (
            <p className="py-6 text-sm text-muted-foreground">No statistics added yet.</p>
          ) : (
            (data ?? []).map((row) => (
              <div key={row.id} className="flex flex-wrap items-end gap-3 rounded-lg border border-border p-3">
                <div className="min-w-[160px] flex-1">
                  <p className="text-sm font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.value == null ? "Data will be updated soon." : "Published"}
                  </p>
                </div>
                <Input
                  type="number"
                  defaultValue={row.value ?? ""}
                  className="w-32"
                  onBlur={(e) => {
                    const next = e.target.value;
                    if (next !== String(row.value ?? "")) update.mutate({ id: row.id, next });
                  }}
                />
                <Button variant="ghost" size="icon" onClick={() => remove.mutate(row.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
