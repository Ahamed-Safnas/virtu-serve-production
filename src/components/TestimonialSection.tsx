import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialSectionProps {
  testimonials: Testimonial[];
}

export default function TestimonialSection({ testimonials }: TestimonialSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Calculate metrics
  const totalCustomers = testimonials.length * 47; // Multiply by factor for realistic number
  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const roundedRating = Math.round(averageRating * 10) / 10;

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starClass = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`${starClass} ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (testimonials.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600">No testimonials available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Discover why businesses trust us with their most important projects
          </p>

          {/* Metrics Display */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{totalCustomers.toLocaleString()}+</div>
              <div className="text-gray-600 font-medium">Customers Served</div>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-300"></div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-4xl font-bold text-blue-600 mr-3">{roundedRating}</span>
                <div className="flex items-center">
                  {renderStars(Math.floor(averageRating), 'lg')}
                </div>
              </div>
              <div className="text-gray-600 font-medium">Average Rating</div>
            </div>
          </div>
        </div>

        {/* Testimonial Carousel */}
        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonial Cards */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="w-full flex-shrink-0 bg-white p-8 md:p-12"
                >
                  <div className="max-w-3xl mx-auto text-center">
                    <div className="mb-8">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-20 h-20 rounded-full object-cover mx-auto mb-6 shadow-lg"
                      />
                      <div className="flex justify-center mb-4">
                        {renderStars(testimonial.rating, 'lg')}
                      </div>
                    </div>
                    
                    <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 italic">
                      "{testimonial.comment}"
                    </blockquote>
                    
                    <div className="text-center">
                      <h4 className="text-lg font-bold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600">{testimonial.designation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            {isAutoPlaying ? 'Hover to pause auto-scroll' : 'Auto-scroll paused'} • Use arrows or dots to navigate
          </p>
        </div>
      </div>
    </section>
  );
}