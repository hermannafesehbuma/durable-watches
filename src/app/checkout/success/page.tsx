'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const total = searchParams.get('total');

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-30">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
          <svg
            className="h-8 w-8 text-green-600"
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
        </div>

        {/* Success Message */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-300 mb-6">
          Thank you for your purchase. Your order has been received and is being
          processed.
        </p>

        {/* Order Details */}
        {orderId && (
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400 mb-2">Order ID:</p>
            <p className="text-white font-mono text-lg">{orderId}</p>
            {total && (
              <>
                <p className="text-sm text-gray-400 mb-2 mt-4">Total Amount:</p>
                <p className="text-white font-semibold text-xl">
                  ${parseFloat(total).toFixed(2)}
                </p>
              </>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="text-left bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-white font-semibold mb-3">What's Next?</h3>
          <ul className="text-gray-300 text-sm space-y-2">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• We'll process your payment and prepare your order</li>
            <li>• You'll get tracking information once shipped</li>
            <li>• Contact us if you have any questions</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/products"
            className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors inline-block"
          >
            Continue Shopping
          </Link>

          <Link
            href="/"
            className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg hover:bg-gray-700 transition-colors inline-block"
          >
            Back to Home
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-gray-400 text-sm">Questions about your order?</p>
          <Link
            href="/contact"
            className="text-teal-400 hover:text-teal-300 text-sm underline"
          >
            Contact our support team
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
