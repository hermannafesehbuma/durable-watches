'use client';

import { useState, FormEvent } from 'react';
import Faqs from './faqs';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        // Reset form
        setFormData({ name: '', email: '', message: '' });
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <div>
        <h3 className="mt-20 text-2xl">Contact Form</h3>
        <p>We will get back to you as soon as possible.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-5">
        <motion.div variants={itemVariants}>
          <label htmlFor="name" className="block text-sm font-medium ">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-teal-600 focus:border-teal-600 sm:text-sm text-gray-800"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-800"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <label htmlFor="message" className="block text-sm font-medium ">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm  focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm text-gray-800"
          ></textarea>
        </motion.div>
        <motion.div variants={itemVariants}>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </motion.div>
      </form>
      <Faqs />
    </motion.div>
  );
}
