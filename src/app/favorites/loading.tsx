'use client';

import { motion } from 'framer-motion';

export default function FavoritesLoading() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">My Favorites</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="border border-gray-700 rounded-lg p-4 space-y-4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="aspect-square bg-gray-800 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse" />
                  <div className="h-6 bg-gray-700 rounded w-1/3 animate-pulse" />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <motion.div
              className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <p className="text-gray-400 mt-2">Loading favorites...</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
