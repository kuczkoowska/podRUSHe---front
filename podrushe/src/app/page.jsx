import { findAllWithFilters } from '@/lib/api'
import Link from 'next/link';


export default async function Home() {
  let packages = [];
  
  try {
    const response = await findAllWithFilters({});
    packages = response.data;
  } catch (error) {
    console.error('Error fetching packages:', error);
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to Podrushe</h1>
        <p className="text-xl text-gray-600">Discover your next adventure</p>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => (
          <Link href={`/packages/${pkg.id}`} key={pkg.id}>
            <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              {pkg.imageUrl && (
                <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{pkg.title}</h2>
                <p className="text-gray-600">{pkg.destination}</p>
                <p className="text-lg font-bold mt-2">${pkg.price}</p>
                <p className="text-sm text-gray-500">
                  {new Date(pkg.startDate).toLocaleDateString()} - 
                  {new Date(pkg.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  )
}
