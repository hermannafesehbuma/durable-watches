'use client';

import { useCart } from '@/contexts/cart-context';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  sku?: string;
  stock_quantity?: number;
}

interface AddToCartProps {
  product: Product;
}

export default function AddToCart({ product }: AddToCartProps) {
  const { addItem, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const itemInCart = isInCart(product.id);

  const handleAddToCart = async () => {
    if (!product.stock_quantity || itemInCart) return;

    setIsAdding(true);

    // Add item to cart with selected quantity
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      sku: product.sku,
      quantity: quantity,
    });

    // Show feedback for a moment
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    const maxQuantity = product.stock_quantity || 1;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const getButtonText = () => {
    if (!product.stock_quantity) return 'Out of Stock';
    if (itemInCart) return 'Already in Cart';
    if (isAdding) return '✓ Added!';
    return 'Add to Cart';
  };

  const getButtonStyles = () => {
    if (!product.stock_quantity) {
      return 'bg-gray-300 text-gray-500 cursor-not-allowed';
    }
    if (itemInCart) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }
    if (isAdding) {
      return 'bg-green-600 text-white';
    }
    return 'bg-teal-600 text-white hover:bg-teal-700';
  };

  return (
    <div className="space-y-4 w-[100%]">
      {/* Quantity Selector */}
      {product.stock_quantity && !itemInCart && (
        <div className="flex items-center space-x-3">
          <label htmlFor="quantity" className="text-sm font-medium text-white">
            Quantity:
          </label>
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              −
            </button>
            <input
              type="number"
              id="quantity"
              min="1"
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) =>
                handleQuantityChange(parseInt(e.target.value) || 1)
              }
              className="w-16 px-2 py-2 text-center border-0 focus:ring-0 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= (product.stock_quantity || 1)}
              className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-400">
            {product.stock_quantity} available
          </span>
        </div>
      )}

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${getButtonStyles()}`}
        disabled={!product.stock_quantity || itemInCart || isAdding}
      >
        {getButtonText()}
      </button>
    </div>
  );
}
