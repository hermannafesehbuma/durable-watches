'use client';

import { FaStar, FaGoogle } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Testimonial {
  name: string;
  rating: number;
  testimonial: string;
}

const testimonials: Testimonial[] = [
  {
    name: 'Alex Johnson',
    rating: 5,
    testimonial:
      'From the moment I inquired about a vintage piece, the team at Rolex Durable Watches was exceptional. Their knowledge and passion are unmatched. The shipping was discreet and incredibly fast. A truly five-star experience from start to finish!',
  },
  {
    name: 'Samantha Bee',
    rating: 4.9,
    testimonial:
      "I was hesitant to purchase a luxury watch online, but Danny and his team made the process seamless and transparent. The watch arrived in pristine condition, exactly as described. Their reputation is well-deserved. I'm already planning my next purchase!",
  },
  {
    name: 'Michael Chen',
    rating: 5,
    testimonial:
      "The level of detail and care that went into my purchase was astounding. Jeff took the time to walk me through the watch's features and history. It's rare to find such personalized service. Rolex Durable Watches has earned a customer for life.",
  },
  {
    name: 'Jessica Miller',
    rating: 5,
    testimonial:
      'I had been searching for a specific model for months. Rolex Durable Watches not only sourced it for me but offered it at a competitive price. The entire transaction was smooth, and their communication was top-notch. Highly recommended!',
  },
  {
    name: 'Robert Bermann',
    rating: 4.5,
    testimonial:
      'The timepiece exceeds my expectation. I can’t give better review. Danny was a tough negotiator but he was very competitive. I wouldn’t hesitate to do business with My Watch LLC. UPDATE: Well we had little issue with the watch. Not really the watch but the white tag didn’t come with the watch. As soon as I discovered I notified Danny and he couldn’t have been any kinder. He told me that he would replace the watch. He told about a Submariner that he had yet to put on his website. I received the timepiece next day. My experience, in the end, exceeded my expectations. My standards are high. Is there a way to give them 10 stars?!?!',
  },
  {
    name: 'Capn Walt',
    rating: 4.7,
    testimonial:
      'As a Rolex Enthusiast (buy, sell, trade) I am very happy to ad My Watch LLC to my source list. Danny is Great Communicator and very easy to business with. Looking forward to our next transaction.',
  },
  {
    name: 'Jasson Weligh',
    rating: 4.5,
    testimonial:
      'I recently purchased a Day-Date from MY Watch LLC. I could not be any happier with my purchase. Danny answered all my questions and or concerns in a timely manner. Most importantly the watch I purchased is awesome. I will definitely be purchasing more watch from Danny. I recommend that anyone looking for a smooth transaction, with a wonderful person, who offers excellent watches you found it at MY Watches LLC',
  },
  {
    name: 'Phil Brines',
    rating: 4.8,
    testimonial:
      'The best of the best service imaginable! Danny is a top shelf professional. I truly appreciate this. They are a small shop and they seem legitimately nice people. Looking for a watch? They’ve probably got it waiting there for you. Amazing place full of amazing people. Also, I’m head over heels in love with my Rolex DJ41. The mint green dial soothes my soul.',
  },
  {
    name: 'Gabriel Proal',
    rating: 4.8,
    testimonial:
      'Big thanks to Sam, Danny, & Jeff who were a pleasure to work with. They answered all my questions, chatted with me on facetime, & shipped overnight. The watch is beautiful!',
  },
  {
    name: 'Suzan Asher',
    rating: 5,
    testimonial:
      'Smoothe and seamless transaction. And, as others have commented, the communication was excellent and shipping was quick and safe. Danny is great to work with.',
  },
];

const getInitials = (name: string) => {
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`;
  }
  return names[0] ? names[0][0] : '';
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <FaStar
          key={index}
          className={index < rating ? 'text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold  sm:text-4xl">
            What Our Customers Are Saying
          </h2>
          <div className="flex justify-center items-center mt-4">
            <FaGoogle className="text-2xl text-white mr-2" />
            <p className="text-lg text-gray-600">Based on Google Reviews</p>
          </div>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2  gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className=" bg-zinc-900 rounded-lg shadow-lg p-6"
              variants={itemVariants}
            >
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center mr-4">
                  <span className="text-white text-xl font-bold">
                    {getInitials(testimonial.name)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-lg text-white">
                    {testimonial.name}
                  </p>
                  <StarRating rating={testimonial.rating} />
                </div>
              </div>
              <p className="text-white">{testimonial.testimonial}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
