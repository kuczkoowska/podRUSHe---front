'use client';

import { useEffect, useState, useCallback } from 'react';
import { findAllWithFilters, createPackage, deletePackage, updatePackage } from '../../lib/api';
import Link from 'next/link';
import Search from '@/components/Search';
import { useSearchParams } from 'next/navigation';

export default function Packages() {
  const [packages, setPackages] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [newPackageData, setNewPackageData] = useState(initialPackageState);

  const searchParams = useSearchParams();

  useEffect(() => {
    setIsAdmin(localStorage.getItem('role') === 'admin');
  }, []);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        let response;
        const filters = ['destination', 'minPrice', 'maxPrice', 'startDate', 'endDate'].reduce((acc, key) => {
          const value = searchParams.get(key);
          if (value) acc[key] = value;
          return acc;
        }, {});
  
        if (Object.keys(filters).length > 0) {
          response = await findAllWithFilters(filters);
        } else {
          response = await findAllWithFilters({});
        }
  
        if (response && response.data) {
          setPackages(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch packages:', error);
        setPackages([]);
      }
    };
  
    fetchPackages();
  }, [searchParams]);

  const handleInputChange = (setter) => (e) => {
    setter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createPackage({ ...newPackageData, price: Number(newPackageData.price) });
      setPackages([...packages, response.data]);
      setIsCreateModalOpen(false);
      setNewPackageData(initialPackageState);
    } catch (error) {
      console.error('Failed to create package:', error);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        description: editingPackage.description,
        price: Number(editingPackage.price),
        startDate: editingPackage.startDate,
        endDate: editingPackage.endDate,
        destination: editingPackage.destination,
        imageUrl: editingPackage.imageUrl
      };
      
      await updatePackage(editingPackage.id, updateData);
      setPackages(packages.map((pkg) => (pkg.id === editingPackage.id ? editingPackage : pkg)));
      setEditingPackage(null);
    } catch (error) {
      console.error('Failed to update package:', error);
    }
  };

  const handleDeletePackage = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
  
    try {
      await deletePackage(id);
      setPackages((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Failed to delete package:', error);
      alert('Failed to delete package');
    }
  }, [setPackages]);
  

  return (
    <div className="container mx-auto p-4">
      <Search />
      <h1 className="text-3xl font-bold mt-10 mb-6 text-center">Travel Packages</h1>

      {isAdmin && (
        <div className="mb-6 text-center">
          <button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">
            Create Package
          </button>
        </div>
      )}

      {editingPackage && (
        <Modal title="Update Package" onClose={() => setEditingPackage(null)}>
          <PackageForm data={editingPackage} onChange={handleInputChange(setEditingPackage)} onSubmit={handleUpdateSubmit} />
        </Modal>
      )}

      {isCreateModalOpen && (
        <Modal title="Create New Package" onClose={() => setIsCreateModalOpen(false)}>
          <PackageForm data={newPackageData} onChange={handleInputChange(setNewPackageData)} onSubmit={handleCreateSubmit} />
        </Modal>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.length > 0 ? (
          packages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} isAdmin={isAdmin} onEdit={setEditingPackage} onDelete={handleDeletePackage} />)
        ) : (
          <div className="col-span-full text-center text-gray-500">No packages found matching your criteria</div>
        )}
      </div>
    </div>
  );
}

const initialPackageState = { 
  title: '', 
  description: '', 
  price: '', 
  startDate: '', 
  endDate: '', 
  destination: '',
  imageUrl: '',
};

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function PackageForm({ data, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit}>
      {['title', 'description', 'price', 'startDate', 'endDate', 'destination'].map((field) => (
        <input
          key={field}
          type={field.includes('Date') ? 'date' : field === 'price' ? 'number' : 'text'}
          name={field}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={data[field]}
          onChange={onChange}
          className="w-full p-2 mb-2 border rounded"
          required
        />
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
    </form>
  );
}

function PackageCard({ pkg, isAdmin, onEdit, onDelete }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div>
        <Link href={`/packages/${pkg.id}`}>
          <div>
            {pkg.imageUrl && <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-48 object-cover" />}
            <div className="p-4">
              <h2 className="text-xl font-semibold">{pkg.title}</h2>
              <p className="text-gray-600">{pkg.destination}</p>
              <p className="text-lg font-bold mt-2">${pkg.price}</p>
              <p className="text-sm text-gray-500">
                {new Date(pkg.startDate).toLocaleDateString()} - {new Date(pkg.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Link>
        {isAdmin && (
          <div className="p-4 mt-auto border-t">
            <button 
              onClick={() => onEdit(pkg)} 
              className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
            >
              Update
            </button>
            <button 
              onClick={() => onDelete(pkg.id)} 
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
