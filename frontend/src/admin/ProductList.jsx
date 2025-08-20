/* eslint-disable no-useless-catch */
import { useQuery } from "@tanstack/react-query";
import { IoSearch } from "react-icons/io5";
import { commenUrl } from "../commen/CommenUrl";
import { Link } from "react-router-dom";
import { useState } from "react";

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: getAllProducts } = useQuery({
    queryKey: ["getallproduct"],
    queryFn: async () => {
      try {
        const res = await fetch(`${commenUrl}/api/v1/products/getallproducts`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  const filteredProducts = getAllProducts?.products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <div className="lg:max-w-9/10 lg:mx-auto p-4">
        <h1 className="py-2 text-2xl">Product Update</h1>
        <div className="flex justify-between items-center">
          <div className="w-5/6 border border-gray-300 rounded">
            <div className="flex items-center">
              <div className="w-full">
                <input
                  type="text"
                  className="h-10 p-2 w-full outline-none rounded"
                  placeholder="Search Products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <IoSearch className="text-5xl p-2 bg-green-500 text-white rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Product List */}
        <div className="customer-order-track mt-8 flex justify-between">
          <div className="order-track w-full h-2/3">
            {filteredProducts?.length > 0 ? (
              filteredProducts.map((item, index) => (
                 <div key={index} className="shadow">
                    <div className="rounded-b text-end pe-10"><span className="px-4 text-xs rounded text-white bg-green-500">Active</span></div>
                <div className="p-2 flex my-3" >   
                  <div className="image w-56 h-56">
                    <img
                      src={item.images[0]}
                      className="w-full h-full object-contain"
                      alt={item.name}
                    />
                  </div>
                  <div className="product-more-details p-2 ps-3">
                    <h1 className="text-sm lg:text-lg">{item.name}</h1>
                    <p className="py-1">Price : ₹ {item.price}</p>
                    <p className="py-1">Stock : {item.stock}</p>
                    <div className="btn">
                      <Link to={`/update-product/${item._id}`}>
                        <button className="hover:text-white hover:bg-green-300 pt-2 px-4 py-2 bg-green-400 rounded">
                          Update Now
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                 </div>
              ))
            ) : (
              <p className="text-gray-500 mt-4">No products found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
