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
      activity: {
        Row: {
          id: string
          last_active: string | null
          last_seen: string | null
          online: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          last_active?: string | null
          last_seen?: string | null
          online?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          last_active?: string | null
          last_seen?: string | null
          online?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin: {
        Row: {
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          id?: string
          role?: string | null
          user_id?: string
        }
        Update: {
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_user_id: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          blocked_user_id?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          blocked_user_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      blocks: {
        Row: {
          blocked_id: string | null
          blocker_id: string
          created_at: string | null
          id: string
        }
        Insert: {
          blocked_id?: string | null
          blocker_id?: string
          created_at?: string | null
          id?: string
        }
        Update: {
          blocked_id?: string | null
          blocker_id?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      boosts: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      compatibility_scores: {
        Row: {
          created_at: string | null
          id: string
          score: number | null
          user1_id: string
          user2_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          score?: number | null
          user1_id?: string
          user2_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number | null
          user1_id?: string
          user2_id?: string | null
        }
        Relationships: []
      }
      interests: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          liked_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          liked_user_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          liked_user_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          created_at: string | null
          id: string
          matched_user_id: string | null
          score: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          matched_user_id?: string | null
          score?: number | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          matched_user_id?: string | null
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          id: string
          user1_id: string
          user2_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          user1_id: string
          user2_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          id?: string
          user1_id?: string
          user2_id?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          created_at: string | null
          delivered: boolean | null
          id: string
          lida: boolean | null
          message: string | null
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          created_at?: string | null
          delivered?: boolean | null
          id?: string
          lida?: boolean | null
          message?: string | null
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          created_at?: string | null
          delivered?: boolean | null
          id?: string
          lida?: boolean | null
          message?: string | null
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          read: boolean | null
          title: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      photos: {
        Row: {
          created_at: string | null
          id: string
          is_primary: boolean | null
          order_index: number | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          order_index?: number | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          expires_at: string | null
          feature: string | null
          id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          feature?: string | null
          id?: string
          user_id?: string
        }
        Update: {
          expires_at?: string | null
          feature?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      profile_boosts: {
        Row: {
          active: boolean | null
          created_at: string | null
          end_time: string | null
          id: string
          start_time: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          user_id?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          end_time?: string | null
          id?: string
          start_time?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_completion: {
        Row: {
          percentage: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          percentage: number
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          percentage?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profile_completion_complete: {
        Row: {
          bio_completed: boolean
          completion_percentage: number | null
          created_at: string | null
          id: string
          interests_completed: boolean | null
          location_completed: boolean | null
          religion_completed: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bio_completed?: boolean
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          interests_completed?: boolean | null
          location_completed?: boolean | null
          religion_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bio_completed?: boolean
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          interests_completed?: boolean | null
          location_completed?: boolean | null
          religion_completed?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile_score: {
        Row: {
          created_at: string | null
          id: string
          likes_received: number | null
          matches_count: number | null
          premium: boolean | null
          profile_views: number | null
          score: number | null
          updated_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          likes_received?: number | null
          matches_count?: number | null
          premium?: boolean | null
          profile_views?: number | null
          score?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          likes_received?: number | null
          matches_count?: number | null
          premium?: boolean | null
          profile_views?: number | null
          score?: number | null
          updated_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      profile_visits: {
        Row: {
          created_at: string | null
          id: string
          visited_user_id: string | null
          visitor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          visited_user_id?: string | null
          visitor_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          visited_user_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean | null
          bio: string | null
          cidade: string | null
          created_at: string
          distance_preference: string | null
          email: string | null
          estado: string | null
          foto_perfil: string | null
          frequencia_igreja: string | null
          hide_location: boolean | null
          id: string
          idade: number | null
          intencao_relacionamento: string | null
          latitude: string | null
          longitude: string | null
          nome: string | null
          premium: boolean | null
          premium_tipo: string | null
          profissão: string | null
          religião: string | null
          sexo: string | null
          trust_score: number | null
          verificado: boolean | null
          versiculo_favorito: string | null
        }
        Insert: {
          ativo?: boolean | null
          bio?: string | null
          cidade?: string | null
          created_at?: string
          distance_preference?: string | null
          email?: string | null
          estado?: string | null
          foto_perfil?: string | null
          frequencia_igreja?: string | null
          hide_location?: boolean | null
          id?: string
          idade?: number | null
          intencao_relacionamento?: string | null
          latitude?: string | null
          longitude?: string | null
          nome?: string | null
          premium?: boolean | null
          premium_tipo?: string | null
          profissão?: string | null
          religião?: string | null
          sexo?: string | null
          trust_score?: number | null
          verificado?: boolean | null
          versiculo_favorito?: string | null
        }
        Update: {
          ativo?: boolean | null
          bio?: string | null
          cidade?: string | null
          created_at?: string
          distance_preference?: string | null
          email?: string | null
          estado?: string | null
          foto_perfil?: string | null
          frequencia_igreja?: string | null
          hide_location?: boolean | null
          id?: string
          idade?: number | null
          intencao_relacionamento?: string | null
          latitude?: string | null
          longitude?: string | null
          nome?: string | null
          premium?: boolean | null
          premium_tipo?: string | null
          profissão?: string | null
          religião?: string | null
          sexo?: string | null
          trust_score?: number | null
          verificado?: boolean | null
          versiculo_favorito?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string | null
          feedback: string | null
          from_user_id: string
          id: string
          rating: number | null
          to_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          from_user_id: string
          id?: string
          rating?: number | null
          to_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          from_user_id?: string
          id?: string
          rating?: number | null
          to_user_id?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          reason: string | null
          reported_id: string
          reported_user_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string | null
          reported_id: string
          reported_user_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          reason?: string | null
          reported_id?: string
          reported_user_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          plan: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      super_likes: {
        Row: {
          created_at: string | null
          id: string
          target_user_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_user_id?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_user_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trust_score: {
        Row: {
          reports_count: number | null
          score: number
          user_id: string
          verified: boolean | null
        }
        Insert: {
          reports_count?: number | null
          score: number
          user_id?: string
          verified?: boolean | null
        }
        Update: {
          reports_count?: number | null
          score?: number
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          chat_user_id: string | null
          id: string
          is_typing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          chat_user_id?: string | null
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          chat_user_id?: string | null
          id?: string
          is_typing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string | null
          id: string
          interest_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          interest_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          interest_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_metrics: {
        Row: {
          likes_count: number
          matches_count: number | null
          messages_count: number | null
          user_id: string
        }
        Insert: {
          likes_count: number
          matches_count?: number | null
          messages_count?: number | null
          user_id?: string
        }
        Update: {
          likes_count?: number
          matches_count?: number | null
          messages_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          distance_km: number | null
          id: string
          max_age: number | null
          min_age: number | null
          religion: string | null
          relitionship_goal: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          distance_km?: number | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          religion?: string | null
          relitionship_goal?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string | null
          distance_km?: number | null
          id?: string
          max_age?: number | null
          min_age?: number | null
          religion?: string | null
          relitionship_goal?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      verification: {
        Row: {
          created_at: string | null
          document_photo: string | null
          id: string
          reviewed_at: string | null
          selfie_photo: string | null
          selfie_with_document: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          document_photo?: string | null
          id?: string
          reviewed_at?: string | null
          selfie_photo?: string | null
          selfie_with_document?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          document_photo?: string | null
          id?: string
          reviewed_at?: string | null
          selfie_photo?: string | null
          selfie_with_document?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      versiculos: {
        Row: {
          created_at: string | null
          id: string
          referencia: string | null
          versiculo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          referencia?: string | null
          versiculo: string
        }
        Update: {
          created_at?: string | null
          id?: string
          referencia?: string | null
          versiculo?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
