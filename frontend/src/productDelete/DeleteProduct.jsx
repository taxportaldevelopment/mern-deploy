import React, { useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { useQuery ,useQueryClient} from "@tanstack/react-query";
import { commenUrl } from '../commen/CommenUrl';
import { toast } from 'react-hot-toast';

const DeleteProduct = () => {
    const queryClient = useQueryClient();
  const handleDeleteProduct = (productId) => {

    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        fetch(`${commenUrl}/api/v1/products/getsingle-productdelete/${productId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                toast.success("Product deleted successfully");
                queryClient.invalidateQueries(["getallproducts"]); // Invalidate the query to refetch data
            } else {
                toast.error(data.error || "Something went wrong");
            }
        })
        .catch(error => {
            toast.error(error.message || "Something went wrong");
        });
    }
};
   

    const [searchTerm, setSearchTerm] = useState("");
    const { data: allproducts } = useQuery({
        queryKey: ["getallproducts"],
        queryFn: async () => {
            // eslint-disable-next-line no-useless-catch
            try {
                const res = await fetch(`${commenUrl}/api/v1/products/getallproducts`, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await res.json();
                if (!res.ok) {
                    toast.error(data.error || "Something went wrong");
                }
                return data;
            } catch (error) {
                throw error;
            }
        }
    });

    // Filter products based on search input
    const filteredProducts = allproducts?.products?.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='container py-3 bg-gray-300'>
            <div className='lg:max-w-10/12 lg:mx-auto p-3'>
                <h1 className='text-3xl font-bold py-2'>Products Remove</h1>    

                {/* search bar */}
                <div className='py-5 px-2 bg-white rounded'>
                    <div className="search-product flex items-center rounded border border-gray-300">
                        <input 
                            type="text" 
                            className='w-full outline-none h-10 p-2' 
                            placeholder='Search products...' 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='bg-green-500 p-2'>
                            <IoSearch className='text-3xl text-white' />
                        </div>
                    </div>
                </div>     

                {/* product list */}
                {filteredProducts && filteredProducts.length > 0 ? (
                    <div>
                        {filteredProducts.map((product) => (
                            <div className='flex p-1 mt-2 bg-white rounded' key={product._id}>
                                <div className="images lg:w-52 w-44 h-44 lg:h-52 p-2">
                                    <img src={product.images[0]} className='w-full h-full object-contain' alt={product.name} />
                                </div>
                                <div className="product-more-details p-2">
                                    <h1 className='text-sm lg:text-lg'>{product.name}</h1>
                                    <p className='py-1'>Price : ₹ {product.price}</p>
                                    <p className='py-1'>Stock : {product.stock}</p>
                                    <div className="btn">
                                        {/* <button className='lg:px-4 p-1 lg:py-2 bg-green-500 hover:bg-green-400 hover:text-white me-2 rounded cursor-pointer'>View Product</button> */}
                                        <button 
                                            className='rounded p-1 lg:px-4 lg:py-2 border text-red-600 border-red-500 cursor-pointer hover:bg-red-500 hover:text-white' 
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            DeleteProduct
                                        </button>
                                    </div>  
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-center mt-5'>No products found.</p>
                )}
            </div>
        </div>
    );
};

export default DeleteProduct;
