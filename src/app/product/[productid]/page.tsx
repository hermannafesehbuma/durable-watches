import Image from 'next/image';
import { getProductById } from '../../../api/supabaseapi';
import ProductImages from '@/components/product-images';
import AddToCart from '@/components/add-to-cart';
import FavoriteButton from '@/components/favorite-button';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  image_url?: string;
  category?: string;
  brand?: string;
  material?: string;
  weight?: string;
  stock_quantity?: number;
  sku?: string;
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.productid;

  // Fetch the specific product by ID
  const { data: product, error } = await getProductById(productId);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Product
          </h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-30">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <a
                  href="/products"
                  className="text-gray-500 hover:text-gray-700"
                >
                  Products
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium">{product.name}</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-6">
            <ProductImages productId={productId} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {product.name}
              </h1>
              <p className="text-sm text-gray-500 mb-4">
                SKU: {product.sku || productId}
              </p>

              {/* Price */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-white">
                  ${product.price || 'Contact for Price'}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Product Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">
                Description
              </h3>
              <div className="text-white leading-relaxed">
                {product.description ? (
                  <>
                    {product.description
                      .split('✔️')
                      .map((point: string, index: number) => {
                        if (index === 0 && !point.trim()) return null;
                        return (
                          <p key={index} className="mb-2 flex">
                            {index > 0 && (
                              <span className="text-green-400 mr-2">✔️</span>
                            )}
                            <span>{point.trim()}</span>
                          </p>
                        );
                      })}
                  </>
                ) : (
                  'No description available for this product.'
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div>
              <h3 className="text-lg font-semibold text-gray-200 mb-3">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {product.brand && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Brand:
                    </span>
                    <p className="text-white">{product.brand}</p>
                  </div>
                )}
                {product.category && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Category:
                    </span>
                    <p className="text-white">{product.category}</p>
                  </div>
                )}
                {product.daimeter && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Daimeter:
                    </span>
                    <p className="text-white">{product.daimeter}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  product.stock_quantity ? 'bg-green-500' : 'bg-red-500'
                }`}
              ></div>
              <span
                className={`text-sm font-medium ${
                  product.stock_quantity ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {product.stock_quantity ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <div className="flex space-x-4">
                <AddToCart product={product} />
              </div>
              <div className="flex flex-row gap-2">
                <button className="w-full py-3 px-6 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-800 transition-colors hover:text-white">
                  Buy Now
                </button>
                <FavoriteButton
                  product={{
                    id: productId,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    sku: product.sku,
                  }}
                  className="px-6 py-3 border rounded-lg"
                />
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t pt-6 space-y-4">
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-white">
                  Free shipping on orders over $100
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm text-white">
                  30-day return guarantee
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span className="text-sm text-white">
                  Secure payment processing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
