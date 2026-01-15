import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Menu, 
  X,
  Database,
  Target,
  FileSpreadsheet,
  BarChart3,
  Copy,
  GraduationCap,
  FileText,
  PhoneCall,
  Presentation,
  Linkedin,
  BookOpen,
  Palette,
  Sticker,
  Bookmark,
  PenTool,
  Instagram,
  Award,
  Users,
  Facebook,

  Filter,
  Globe,
  Zap,
  Shield
} from 'lucide-react';
import { useState } from 'react';
import { Service, ContactInfo } from '../types';
import TestimonialSection from './TestimonialSection';
import { useVisitorTracking } from '../hooks/useVisitorTracking';
import TikTokIcon from './ui/TikTokIcon';
import WhatsAppIcon from './ui/WhatsAppIcon';

interface WebsiteProps {
  services: Service[];
  contactInfo: ContactInfo;
  testimonials: any[];
  onVisit: () => void;
}

export default function Website({ services, contactInfo, testimonials, onVisit }: WebsiteProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [serviceType, setServiceType] = useState<'products' | 'services'>('services');
  const { trackUniqueVisit } = useVisitorTracking();

  React.useEffect(() => {
    const isNewVisit = trackUniqueVisit();
    if (isNewVisit) {
      onVisit();
    }
  }, [onVisit, trackUniqueVisit]);

  const categories = Array.from(new Set(services.map(service => service.category)));
  
  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const getServiceIcon = (serviceTitle: string) => {
    const iconClass = "w-6 h-6";
    
    if (serviceTitle.includes('Data Management')) return <Database className={iconClass} />;
    if (serviceTitle.includes('Lead Generation')) return <Target className={iconClass} />;
    if (serviceTitle.includes('Workbook Management')) return <FileSpreadsheet className={iconClass} />;
    if (serviceTitle.includes('Spreadsheet')) return <BarChart3 className={iconClass} />;
    if (serviceTitle.includes('Replication') || serviceTitle.includes('Conversion')) return <Copy className={iconClass} />;
    if (serviceTitle.includes('Academic') || serviceTitle.includes('Exam')) return <GraduationCap className={iconClass} />;
    if (serviceTitle.includes('CV') || serviceTitle.includes('Resume')) return <FileText className={iconClass} />;
    if (serviceTitle.includes('Call')) return <PhoneCall className={iconClass} />;
    if (serviceTitle.includes('Presentation')) return <Presentation className={iconClass} />;
    if (serviceTitle.includes('LinkedIn')) return <Linkedin className={iconClass} />;
    if (serviceTitle.includes('EBook')) return <BookOpen className={iconClass} />;
    if (serviceTitle.includes('Design')) return <Palette className={iconClass} />;
    if (serviceTitle.includes('Sticker')) return <Sticker className={iconClass} />;
    if (serviceTitle.includes('Bookmark')) return <Bookmark className={iconClass} />;
    if (serviceTitle.includes('Calligraphy')) return <PenTool className={iconClass} />;
    if (serviceTitle.includes('Instagram')) return <Instagram className={iconClass} />;
    
    return <CheckCircle className={iconClass} />;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/logo.png" 
                alt="Virtu Serve Logo" 
                className="w-14 h-14 object-contain"
                onError={(e) => {
                  console.error('Logo failed to load');
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{display: 'none'}}>
                VS
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VIRTU SERVE</h1>
                <p className="text-xs text-gray-600">Virtual Assistant Solutions</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-700 hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-gray-700 hover:text-blue-600 transition-colors">About</button>
              <button onClick={() => scrollToSection('services')} className="text-gray-700 hover:text-blue-600 transition-colors">Services</button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button onClick={() => scrollToSection('home')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Home</button>
                <button onClick={() => scrollToSection('about')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">About</button>
                <button onClick={() => scrollToSection('services')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Services</button>
                <button onClick={() => scrollToSection('contact')} className="block w-full text-left px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">Contact</button>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        {/* Professional imagery - Data visualization and business graphics */}
        <div className="absolute inset-0 opacity-15">
          <img 
            src="https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop" 
            alt="Professional data analysis and business charts" 
            className="w-full h-full object-cover"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Professional Services That
              <span className="text-blue-600 block">Drive Results</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              From data management to creative design, we deliver comprehensive solutions that streamline your workflow and enhance your business operations.
            </p>
            
            {/* Professional service highlights with icons */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Data Management</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Creative Design</span>
              </div>
              <div className="flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Professional Support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('services')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl backdrop-blur-sm"
              >
                Explore Our Services
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 bg-white/80 backdrop-blur-sm"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center text-gray-600">
            <span className="text-sm mb-2">Scroll to explore</span>
            <ArrowRight className="w-5 h-5 transform rotate-90" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">About Virtu Serve</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Global virtual services provider with over five years of expertise, delivering high-quality support to professionals across various industries.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-left">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Expertise</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">CV and Resume Enhancement</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Lead Generation & Data Extraction</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">MS Office & Google Spreadsheet Management</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Document Processing & File Conversion</span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Academic Typing & Exam Preparation</span>
                </div>
              </div>
            </div>
            
            <div className="relative lg:block hidden">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                alt="Professional team working on data analysis" 
                className="w-full h-80 object-cover rounded-2xl shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent rounded-2xl"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <div className="bg-blue-600 px-4 py-2 rounded-lg">
                  <p className="font-semibold">24/7 Operations</p>
                  <p className="text-sm opacity-90">Always here when you need us</p>
                </div>
              </div>
            </div>
            
            {/* Mobile/Tablet image - shown on smaller screens */}
            <div className="relative lg:hidden">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                alt="Professional team working on data analysis" 
                className="w-full h-64 object-cover rounded-2xl shadow-xl mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplifying your operations by handling time-consuming tasks, allowing you to focus on growing your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Streamline Processes</h3>
              <p className="text-gray-600">
                Optimize your workflow with efficient systems and automated solutions.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Save Time</h3>
              <p className="text-gray-600">
                Focus on your core objectives while we handle the time-consuming tasks.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Reliable Service</h3>
              <p className="text-gray-600">
                Dependable 24/7 support ensuring your tasks are managed efficiently.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">Our Solutions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive products and services designed to streamline your operations and boost productivity.
            </p>
          </div>

          {/* Service Type Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-white p-1 rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => setServiceType('products')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  serviceType === 'products'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setServiceType('services')}
                className={`px-6 py-3 rounded-md font-semibold transition-all duration-200 ${
                  serviceType === 'services'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Services
              </button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {serviceType === 'products' ? 'Our Products' : 'Our Services'}
              </h3>
              <p className="text-gray-600">
                {`All available ${serviceType} across different categories`}
              </p>
            </div>

            {services.filter(service => service.category === (serviceType === 'products' ? 'Products' : 'Services')).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.filter(service => service.category === (serviceType === 'products' ? 'Products' : 'Services')).map((service) => (
                  <div 
                    key={service.id}
                    className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                      {getServiceIcon(service.title)}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3 leading-snug">
                      {service.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No {serviceType} found</h4>
                <p className="text-gray-600">
                  No {serviceType} available in the selected category. Try selecting a different category.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection testimonials={testimonials} />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Contact section image */}
          <div className="mb-16">
            <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden shadow-lg">
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=700&fit=crop" 
                alt="Professional business communication and customer service" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-blue-600/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h3>
                  <p className="text-xl opacity-90">Ready to transform your business operations?</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ready to streamline your workflow? Contact us today to discuss your project requirements.
            </p>
          </div>

          <ContactCards contactInfo={contactInfo} />

          {/* Enhanced Business Hours Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 rounded-2xl shadow-lg border border-blue-100">
              <div className="text-center mb-8">
                <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Business Hours</h3>
                <p className="text-gray-600">We're here when you need us most</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Weekdays</h4>
                  <p className="text-gray-700 font-medium">{contactInfo.businessHours.weekdays}</p>
                  <p className="text-sm text-green-600 mt-1">Most Active</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Saturday</h4>
                  <p className="text-gray-700 font-medium">{contactInfo.businessHours.saturday}</p>
                  <p className="text-sm text-yellow-600 mt-1">Limited Hours</p>
                </div>
                
                <div className="text-center p-6 bg-white rounded-xl shadow-md border border-gray-100">
                  <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 text-red-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Sunday</h4>
                  <p className="text-gray-700 font-medium">{contactInfo.businessHours.sunday}</p>
                  <p className="text-sm text-red-600 mt-1">Rest Day</p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-100 p-4 rounded-lg inline-block">
                  <p className="text-blue-800 font-medium">
                    <strong>Emergency Support:</strong> Available 24/7 via WhatsApp for urgent matters
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call-to-Action Section */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto text-white">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-blue-100 mb-6 text-lg">
                Join hundreds of satisfied clients who trust us with their business operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.open(contactInfo.socialMedia.whatsapp, '_blank')}
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>Start WhatsApp Chat</span>
                </button>
                <button
                  onClick={() => window.open(`mailto:${contactInfo.email}?subject=Project Inquiry&body=Hello, I'm interested in your services...`, '_self')}
                  className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Send Project Brief</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo.png" 
                  alt="Virtu Serve Logo" 
                  className="w-14 h-14 object-contain"
                  onError={(e) => {
                    console.error('Footer logo failed to load');
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{display: 'none'}}>
                  VS
                </div>
                <div>
                  <h3 className="text-xl font-bold">VIRTU SERVE</h3>
                  <p className="text-sm text-gray-400">Virtual Assistant Solutions</p>
                </div>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted partner for comprehensive business services. From data management to creative solutions, we deliver excellence in every project.
              </p>
              <div className="flex space-x-4">
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.linkedin)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.instagram)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.facebook)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.whatsapp)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.tiktok)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <TikTokIcon className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => handleSocialClick(contactInfo.socialMedia.email)}
                  className="text-gray-400 hover:text-white transition-colors flex items-center space-x-1"
                >
                  <Mail className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors">About Us</button></li>
                <li><button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Data Management</li>
                <li>Resume Optimization</li>
                <li>Lead Generation</li>
                <li>Design Services</li>
                <li>Content Creation</li>
                <li>Professional Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Virtu Serve. All rights reserved. | Professional Services for Modern Business
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Contact Cards Component
function ContactCards({ contactInfo }: { contactInfo: ContactInfo }) {
  const [showPhoneOptions, setShowPhoneOptions] = useState(false);

  const handlePhoneClick = () => {
    setShowPhoneOptions(true);
  };

  const handleEmailClick = () => {
    window.open(`mailto:${contactInfo.email}`, '_self');
  };

  const handleNormalCall = () => {
    window.open(`tel:${contactInfo.phone}`, '_self');
    setShowPhoneOptions(false);
  };

  const handleWhatsAppCall = () => {
    window.open(contactInfo.socialMedia.whatsapp, '_blank');
    setShowPhoneOptions(false);
  };

  const closePhoneOptions = () => {
    setShowPhoneOptions(false);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
        {/* Phone Container */}
        <div 
          className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-100 cursor-pointer group"
          onClick={handlePhoneClick}
        >
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <Phone className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
          <p className="text-gray-700 font-medium text-lg">{contactInfo.phone}</p>
          <p className="text-sm text-gray-600 mt-2">Available 24/7 for urgent matters</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm text-blue-600 font-medium">Click to call</p>
          </div>
        </div>

        {/* Email Container */}
        <div 
          className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100 cursor-pointer group"
          onClick={handleEmailClick}
        >
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
          <p className="text-gray-700 font-medium text-lg break-all">{contactInfo.email}</p>
          <p className="text-sm text-gray-600 mt-2">We respond within 24 hours</p>
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <p className="text-sm text-green-600 font-medium">Click to send email</p>
          </div>
        </div>

        {/* Office Container */}
        <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 group">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Office</h3>
          <p className="text-gray-700 font-medium text-lg whitespace-pre-line">
            {contactInfo.address}
          </p>
          <p className="text-sm text-gray-600 mt-2">Remote operations worldwide</p>
        </div>
      </div>

      {/* Phone Options Modal */}
      {showPhoneOptions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center mb-6">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Call Method</h3>
              <p className="text-gray-600">How would you like to contact us?</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleNormalCall}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <Phone className="w-6 h-6" />
                <span>Normal Call</span>
              </button>
              
              <button
                onClick={handleWhatsAppCall}
                className="w-full bg-green-600 text-white px-6 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-3"
              >
                <WhatsAppIcon className="w-6 h-6" />
                <span>WhatsApp Call</span>
              </button>

              <button
                onClick={closePhoneOptions}
                className="w-full bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all duration-300 text-lg font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
