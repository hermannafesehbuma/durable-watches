'use client';

import { useState, useEffect } from 'react';
import { getRandomProducts } from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link';
import AddToCart from './add-to-cart';
import FavoriteButton from './favorite-button';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  sku?: string;
  stock_quantity?: number;
  primary_image?: {
    id: string;
    url: string;
    alt_text?: string;
    is_primary: boolean;
  } | null;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data, error } = await getRandomProducts(4);

        if (error) {
          setError(error.message);
        } else {
          setProducts(data || []);
        }
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Featured Products
          </h2>
          <p className="text-red-400">Error loading products: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Featured Products
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const imageUrl = product.primary_image?.url || product.image_url;
            const altText = product.primary_image?.alt_text || product.name;

            return (
              <div
                key={product.id}
                className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={altText}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-600 flex items-center justify-center">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </Link>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton
                      product={{
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image_url: imageUrl,
                        sku: product.sku,
                      }}
                      className="p-2 bg-white/80 rounded-full"
                    />
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-white mb-2 hover:text-teal-400 transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                  </Link>
                  {product.sku && (
                    <p className="text-sm text-gray-400 mb-2">
                      SKU: {product.sku}
                    </p>
                  )}
                  <p className="text-xl font-bold text-teal-400 mb-4">
                    ${product.price}
                  </p>
                  <AddToCart product={product} />
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
