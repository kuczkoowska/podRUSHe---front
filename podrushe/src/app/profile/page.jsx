'use client';

import { useEffect, useState, useContext } from 'react';
import { getUserProfile, updateUserProfile, deleteUserProfile } from '@/lib/api';
import AuthProvider, { AuthContext } from '@/components/AuthProvider';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const { logout } = useContext(AuthContext);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(formData);
      if (response.status === 200) {
        setUser(response.data);
        setIsEditing(false);
      } else {
        console.error('Failed to update profile:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) return <div>Loading...</div>;


  return (
    <AuthProvider>
      <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-4xl font-bold mb-14 mt-4 text-center text-gray-800">My Profile</h1>
        <div className="max-w-2xl mx-auto">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold">First Name</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full border rounded p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full border rounded p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full border rounded p-3 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-200 w-full"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition duration-200 w-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <p className="text-gray-600 font-semibold">Username:</p>
                <p className="text-gray-800">{user.username}</p>
                <p className="text-gray-600 font-semibold">Name:</p>
                <p className="text-gray-800">{user.firstName} {user.lastName}</p>
                <p className="text-gray-600 font-semibold">Email:</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div className="flex flex-row justify-center gap-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition duration-200 w-full"
                >
                  Edit Profile
                </button>
                <button
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete your profile?')) {
                      try {
                        await deleteUserProfile();
                        window.location.href = '/auth/login';
                      } catch (error) {
                        console.error('Failed to delete profile:', error);
                      }
                    }
                  }}
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition duration-200 w-full"
                >
                  Delete Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600 transition duration-200 w-full"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthProvider>
  );
}
