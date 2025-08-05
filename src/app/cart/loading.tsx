'use client';

import { motion } from 'framer-motion';

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-4 p-4 border border-gray-700 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-20 h-20 bg-gray-800 rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-1/4 animate-pulse" />
                </div>
                <div className="w-24 h-8 bg-gray-700 rounded animate-pulse" />
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <motion.div
              className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-400 mt-2">Loading cart items...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
