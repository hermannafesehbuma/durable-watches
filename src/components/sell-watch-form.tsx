'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function SellWatchForm() {
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerEmail: '',
    sellerPhone: '',
    watchBrand: '',
    watchModel: '',
    watchReference: '',
    watchCondition: 'New',
    watchDescription: '',
  });
  const [watchImages, setWatchImages] = useState<FileList | null>(null);
  const [warrantyImage, setWarrantyImage] = useState<FileList | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (name === 'watchImages') {
      setWatchImages(files);
    } else if (name === 'warrantyImage') {
      setWarrantyImage(files);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Add files
      if (watchImages) {
        Array.from(watchImages).forEach((file) => {
          formDataToSend.append('watchImages', file);
        });
      }

      if (warrantyImage && warrantyImage[0]) {
        formDataToSend.append('warrantyImage', warrantyImage[0]);
      }

      const response = await fetch('/api/send-sell-watch', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        toast.success(
          "Submission sent successfully! We'll review your watch and get back to you soon."
        );
        // Reset form
        setFormData({
          sellerName: '',
          sellerEmail: '',
          sellerPhone: '',
          watchBrand: '',
          watchModel: '',
          watchReference: '',
          watchCondition: 'New',
          watchDescription: '',
        });
        setWatchImages(null);
        setWarrantyImage(null);
      } else {
        throw new Error('Failed to send submission');
      }
    } catch (error) {
      console.error('Error sending submission:', error);
      alert(
        'Sorry, there was an error sending your submission. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-3xl mx-auto p-8  rounded-lg shadow-lg"
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <motion.h2
        className="text-3xl font-bold text-center text-white"
        variants={itemVariants}
      >
        Sell Your Watch
      </motion.h2>
      <motion.p variants={itemVariants}>
        Complete the form below, and we&apos;ll be in touch with you as soon as
        possible with an initial quote.
      </motion.p>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold text-white mb-4">
          Seller Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="sellerName"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              name="sellerName"
              id="sellerName"
              value={formData.sellerName}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500 "
            />
          </div>
          <div>
            <label
              htmlFor="sellerEmail"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              type="email"
              name="sellerEmail"
              id="sellerEmail"
              value={formData.sellerEmail}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="sellerPhone"
              className="block text-sm font-medium text-gray-300"
            >
              Phone Number
            </label>
            <input
              type="tel"
              name="sellerPhone"
              id="sellerPhone"
              value={formData.sellerPhone}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold text-white mb-4">Watch Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="watchBrand"
              className="block text-sm font-medium text-gray-300"
            >
              Brand
            </label>
            <input
              type="text"
              name="watchBrand"
              id="watchBrand"
              value={formData.watchBrand}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="watchModel"
              className="block text-sm font-medium text-gray-300"
            >
              Model
            </label>
            <input
              type="text"
              name="watchModel"
              id="watchModel"
              value={formData.watchModel}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="watchReference"
              className="block text-sm font-medium text-gray-300"
            >
              Reference Number
            </label>
            <input
              type="text"
              name="watchReference"
              id="watchReference"
              value={formData.watchReference}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          <div>
            <label
              htmlFor="watchCondition"
              className="block text-sm font-medium text-gray-300"
            >
              Condition
            </label>
            <select
              name="watchCondition"
              id="watchCondition"
              value={formData.watchCondition}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option>New</option>
              <option>Mint</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="watchDescription"
              className="block text-sm font-medium text-gray-300"
            >
              Description
            </label>
            <textarea
              name="watchDescription"
              id="watchDescription"
              rows={4}
              value={formData.watchDescription}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 rounded-md shadow-sm text-gray-800 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            ></textarea>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-semibold text-white mb-4">Upload Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="watchImages"
              className="block text-sm font-medium text-gray-300"
            >
              Watch Photos
            </label>
            <input
              type="file"
              name="watchImages"
              id="watchImages"
              onChange={handleFileChange}
              multiple
              required
              className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
          </div>
          <div>
            <label
              htmlFor="warrantyImage"
              className="block text-sm font-medium text-gray-300"
            >
              Warranty Card Photo
            </label>
            <input
              type="file"
              name="warrantyImage"
              id="warrantyImage"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
            />
          </div>
        </div>
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
        variants={itemVariants}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
      </motion.button>
    </motion.form>
  );
}
