export interface Database {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          name: string;
          designation: string;
          rating: number;
          comment: string;
          avatar: string;
          date_added: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          designation: string;
          rating: number;
          comment: string;
          avatar: string;
          date_added?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          designation?: string;
          rating?: number;
          comment?: string;
          avatar?: string;
          date_added?: string;
          created_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          phone: string;
          email: string;
          address: string;
          business_hours: {
            weekdays: string;
            saturday: string;
            sunday: string;
          };
          social_media: {
            email: string;
            linkedin: string;
            instagram: string;
            facebook: string;
            whatsapp: string;
            tiktok: string;
          };
          updated_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          email: string;
          address: string;
          business_hours: {
            weekdays: string;
            saturday: string;
            sunday: string;
          };
          social_media: {
            email: string;
            linkedin: string;
            instagram: string;
            facebook: string;
            whatsapp: string;
            tiktok: string;
          };
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          email?: string;
          address?: string;
          business_hours?: {
            weekdays: string;
            saturday: string;
            sunday: string;
          };
          social_media?: {
            email: string;
            linkedin: string;
            instagram: string;
            facebook: string;
            whatsapp: string;
            tiktok: string;
          };
          updated_at?: string;
        };
      };
      visitor_stats: {
        Row: {
          id: string;
          date: string;
          visitors: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          visitors?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          visitors?: number;
          created_at?: string;
        };
      };
    };
  };
}
