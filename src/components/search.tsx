'use client';

import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { searchProducts } from '@/api/supabaseapi';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  primary_image?: {
    url: string;
    alt_text?: string;
  };
}

interface SearchProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function Search({ isOpen, onToggle, onClose }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle search
  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (searchTerm.trim() && isOpen) {
        setLoading(true);
        try {
          const { data, error } = await searchProducts(searchTerm);
          if (!error && data) {
            setResults(data);
            setShowResults(true);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, isOpen]);

  // Focus input when search opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleResultClick = () => {
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
    onClose();
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search Icon */}
      <FaSearch
        className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors"
        onClick={onToggle}
      />

      {/* Search Bar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 md:right-0 md:left-auto w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
                <button
                  onClick={onClose}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {loading && (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2">Searching...</p>
                </div>
              )}

              {!loading &&
                showResults &&
                results.length === 0 &&
                searchTerm.trim() && (
                  <div className="p-4 text-center text-gray-500">
                    <p>No products found for "{searchTerm}"</p>
                  </div>
                )}

              {!loading && results.length > 0 && (
                <div className="py-2">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={handleResultClick}
                      className="flex items-center p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex-shrink-0 w-12 h-12 mr-3">
                        {product.primary_image ? (
                          <Image
                            src={product.primary_image.url}
                            alt={product.primary_image.alt_text || product.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <FaSearch className="text-gray-400 text-sm" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {!loading && !showResults && searchTerm.trim() === '' && (
                <div className="p-4 text-center text-gray-500">
                  <p>Start typing to search products...</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
