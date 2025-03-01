'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '@/lib/api';
import Link from 'next/link';

export default function Register() {
  const [userData, setUserData] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await register(userData);
      router.push('/auth/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
    <div className="flex items-center mt-14 justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        
        {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4">{error}</div>}
        
        <input
          type="text"
          placeholder="Username"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUserData({ ...userData, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUserData({ ...userData, password: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="First Name"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="w-full p-2 mb-4 border rounded"
          onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
        >
          Register
        </button>
        <div className="text-center">
          <Link href="/auth/login" className="text-blue-500 hover:text-blue-600">
            Already have an account? Login
          </Link>
        </div>
      </form>
    </div>
    </>
  );
}