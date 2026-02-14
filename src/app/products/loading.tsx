'use client';

import { motion } from 'framer-motion';

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header skeleton */}
          <div className="text-center mb-12">
            <div className="h-12 bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-700 rounded w-96 mx-auto animate-pulse"></div>
          </div>

          {/* Filter/Sort bar skeleton */}
          <div className="flex justify-between items-center mb-8 p-4 border border-gray-700 rounded-lg">
            <div className="flex space-x-4">
              <div className="h-10 bg-gray-700 rounded w-32 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-28 animate-pulse"></div>
              <div className="h-10 bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
            <div className="h-10 bg-gray-700 rounded w-40 animate-pulse"></div>
          </div>

          {/* Products grid skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-gray-700 rounded-lg overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Product image skeleton */}
                <div className="aspect-square bg-gray-800 animate-pulse relative">
                  {/* Discount badge skeleton */}
                  <div className="absolute top-4 left-4 w-16 h-6 bg-gray-700 rounded animate-pulse"></div>
                  {/* Favorite button skeleton */}
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-700 rounded-full animate-pulse"></div>
                </div>

                {/* Product details skeleton */}
                <div className="p-6 space-y-4">
                  {/* Brand skeleton */}
                  <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>

                  {/* Title skeleton */}
                  <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded animate-pulse"></div>
                    <div className="h-6 bg-gray-700 rounded w-4/5 animate-pulse"></div>
                  </div>

                  {/* Price and stock skeleton */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="space-y-2">
                      <div className="h-7 bg-gray-700 rounded w-24 animate-pulse"></div>
                      <div className="h-4 bg-gray-700 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="w-3 h-3 bg-gray-700 rounded-full animate-pulse"></div>
                  </div>

                  {/* Action buttons skeleton */}
                  <div className="flex space-x-3 pt-4">
                    <div className="flex-1 h-10 bg-gray-700 rounded animate-pulse"></div>
                    <div className="w-10 h-10 bg-gray-700 rounded animate-pulse"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="flex justify-center items-center space-x-4 mb-8">
            <div className="h-10 bg-gray-700 rounded w-20 animate-pulse"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gray-700 rounded animate-pulse"
                ></div>
              ))}
            </div>
            <div className="h-10 bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>

          {/* Loading spinner and text */}
          <div className="text-center">
            <motion.div
              className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-400 mt-2">Loading products...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
