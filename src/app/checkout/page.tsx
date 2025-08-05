'use client';

import { useCart } from '@/contexts/cart-context';
import {
  getProductPrimaryImages,
  createCompleteOrder,
} from '@/api/supabaseapi';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  paymentMethod: 'wire' | 'crypto' | 'zelle' | 'stripe';
}

interface PrimaryImage {
  product_id: string;
  url: string;
  alt_text?: string;
}

export default function CheckoutPage() {
  const { state, clearCart } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [primaryImages, setPrimaryImages] = useState<PrimaryImage[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',
    paymentMethod: 'stripe',
  });

  // Calculate order totals
  const subtotal = state.totalPrice;
  const shippingCost = 0; // Free shipping or calculate based on your logic
  const taxRate = 0.08; // 8% tax rate, adjust as needed
  const tax = subtotal * taxRate;
  const finalTotal = subtotal + shippingCost + tax;

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Calculate totals
      const shippingCost = 15.0;
      const tax = state.totalPrice * 0.08; // 8% tax
      const finalTotal = state.totalPrice + shippingCost + tax;

      // Prepare order data
      const orderData = {
        total: finalTotal,
        payment_method: formData.paymentMethod,
        email: formData.email,
        status: 'pending',
        shipping: {
          full_name: `${formData.firstName} ${formData.lastName}`,
          address_line1: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.zipCode,
          phone: formData.phone,
        },
        items: state.items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price, // This is the price_at_time
        })),
      };

      // Create the order in the database
      const { data: orderResult, error } = await createCompleteOrder(orderData);

      if (error) {
        console.error('Error creating order:', error);
        alert('Failed to create order. Please try again.');
        return;
      }

      console.log('Order created successfully:', orderResult);

      // After successful order creation, send confirmation email
      if (orderResult) {
        try {
          await fetch('/api/send-order-confirmation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderData: {
                orderId: orderResult.order.id,
                email: formData.email,
                paymentMethod: formData.paymentMethod,
                status: 'pending',
                total: finalTotal,
                shipping: {
                  full_name: `${formData.firstName} ${formData.lastName}`,
                  address_line1: formData.address,
                  city: formData.city,
                  state: formData.state,
                  country: formData.country,
                  postal_code: formData.zipCode,
                  phone: formData.phone,
                },
              },
              items: state.items,
            }),
          });
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
          // Don't fail the order if email fails
        }
      }
      // Clear cart and redirect to success page
      clearCart();
      router.push('/checkout/success');
    } catch (error) {
      console.error('Error processing order:', error);
      alert('An error occurred while processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentInstructions = () => {
    switch (formData.paymentMethod) {
      case 'wire':
        return (
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-6 mb-4">
            <h4 className="text-blue-200 font-semibold mb-3">
              Wire Transfer Instructions
            </h4>
            <div className="text-blue-200 text-sm space-y-2">
              <p className="mt-4 pt-2 border-t border-blue-700">
                After placing your order, we will provide you our wire transfer
                details. Include your order number in the transfer reference.
                Allow 1-3 business days for processing.
              </p>
            </div>
          </div>
        );

      case 'crypto':
        return (
          <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-6 mb-4">
            <h4 className="text-yellow-200 font-semibold mb-3">
              Cryptocurrency Payment Instructions
            </h4>
            <div className="text-yellow-200 text-sm space-y-2">
              <p>
                <strong>Accepted Cryptocurrencies:</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Bitcoin (BTC)</li>
                <li>Ethereum (ETH)</li>
                <li>USD Coin (USDC)</li>
                <li>Tether (USDT)</li>
              </ul>
              <p className="mt-4 pt-2 border-t border-yellow-700">
                After placing your order, you will receive an email with the
                specific wallet address and exact amount to send. Include your
                order number in the transaction memo if supported.
              </p>
            </div>
          </div>
        );

      case 'zelle':
        return (
          <div className="bg-green-900 border border-green-700 rounded-lg p-6 mb-4">
            <h4 className="text-green-200 font-semibold mb-3">
              Zelle Payment Instructions
            </h4>
            <div className="text-green-200 text-sm space-y-2">
              <p className="mt-4 pt-2 border-t border-green-700">
                After placing your order, we will provide you with the Zelle
                details, send the exact order total via Zelle using the
                imformation provided. Include your order number in the payment
                memo. Payment must be completed within 24 hours to secure your
                order.
              </p>
            </div>
          </div>
        );

      case 'stripe':
        return (
          <div className="bg-purple-900 border border-purple-700 rounded-lg p-6 mb-4">
            <h4 className="text-purple-200 font-semibold mb-3">
              Credit/Debit Card Payment
            </h4>
            <div className="text-purple-200 text-sm space-y-2">
              <p>
                <strong>Accepted Cards:</strong> Visa, Mastercard, American
                Express, Discover
              </p>
              <p>
                <strong>Security:</strong> All transactions are secured with SSL
                encryption
              </p>
              <p>
                <strong>Processing:</strong> Payments are processed instantly
                via Stripe
              </p>
              <p className="mt-4 pt-2 border-t border-purple-700">
                After placing your order, we will provide yopu with our stripe
                link to proceed with the payemnt.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-32 px-4 bg-black mb-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Shipping Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact Information */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Name */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* City, State, ZIP */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Payment Method */}
              <div className="border-t border-gray-700 pt-6">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Payment Information
                </h3>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="stripe">Credit/Debit Card (Stripe)</option>
                    <option value="wire">Wire Transfer</option>
                    <option value="crypto">Cryptocurrency</option>
                    <option value="zelle">Zelle</option>
                  </select>
                </div>

                {renderPaymentInstructions()}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing
                  ? 'Processing...'
                  : `Complete Order - $${finalTotal.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {isLoadingImages ? (
                <div className="text-center py-4">
                  <span className="text-gray-400">
                    Loading product images...
                  </span>
                </div>
              ) : (
                state.items.map((item) => {
                  const primaryImage = getPrimaryImage(item.id);
                  const imageUrl = primaryImage?.url || item.image_url;
                  const altText = primaryImage?.alt_text || item.name;

                  return (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-lg overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={altText}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                            <span className="text-gray-400 text-xs">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.name}</h4>
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-white font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Order Totals */}
            <div className="border-t border-gray-700 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal:</span>
                <span>${state.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping:</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax:</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-white border-t border-gray-700 pt-2">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Back to Cart */}
            <div className="mt-6">
              <Link
                href="/cart"
                className="block w-full text-center bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
