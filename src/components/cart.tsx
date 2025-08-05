'use client';

import { useCart } from '@/contexts/cart-context';
import { getProductPrimaryImages } from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaTrash } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface PrimaryImage {
  product_id: string;
  url: string;
  alt_text?: string;
}

export default function Cart() {
  const { state, removeItem, updateQuantity } = useCart();
  const router = useRouter();
  const [primaryImages, setPrimaryImages] = useState<PrimaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);

  // Fetch primary images when cart items change
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

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen pt-32 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-8">Your Cart</h1>
          <div className="bg-gray-800 rounded-lg p-12">
            <div className="text-gray-400 mb-6">
              <svg
                className="w-24 h-24 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                />
              </svg>
              <p className="text-xl">Your cart is empty</p>
            </div>
            <Link
              href="/products"
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors inline-block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Your Cart ({state.totalItems} items)
        </h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {/* Cart Items */}
          <div className="divide-y divide-gray-700">
            {state.items.map((item) => {
              const primaryImage = getPrimaryImage(item.id);

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4"
                >
                  {/* Enhanced Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-lg overflow-hidden mx-auto sm:mx-0">
                    {(() => {
                      const imageUrl = primaryImage?.url || item.image_url;
                      const altText = primaryImage?.alt_text || item.name;

                      return imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={altText}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">
                            {isLoadingImages ? 'Loading...' : 'No Image'}
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                      {item.name}
                    </h3>
                    {item.sku && (
                      <p className="text-xs sm:text-sm text-gray-400">
                        SKU: {item.sku}
                      </p>
                    )}
                    <p className="text-base sm:text-lg font-bold text-teal-400">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity Controls and Actions Row */}
                  <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Total and Remove Button */}
                    <div className="flex items-center space-x-4">
                      <div className="text-center sm:text-right">
                        <p className="text-base sm:text-lg font-bold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove from cart"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="bg-gray-900 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-semibold text-white">
                Total:
              </span>
              <span className="text-xl sm:text-2xl font-bold text-teal-400">
                ${state.totalPrice.toFixed(2)}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                href="/products"
                className="flex-1 bg-gray-700 text-white py-3 px-6 rounded-lg text-center hover:bg-gray-600 transition-colors"
              >
                Continue Shopping
              </Link>
              <button
                onClick={handleProceedToCheckout}
                className="flex-1 bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
