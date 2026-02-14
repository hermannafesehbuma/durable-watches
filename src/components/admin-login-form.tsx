'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export default function AdminLoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Let middleware handle the redirect after successful login
    router.push('/admin');
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-4 xs:mt-2 p-4 xs:p-3 xs:mx-2 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl xs:text-lg font-bold mb-4 xs:mb-3 text-center text-white">
        Admin Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 xs:space-y-2">
        <div>
          <label
            htmlFor="email"
            className="block text-sm xs:text-xs font-medium text-white mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 xs:px-2 xs:py-1.5 xs:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm xs:text-xs font-medium text-white mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 xs:px-2 xs:py-1.5 xs:text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-black"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm xs:text-xs">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 xs:py-1.5 xs:px-3 border border-transparent rounded-md shadow-sm text-sm xs:text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 mt-4 xs:mt-3"
        >
          {loading ? 'Signing in...' : 'Sign In as Admin'}
        </button>
      </form>
    </div>
  );
}
