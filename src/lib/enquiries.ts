import { supabase } from "@/integrations/supabase/client";

export type EnquiryKind =
  | "general"
  | "volunteer"
  | "foster"
  | "adoption"
  | "csr"
  | "sponsorship"
  | "contact";

export interface EnquiryPayload {
  name: string;
  email: string;
  phone?: string | null;
  city?: string | null;
  organisation?: string | null;
  contact_person?: string | null;
  interest?: string | null;
  roles?: string[] | null;
  amount?: number | null;
  animal_id?: string | null;
  subject?: string | null;
  message?: string | null;
}

export async function submitEnquiry(kind: EnquiryKind, payload: EnquiryPayload) {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error("You need to be signed in to submit this form.");

  const { error } = await supabase.from("enquiries").insert({
    kind,
    user_id: userId,
    ...payload,
  });
  if (error) throw error;
}

export const enquiryKindLabels: Record<EnquiryKind, string> = {
  general: "General Enquiries",
  volunteer: "Volunteer Applications",
  foster: "Foster Applications",
  adoption: "Adoption Enquiries",
  csr: "CSR Enquiries",
  sponsorship: "Sponsorship Enquiries",
  contact: "Contact Enquiries",
};
