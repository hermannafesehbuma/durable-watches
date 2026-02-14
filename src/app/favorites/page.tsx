'use client';

import { useFavorites } from '@/contexts/favorites-context';
import { getProductPrimaryImages } from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link';
import { FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface PrimaryImage {
  product_id: string;
  url: string;
  alt_text?: string;
}

export default function FavoritesPage() {
  const { state, removeFavorite, clearFavorites } = useFavorites();
  const [primaryImages, setPrimaryImages] = useState<PrimaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch primary images when favorite items change
  useEffect(() => {
    const fetchPrimaryImages = async () => {
      if (state.items.length === 0) {
        setPrimaryImages([]);
        return;
      }

      setIsLoadingImages(true);
      const productIds = state.items.map((item) => item.id);
      const { data: images, error } = await getProductPrimaryImages(productIds);

      if (error || !images) {
        console.error('Failed to fetch primary images:', error);
        setPrimaryImages([]);
      } else {
        setPrimaryImages(images);
      }
      setIsLoadingImages(false);
    };

    fetchPrimaryImages();
  }, [state.items]);

  // Helper function to get primary image for a product
  const getPrimaryImage = (productId: string) => {
    return primaryImages.find((img) => img.product_id === productId);
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold mb-4">Your Favorites</h1>
            <p className="text-gray-400 mb-8">
              You haven't added any items to your favorites yet.
            </p>
            <Link
              href="/"
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">
            Your Favorites ({state.totalItems})
          </h1>
          {state.items.length > 0 && (
            <button
              onClick={clearFavorites}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {state.items.map((item) => {
            const primaryImage = getPrimaryImage(item.id);

            return (
              <div
                key={item.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg"
              >
                <div className="relative">
                  {(() => {
                    const imageUrl = primaryImage?.url || item.image_url;
                    const altText = primaryImage?.alt_text || item.name;

                    return imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={altText}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">
                          {isLoadingImages ? 'Loading...' : 'No Image'}
                        </span>
                      </div>
                    );
                  })()}
                  <button
                    onClick={() => removeFavorite(item.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <FaTrash className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                  {item.sku && (
                    <p className="text-sm text-gray-400 mb-2">
                      SKU: {item.sku}
                    </p>
                  )}
                  <p className="text-xl font-bold text-teal-400 mb-4">
                    ${item.price}
                  </p>
                  <Link
                    href={`/product/${item.id}`}
                    className="block w-full bg-teal-600 text-white text-center py-2 rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    View Product
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
