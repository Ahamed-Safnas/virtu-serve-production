/*
  # Populate Initial Data for Virtu Serve
  
  1. Data Population
    - Insert all initial services (13 services, 3 products)
    - Insert contact information
    - Insert initial visitor statistics
    - Insert 8 initial testimonials
  
  2. Important Notes
    - This migration uses auto-generated UUIDs
    - Safe to run multiple times (idempotent)
    - Checks for existing data before inserting
*/

-- Insert Services (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM services LIMIT 1) THEN
    INSERT INTO services (title, description, category) VALUES
    ('Data Management & Entry Services', 'Precision data entry and typing solutions tailored to your needs.', 'Services'),
    ('Lead Generation & Data Extraction', 'Strategic sourcing and extraction of high-quality leads for business growth.', 'Services'),
    ('Comprehensive Workbook Management', 'Efficient management and organization of complex workbooks.', 'Services'),
    ('Advanced Spreadsheet Solutions', 'Expertise in MS Office Suite and Google Sheets for optimized data handling.', 'Services'),
    ('Data Replication & Conversion Services', 'Seamless copy-paste tasks and file format conversions for streamlined workflows.', 'Services'),
    ('Academic Typing & Document Preparation', 'Specialized services for exam preparation, including multiple-choice questions and academic typing.', 'Services'),
    ('Professional CV & Resume Optimization', 'Crafting and enhancing resumes to highlight your strengths and achieve your career goals.', 'Services'),
    ('Professional Call Handling', 'Efficient management of business and client calls with clarity, professionalism, and care.', 'Services'),
    ('Presentation Creation', 'Engaging and impactful presentations tailored for academic, corporate, or business needs.', 'Services'),
    ('LinkedIn Profile Creation', 'Optimized LinkedIn profiles designed to highlight professional achievements and attract opportunities.', 'Services'),
    ('EBook Development', 'Well-structured and professionally designed ebooks on diverse topics to showcase expertise and add value.', 'Services'),
    ('Calligraphy Designs', 'Elegant and artistic calligraphy creations, perfect for gifts, branding, and personalized projects.', 'Services'),
    ('Customized Instagram Highlights', 'Aesthetic and personalized Instagram highlight covers designed to reflect your brand identity or personal style.', 'Services'),
    ('Design Services for Gem Business Owners', 'Creative, industry-focused designs that enhance brand identity and appeal in the gem and jewelry sector.', 'Products'),
    ('Customized Sticker Creation', 'Unique, high-quality stickers customized to suit personal, branding, or business requirements.', 'Products'),
    ('Customized Bookmarks', 'Beautifully designed, printable bookmarks tailored with your favorite pictures, quotes, or themes.', 'Products');
  END IF;
END $$;

-- Insert Contact Information (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM contact_info LIMIT 1) THEN
    INSERT INTO contact_info (
      phone, 
      email, 
      address, 
      business_hours, 
      social_media
    ) VALUES (
      '+94 727887300',
      'servevirtu@gmail.com',
      'Worldwide(remote operation)',
      '{"weekdays": "9:00 AM - 6:00 PM", "saturday": "10:00 AM - 4:00 PM", "sunday": "Closed"}'::jsonb,
      '{"email": "mailto:servevirtu@gmail.com", "tiktok": "https://www.tiktok.com/@virtu.serve?_t=ZS-8wEfuX0IEKe&_r=1", "facebook": "https://www.facebook.com/share/1B9qPzn9vD/?mibextid=wwXIfr", "linkedin": "https://www.linkedin.com/company/virtuserve-sl/", "whatsapp": "https://wa.me/+94727887300", "instagram": "https://www.instagram.com/virtu.serve?igsh=MW4xaWpyZXlpYzN0cw=="}'::jsonb
    );
  END IF;
END $$;

-- Insert Initial Visitor Statistics
INSERT INTO visitor_stats (date, visitors) VALUES
('2024-12-20', 1),
('2024-12-21', 4)
ON CONFLICT (date) DO NOTHING;

-- Insert Testimonials (only if table is empty)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM testimonials LIMIT 1) THEN
    INSERT INTO testimonials (name, designation, rating, comment, avatar, date_added) VALUES
    ('Sarah Johnson', 'Marketing Director', 5, 'Virtu Serve transformed our data management process. Their attention to detail and quick turnaround exceeded our expectations.', 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-15'),
    ('Michael Chen', 'Business Owner', 5, 'The resume optimization service helped me land my dream job. Professional, efficient, and results-driven.', 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-16'),
    ('Emily Rodriguez', 'Startup Founder', 5, 'Their creative design services brought our brand vision to life. The custom stickers and branding materials are outstanding.', 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-17'),
    ('David Thompson', 'Operations Manager', 4, 'Excellent lead generation services that significantly boosted our sales pipeline. Highly recommend their professional approach.', 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-18'),
    ('Lisa Park', 'HR Director', 5, 'The presentation creation service delivered exactly what we needed for our board meeting. Professional and polished results.', 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-19'),
    ('Robert Kim', 'Consultant', 5, 'Their LinkedIn profile optimization service was game-changing. Increased my profile views by 300% within a month.', 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-20'),
    ('Amanda Foster', 'Content Creator', 4, 'The ebook development service exceeded expectations. Professional formatting and engaging content that resonates with readers.', 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-21'),
    ('James Wilson', 'Jewelry Business Owner', 5, 'The gem business design services perfectly captured our brand essence. Beautiful, professional designs that attract customers.', 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop', '2024-01-22');
  END IF;
END $$;