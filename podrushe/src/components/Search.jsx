import React, { useState } from 'react';
import { findAllWithFilters } from '../lib/api';

const Search = () => {
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [destination, setDestination] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSearch = async () => {
        const filters = {
            destination,
            minPrice,
            maxPrice,
            startDate,
            endDate
        };

        const queryString = Object.keys(filters)
            .filter(key => filters[key])
            .map(key => `${key}=${encodeURIComponent(filters[key])}`)
            .join('&');

        try {
            const response = await findAllWithFilters(filters);
            if (response && response.data) {
                setResults(response.data);
                window.location.href = `/packages?${queryString}`;
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Error fetching search results:', error);
            setResults([]);
        }
    };

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <div 
                className="border border-gray-300 rounded-lg p-4 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h2 className="text-2xl font-bold text-center mb-4">Search Packages</h2>
            </div>
            {isOpen && (
                <div className="space-y-4 mt-4">
                    <input
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Destination"
                    />
                    <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Min Price"
                    />
                    <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Max Price"
                    />
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Search
                    </button>
                </div>
            )}
            <div className="mt-6">
                {results.map((result, index) => (
                    <div key={index} className="p-4 mb-2 bg-gray-100 border border-gray-300 rounded-lg">
                        {result.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
