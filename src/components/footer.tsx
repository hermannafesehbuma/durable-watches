import Link from 'next/link';
import Image from 'next/image';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-8 border-t border-gray-600 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Chrono24 Badge */}
          <div>
            {/* You will need to find and place the trusted-seller-icon.png in your public folder */}
            <Image
              src="/logo.png"
              alt="Chrono24 Trusted Seller"
              width={100}
              height={100}
            />
          </div>

          {/* Michigan Location */}
          <div>
            <h3 className="font-bold text-lg mb-4">Philadelphia</h3>
            <p>County Lane Plaza</p>
            <p>Bustleton Ave, PA 15501</p>
            <p className="mt-4">MON-SAT 9AM - 6PM (EST)</p>
            <p>Phone: 323 389 5316</p>
          </div>

          {/* Contact Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact</h3>
            <ul>
              <li>
                <Link href="/location" className="hover:text-gray-600">
                  Store Locator
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-gray-600">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/sellmywatch" className="hover:text-gray-600">
                  Sell My Watch
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-gray-600">
                  Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="YouTube">
              <FaYoutube />
            </a>
            <a href="#" aria-label="TikTok">
              <FaTiktok />
            </a>
          </div>
        </div>

        {/* Subscription */}
        <div className="mt-12 text-center">
          <h3 className="font-bold text-lg mb-4">
            Subscribe today to receive email updates on our timepieces.
          </h3>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Email"
              className="p-2 bg-gray-800 border border-gray-700"
            />
            <button type="submit" className="p-2 bg-gray-700">
              →
            </button>
          </form>
        </div>

        {/* Follow on Shop */}
        <div className="mt-8 text-center">
          <button className="bg-teal-600 px-6 py-2 rounded-full">
            Follow on shop
          </button>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>
            &copy; {new Date().getFullYear()}, Rolex Durable Watches. All Rights
            Reserved
          </p>
          <div className="flex flex-col space-y-2 md:flex-row items-center md:space-y-0 md:space-x-4 mt-4 md:mt-0">
            <select className="bg-black border border-gray-700 p-2">
              <option>USD $ | Cameroon</option>
            </select>
            <Link href="/refunds-policy">Refund policy</Link>
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms-of-service">Terms of service</Link>
            <Link href="/shipping-policy">Shipping policy</Link>
            <Link href="/contact">Contact information</Link>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>
            All rights reserved. My Watch LLC is not affiliated with Rolex S.A.,
            Rolex USA, or any of its subsidiaries.
          </p>
          <p>
            My Watch LLC is an independent watch dealer and is not sponsored by,
            associated with and/or affiliated with Rolex S.A., Rolex USA, or any
            other brand
          </p>
        </div>
      </div>
    </footer>
  );
}
