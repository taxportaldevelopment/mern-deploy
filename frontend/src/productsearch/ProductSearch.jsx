import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { commenUrl } from '../commen/CommenUrl';
import { IoStar } from "react-icons/io5";
import { useNavigate } from "react-router-dom"; 
const ProductSearch = () => {
    const navigate = useNavigate();
    const {keyword} = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!keyword) return;

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/get/products/search?keyword=${keyword}`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);

      }
    };

    fetchProducts();
  }, [keyword]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="container">
         <div className='lg:max-w-9/10 lg:mx-auto'>
           <h1 className='py-3 text-2xl p-2'>Search Result</h1>

             {products && products.length >0?
               (
                 <div>
                     {products.map((items,index)=>(
                <div className='flex p-1 mt-2 bg-white shadow mb-1 hover:cursor-pointer' onClick={()=>navigate(`/product/${items._id}`)} key={index}>
                      <div className="images lg:w-52 w-44 h-44 lg:h-52  p-2">
                          <img src={items.images[0]} className='w-full h-full object-contain' alt="" />
                      </div>
                      <div className="product-more-details p-2">
                           <h1 className='text-xs lg:text-lg pb-1  hover:text-blue-500 cursor-pointer hover:underline hover:underline-offset-3' onClick={()=>navigate(`/product/${items._id}`)}>{items.name}</h1>
                            <p className='opacity-75 text-xs lg:text-lg'>price: ₹ {items.price}</p>
                            <p className='opacity-75 text-xs lg:text-lg'>{items.warranty}</p> 
                            {/* return policy less then 0 show the */}
                            {items.returnPolicy == 0 ? (<p>No Return Policy</p>) : (
                              <p className='opacity-75 text-xs lg:text-lg'>{items.returnPolicy}</p>
                            )}
                                <div className='flex items-center py-2'>
                                    <IoStar className='text-green-500'/>
                                    <IoStar className='text-green-500'/>
                                    <IoStar className='text-green-500'/>
                                    <IoStar className='text-green-500'/>
                                    <IoStar className='text-green-500'/>
                                                                   {/* <span>123 </span> */}
                                </div>
                      </div>
                 </div>
    
                      ))}
                 </div>
               )
             :<p className='text-center text-2xl'>Product Not Matched</p>}
         </div>
    </div>
  )
}

export default ProductSearch