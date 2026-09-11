export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      allergens: {
        Row: {
          category: string | null;
          id: number;
          name: string;
        };
        Insert: {
          category?: string | null;
          id: number;
          name: string;
        };
        Update: {
          category?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      dietary_preferences: {
        Row: {
          created_at: string | null;
          diet_id: number;
          id: number;
          level: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          diet_id: number;
          id?: number;
          level?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          diet_id?: number;
          id?: number;
          level?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "dietary_preferences_diet_id_fkey";
            columns: ["diet_id"];
            isOneToOne: false;
            referencedRelation: "diets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "dietary_preferences_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      diets: {
        Row: {
          id: number;
          name: string;
          tag: string | null;
        };
        Insert: {
          id: number;
          name: string;
          tag?: string | null;
        };
        Update: {
          id?: number;
          name?: string;
          tag?: string | null;
        };
        Relationships: [];
      };
      meal_plans: {
        Row: {
          id: number;
          meal_id: string | null;
          product_id: number | null;
        };
        Insert: {
          id?: number;
          meal_id?: string | null;
          product_id?: number | null;
        };
        Update: {
          id?: number;
          meal_id?: string | null;
          product_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "meal_plans_meal_id_fkey";
            columns: ["meal_id"];
            isOneToOne: false;
            referencedRelation: "meals";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "meal_plans_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      meals: {
        Row: {
          active: boolean | null;
          created_at: string | null;
          id: string;
          meal_type: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          meal_type: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          active?: boolean | null;
          created_at?: string | null;
          id?: string;
          meal_type?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      places: {
        Row: {
          active: boolean | null;
          category: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          cultural_cuisine: string | null;
          description: string | null;
          id: number;
          is_certified: boolean;
          is_dedicated_facility: boolean;
          know_before_you_go: string | null;
          name: string;
          offers_catering: boolean | null;
          offers_delivery: boolean | null;
          phone: string | null;
          ranking: number | null;
          state: string | null;
          street_address: string | null;
          trained_staff: boolean | null;
          updated_at: string;
          verified: boolean | null;
          website: string | null;
          written_allergen_menu: boolean | null;
          zipcode: string | null;
        };
        Insert: {
          active?: boolean | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          cultural_cuisine?: string | null;
          description?: string | null;
          id: number;
          is_certified?: boolean;
          is_dedicated_facility?: boolean;
          know_before_you_go?: string | null;
          name: string;
          offers_catering?: boolean | null;
          offers_delivery?: boolean | null;
          phone?: string | null;
          ranking?: number | null;
          state?: string | null;
          street_address?: string | null;
          trained_staff?: boolean | null;
          updated_at?: string;
          verified?: boolean | null;
          website?: string | null;
          written_allergen_menu?: boolean | null;
          zipcode?: string | null;
        };
        Update: {
          active?: boolean | null;
          category?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          cultural_cuisine?: string | null;
          description?: string | null;
          id?: number;
          is_certified?: boolean;
          is_dedicated_facility?: boolean;
          know_before_you_go?: string | null;
          name?: string;
          offers_catering?: boolean | null;
          offers_delivery?: boolean | null;
          phone?: string | null;
          ranking?: number | null;
          state?: string | null;
          street_address?: string | null;
          trained_staff?: boolean | null;
          updated_at?: string;
          verified?: boolean | null;
          website?: string | null;
          written_allergen_menu?: boolean | null;
          zipcode?: string | null;
        };
        Relationships: [];
      };
      places_allergens: {
        Row: {
          allergen_id: number;
          id: number;
          place_id: number;
          status: string;
        };
        Insert: {
          allergen_id: number;
          id?: number;
          place_id: number;
          status: string;
        };
        Update: {
          allergen_id?: number;
          id?: number;
          place_id?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "places_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "places_allergens_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
        ];
      };
      places_diets: {
        Row: {
          availability: string | null;
          diet_id: number;
          place_id: number;
        };
        Insert: {
          availability?: string | null;
          diet_id: number;
          place_id: number;
        };
        Update: {
          availability?: string | null;
          diet_id?: number;
          place_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "places_diets_diet_id_fkey";
            columns: ["diet_id"];
            isOneToOne: false;
            referencedRelation: "diets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "places_diets_place_id_fkey";
            columns: ["place_id"];
            isOneToOne: false;
            referencedRelation: "places";
            referencedColumns: ["id"];
          },
        ];
      };
      product_allergens: {
        Row: {
          allergen_id: number;
          id: number;
          product_id: number;
          status: string;
        };
        Insert: {
          allergen_id: number;
          id?: number;
          product_id: number;
          status: string;
        };
        Update: {
          allergen_id?: number;
          id?: number;
          product_id?: number;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_allergens_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_diets: {
        Row: {
          diet_id: number;
          product_id: number;
        };
        Insert: {
          diet_id: number;
          product_id: number;
        };
        Update: {
          diet_id?: number;
          product_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_diets_diet_id_fkey";
            columns: ["diet_id"];
            isOneToOne: false;
            referencedRelation: "diets";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_diets_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          active: boolean | null;
          brand_name: string | null;
          category: string | null;
          created_at: string | null;
          cultural_cuisine: string | null;
          id: number;
          ingredient_type: string | null;
          is_dedicated_facility: boolean | null;
          is_party_safe: boolean | null;
          labels: string | null;
          name: string;
          product_ingredients: string | null;
          suitable_breakfast: boolean | null;
          suitable_dinner: boolean | null;
          suitable_lunch: boolean | null;
          updated_at: string | null;
          verified: boolean | null;
          where_to_buy: string | null;
        };
        Insert: {
          active?: boolean | null;
          brand_name?: string | null;
          category?: string | null;
          created_at?: string | null;
          cultural_cuisine?: string | null;
          id?: number;
          ingredient_type?: string | null;
          is_dedicated_facility?: boolean | null;
          is_party_safe?: boolean | null;
          labels?: string | null;
          name: string;
          product_ingredients?: string | null;
          suitable_breakfast?: boolean | null;
          suitable_dinner?: boolean | null;
          suitable_lunch?: boolean | null;
          updated_at?: string | null;
          verified?: boolean | null;
          where_to_buy?: string | null;
        };
        Update: {
          active?: boolean | null;
          brand_name?: string | null;
          category?: string | null;
          created_at?: string | null;
          cultural_cuisine?: string | null;
          id?: number;
          ingredient_type?: string | null;
          is_dedicated_facility?: boolean | null;
          is_party_safe?: boolean | null;
          labels?: string | null;
          name?: string;
          product_ingredients?: string | null;
          suitable_breakfast?: boolean | null;
          suitable_dinner?: boolean | null;
          suitable_lunch?: boolean | null;
          updated_at?: string | null;
          verified?: boolean | null;
          where_to_buy?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          city: string | null;
          created_at: string | null;
          display_name: string;
          email: string;
          id: string;
          onboarding_complete: boolean;
          state: string | null;
          updated_at: string | null;
        };
        Insert: {
          city?: string | null;
          created_at?: string | null;
          display_name?: string;
          email: string;
          id: string;
          onboarding_complete?: boolean;
          state?: string | null;
          updated_at?: string | null;
        };
        Update: {
          city?: string | null;
          created_at?: string | null;
          display_name?: string;
          email?: string;
          id?: string;
          onboarding_complete?: boolean;
          state?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      user_allergens: {
        Row: {
          allergen_id: number;
          created_at: string | null;
          id: number;
          severity: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          allergen_id: number;
          created_at?: string | null;
          id?: never;
          severity?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          allergen_id?: number;
          created_at?: string | null;
          id?: never;
          severity?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_allergens_allergen_id_fkey";
            columns: ["allergen_id"];
            isOneToOne: false;
            referencedRelation: "allergens";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_allergens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
