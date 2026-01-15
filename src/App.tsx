import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Website from './components/Website';
import AdminLogin from './components/AdminLogin';
import AdminDashboardWrapper from './components/AdminDashboardWrapper';
import { supabaseOperations } from './lib/supabaseOperations';
import { initialServices, initialContactInfo, initialTestimonials } from './data/initialData';
import { Service, ContactInfo, Testimonial } from './types';

function App() {
  const [services, setServices] = useState<Service[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWebsiteData();
  }, []);

  const loadWebsiteData = async () => {
    try {
      const [servicesData, contactData, testimonialsData] = await Promise.all([
        supabaseOperations.fetchServices(),
        supabaseOperations.fetchContactInfo(),
        supabaseOperations.fetchTestimonials(),
      ]);

      setServices(servicesData);
      setContactInfo(contactData || initialContactInfo);
      setTestimonials(testimonialsData);
    } catch (err) {
      console.error('Error loading website data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVisit = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      await supabaseOperations.recordVisit(today);
    } catch (err) {
      console.error('Error recording visit:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Website
              services={services}
              contactInfo={contactInfo}
              testimonials={testimonials}
              onVisit={handleVisit}
            />
          }
        />
        <Route
          path="/admin"
          element={
            isAdminLoggedIn ? (
              <AdminDashboardWrapper
                onLogout={() => setIsAdminLoggedIn(false)}
              />
            ) : (
              <AdminLogin onLogin={() => setIsAdminLoggedIn(true)} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;