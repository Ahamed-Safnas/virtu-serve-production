import { Service, ContactInfo, VisitorData, Testimonial } from '../types';

export const initialServices: Service[] = [
  // Services
  {
    id: '1',
    title: 'Data Management & Entry Services',
    description: 'Precision data entry and typing solutions tailored to your needs.',
    category: 'Services'
  },
  {
    id: '2',
    title: 'Lead Generation & Data Extraction',
    description: 'Strategic sourcing and extraction of high-quality leads for business growth.',
    category: 'Services'
  },
  {
    id: '3',
    title: 'Comprehensive Workbook Management',
    description: 'Efficient management and organization of complex workbooks.',
    category: 'Services'
  },
  {
    id: '4',
    title: 'Advanced Spreadsheet Solutions',
    description: 'Expertise in MS Office Suite and Google Sheets for optimized data handling.',
    category: 'Services'
  },
  {
    id: '5',
    title: 'Data Replication & Conversion Services',
    description: 'Seamless copy-paste tasks and file format conversions for streamlined workflows.',
    category: 'Services'
  },
  {
    id: '6',
    title: 'Academic Typing & Document Preparation',
    description: 'Specialized services for exam preparation, including multiple-choice questions and academic typing.',
    category: 'Services'
  },
  {
    id: '7',
    title: 'Professional CV & Resume Optimization',
    description: 'Crafting and enhancing resumes to highlight your strengths and achieve your career goals.',
    category: 'Services'
  },
  {
    id: '8',
    title: 'Professional Call Handling',
    description: 'Efficient management of business and client calls with clarity, professionalism, and care.',
    category: 'Services'
  },
  {
    id: '9',
    title: 'Presentation Creation',
    description: 'Engaging and impactful presentations tailored for academic, corporate, or business needs.',
    category: 'Services'
  },
  {
    id: '10',
    title: 'LinkedIn Profile Creation',
    description: 'Optimized LinkedIn profiles designed to highlight professional achievements and attract opportunities.',
    category: 'Services'
  },
  {
    id: '11',
    title: 'EBook Development',
    description: 'Well-structured and professionally designed ebooks on diverse topics to showcase expertise and add value.',
    category: 'Services'
  },
  {
    id: '15',
    title: 'Calligraphy Designs',
    description: 'Elegant and artistic calligraphy creations, perfect for gifts, branding, and personalized projects.',
    category: 'Services'
  },
  {
    id: '16',
    title: 'Customized Instagram Highlights',
    description: 'Aesthetic and personalized Instagram highlight covers designed to reflect your brand identity or personal style.',
    category: 'Services'
  },
  
  // Products
  {
    id: '12',
    title: 'Design Services for Gem Business Owners',
    description: 'Creative, industry-focused designs that enhance brand identity and appeal in the gem and jewelry sector.',
    category: 'Products'
  },
  {
    id: '13',
    title: 'Customized Sticker Creation',
    description: 'Unique, high-quality stickers customized to suit personal, branding, or business requirements.',
    category: 'Products'
  },
  {
    id: '14',
    title: 'Customized Bookmarks',
    description: 'Beautifully designed, printable bookmarks tailored with your favorite pictures, quotes, or themes.',
    category: 'Products'
  }
];

// export const initialContactInfo: ContactInfo = {
//   phone: '+1 (555) 123-4567',
//   email: 'contact@virtuserve.com',
//   address: '123 Business Ave\nSuite 100, City, ST 12345',
//   businessHours: {
//     weekdays: '9:00 AM - 6:00 PM',
//     saturday: '10:00 AM - 4:00 PM',
//     sunday: 'Closed'
//   },
//   socialMedia: {
//     email: 'mailto:contact@virtuserve.com',
//     linkedin: 'https://linkedin.com/company/virtuserve',
//     instagram: 'https://instagram.com/virtuserve',
//     facebook: 'https://facebook.com/virtuserve',
//     whatsapp: 'https://wa.me/15551234567',
//     tiktok: 'https://tiktok.com/@virtuserve'
//   }
// };

export const initialContactInfo: ContactInfo = {
  phone: "+94 727887300",
  email: "servevirtu@gmail.com",
  address: "Worldwide(remote operation)",
  businessHours: {
    weekdays: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed"
  },
  socialMedia: { // Add this socialMedia object
    linkedin: "https://www.linkedin.com/company/virtuserve-sl/",
    instagram: "https://www.instagram.com/virtu.serve?igsh=MW4xaWpyZXlpYzN0cw==",
    facebook: "https://www.facebook.com/share/1B9qPzn9vD/?mibextid=wwXIfr",
    whatsapp: "https://wa.me/+94727887300",
    tiktok: "https://www.tiktok.com/@virtu.serve?_t=ZS-8wEfuX0IEKe&_r=1",
    email: "mailto:servevirtu@gmail.com"
  }
};

export const initialVisitorData: VisitorData[] = [
  { date: '2025-09-11', visitors: 1 },
  { date: '2025-09-14', visitors: 4 }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    designation: 'Marketing Director',
    rating: 5,
    comment: 'Virtu Serve transformed our data management process. Their attention to detail and quick turnaround exceeded our expectations.',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-15'
  },
  {
    id: '2',
    name: 'Michael Chen',
    designation: 'Business Owner',
    rating: 5,
    comment: 'The resume optimization service helped me land my dream job. Professional, efficient, and results-driven.',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-16'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    designation: 'Startup Founder',
    rating: 5,
    comment: 'Their creative design services brought our brand vision to life. The custom stickers and branding materials are outstanding.',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-17'
  },
  {
    id: '4',
    name: 'David Thompson',
    designation: 'Operations Manager',
    rating: 4,
    comment: 'Excellent lead generation services that significantly boosted our sales pipeline. Highly recommend their professional approach.',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-18'
  },
  {
    id: '5',
    name: 'Lisa Park',
    designation: 'HR Director',
    rating: 5,
    comment: 'The presentation creation service delivered exactly what we needed for our board meeting. Professional and polished results.',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-19'
  },
  {
    id: '6',
    name: 'Robert Kim',
    designation: 'Consultant',
    rating: 5,
    comment: 'Their LinkedIn profile optimization service was game-changing. Increased my profile views by 300% within a month.',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-20'
  },
  {
    id: '7',
    name: 'Amanda Foster',
    designation: 'Content Creator',
    rating: 4,
    comment: 'The ebook development service exceeded expectations. Professional formatting and engaging content that resonates with readers.',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-21'
  },
  {
    id: '8',
    name: 'James Wilson',
    designation: 'Jewelry Business Owner',
    rating: 5,
    comment: 'The gem business design services perfectly captured our brand essence. Beautiful, professional designs that attract customers.',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    dateAdded: '2024-01-22'
  }
];
