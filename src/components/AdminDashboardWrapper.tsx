import React, { useState, useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import { supabaseOperations } from '../lib/supabaseOperations';
import { Service, ContactInfo, VisitorData, Testimonial } from '../types';
import { initialServices, initialContactInfo, initialTestimonials } from '../data/initialData';

interface AdminDashboardWrapperProps {
  onLogout: () => void;
}

export default function AdminDashboardWrapper({ onLogout }: AdminDashboardWrapperProps) {
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [visitorData, setVisitorData] = useState<VisitorData[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [servicesData, contactData, visitorStatsData, testimonialsData] = await Promise.all([
        supabaseOperations.fetchServices(),
        supabaseOperations.fetchContactInfo(),
        supabaseOperations.fetchVisitorStats(),
        supabaseOperations.fetchTestimonials(),
      ]);

      setServices(servicesData);
      setContactInfo(contactData || initialContactInfo);
      setVisitorData(visitorStatsData);
      setTestimonials(testimonialsData);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateServices = async (updatedServices: Service[]) => {
    try {
      await supabaseOperations.updateServices(updatedServices);
      setServices(updatedServices);
    } catch (err) {
      console.error('Error updating services:', err);
      alert('Failed to update services. Please try again.');
    }
  };

  const handleUpdateContactInfo = async (updatedContactInfo: ContactInfo) => {
    try {
      await supabaseOperations.updateContactInfo(updatedContactInfo);
      setContactInfo(updatedContactInfo);
    } catch (err) {
      console.error('Error updating contact info:', err);
      alert('Failed to update contact information. Please try again.');
    }
  };

  const handleUpdateTestimonials = async (updatedTestimonials: Testimonial[]) => {
    try {
      await supabaseOperations.updateTestimonials(updatedTestimonials);
      setTestimonials(updatedTestimonials);
    } catch (err) {
      console.error('Error updating testimonials:', err);
      alert('Failed to update testimonials. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg mb-4">
            {error}
          </div>
          <button
            onClick={loadData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboard
      services={services}
      contactInfo={contactInfo}
      visitorData={visitorData}
      testimonials={testimonials}
      onUpdateServices={handleUpdateServices}
      onUpdateContactInfo={handleUpdateContactInfo}
      onUpdateTestimonials={handleUpdateTestimonials}
      onLogout={onLogout}
    />
  );
}
