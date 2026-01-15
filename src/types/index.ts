export interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia: {
    email: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    whatsapp: string;
    tiktok: string;
  };
}

export interface VisitorData {
  date: string;
  visitors: number;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  rating: number;
  comment: string;
  avatar: string;
  dateAdded: string;
}