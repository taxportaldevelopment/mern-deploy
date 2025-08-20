import React, { useState,useEffect } from 'react';
import { IoIosClose } from "react-icons/io";
import {useQuery,useMutation} from "@tanstack/react-query";
import { commenUrl } from '../commen/CommenUrl';
import {toast} from "react-hot-toast";
import addtocart from "../assets/add-to-cart.png";
import {useQueryClient} from "@tanstack/react-query";
import LoadingSpenner from '../commen/LoadingSpenner';
import {useNavigate} from "react-router-dom";
// icons
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
const AddToCart = () => {

    useEffect(() => {
        function getRefresh() {
            window.scrollTo(0, 0);
        }
        getRefresh();
    }, []);

    const navigate = useNavigate();
    const [productId,setProductId] = useState();
       const queryClient = useQueryClient();
    const {data:CartData}= useQuery({
          queryKey:["cart"],
          queryFn:async()=>{
              // eslint-disable-next-line no-useless-catch
              try {

                  const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/addtocart/car/getallcart`, {
                       method: "GET",
                       credentials: "include",
                    //    headers:{
                    //         "Content-Type":"application/json"
                    //    }
                  });
                  const data = await res.json();
                  if(!res.ok){
                      toast.error(data.error || "Something went wrong")
                  }
                  return data;
              } catch(error){
                   throw error
              }
          }
    });

  // remove cart
  const { mutate: RemoveCart ,isPending} = useMutation({
    mutationFn: async ({ cartId }) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(
          `${commenUrl}/api/v1/addtocart/car/add/remove/${cartId}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess:()=>{
          queryClient.invalidateQueries("cart")
    }
  });

    // add new quantity
  const { mutate: addQuantity } = useMutation({
    mutationFn: async (pre) => {
      try {
        console.log(pre);

        const person = { action: pre };

        const res = await fetch(
          `${commenUrl}/api/v1/addtocart/car/add/quantity/${productId}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(person),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        return data;
      } catch (error) {
        console.error("Mutation error:", error); // Add this for better debugging
        throw error; // You can handle the error in onError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (error) => {
      toast.error(error.message); // Optional: handle errors gracefully
    },
  });
  const handleAddQuantity = (id) => {
      setProductId(id)
    addQuantity("increment"); // or whatever action string you're sending
  };
  const handleAddQuantityDec = (id) => {
    setProductId(id)
    addQuantity("decrement"); // or whatever action string you're sending
  };
  return (
    <div>
 
      {CartData?.success == false?
        (<div className='flex justify-center items-center'>
            <div>
                <img src={addtocart} className='h-72 p-3' alt="add to cart" />
                <p className='text-center'>Cart Not Found</p>
                <div className='flex justify-center items-center my-2'>
                    <button onClick={()=>navigate("/")} className='px-3 py-1 bg-green-400 hover:text-white'>Start Shopping</button>
                </div>
            </div>
        </div>)
      :       (<div className="container">
   
                <div className="add-to-cart-header flex p-4 bg-gray-200">
                    <MdOutlineShoppingCartCheckout className='text-3xl me-2' />
                    <h2 className='text-2xl font-bold product-font'>Add to Cart</h2>
                    {/* <button className='bg-red-600 text-white rounded-md px-4 py-2'>Clear Cart</button> */}
                </div>
            <div className="add-to-cart flex justify-between flex-wrap p-4">
             <div className="md:w-1/2">
                              {CartData?.cartFind.map((items,index)=>(
                         
                    <div className="cart-item lg:flex justify-between items-center p-4 "  key={index}>
                        <div className="cart-image lg:w-1/3 w-full">
                            <img src={items.productId.images[0]} alt="Product" className='w-full h-full object-cover rounded' />
                        </div>
                        <div className="cart-details lg:w-2/3 w-full px-4 ">
                            <h1 className='lg:whitespace-nowrap lg:w-96 lg:text-ellipsis lg:overflow-hidden px-1 pt-2 font-bold'>{items.productId.name}</h1>
                            {/* increse Quantity */}
                            <div className="quantity mt-4">
                                <label htmlFor="quantity" className='text-lg block'>Quantity:</label>
                                 <div className='flex'>
                                     <div className="hover:text-white add-quantity w-8 rounded h-8 flex justify-center items-center bg-green-500 text-2xl p-1 cursor-pointer" onClick={() => handleAddQuantityDec(items.productId._id)}>-</div>
                                     <div className="hover:text-white add-quantity w-8 rounded h-8 flex justify-center items-center">{items.quantity}</div>
                                     <div className="hover:text-white add-quantity w-8 rounded h-8 flex justify-center items-center bg-green-500  text-2xl p-1 cursor-pointer" onClick={()=>handleAddQuantity(items.productId._id)}>+</div>
                                 </div>
                            </div>
                            {/* price show indian format */}
                            <p className='lg:text-lg py-1 '>₹ {items.productId.price.toLocaleString()}</p>
                        {/* remove add to cart */}
                        <div className="remove-cart flex justify-end items-center">
                            <div className='flex items-center cursor-pointer my-2 text-red-500'>
                                <IoIosClose className='text-3xl' />
                                  {isPending?<LoadingSpenner/>:<span className='font-bold cursor-pointer' onClick={()=>RemoveCart({cartId:items.productId._id})}>Remove</span>}
                            </div>
                         </div>  
                        </div>
     
                    </div>
                    ))}
             </div>
             <div className="lg:w-1/2 w-full">
                    <div className="cart-summary p-4 border-s">
                        <h1 className='text-2xl font-bold bg-green-300 p-1 ps-2 rounded'>Cart Summary</h1>
                         <div className='flex justify-between items-center mt-4'>
                             <p className=' font-bold'>Total Items:</p>
                             <h3>1</h3>
                         </div>
                        {/* tax amount */}
                        {/* discount */}
                                <div className='flex justify-between items-center mt-4'>
                                    <p className=' font-bold'>Discount:</p>
                                    <h3>₹ 100</h3>
                                </div>    
                        {/* tax amount */}
                        <div className='flex justify-between items-center mt-4'>
                            <p className=' font-bold'>Tax:</p>
                            <h3>₹ 150</h3>
                        </div>
                        {/* delivery charge */}
                        <div className='flex justify-between items-center mt-4'>
                            <p className=' font-bold'>Delivery Charge:</p>
                            <h3>₹ 50</h3>
                        </div>
                        {/* total price */}
                        <div className='flex justify-between items-center mt-4'>
                            <p className=' font-bold'>Total Price:</p>
                            <h3>₹ 1,500</h3>
                        </div>
                         {/* buy now */}
                         <div>
                             <button className='mt-2 rounded py-3 w-full bg-amber-400 hover:bg-amber-300'>Buy Now</button>
                         </div>
                    </div>
             </div>
               </div>
             
       </div>)
    }
    </div>
  )
}

export default AddToCart
