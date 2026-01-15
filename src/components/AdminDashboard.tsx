import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Users, 
  Settings, 
  Plus, 
  LogOut,
  Trash2, 
  Save, 
  X, 
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Clock,
  Star,
  Search,
  Filter,
  MessageSquare,
  CheckSquare,
  MoreVertical,
  Linkedin, // Add this import
  Instagram, // Add this import
  Facebook,
  Edit
} from 'lucide-react';
import { Service, ContactInfo, VisitorData, Testimonial } from '../types';
import TikTokIcon from './ui/TikTokIcon';
import WhatsAppIcon from './ui/WhatsAppIcon';
import ImageUpload from './ui/ImageUpload';


interface AdminDashboardProps {
  services: Service[];
  contactInfo: ContactInfo;
  visitorData: VisitorData[];
  testimonials: Testimonial[];
  onUpdateServices: (services: Service[]) => void;
  onUpdateContactInfo: (contactInfo: ContactInfo) => void;
  onUpdateTestimonials: (testimonials: Testimonial[]) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  services,
  contactInfo,
  visitorData,
  testimonials,
  onUpdateServices,
  onUpdateContactInfo,
  onUpdateTestimonials,
  onLogout
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'services' | 'testimonials' | 'contact'>('analytics');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isAddingTestimonial, setIsAddingTestimonial] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [selectedTestimonials, setSelectedTestimonials] = useState<string[]>([]);
  const [tempContactInfo, setTempContactInfo] = useState<ContactInfo>(() => ({
    ...contactInfo,
    socialMedia: {
      email: contactInfo.socialMedia?.email || '',
      linkedin: contactInfo.socialMedia?.linkedin || '',
      instagram: contactInfo.socialMedia?.instagram || '',
      facebook: contactInfo.socialMedia?.facebook || '',
      whatsapp: contactInfo.socialMedia?.whatsapp || '',
      tiktok: contactInfo.socialMedia?.tiktok || '',
    }
  }));

  const categories = Array.from(new Set(services.map(service => service.category)));
  
  // Filter testimonials based on search and rating
  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         testimonial.comment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === null || testimonial.rating === ratingFilter;
    return matchesSearch && matchesRating;
  });

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      title: '',
      description: '',
      category: 'Product Services' // Default to products
    };
    setEditingService(newService);
    setIsAddingService(true);
  };

  const handleSaveService = () => {
    if (!editingService) return;

    if (isAddingService) {
      onUpdateServices([...services, editingService]);
    } else {
      onUpdateServices(services.map(s => s.id === editingService.id ? editingService : s));
    }

    setEditingService(null);
    setIsAddingService(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      onUpdateServices(services.filter(s => s.id !== id));
    }
  };

  const handleSaveContact = () => {
    onUpdateContactInfo(tempContactInfo);
    setEditingContact(false);
  };

  // Update temp contact info when editing starts
  React.useEffect(() => {
    if (editingContact) {
      setTempContactInfo(contactInfo);
    }
  }, [editingContact, contactInfo]);

  const handleAddTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString(),
      name: '',
      designation: '',
      rating: 5,
      comment: '',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setEditingTestimonial(newTestimonial);
    setIsAddingTestimonial(true);
  };

  const handleSaveTestimonial = () => {
    if (!editingTestimonial) return;

    if (isAddingTestimonial) {
      onUpdateTestimonials([...testimonials, editingTestimonial]);
    } else {
      onUpdateTestimonials(testimonials.map(t => t.id === editingTestimonial.id ? editingTestimonial : t));
    }

    setEditingTestimonial(null);
    setIsAddingTestimonial(false);
  };


  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
      onUpdateTestimonials(testimonials.filter(t => t.id !== id));
      setSelectedTestimonials(selectedTestimonials.filter(selectedId => selectedId !== id));
    }
  };

  const handleBulkDelete = () => {
    if (selectedTestimonials.length === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedTestimonials.length} testimonial(s)?`)) {
      onUpdateTestimonials(testimonials.filter(t => !selectedTestimonials.includes(t.id)));
      setSelectedTestimonials([]);
    }
  };

  const toggleTestimonialSelection = (id: string) => {
    setSelectedTestimonials(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const selectAllTestimonials = () => {
    if (selectedTestimonials.length === filteredTestimonials.length) {
      setSelectedTestimonials([]);
    } else {
      setSelectedTestimonials(filteredTestimonials.map(t => t.id));
    }
  };

  const totalVisitors = visitorData.reduce((sum, data) => sum + data.visitors, 0);
  const avgVisitors = Math.round(totalVisitors / visitorData.length);
  const averageTestimonialRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const uniqueVisitors = totalVisitors; // Since we now track unique visits only

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                <img  src="logo.png"  alt="Logo" className="w-full h-full object-cover"/>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Virtu Serve Admin</h1>
                <p className="text-xs text-gray-600 hidden sm:block">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <a
                href="/"
                className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-2 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Visit Homepage</span>
                <span className="sm:hidden">Home</span>
              </a>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 sm:space-x-2 text-gray-600 hover:text-gray-900 transition-colors text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-nowrap gap-1 sm:gap-0 sm:space-x-1 bg-gray-100 p-1 rounded-lg mb-8 max-w-full sm:max-w-md">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'analytics' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'services' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Services</span>
            <span className="sm:hidden">Items</span>
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'testimonials' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Reviews</span>
            <span className="sm:hidden">Reviews</span>
          </button>
          <button
            onClick={() => setActiveTab('contact')}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md font-medium transition-colors text-sm sm:text-base ${
              activeTab === 'contact' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Contact</span>
            <span className="sm:hidden">Contact</span>
          </button>
        </div>

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Unique Visitors</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{uniqueVisitors}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Session-based tracking</p>
                  </div>
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Average Daily</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{avgVisitors}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Unique visits per day</p>
                  </div>
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Services</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{services.length}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Active service offerings</p>
                  </div>
                  <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{averageTestimonialRating.toFixed(1)}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden sm:block">Customer satisfaction</p>
                  </div>
                  <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Visitor Tracking Information */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Visitor Tracking Details</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Tracking Method</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Session-based unique visitor tracking</li>
                    <li>• 30-minute session timeout</li>
                    <li>• 24-hour cooldown for repeat visits</li>
                    <li>• Cross-tab session management</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">What Counts as a Visit</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• First landing on the website</li>
                    <li>• Return after 24+ hours</li>
                    <li>• New session after timeout</li>
                    <li>• Does NOT count page refreshes or navigation</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Unique Visitor Analytics</h3>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      formatter={(value) => [`${value} unique visitors`, 'Visitors']}
                    />
                    <Bar dataKey="visitors" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Services & Products</h2>
              <div className="flex space-x-2 sm:space-x-3 w-full sm:w-auto">
                <button
                  onClick={handleAddService}
                  className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base flex-1 sm:flex-none justify-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            {/* Services Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg sm:text-xl font-semibold text-blue-900 flex items-center">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Services
                </h3>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">Professional services and expertise we offer</p>
              </div>
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {services
                    .filter(service => service.category === 'Services')
                    .map(service => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{service.title}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingService(service)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    ))}
                  {services.filter(service => service.category === 'Services').length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No services added yet. Click "Add Item" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 bg-green-50">
                <h3 className="text-xl font-semibold text-green-900 flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Products
                </h3>
                <p className="text-sm text-green-700 mt-1">Digital products and deliverables we create</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services
                    .filter(service => service.category === 'Products')
                    .map(service => (
                      <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">{service.title}</h4>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setEditingService(service)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{service.description}</p>
                      </div>
                    ))}
                  {services.filter(service => service.category === 'Products').length === 0 && (
                    <div className="col-span-full text-center py-8 text-gray-500">
                      <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No products added yet. Click "Add Item" to get started.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Other Categories */}
            {categories.filter(cat => cat !== 'Services' && cat !== 'Products').length > 0 && (
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Other Categories
                  </h3>
                  <p className="text-sm text-gray-700 mt-1">Custom categories you've created</p>
                </div>
                <div className="p-6">
                  {categories
                    .filter(cat => cat !== 'Services' && cat !== 'Products')
                    .map(category => (
                      <div key={category} className="mb-6">
                        <h4 className="text-lg font-medium text-gray-800 mb-4">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {services
                            .filter(service => service.category === category)
                            .map(service => (
                              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                  <h5 className="font-semibold text-gray-900">{service.title}</h5>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => setEditingService(service)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteService(service.id)}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-gray-600 text-sm">{service.description}</p>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Edit Service Modal */}
            {editingService && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">
                      {isAddingService ? 'Add Service' : 'Edit Service'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={editingService.title}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          title: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={editingService.description}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          description: e.target.value
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <select
                        value={editingService.category}
                        onChange={(e) => setEditingService({
                          ...editingService,
                          category: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Services">Services</option>
                        <option value="Products">Products</option>
                        {categories
                          .filter(cat => cat !== 'Services' && cat !== 'Products')
                          .map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        <option value="Custom Category">Add Custom Category</option>
                      </select>
                    </div>

                    {editingService.category === 'Custom Category' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Custom Category Name
                        </label>
                        <input
                          type="text"
                          onChange={(e) => setEditingService({
                            ...editingService,
                            category: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter category name"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setEditingService(null);
                        setIsAddingService(false);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveService}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Manage Testimonials</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {selectedTestimonials.length > 0 && (
                  <button
                    onClick={handleBulkDelete}
                    className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected ({selectedTestimonials.length})</span>
                  </button>
                )}
                <button
                  onClick={handleAddTestimonial}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Review</span>
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, designation, or review content..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={ratingFilter || ''}
                    onChange={(e) => setRatingFilter(e.target.value ? parseInt(e.target.value) : null)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Testimonials List */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={selectAllTestimonials}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>
                      {selectedTestimonials.length === filteredTestimonials.length ? 'Deselect All' : 'Select All'}
                    </span>
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  {filteredTestimonials.length} of {testimonials.length} testimonials
                </p>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredTestimonials.map(testimonial => (
                  <div key={testimonial.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <input
                        type="checkbox"
                        checked={selectedTestimonials.includes(testimonial.id)}
                        onChange={() => toggleTestimonialSelection(testimonial.id)}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.designation}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {Array.from({ length: 5 }, (_, index) => (
                                <Star
                                  key={index}
                                  className={`w-4 h-4 ${
                                    index < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => setEditingTestimonial(testimonial)}
                                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(testimonial.id)}
                                className="p-1 text-red-600 hover:text-red-800 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">"{testimonial.comment}"</p>
                        <p className="text-xs text-gray-500 mt-2">Added: {new Date(testimonial.dateAdded).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Testimonial Modal */}
            {editingTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold">
                      {isAddingTestimonial ? 'Add Testimonial' : 'Edit Testimonial'}
                    </h3>
                    <button
                      onClick={() => {
                        setEditingTestimonial(null);
                        setIsAddingTestimonial(false);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.name}
                        onChange={(e) => setEditingTestimonial({
                          ...editingTestimonial,
                          name: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Designation/Title
                      </label>
                      <input
                        type="text"
                        value={editingTestimonial.designation}
                        onChange={(e) => setEditingTestimonial({
                          ...editingTestimonial,
                          designation: e.target.value
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Marketing Director, CEO"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Rating
                      </label>
                      <div className="flex items-center space-x-2">
                        {Array.from({ length: 5 }, (_, index) => (
                          <button
                            key={index}
                            onClick={() => setEditingTestimonial({
                              ...editingTestimonial,
                              rating: index + 1
                            })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                index < editingTestimonial.rating 
                                  ? 'text-yellow-400 fill-current hover:text-yellow-500' 
                                  : 'text-gray-300 hover:text-gray-400'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {editingTestimonial.rating} star{editingTestimonial.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Comment
                      </label>
                      <textarea
                        value={editingTestimonial.comment}
                        onChange={(e) => setEditingTestimonial({
                          ...editingTestimonial,
                          comment: e.target.value
                        })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter the customer's review..."
                      />
                    </div>

                    <div>
                      {/* <label className="block text-sm font-medium text-gray-700 mb-1">
                        Profile Picture
                      </label> */}
                      <ImageUpload
                        currentImage={editingTestimonial.avatar}
                        onImageChange={(imageUrl) => setEditingTestimonial({
                          ...editingTestimonial,
                          avatar: imageUrl
                        })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setEditingTestimonial(null);
                        setIsAddingTestimonial(false);
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveTestimonial}
                      disabled={!editingTestimonial.name || !editingTestimonial.comment}
                      className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              <button
                onClick={() => setEditingContact(!editingContact)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>{editingContact ? 'Cancel' : 'Edit'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  {editingContact ? (
                    <input
                      type="text"
                      value={tempContactInfo.phone}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo,
                        phone: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{contactInfo.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  {editingContact ? (
                    <input
                      type="email"
                      value={tempContactInfo.email}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo,
                        email: e.target.value
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{contactInfo.email}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Address
                  </label>
                  {editingContact ? (
                    <textarea
                      value={tempContactInfo.address}
                      onChange={(e) => setTempContactInfo({
                        ...tempContactInfo,
                        address: e.target.value
                      })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-line">{contactInfo.address}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    <Clock className="w-4 h-4 inline mr-2" />
                    Business Hours
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Monday - Friday
                      </label>
                      {editingContact ? (
                        <input
                          type="text"
                          value={tempContactInfo.businessHours.weekdays}
                          onChange={(e) => setTempContactInfo({
                            ...tempContactInfo,
                            businessHours: {
                              ...tempContactInfo.businessHours,
                              weekdays: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{contactInfo.businessHours.weekdays}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Saturday
                      </label>
                      {editingContact ? (
                        <input
                          type="text"
                          value={tempContactInfo.businessHours.saturday}
                          onChange={(e) => setTempContactInfo({
                            ...tempContactInfo,
                            businessHours: {
                              ...tempContactInfo.businessHours,
                              saturday: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{contactInfo.businessHours.saturday}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Sunday
                      </label>
                      {editingContact ? (
                        <input
                          type="text"
                          value={tempContactInfo.businessHours.sunday}
                          onChange={(e) => setTempContactInfo({
                            ...tempContactInfo,
                            businessHours: {
                              ...tempContactInfo.businessHours,
                              sunday: e.target.value
                            }
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-gray-900">{contactInfo.businessHours.sunday}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              </div>

              {/* Social Media Links */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Social Media Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Linkedin className="w-4 h-4 inline mr-2" />
                      LinkedIn
                    </label>
                    {editingContact ? (
                      <input
                        type="url"
                        value={tempContactInfo.socialMedia?.linkedin || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            linkedin: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://linkedin.com/company/yourcompany"
                      />
                    ) : (
                      <p className="text-gray-900">{contactInfo.socialMedia?.linkedin || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Instagram className="w-4 h-4 inline mr-2" />
                      Instagram
                    </label>
                    {editingContact ? (
                      <input
                        type="url"
                        value={tempContactInfo.socialMedia?.instagram || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            instagram: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://instagram.com/yourcompany"
                      />
                    ) : (
                      <p className='text-gray-900'>{contactInfo.socialMedia?.instagram || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Facebook className="w-4 h-4 inline mr-2" />
                      Facebook
                    </label>
                    {editingContact ? (
                      <input
                        type="url"
                        value={tempContactInfo.socialMedia?.facebook || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            facebook: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://facebook.com/yourcompany"
                      />
                    ) : (
                      <p className='text-gray-900'>{contactInfo.socialMedia?.facebook || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <WhatsAppIcon className="w-4 h-4 inline mr-2" />
                      WhatsApp
                    </label>
                    {editingContact ? (
                      <input
                        type="url"
                        value={tempContactInfo.socialMedia?.whatsapp || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            whatsapp: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://wa.me/1234567890"
                      />
                    ) : (
                      <p className='text-gray-900'>{contactInfo.socialMedia?.whatsapp || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TikTokIcon className="w-4 h-4 inline mr-2" />
                      TikTok
                    </label>
                    {editingContact ? (
                      <input
                        type="url"
                        value={tempContactInfo.socialMedia?.tiktok || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            tiktok: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://tiktok.com/@yourcompany"
                      />
                    ) : (
                      <p className='text-gray-900'>{contactInfo.socialMedia?.tiktok || 'Not provided'}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Link
                    </label>
                    {editingContact ? (
                      <input
                        type="text"
                        value={tempContactInfo.socialMedia?.email || ''}
                        onChange={(e) => setTempContactInfo({
                          ...tempContactInfo,
                          socialMedia: {
                            ...tempContactInfo.socialMedia,
                            email: e.target.value
                          }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="mailto:contact@yourcompany.com"
                      />
                    ) : (
                      <p className='text-gray-900'>{contactInfo.socialMedia?.email || 'Not provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {editingContact && (
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setEditingContact(false);
                    setTempContactInfo(contactInfo);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveContact}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}