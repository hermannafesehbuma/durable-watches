'use client';

import { useEffect } from 'react';

interface RevalidationProviderProps {
  children: React.ReactNode;
}

export default function RevalidationProvider({
  children,
}: RevalidationProviderProps) {
  useEffect(() => {
    // Start periodic revalidation every 30 minutes
    const interval = setInterval(async () => {
      try {
        const response = await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paths: [
              '/',
              '/products',
              '/admin',
              '/admin/orders',
              '/admin/products',
              '/cart',
              '/favorites',
            ],
          }),
        });

        if (response.ok) {
          console.log('Cache revalidation completed successfully');
        } else {
          console.error('Cache revalidation failed:', response.statusText);
        }
      } catch (error) {
        console.error('Error during cache revalidation:', error);
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return <>{children}</>;
}