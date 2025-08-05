'use client';

import { useFavorites } from '@/contexts/favorites-context';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  sku?: string;
}

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  showText?: boolean;
}

export default function FavoriteButton({
  product,
  className = '',
  showText = false,
}: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [isAnimating, setIsAnimating] = useState(false);
  const isProductFavorite = isFavorite(product.id);

  const handleFavoriteToggle = () => {
    setIsAnimating(true);

    if (isProductFavorite) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        sku: product.sku,
      });
    }

    // Reset animation after a short delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  const getButtonStyles = () => {
    const baseStyles =
      'transition-all duration-300 flex items-center justify-center gap-2';
    const animationStyles = isAnimating ? 'scale-110' : 'scale-100';

    if (isProductFavorite) {
      return `${baseStyles} ${animationStyles} bg-red-500 text-white border-red-500 hover:bg-red-600 ${className}`;
    }
    return `${baseStyles} ${animationStyles} border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 ${className}`;
  };

  const getHeartStyles = () => {
    const baseStyles = 'transition-colors duration-300';
    if (isProductFavorite) {
      return `${baseStyles} text-white`;
    }
    return `${baseStyles} text-gray-400`;
  };

  const getButtonText = () => {
    if (isProductFavorite) {
      return 'Remove from Favorites';
    }
    return 'Add to Favorites';
  };

  return (
    <button
      onClick={handleFavoriteToggle}
      className={getButtonStyles()}
      title={getButtonText()}
    >
      <FaHeart className={`w-5 h-5 ${getHeartStyles()}`} />
      {showText && (
        <span className="text-sm font-medium">
          {isProductFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}
