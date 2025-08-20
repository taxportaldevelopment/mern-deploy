import React, { useEffect, useState } from 'react'
import { IoStar } from "react-icons/io5";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import { commenUrl } from '../commen/CommenUrl';
import {toast} from "react-hot-toast";
const Review = ({orderId}) => {

    const [comment,setComment] = useState("");
    const [rating,setRating] = useState();
    const [hover, setHover] = useState(null);

      const queryClient = useQueryClient();
      const {data:getReviews} = useQuery({
          queryKey:["userreview"],
          queryFn:async()=>{
                // eslint-disable-next-line no-useless-catch
                try {
                    
                    const res = await fetch(`${commenUrl}/api/v1/products/get/allproduct/${orderId}`);
                    const data = await res.json();

                    if(data.error) return null;
                    if(!res.ok){
                        throw new Error(data.error || "Something went wrong");
                    }
                    return data;
                    
                } catch (error) {
                    throw error
                }
          },
          retry:false,
      })
          const {mutate:addReview,isError,error,isPending} = useMutation({
         mutationFn:async({comment,rating})=>{
            
             // eslint-disable-next-line no-useless-catch
             try {
                const res = await fetch(`${commenUrl}/api/v1/products/product-review/${orderId}`,{
                       method:"POST",
                       credentials:"include",
                       headers:{
                          "Content-Type":"application/json"
                       },
                       body:JSON.stringify({comment,rating})
                });
                const data = await res.json();
                if(!res.ok){
                    throw new Error(data.error || "Something went wrong");
                }
               return data;
            } catch (error) {
                throw error;
            }
         },
         onSuccess:(updateReview)=>{
                toast.success("review added successfully");
                queryClient.invalidateQueries("userreview")
                setComment("")
                // queryClient.setQueryData(["userreview"],(oldreview)=>{
                //      if(oldreview._id == getReviews._id){
                //           return {...oldreview,review:updateReview}
                //      }
                //      return oldreview
                // })
             
         }
    })
  
    const onSubmit = (e)=>{
           e.preventDefault();
           let formData = {
                comment:comment,
                rating:rating
           }
           addReview(formData);
           
    }
  return (
     <div>
                         <div className="product-reviews mt-8">
                    <h2 className='text-2xl font-semibold'>Customer Reviews</h2>
                                           {/* enter review */}
                    <form onSubmit={onSubmit}>
                    <div className="set-rating flex space-x-1 text-yellow-500 cursor-pointer py-4">
                                {[1,2,3,4,5].map((str)=>(
                                      <FaStar
                                         key={str}
                                         size={30}
                                         onClick={()=>setRating(str)}
                                         onMouseEnter={() => setHover(str)}
                                         onMouseLeave={() => setHover(null)}
                                         color={(hover || rating) >= str ? '#facc15' : '#e5e7eb'}
                                      />
                                ))}
                          </div>
                         <div className="review-section py-2">
                             <textarea name="review" value={comment} onChange={(e)=>setComment(e.target.value)} id=""  rows="3" className='border-2 p-2 lg:w-96 block w-full rounded border-gray-300 focus:outline-0' placeholder='Write a review...'></textarea>
                            {comment && <button disabled={isPending} className=' my-3 px-4 py-2 border border-green-500 rounded cursor-pointer hover:bg-green-400 hover:text-white'>Send Review</button>}
                        </div>
                        {isError && <p className='text-red-500'>{error.message}</p>}
                    </form>                       
                          
                       {/* photo and name and reviews */}
                       {getReviews?.map((items,index)=>(
                           
                    <div className="review-item flex items-center mt-5 py-2 border-b" key={index}>
                        <div className="review-photo w-16 h-16 rounded-full overflow-hidden shadow-md">
                            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="User" className='w-full h-full object-cover' />
                        </div>
                        <div className="review-details ms-4">
                            <h3 className='text-lg font-semibold'>{items.name}</h3>
                            <p className='text-sm'>{items.comment}</p>
                            {/* star rating */}
                            <div className="star-rating py-1">
                                <div className='flex items-center'>
                                    {items.rating >= 1 ? <IoStar className='text-green-500' /> : <FaRegStar className='text-gray-400' />}
                                    {items.rating >= 2 ? <IoStar className='text-green-500' /> : <FaRegStar className='text-gray-400' />}
                                    {items.rating >= 3 ? <IoStar className='text-green-500' /> : <FaRegStar className='text-gray-400' />}
                                    {items.rating >= 4 ? <IoStar className='text-green-500' /> : <FaRegStar className='text-gray-400' />}
                                    {items.rating >= 5 ? <IoStar className='text-green-500' /> : <FaRegStar className='text-gray-400' />}
                                    <span className='ms-2 bg-gray-400 px-2 py-1 text-xs rounded text-white'>
                                        {items.rating.toFixed(1)} ★
                                    </span>
                                 </div>    
                            </div>         
                        </div>
                    </div>
                       ))}


                    </div>  
     </div>
  )
}

export default Review