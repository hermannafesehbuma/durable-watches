import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['shengcgeqmfafnzdsvem.supabase.co'], // <-- Add your Supabase storage domain
    unoptimized: true, // Bypass Next.js Image Optimization to avoid 402 payment errors
  },
};

export default nextConfig;
