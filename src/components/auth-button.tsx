'use client';

import { useAuth } from '@/contexts/auth-context';
import Link from 'next/link';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

export default function AuthButton() {
  const { user, signOut, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-6 h-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
    );
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center space-x-1 hover:text-blue-600"
      >
        <FaUserCircle className="text-xl" />
        <span className="hidden md:inline">Login</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Admin
        </Link>
      )}

      <div className="flex items-center space-x-2">
        <FaUserCircle className="text-xl" />
        <span className="hidden md:inline text-sm">{user.email}</span>
        <button
          onClick={signOut}
          className="flex items-center space-x-1 text-sm hover:text-red-600"
          title="Sign Out"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </div>
  );
}
