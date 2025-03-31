export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          created_at: string | null
          date: string | null
          id: string
          image_url: string | null
          images: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          created_at?: string | null
          date?: string | null
          id?: string
          image_url?: string | null
          images?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      portfolio_companies: {
        Row: {
          created_at: string | null
          description: string | null
          gallery_images: Json | null
          id: string
          logo_url: string | null
          name: string
          status: string | null
          type: string | null
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gallery_images?: Json | null
          id?: string
          logo_url?: string | null
          name: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gallery_images?: Json | null
          id?: string
          logo_url?: string | null
          name?: string
          status?: string | null
          type?: string | null
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_conversion_metrics: {
        Args: {
          workspace_id: number
        }
        Returns: {
          total_leads: number
          converted_leads: number
          conversion_rate: number
        }[]
      }
      calculate_conversion_metrics_with_monthly: {
        Args: {
          workspace_id: number
        }
        Returns: {
          total_leads: number
          converted_leads: number
          conversion_rate: number
          top_source_id: string
          top_source_conversions: number
          monthly_stats: Json
        }[]
      }
      calculate_conversion_metrics_with_top_source: {
        Args: {
          workspace_id: number
        }
        Returns: {
          total_leads: number
          converted_leads: number
          conversion_rate: number
          top_source_id: string
          top_source_conversions: number
        }[]
      }
      calculate_total_revenue: {
        Args: {
          workspace_id: string
        }
        Returns: number
      }
      count_arrived_leads:
        | {
            Args: Record<PropertyKey, never>
            Returns: number
          }
        | {
            Args: {
              workspace_id: number
            }
            Returns: number
          }
      get_last_active_workspace: {
        Args: {
          p_user_id: string
        }
        Returns: {
          workspace_id: number
          workspace_name: string
          user_role: string
        }[]
      }
      get_or_set_last_active_workspace: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_qualified_leads_count:
        | {
            Args: {
              workspace_id: number
            }
            Returns: {
              qualified_count: number
              status_names: string[]
            }[]
          }
        | {
            Args: {
              workspace_id: string
            }
            Returns: {
              qualified_count: number
              status_names: string[]
            }[]
          }
      get_workspace_analytics:
        | {
            Args: {
              p_workspace_id: number
            }
            Returns: Json
          }
        | {
            Args: {
              p_workspace_id: number
              p_user_id: string
            }
            Returns: Json
          }
      get_workspace_metrics: {
        Args: {
          p_workspace_id: number
        }
        Returns: Json
      }
      set_active_workspace: {
        Args: {
          p_user_id: string
          p_workspace_id: number
        }
        Returns: undefined
      }
      set_last_active_workspace:
        | {
            Args: {
              user_id: string
              workspace_id: number
            }
            Returns: undefined
          }
        | {
            Args: {
              user_id: string
              workspace_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
