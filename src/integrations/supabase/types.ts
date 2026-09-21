export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      animals: {
        Row: {
          age: string | null
          behaviour: string | null
          created_at: string
          description: string | null
          gender: string | null
          geopet_id: string | null
          health_status: string | null
          id: string
          is_public: boolean
          location: string | null
          name: string
          photo_urls: string[]
          recovery_timeline: string | null
          rescue_story: string | null
          species: string | null
          sponsor_info: string | null
          status: Database["public"]["Enums"]["animal_status"]
          sterilization_status: string | null
          updated_at: string
          vaccination_status: string | null
        }
        Insert: {
          age?: string | null
          behaviour?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          geopet_id?: string | null
          health_status?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          name: string
          photo_urls?: string[]
          recovery_timeline?: string | null
          rescue_story?: string | null
          species?: string | null
          sponsor_info?: string | null
          status?: Database["public"]["Enums"]["animal_status"]
          sterilization_status?: string | null
          updated_at?: string
          vaccination_status?: string | null
        }
        Update: {
          age?: string | null
          behaviour?: string | null
          created_at?: string
          description?: string | null
          gender?: string | null
          geopet_id?: string | null
          health_status?: string | null
          id?: string
          is_public?: boolean
          location?: string | null
          name?: string
          photo_urls?: string[]
          recovery_timeline?: string | null
          rescue_story?: string | null
          species?: string | null
          sponsor_info?: string | null
          status?: Database["public"]["Enums"]["animal_status"]
          sterilization_status?: string | null
          updated_at?: string
          vaccination_status?: string | null
        }
        Relationships: []
      }
      donation_settings: {
        Row: {
          account_name: string | null
          account_number: string | null
          bank_address: string | null
          bank_name: string | null
          id: boolean
          ifsc_code: string | null
          notes: string | null
          qr_image_url: string | null
          updated_at: string
          upi_id: string | null
        }
        Insert: {
          account_name?: string | null
          account_number?: string | null
          bank_address?: string | null
          bank_name?: string | null
          id?: boolean
          ifsc_code?: string | null
          notes?: string | null
          qr_image_url?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Update: {
          account_name?: string | null
          account_number?: string | null
          bank_address?: string | null
          bank_name?: string | null
          id?: boolean
          ifsc_code?: string | null
          notes?: string | null
          qr_image_url?: string | null
          updated_at?: string
          upi_id?: string | null
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donor_email: string | null
          donor_name: string
          donor_phone: string | null
          id: string
          method: string | null
          notes: string | null
          purpose: string | null
          received_on: string | null
          reference: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          donor_email?: string | null
          donor_name: string
          donor_phone?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          purpose?: string | null
          received_on?: string | null
          reference?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donor_email?: string | null
          donor_name?: string
          donor_phone?: string | null
          id?: string
          method?: string | null
          notes?: string | null
          purpose?: string | null
          received_on?: string | null
          reference?: string | null
        }
        Relationships: []
      }
      enquiries: {
        Row: {
          admin_notes: string | null
          amount: number | null
          animal_id: string | null
          city: string | null
          contact_person: string | null
          created_at: string
          email: string
          id: string
          interest: string | null
          kind: Database["public"]["Enums"]["enquiry_kind"]
          message: string | null
          name: string
          organisation: string | null
          phone: string | null
          roles: string[] | null
          status: Database["public"]["Enums"]["enquiry_status"]
          subject: string | null
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          amount?: number | null
          animal_id?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email: string
          id?: string
          interest?: string | null
          kind: Database["public"]["Enums"]["enquiry_kind"]
          message?: string | null
          name: string
          organisation?: string | null
          phone?: string | null
          roles?: string[] | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          amount?: number | null
          animal_id?: string | null
          city?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string
          id?: string
          interest?: string | null
          kind?: Database["public"]["Enums"]["enquiry_kind"]
          message?: string | null
          name?: string
          organisation?: string | null
          phone?: string | null
          roles?: string[] | null
          status?: Database["public"]["Enums"]["enquiry_status"]
          subject?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      impact_stats: {
        Row: {
          display_order: number
          id: string
          label: string
          updated_at: string
          value: number | null
        }
        Insert: {
          display_order?: number
          id?: string
          label: string
          updated_at?: string
          value?: number | null
        }
        Update: {
          display_order?: number
          id?: string
          label?: string
          updated_at?: string
          value?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          last_login_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          last_login_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          last_login_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      animal_status: "available" | "adopted" | "fostered"
      app_role: "admin" | "user"
      enquiry_kind:
        | "general"
        | "volunteer"
        | "foster"
        | "adoption"
        | "csr"
        | "sponsorship"
        | "contact"
      enquiry_status: "new" | "in_progress" | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      animal_status: ["available", "adopted", "fostered"],
      app_role: ["admin", "user"],
      enquiry_kind: [
        "general",
        "volunteer",
        "foster",
        "adoption",
        "csr",
        "sponsorship",
        "contact",
      ],
      enquiry_status: ["new", "in_progress", "closed"],
    },
  },
} as const
