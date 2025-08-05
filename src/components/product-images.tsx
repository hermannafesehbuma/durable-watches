'use client';

import { useState, useEffect } from 'react';
import { getProductImages } from '../api/supabaseapi';
import Image from 'next/image';

interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean;
  alt_text?: string;
}

interface ProductImagesProps {
  productId: string;
}

export default function ProductImages({ productId }: ProductImagesProps) {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helper function to check if URL is a video
  const isVideo = (url: string | null | undefined) => {
    if (!url || typeof url !== 'string') return false;
    return url.toLowerCase().endsWith('.mp4');
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await getProductImages(productId);

        if (error) {
          setError('Failed to load images');
          return;
        }
        console.log(`data:`, data);

        if (data && data.length > 0) {
          setImages(data);
          // Find primary image index or default to 0
          const primaryIndex = data.findIndex((img) => img.is_primary);
          setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
        }
      } catch (err) {
        setError('Failed to load images');
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [productId]);

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className="flex justify-center items-center h-96 bg-gray-100">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const currentImage = images[currentImageIndex];
  const currentIsVideo = isVideo(currentImage.url);

  return (
    <div className="space-y-4">
      {/* Main Image/Video Display */}
      <div className="relative aspect-square bg-gray-100 rounded-lg">
        {currentIsVideo ? (
          <video
            src={currentImage.url}
            controls
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          <Image
            src={currentImage.url}
            alt={
              currentImage.alt_text || `Product image ${currentImageIndex + 1}`
            }
            fill
            className="object-cover"
            priority={currentImage.is_primary}
          />
        )}

        {/* Primary Badge */}
        {currentImage.is_primary && (
          <div className="absolute top-2 left-2 bg-teal-600 text-white px-2 py-1 rounded text-sm font-medium">
            {currentIsVideo ? 'Main Video' : 'Main Image'}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-4 hover:bg-opacity-75 transition-opacity text-xs"
            >
              ←
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 bg-opacity-50 text-white p-4 hover:bg-opacity-75 transition-opacity"
            >
              →
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Slideshow */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {images.map((image, index) => {
            const thumbnailIsVideo = isVideo(image.url);
            return (
              <button
                key={image.id}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-blue-600 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {thumbnailIsVideo ? (
                  <div className="relative w-full h-full bg-gray-800 flex items-center justify-center">
                    {/* Video thumbnail with play icon */}
                    <video
                      src={image.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-0 h-0 border-l-4 border-l-black border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                    quality={100}
                    sizes="80px"
                  />
                )}

                {/* Primary indicator on thumbnail */}
                {image.is_primary && (
                  <div className="absolute top-1 left-1 w-2 h-2 bg-blue-600 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Image Counter */}
      <div className="text-center text-sm text-gray-500">
        {currentImageIndex + 1} of {images.length}
      </div>
    </div>
  );
}
