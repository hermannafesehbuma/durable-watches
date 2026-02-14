'use client';

import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  rating: number;
  testimonial: string;
}

// Using the same testimonials data from your official page
const testimonials: Testimonial[] = [
  {
    name: 'Alex Johnson',
    rating: 5,
    testimonial:
      'From the moment I inquired about a vintage piece, the team at Durable Watches Sale was exceptional. Their knowledge and passion are unmatched. The shipping was discreet and incredibly fast. A truly five-star experience from start to finish!',
  },
  {
    name: 'Samantha Bee',
    rating: 4.9,
    testimonial:
      "I was hesitant to purchase a luxury watch online, but Adrian and his team made the process seamless and transparent. The watch arrived in pristine condition, exactly as described. Their reputation is well-deserved. I'm already planning my next purchase!",
  },
  {
    name: 'Michael Chen',
    rating: 5,
    testimonial:
      "The level of detail and care that went into my purchase was astounding. Jeff took the time to walk me through the watch's features and history. It's rare to find such personalized service. Durable Watches Sale has earned a customer for life.",
  },
  {
    name: 'Jessica Miller',
    rating: 5,
    testimonial:
      'I had been searching for a specific model for months. Durable Watches Sale not only sourced it for me but offered it at a competitive price. The entire transaction was smooth, and their communication was top-notch. Highly recommended!',
  },
  {
    name: 'Robert Bermann',
    rating: 4.5,
    testimonial:
      "The timepiece exceeds my expectation. I can't give better review. Adrian was a tough negotiator but he was very competitive. I wouldn't hesitate to do business with DURABLE WATCHES SALE.",
  },
  {
    name: 'Phil Brines',
    rating: 4.8,
    testimonial:
      'The best of the best service imaginable! Adrian is a top shelf professional. They are a small shop and they seem legitimately nice people. Amazing place full of amazing people.',
  },
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return names[0] ? names[0][0] : '';
};

const StarRating = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className="text-yellow-400 text-sm" />
      ))}
      {hasHalfStar && <FaStar className="text-yellow-400 text-sm opacity-50" />}
      {[...Array(5 - Math.ceil(rating))].map((_, index) => (
        <FaStar key={`empty-${index}`} className="text-gray-400 text-sm" />
      ))}
      <span className="ml-2 text-sm text-gray-400">{rating}</span>
    </div>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export default function LandingTestimonials() {
  // Show only first 3 testimonials for landing page
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-16 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Watch Enthusiasts
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our customers say about
            their experience with Durable Watches Sale.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {featuredTestimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-white text-lg font-bold">
                    {getInitials(testimonial.name)}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-white text-lg">
                    {testimonial.name}
                  </p>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                "
                {testimonial.testimonial.length > 150
                  ? `${testimonial.testimonial.substring(0, 150)}...`
                  : testimonial.testimonial}
                "
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <a
            href="/testimonials"
            className="inline-flex items-center px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-300"
          >
            Read More Reviews
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
