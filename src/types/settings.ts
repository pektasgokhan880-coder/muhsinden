export interface SiteSettings {
  id?: number;
  name: string;
  tagline: string;
  description: string;
  phone: string;
  phone_display: string;
  whatsapp: string;
  address_line1: string;
  address_line2: string;
  address_city: string;
  social_facebook: string;
  social_instagram: string;
  social_tiktok: string;
  working_hours_weekday: string;
  working_hours_weekend: string;
  logo_url: string;
  banner_url: string;
  updated_at?: string;
}
