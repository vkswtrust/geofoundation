import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { SignedImage } from "@/components/SignedImage";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { uploadFile } from "@/lib/storage";

type AnimalStatus = "available" | "adopted" | "fostered";

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
  sponsor_info: string | null;
  recovery_timeline: string | null;
  photo_urls: string[];
  status: AnimalStatus;
  is_public: boolean;
};

const textFields = [
  ["name", "Name *"],
  ["species", "Species"],
  ["age", "Age"],
  ["gender", "Gender"],
  ["location", "Location"],
  ["geopet_id", "GeoPet ID™"],
  ["health_status", "Health status"],
  ["vaccination_status", "Vaccination status"],
  ["sterilization_status", "Sterilization status"],
  ["behaviour", "Behaviour"],
] as const;

const longFields = [
  ["rescue_story", "Rescue story"],
  ["description", "Description"],
  ["sponsor_info", "Sponsor information"],
  ["recovery_timeline", "Recovery timeline"],
] as const;

const emptyDraft = {
  name: "",
  species: "",
  age: "",
  gender: "",
  location: "",
  geopet_id: "",
  health_status: "",
  vaccination_status: "",
  sterilization_status: "",
  behaviour: "",
  rescue_story: "",
  description: "",
  sponsor_info: "",
  recovery_timeline: "",
  status: "available" as AnimalStatus,
  is_public: true,
};

type Draft = typeof emptyDraft;

