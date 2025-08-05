'use client';

import { motion, useScroll } from './motion';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaUserCircle, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '@/contexts/cart-context';
import { useFavorites } from '@/contexts/favorites-context';
import Search from './search';
import MobileMenu from './mobile-menu';
import MdMenu from './md-menu';

export default function Header() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { state } = useCart();
  const { state: favoritesState } = useFavorites();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > window.innerHeight);
    });
  }, [scrollY]);

  const navItems = [
    { name: 'Collection', link: '/products' },
    { name: 'Store Locator', link: '/location' },
    { name: 'Sell my Watch', link: '/sellmywatch' },
    { name: 'Contact us', link: '/contact' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'tween',
        ease: 'easeOut',
        duration: 0.4,
      },
    },
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 bg-black/80 backdrop-blur-sm md:px-20"
      animate={{
        height: isScrolled ? '4rem' : '6rem',
        fontSize: isScrolled ? '0.875rem' : '1rem',
      }}
      transition={{ duration: 0.3 }}
    >
      {/* Mobile Menu - visible on xsm to sm screens */}
      <div className="block sm:block md:hidden">
        <MobileMenu navItems={navItems} />
      </div>

      {/* Mobile Actions - visible on xsm to sm screens */}
      <div className="flex md:hidden items-center gap-4">
        <Link href="/favorites" className="relative">
          <FaHeart className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
          {favoritesState.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {favoritesState.totalItems}
            </span>
          )}
        </Link>
        <Link href="/cart" className="relative">
          <FaShoppingCart className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
          {state.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {state.totalItems}
            </span>
          )}
        </Link>
      </div>

      {/* MD Hamburger Menu - visible only on md screens */}
      <div className="hidden md:block lg:hidden">
        <MdMenu navItems={navItems} />
      </div>

      {/* Desktop Navigation - visible on lg and above */}
      <motion.nav
        className="hidden lg:flex gap-6 text-white"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.link}
            className="relative text-white"
          >
            <motion.div
              whileHover={{
                opacity: 0.7,
                transition: { duration: 0.2 },
              }}
            >
              {item.name}
              <motion.span
                className="absolute bottom-0 left-0 w-full h-[2px] bg-white"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.2 }}
              />
            </motion.div>
          </Link>
        ))}
      </motion.nav>

      {/* Logo - centered */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        animate={{ scale: isScrolled ? 0.9 : 1 }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            width={300}
            height={300}
            alt="logo"
            className="w-20 h-20"
          />
        </Link>
      </motion.div>

      {/* Desktop Actions - visible on md and above */}
      <div className="hidden md:flex items-center gap-6">
        <Search
          isOpen={isSearchOpen}
          onToggle={handleSearchToggle}
          onClose={handleSearchClose}
        />
        <FaUserCircle className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
        <Link href="/favorites" className="relative">
          <FaHeart className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
          {favoritesState.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {favoritesState.totalItems}
            </span>
          )}
        </Link>
        <Link href="/cart" className="relative">
          <FaShoppingCart className="text-white text-2xl cursor-pointer hover:text-gray-300 transition-colors" />
          {state.totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {state.totalItems}
            </span>
          )}
        </Link>
      </div>
    </motion.header>
  );
}
