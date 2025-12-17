export interface Database {
  public: {
    Tables: {
      profile: {
        Row: {
          id: string;
          full_name: string;
          headline: string;
          about_me: string;
          email: string;
          phone: string | null;
          location: string | null;
          profile_image_url: string | null;
          resume_url: string | null;
          linkedin_url: string | null;
          github_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          headline?: string;
          about_me?: string;
          email?: string;
          phone?: string | null;
          location?: string | null;
          profile_image_url?: string | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          headline?: string;
          about_me?: string;
          email?: string;
          phone?: string | null;
          location?: string | null;
          profile_image_url?: string | null;
          resume_url?: string | null;
          linkedin_url?: string | null;
          github_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          short_description: string;
          detailed_description: string;
          my_contribution: string;
          tech_stack: string[];
          github_url: string | null;
          live_demo_url: string | null;
          image_urls: string[];
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          short_description: string;
          detailed_description?: string;
          my_contribution?: string;
          tech_stack?: string[];
          github_url?: string | null;
          live_demo_url?: string | null;
          image_urls?: string[];
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          short_description?: string;
          detailed_description?: string;
          my_contribution?: string;
          tech_stack?: string[];
          github_url?: string | null;
          live_demo_url?: string | null;
          image_urls?: string[];
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          skill_name: string;
          category: string;
          proficiency_level: string;
          years_of_experience: number | null;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          skill_name: string;
          category: string;
          proficiency_level?: string;
          years_of_experience?: number | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          skill_name?: string;
          category?: string;
          proficiency_level?: string;
          years_of_experience?: number | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      certificates: {
        Row: {
          id: string;
          title: string;
          issuer: string;
          date_issued: string;
          description: string | null;
          image_url: string | null;
          credential_url: string | null;
          featured: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          issuer: string;
          date_issued: string;
          description?: string | null;
          image_url?: string | null;
          credential_url?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          issuer?: string;
          date_issued?: string;
          description?: string | null;
          image_url?: string | null;
          credential_url?: string | null;
          featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      coding_metrics: {
        Row: {
          id: string;
          platform_name: string;
          username: string;
          profile_url: string;
          total_solved: number;
          easy_solved: number | null;
          medium_solved: number | null;
          hard_solved: number | null;
          rank_rating: string | null;
          badge_icon_url: string | null;
          last_updated: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          platform_name: string;
          username: string;
          profile_url: string;
          total_solved?: number;
          easy_solved?: number | null;
          medium_solved?: number | null;
          hard_solved?: number | null;
          rank_rating?: string | null;
          badge_icon_url?: string | null;
          last_updated?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform_name?: string;
          username?: string;
          profile_url?: string;
          total_solved?: number;
          easy_solved?: number | null;
          medium_solved?: number | null;
          hard_solved?: number | null;
          rank_rating?: string | null;
          badge_icon_url?: string | null;
          last_updated?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject?: string | null;
          message: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string | null;
          message?: string;
          read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
