'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb skeleton */}
        <div className="mb-8">
          <div className="h-4 bg-gray-700 rounded w-64 animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="space-y-4">
            <motion.div
              className="aspect-square bg-gray-800 rounded-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="h-8 bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-1/3 animate-pulse"></div>
            </div>

            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6 animate-pulse"></div>
              <div className="h-4 bg-gray-700 rounded w-4/5 animate-pulse"></div>
            </div>

            <div className="space-y-4">
              <div className="h-12 bg-gray-700 rounded animate-pulse"></div>
              <div className="flex space-x-4">
                <div className="h-12 bg-gray-700 rounded flex-1 animate-pulse"></div>
                <div className="h-12 bg-gray-700 rounded w-12 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading spinner */}
        <div className="flex justify-center mt-12">
          <motion.div
            className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      </div>
    </div>
  );
}
