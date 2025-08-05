'use client';

import { motion, AnimatePresence } from './motion';
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';

interface MdMenuProps {
  navItems: { name: string; link: string }[];
}

export default function MdMenu({ navItems }: MdMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Menu Button - Only visible on md screens */}
      <button
        onClick={toggleMenu}
        className="hidden md:block lg:hidden text-white text-2xl z-50 relative"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 z-40 md:block lg:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-80 bg-black z-50 md:block lg:hidden"
            >
              <div className="flex flex-col h-full">
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

                {/* Navigation Links Only */}
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
