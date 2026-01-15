import { supabase } from './supabase';
import { Service, ContactInfo, VisitorData, Testimonial } from '../types';

export const supabaseOperations = {
  async fetchServices(): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching services:', error);
      throw new Error('Failed to fetch services');
    }

    return data.map(service => ({
      id: service.id,
      title: service.title,
      description: service.description,
      category: service.category,
    }));
  },

  async updateServices(services: Service[]): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-services`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ services }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update services');
      }
    } catch (error) {
      console.error('Error updating services:', error);
      throw error;
    }
  },

  async fetchTestimonials(): Promise<Testimonial[]> {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('date_added', { ascending: false });

    if (error) {
      console.error('Error fetching testimonials:', error);
      throw new Error('Failed to fetch testimonials');
    }

    return data.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      designation: testimonial.designation,
      rating: testimonial.rating,
      comment: testimonial.comment,
      avatar: testimonial.avatar,
      dateAdded: testimonial.date_added,
    }));
  },

  async updateTestimonials(testimonials: Testimonial[]): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-testimonials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ testimonials }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update testimonials');
      }
    } catch (error) {
      console.error('Error updating testimonials:', error);
      throw error;
    }
  },

  async fetchContactInfo(): Promise<ContactInfo | null> {
    const { data, error } = await supabase
      .from('contact_info')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching contact info:', error);
      throw new Error('Failed to fetch contact info');
    }

    if (!data) {
      return null;
    }

    return {
      phone: data.phone,
      email: data.email,
      address: data.address,
      businessHours: data.business_hours,
      socialMedia: data.social_media,
    };
  },

  async updateContactInfo(contactInfo: ContactInfo): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-update-contact`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify(contactInfo),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update contact info');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  },

  async fetchVisitorStats(): Promise<VisitorData[]> {
    const { data, error } = await supabase
      .from('visitor_stats')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      console.error('Error fetching visitor stats:', error);
      throw new Error('Failed to fetch visitor stats');
    }

    return data.map(stat => ({
      date: stat.date,
      visitors: stat.visitors,
    }));
  },

  async recordVisit(date: string): Promise<void> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-record-visit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ date }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record visit');
      }
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  },

  async authenticateAdmin(username: string, password: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Error authenticating admin:', error);
      return false;
    }
  },
};
