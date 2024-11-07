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
      admin_user: {
        Row: {
          created_at: string | null
          created_by: string
          id: string
          role: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: string
          role?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: string
          role?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_message: {
        Row: {
          created_at: string | null
          created_by: string
          friend_id: string
          id: string
          project_id: string
          team_id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          friend_id: string
          id?: string
          project_id: string
          team_id: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          friend_id?: string
          id?: string
          project_id?: string
          team_id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          created_at: string | null
          created_by: string
          handle: string | null
          id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          handle?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          handle?: string | null
          id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      project: {
        Row: {
          admin_id: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          image_url: string | null
          lead_by: string | null
          name: string
          unlisted: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          image_url?: string | null
          lead_by?: string | null
          name: string
          unlisted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          image_url?: string | null
          lead_by?: string | null
          name?: string
          unlisted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      sensitive_profile: {
        Row: {
          created_at: string | null
          created_by: string
          email: string | null
          id: string
          iss: string | null
          sub: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          email?: string | null
          id?: string
          iss?: string | null
          sub?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          email?: string | null
          id?: string
          iss?: string | null
          sub?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team: {
        Row: {
          admin_id: string
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          lead_by: string | null
          name: string
          unlisted: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          admin_id: string
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          lead_by?: string | null
          name: string
          unlisted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          admin_id?: string
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          lead_by?: string | null
          name?: string
          unlisted?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_friend: {
        Row: {
          created_at: string | null
          created_by: string
          friend_id: string
          friends: boolean | null
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          friend_id: string
          friends?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          friend_id?: string
          friends?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_project: {
        Row: {
          created_at: string | null
          created_by: string
          project_id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          project_id: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          project_id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_team: {
        Row: {
          created_at: string | null
          created_by: string
          team_id: string
          updated_at: string | null
          updated_by: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          team_id: string
          updated_at?: string | null
          updated_by?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          team_id?: string
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auth_custom_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
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
