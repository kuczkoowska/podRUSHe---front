'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(credentials);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('userId', response.data.user.id);
      localStorage.setItem('role', response.data.user.role);
      localStorage.setItem('isLoggedIn', 'true')
      router.push('/packages');
    } catch (error) {
      alert('Login failed');
    }
  };
  return (
    <>
      <div className="flex items-start justify-center pt-20">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-2 mb-4 border rounded"
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-6 border rounded"
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
          <div className="text-center">
          <Link href="/auth/register" className="text-blue-500 hover:text-blue-600">
            Don't have an account? Register here
          </Link>
        </div>
        </form>
      </div>
    </>
  );
}