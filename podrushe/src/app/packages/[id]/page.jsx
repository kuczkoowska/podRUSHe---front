'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getPackageById, createBooking} from '@/lib/api';
import Comment from '@/components/Comment';


const PackageDetails = () => {
    const { id } = useParams();
    const [packageDetails, setPackageDetails] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loginStatus);
    }, []);

    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                const response = await getPackageById(id);
                if (response) {
                    setPackageDetails(response);
                } else {
                    console.error('Package not found');
                }
            } catch (error) {
                console.error('Error fetching package details:', error);
            }
        };

        if (id) {
            fetchPackageDetails();
        }
    }, [id]);

    if (!packageDetails) {
        return <div>Loading...</div>;
    }

    const handleBooking = async () => {
        try {
            const numberOfTravelers = prompt('Enter the number of travelers:');
            if (!numberOfTravelers) {
                alert('Number of travelers is required.');
                return;
            }
            const parsedNumberOfTravelers = parseInt(numberOfTravelers, 10);
            if (isNaN(parsedNumberOfTravelers) || parsedNumberOfTravelers <= 0) {
                alert('Please enter a valid number of travelers.');
                return;
            }
            const bookingData = {
                packageId: packageDetails.data.id,
                numberOfTravelers: parsedNumberOfTravelers,
            };
            const response = await createBooking(bookingData);
            if (response.ok) {
                alert('Booking successful!');
            } else {
                alert('Failed to create booking. Please try again.');
            }
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        }
    };

    return (
        <div className="p-5 font-sans">
            <div className="my-5 p-5 border border-gray-300 rounded-lg bg-white shadow-md">
                <div className="flex justify-center">
                    <img src={packageDetails.data.imageUrl} alt={packageDetails.data.title} className="mt-2 rounded-lg max-w-full h-auto" />
                </div>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">{packageDetails.data.title}</h2>
                <p className="text-gray-600 mb-4">{packageDetails.data.description}</p>
                <p className="text-gray-600 mb-2"><strong>Destination:</strong> {packageDetails.data.destination}</p>
                <p className="text-gray-600 mb-2"><strong>Price:</strong> ${packageDetails.data.price}</p>
                <p className="text-gray-600 mb-2"><strong>Start Date:</strong> {new Date(packageDetails.data.startDate).toLocaleDateString()}</p>
                <p className="text-gray-600 mb-4"><strong>End Date:</strong> {new Date(packageDetails.data.endDate).toLocaleDateString()}</p>
                <button
                    onClick={() => {
                        if (!isLoggedIn) {
                            alert('You must log in before booking.');
                            return;
                        }
                        handleBooking();
                    }}
                    className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-center mt-4 transition-colors duration-300"
                >
                    Book Now
                </button>
            </div>
            <div className="my-5 p-5 border border-gray-300 rounded-lg bg-white shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Comments</h3>
            <Comment packageId={id} />
        </div>
        </div>
    );
};

export default PackageDetails;