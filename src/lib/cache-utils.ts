// Remove the server-side import
// import { revalidatePath } from 'next/cache'; // Remove this line

// Define all paths that need periodic revalidation
const REVALIDATION_PATHS = [
  '/',
  '/products',
  '/admin',
  '/admin/orders',
  '/admin/products',
  '/cart',
  '/favorites',
];

// Client-side function to trigger revalidation via API
export async function triggerRevalidation(paths: string[]) {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paths }),
    });

    if (!response.ok) {
      throw new Error(`Revalidation failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error triggering revalidation:', error);
    throw error;
  }
}

// Client-side helper functions that use the API
export async function revalidateAllPaths() {
  return triggerRevalidation(REVALIDATION_PATHS);
}

export async function revalidateProductPaths(productId?: string) {
  const paths = ['/products', '/admin/products', '/'];
  if (productId) {
    paths.push(`/product/${productId}`);
  }
  return triggerRevalidation(paths);
}

export async function revalidateOrderPaths() {
  const paths = ['/admin/orders', '/admin'];
  return triggerRevalidation(paths);
}
