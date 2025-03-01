'use client';

import { useEffect, useState } from 'react';
import { getBookings, deleteBooking, updateBooking, getUserBookings } from '@/lib/api';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const [userId, setUserId] = useState('');
  const [userBookings, setUserBookings] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role === 'admin') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleSearchByUserId = async () => {
    if (!userId || isNaN(parseInt(userId))) {
      alert('Please enter a valid user ID');
      return;
    }
    
    try {
      const response = await getUserBookings(parseInt(userId));
      console.log('Raw API response:', response);
      console.log('User bookings data:', response.data);
      setUserBookings(response.data);
    } catch (error) {
      console.error('Error details:', error.response?.data);
      console.error('Status code:', error.response?.status);
      console.error('Failed to fetch bookings for user:', error);
    }
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await getBookings();
        setBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBooking(id);
      setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleUpdateTravelers = async (id, currentNumberOfTravelers) => {
    const newNumberOfTravelers = prompt('Enter the new number of travelers (must be greater than 0):', currentNumberOfTravelers);
  
    if (newNumberOfTravelers === null) {
      return;
    }
  
    const parsedNumber = parseInt(newNumberOfTravelers, 10);
  
    if (isNaN(parsedNumber) || parsedNumber <= 0) {
      alert('Invalid number of travelers. It must be a number greater than 0.');
      return;
    }
  
    try {
      const response = await updateBooking(id, { numberOfTravelers: parsedNumber });
  
      if (response.status === 200) {
        const updatedBookingsResponse = await getBookings();
        setBookings(updatedBookingsResponse.data);
        alert('Booking updated successfully!');
      } else {
        alert(`Failed to update booking: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert(`Failed to update booking: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {isAdmin && (
        <div className="mb-6">
          <input
            type="text"
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter User ID"
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={handleSearchByUserId}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          >
            Search by User ID
          </button>
        </div>
      )}
      <div className="space-y-4">
        {(isAdmin ? userBookings : bookings).map((booking) => (
          <div key={booking.id} className="border rounded-lg p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{booking.package?.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Booking Date:</p>
                <p>{new Date(booking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Number of Travelers:</p>
                <p>{booking.numberOfTravelers}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Price:</p>
                <p className="font-semibold">${booking.totalPrice}</p>
              </div>
              {!isAdmin ? (
                <>
                <div className="col-span-2 flex justify-end"></div>
                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleUpdateTravelers(booking.id, booking.numberOfTravelers)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 ml-2"
                  >
                    Modify
                  </button>
                </>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
