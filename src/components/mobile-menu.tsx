'use client';

import { motion, AnimatePresence } from './motion';
import { useState } from 'react';
import Link from 'next/link';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaShoppingCart,
  FaHeart,
} from 'react-icons/fa';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import Search from './search';

interface MobileMenuProps {
  navItems: { name: string; link: string }[];
}

export default function MobileMenu({ navItems }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();
  const { state: favoritesState } = useFavorites();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="md:hidden text-white text-2xl z-50 relative"
        aria-label="Toggle mobile menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Remove this backdrop section since menu is now full width */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
            /> */}

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-full bg-black z-50 md:hidden px-1"
              style={{ backgroundColor: '#000000' }}
            >
              <div className="flex flex-col h-full bg-black">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-800">
                  <h2 className="text-white text-xl font-semibold">Menu</h2>
                  <button
                    onClick={closeMenu}
                    className="text-white text-2xl"
                    aria-label="Close menu"
                  >
                    <FaTimes />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-6 py-4 bg-black">
                  <ul className="space-y-4">
                    {navItems.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.link}
                          onClick={closeMenu}
                          className="block text-white text-lg py-3 border-b border-gray-800 hover:text-gray-300 transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Bottom Actions */}
                <div className="p-6 border-t border-gray-800 bg-black">
                  <div className="flex items-center justify-around">
                    {/* Search */}
                    <Search
                      isOpen={isSearchOpen}
                      onToggle={handleSearchToggle}
                      onClose={handleSearchClose}
                    />

                    {/* User Profile */}
                    <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
                  </div>
                </div>

                {/* Favorites */}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
