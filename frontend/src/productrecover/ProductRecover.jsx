import React from 'react';
import { useQuery,useQueryClient} from '@tanstack/react-query';
import { commenUrl} from '../commen/CommenUrl';

const ProductRecover = () => {
     const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery({
    queryKey: ['authUser'],
    queryFn: () => fetch('/api/auth/user').then((res) => res.json()),
  });

// recover api
  const { data: recoverProduct } = useQuery({
    queryKey: ['recoverProduct'],
    queryFn: () => fetch(`${commenUrl}/api/v1/products/get/recoverproducts`).then((res) => res.json()),
  });

  const products = recoverProduct?.products || [];

// re-recover products
   const handleRecover = async (productId) => {
    // make sure confirm recover
    const confirmRecover = window.confirm('Are you sure you want to recover this product?');
    if (!confirmRecover) return;
    try {
      const response = await fetch(`${commenUrl}/api/v1/products/getsingle-productrecover/${productId}`, {
        method: 'GET',
        credentials: 'include', // Include cookies for authentication   
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to recover product');
      }

      const data = await response.json();
      if(data) {
        alert('Product recovered successfully!');
        window.location.href = "/admin/recover-product"; // Invalidate the query to refetch the data
      }
      // Optionally, you can refetch the products or update the state to reflect the changes
    } catch (error) {
      console.error('Error recovering product:', error);
        alert('Super Admins only.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📦 Recover Products</h1>

      {isLoading && <p className="text-gray-600">Loading...</p>}

      {authUser && (
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <h2 className="text-lg font-semibold text-gray-700">Welcome, {authUser.name}</h2>
          <p className="text-sm text-gray-500">Email: {authUser.email}</p>
        </div>
      )}

      <div className="bg-white shadow rounded-md overflow-hidden">
        <div className="bg-gray-100 px-4 py-2 font-medium text-gray-700">Recovered Product List</div>
        <ul className="divide-y divide-gray-200">
          {products.map((product) => (
            <li key={product.id} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded py-1" />
                  <div>
                    <p className="text-md font-semibold text-gray-800 py-1">{product.name}</p>
                    <p className="text-sm text-gray-500 py-1">
  Recovered on:{" "}
  {product.createdAt
    ? new Date(product.createdAt).toISOString().split("T")[0]
    : "N/A"}
</p>

                    <p className="text-sm text-gray-500 py-1">Price: {product.price}</p>
                  </div>
                </div>
                <span onClick={() => handleRecover(product._id)} className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full cursor-pointer">
                  recovered
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductRecover;
