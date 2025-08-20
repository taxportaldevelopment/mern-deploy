import React, { useState } from 'react';
import products from "../assets/home/products.jpg";
import advertisement1 from "../assets/home/advertisement-1.jpg";
import {formatNumber} from "indian-number-format";
// icons
import { IoStar } from "react-icons/io5";
import { IoMdStarOutline } from "react-icons/io";
import {useQuery} from "@tanstack/react-query";
import LoadingSpenner from '../commen/LoadingSpenner';
import { commenUrl } from '../commen/CommenUrl';
import {toast} from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import StarRating from '../starRating/StarRating';


const Home = () => {
      const [hoveredIndex, setHoveredIndex] = useState(null);

       const navigate = useNavigate();
     var arrayCount =[1,2,3,4,5,6,7,8,9,10]
      const [category,setCategory] = useState("All");
      const {data:allproducts} = useQuery({
           queryKey:["getallproducts"],
           queryFn:async()=>{
                // eslint-disable-next-line no-useless-catch
                try {
                    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/getallproducts`,{
                           method:"GET",
                           credentials:"include",
                           headers:{
                              "Content-Type":"application/json"
                           }
                    });
                    const data = await res.json();
                    if(!res.ok){
                        toast.error(data.error || "Something went wrong")
                    }
                   return data;
                } catch (error) {
                    throw error
                }
           }
      });
     // get category
     const {data:getCategory,isLoading} = useQuery({
          queryKey:["categorylist",category],
          queryFn:async()=>{
                // eslint-disable-next-line no-useless-catch
                try {
                    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/products/get/category?category=${category}`,{
                         method:"GET",
                         credentials:"include"
                    });

                    const data = await res.json();
                    if(!res.ok){
                          throw new Error(data.error || "Something went wrong")
                    }
                    return data;
                }catch(error){
                    throw error
                }
          }
     });
   const selectCategoryProduct = (element)=>{
       setCategory(element);
       getCategory()
   }

   return (
    <div>
        <div className="home-banner"></div> 
        {/* product adds */}
         <div className="mx-auto">
         <div className="lg:max-w-9/10 lg:mx-auto mt-4">
                     <h1 className='text-3xl py-4 product-font ps-6'>Best Sellers</h1>
              <div className="product-for-you p-2">        
                           {arrayCount.map((items,index)=>(

                                  <div className="product-cart box-shadow-box rounded-md cursor-pointer">
                           <div className="images object-cover h-52">
                                <img src={products} className='w-full object-cover h-full rounded-md' alt="product-img" />
                           </div>
                           <div className="star-rating flex justify-center py-1">
                                   <div className='flex items-center'>
                                        {/* <StarRating rating={20} /> */}
                                       {/* <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/> */}
                                       {/* <span>123 </span> */}
                                   </div>
                           </div>
                           <div className="details p-1">
                                 <h5 className='whitespace-nowrap md:w-56 text-ellipsis overflow-hidden opacity-80 text-md px-1 pt-2'>product light</h5>
                                 <h1 className='text-lg font-bold mt-2 text-center'>From : ₹ 1,500</h1>
                           </div>
                            <div className="rating p-2">
                                 <div className='flex  items-center'>
                                 <span className='w-12 flex text-sm items-center text-center bg-green-600 rounded-lg text-white px-2'>3.9
                                      <IoMdStarOutline />
                                 </span>
                                    <span className='text-xs ms-2'>327 Reviews</span>
                                 </div>
                            </div>
                            {/* <div className="buy-and-cart">
                                   <div className='flex justify-between p-2'>
                                         <button className='bg-orange-600 hover:bg-orange-500 text-white rounded-md px-4 py-1'>Buy Now</button>
                                         <button className='bg-yellow-400 hover:bg-yellow-300 text-white rounded-md px-4 py-1'>Add to Cart</button>
                                   </div>
                            </div> */}
                                   </div>
                           ))}
               

              </div>
             {/* advertisement section */}
                 <div className="advertisement my-5 rounded-md">
                      <img src={advertisement1} alt="Advertisement" className='shadow-lg w-full h-32 lg:h-96 p-1 lg:object-cover rounded' />
                 </div>
                 <div className="popular-add p-2 flex justify-between flex-wrap ">
                      <div className='md:w-96 w-full my-2 rounded p-3 bg-pink-100'>
                           <div className='flex items-center justify-between'>
                               <div className="image">
                                   <img src="https://www.bigbasket.com/media/uploads/p/xxl/413498_2-domex-specl-toilet-cleaning-powder.jpg" alt="Product" className=' h-48 object-cover rounded-md' />
                               </div>
                                   <div className='text-center font-serif font-bold'><h1>septic tank cleaning powder</h1></div>
                           </div>
                      </div>
                      <div className='md:w-96 w-full my-2 rounded p-3 bg-blue-100'>
                           <div className='flex items-center justify-between'>
                               <div className="image">
                                   <img src="https://www.bigbasket.com/media/uploads/p/xxl/413498_2-domex-specl-toilet-cleaning-powder.jpg" alt="Product" className=' h-48 object-cover rounded-md' />
                               </div>
                                   <div className='text-center font-serif font-bold'><h1>septic tank cleaning powder</h1></div>
                           </div>
                      </div>
                      <div className='md:w-96 w-full my-2 rounded p-3 bg-green-100'>
                           <div className='flex items-center justify-between'>
                               <div className="image">
                                   <img src="https://www.bigbasket.com/media/uploads/p/xxl/413498_2-domex-specl-toilet-cleaning-powder.jpg" alt="Product" className=' h-48 object-cover rounded-md' />
                               </div>
                                   <div className='text-center font-serif font-bold'><h1>septic tank cleaning powder</h1></div>
                           </div>
                      </div>
                 </div>
               {/*  product category filter only product completed loading after show category list*/}
                           
                 <div className="product-category-filter p-2">
                                 <h1 className='text-3xl py-4 product-font ps-6'>Product Category</h1>
                        <div className="filter-section flex justify-end items-center py-3">
                              <select name="category" onChange={(e)=>selectCategoryProduct(e.target.value)} className='border rounded-md p-2'>
                                        <option value="" disabled>Select Category</option>
                                        {getCategory?.categories.map((items,index)=>(
                                             <option value={items} key={index}>{items}</option>

                                        ))}
                              </select>
                        </div>
                        {/* loading spinner added */}
                         {isLoading && <div className="flex justify-center items-center py-4"><LoadingSpenner size='10' /></div>}
                         {/* product length */}
                         {getCategory?.products?.length === 0 && !isLoading && <div className="flex justify-center items-center py-4">No products found</div>}
                        {/* product list */}
                        <div className="product-for-you p-2">        
                           {getCategory?.products?.map((items,index)=>(

                                  <div key={index} className="product-cart box-shadow-box rounded-md cursor-pointer overflow-hidden" onClick={()=>navigate(`/product/${items._id}`)}
                                   onMouseEnter={() => setHoveredIndex(index)}
                                   onMouseLeave={() => setHoveredIndex(null)}
                                  >
                                 {/* offer top position */}

                           <div className="images object-cover h-48 relative">
                                <img src={hoveredIndex === index ? items.images[1] : items.images[0]} className='w-full object-cover h-full rounded-lg hover:scale-105 transition-transform duration-500' alt={items.name} />
                                     {items.offer > 0 && <div className="offer-top absolute top-0 left-0 bg-red-500 text-white p-1 rounded-br-md"><span className='text-xs'>{items.offer}%</span></div>}
                           </div>

                           <div className="details py-1">
                                 <h5 className='whitespace-nowrap md:w-56 text-ellipsis overflow-hidden  text-md px-1 pt-2'>{items.name}</h5>
                                 <h1 className='text-lg font-bold mt-2 text-center'>From : ₹ {items.price.toLocaleString("en-IN")}</h1>
                           </div>
                            <div className="rating p-2">
                                      <div className="star-rating flex  py-1">
                                   <div className='flex items-center'>
                                       {/* <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/>
                                       <IoStar className='text-green-500'/> */}
                                       <StarRating rating={items.ratings} reviews={items.numOfReviews} />
                                       {/* <span>123 </span> */}
                                   </div>
                           </div>
                            </div>
                            <div className="buy-and-cart my-1">
                                   <div className='flex justify-between p-1'>
                                         {/* <button className='bg-orange-600 hover:bg-orange-500 md:text-lg  text-white rounded-md lg:py-2 py-1 w-full '>Buy Now</button> */}
                                         {/* <button className='bg-yellow-400 hover:bg-yellow-300 text-xs text-white rounded-md px-3 py-1'>Add to Cart</button> */}
                                   </div>
                            </div>
                                   </div>
                           ))}
               

                         </div>

                 </div>
         </div>
         </div>
    </div>
  )
}

export default Home