export function AnimalsPanel() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data } = useQuery({
    queryKey: ["admin", "animals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("animals")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Animal[];
    },
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "animals"] });
    void queryClient.invalidateQueries({ queryKey: ["animals", "public"] });
  };

  const create = useMutation({
    mutationFn: async () => {
      if (!draft.name.trim()) throw new Error("Enter the animal's name.");
      const payload = {
        name: draft.name.trim(),
        species: draft.species.trim() || null,
        age: draft.age.trim() || null,
        gender: draft.gender.trim() || null,
        location: draft.location.trim() || null,
        geopet_id: draft.geopet_id.trim() || null,
        health_status: draft.health_status.trim() || null,
        vaccination_status: draft.vaccination_status.trim() || null,
        sterilization_status: draft.sterilization_status.trim() || null,
        behaviour: draft.behaviour.trim() || null,
        rescue_story: draft.rescue_story.trim() || null,
        description: draft.description.trim() || null,
        sponsor_info: draft.sponsor_info.trim() || null,
        recovery_timeline: draft.recovery_timeline.trim() || null,
        status: draft.status,
        is_public: draft.is_public,
        photo_urls: photos,
      };
      const { error } = await supabase.from("animals").insert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Animal added.");
      setDraft(emptyDraft);
      setPhotos([]);
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message || "Could not add the animal."),
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Partial<Animal> }) => {
      const { error } = await supabase
        .from("animals")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Animal updated.");
      invalidate();
    },
    onError: () => toast.error("Could not update the animal."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("animals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Animal removed.");
      invalidate();
    },
    onError: () => toast.error("Could not remove the animal."),
  });

  const onUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const refs: string[] = [];
      for (const file of Array.from(files)) {
        refs.push(await uploadFile("animal-photos", file, "animals/"));
      }
      setPhotos((prev) => [...prev, ...refs]);
    } catch {
      toast.error("Could not upload the photo(s).");
    } finally {
      setUploading(false);
    }
  };

  const addPhotoToExisting = async (animal: Animal, files: FileList) => {
    try {
      const refs: string[] = [];
      for (const file of Array.from(files)) {
        refs.push(await uploadFile("animal-photos", file, "animals/"));
      }
      patch.mutate({ id: animal.id, values: { photo_urls: [...animal.photo_urls, ...refs] } });
    } catch {
      toast.error("Could not upload the photo(s).");
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Add an adoption animal</CardTitle>
          <CardDescription>
            Only animals added here appear on the Adopt page. Nothing is shown until you add it.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            {textFields.map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={`an-${key}`}>{label}</Label>
                <Input
                  id={`an-${key}`}
                  className="mt-1.5"
                  value={draft[key]}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {longFields.map(([key, label]) => (
              <div key={key}>
                <Label htmlFor={`an-${key}`}>{label}</Label>
                <Textarea
                  id={`an-${key}`}
                  className="mt-1.5"
                  value={draft[key]}
                  onChange={(e) => setDraft((prev) => ({ ...prev, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft((prev) => ({ ...prev, status: v as AnimalStatus }))}
              >
                <SelectTrigger className="mt-1.5 w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="adopted">Adopted</SelectItem>
                  <SelectItem value="fostered">Fostered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch
                checked={draft.is_public}
                onCheckedChange={(checked) => setDraft((prev) => ({ ...prev, is_public: checked }))}
              />
              <span className="text-sm">Show on the website</span>
            </div>
            <Label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload photos
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.length) void onUpload(e.target.files);
                }}
              />
            </Label>
          </div>

          {photos.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {photos.map((ref) => (
                <SignedImage
                  key={ref}
                  storageRef={ref}
                  alt="Animal photo"
                  className="h-20 w-20 rounded-md border border-border object-cover"
                />
              ))}
            </div>
          ) : null}

          <Button onClick={() => create.mutate()} disabled={create.isPending} className="w-fit">
            {create.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )}
            Add animal
          </Button>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle className="text-primary">Listed animals</CardTitle>
          <CardDescription>
            {(data ?? []).length === 0
              ? "No animals have been added yet."
              : `${(data ?? []).length} animal(s) in the records.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {(data ?? []).map((animal) => (
            <div key={animal.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-start gap-4">
                {animal.photo_urls[0] ? (
                  <SignedImage
                    storageRef={animal.photo_urls[0]}
                    alt={animal.name}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                ) : null}
                <div className="min-w-[180px] flex-1">
                  <p className="font-display text-base font-semibold text-primary">{animal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[animal.species, animal.age, animal.gender, animal.location]
                      .filter(Boolean)
                      .join(" · ") || "No further details"}
                  </p>
                  {animal.geopet_id ? (
                    <p className="text-xs text-muted-foreground">GeoPet ID™ {animal.geopet_id}</p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={animal.status}
                    onValueChange={(v) => patch.mutate({ id: animal.id, values: { status: v as AnimalStatus } })}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="adopted">Adopted</SelectItem>
                      <SelectItem value="fostered">Fostered</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={animal.is_public}
                      onCheckedChange={(checked) =>
                        patch.mutate({ id: animal.id, values: { is_public: checked } })
                      }
                    />
                    <span className="text-xs text-muted-foreground">Public</span>
                  </div>
                  <Label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-xs">
                    <Upload className="h-3.5 w-3.5" /> Add photo
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.length) void addPhotoToExisting(animal, e.target.files);
                      }}
                    />
                  </Label>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(animal.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div className="mt-3 grid gap-2 md:grid-cols-2">
                <div>
                  <Label className="text-xs">Health status</Label>
                  <Input
                    defaultValue={animal.health_status ?? ""}
                    className="mt-1"
                    onBlur={(e) =>
                      e.target.value !== (animal.health_status ?? "") &&
                      patch.mutate({ id: animal.id, values: { health_status: e.target.value || null } })
                    }
                  />
                </div>
                <div>
                  <Label className="text-xs">Recovery timeline</Label>
                  <Input
                    defaultValue={animal.recovery_timeline ?? ""}
                    className="mt-1"
                    onBlur={(e) =>
                      e.target.value !== (animal.recovery_timeline ?? "") &&
                      patch.mutate({ id: animal.id, values: { recovery_timeline: e.target.value || null } })
                    }
                  />
                </div>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Save className="h-3 w-3" /> Changes save when you leave a field.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
