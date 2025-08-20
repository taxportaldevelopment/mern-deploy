import React, { useEffect, useRef, useState } from 'react';
import { useQuery,useQueryClient,useMutation} from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { commenUrl } from '../commen/CommenUrl';
import { useParams } from "react-router-dom";
import { IoStar,IoChevronBackOutline,IoChevronForwardOutline,IoStarOutline} from "react-icons/io5";
import Review from './Review';
import { FaCheckCircle} from "react-icons/fa";
// icons
import { TiArrowRight } from "react-icons/ti";
// Tracker Component
const FlipkartOrderTracker = ({ steps, currentStep }) => {
  return (
    <div className="flex flex-col p-4">
      <div className="flex justify-between items-center w-full relative">
        {steps.map((step, index) => (
          <div key={index} className="flex-1 text-center relative z-10">
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs 
                ${index <= currentStep ? 'bg-green-500' : 'bg-gray-300'}`}>
                <FaCheckCircle size={16} />
              </div>
              <p className={`mt-2 text-xs ${index <= currentStep ? 'text-green-600 font-semibold' : 'text-gray-500'}`}>
                {step.label}
              </p>
              {step.date && (
                <p className="text-xs text-gray-400 mt-1">{step.date}</p>
              )}
            </div>
          </div>
        ))}
        <div className="absolute top-3 left-0 right-0 h-1 bg-gray-300 z-0 rounded">
          <div
            className="h-full bg-green-500 rounded transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div> 
    </div>
  );
};
 
const ProductReview = () => {
  const { orderId } = useParams(); 
const { mutate: cancelOrderMutation, isLoading: isCancelling } = useMutation({
  mutationFn: async () => {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/orderproduct/author/ordercancel/active/${orderId}`, {
      method: "PUT", // or "POST" depending on your backend
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Cancellation failed");
      throw new Error(data.message || "Cancellation failed");
    }
    return data;
  },
  onSuccess: (data) => {
    toast.success(data.message || "Order cancelled successfully");
    queryClient.invalidateQueries(["getorder", orderId]); // Refresh order data
  },
  onError: () => {
    toast.error("Failed to cancel the order");
  },
});



  const queryClient = useQueryClient();
    useEffect(()=>{
    function getRefresh() {
       window.scrollTo(0, 0);
    }
    getRefresh();
    // Hide the scrollbar for the mobile scrollable area
    const style = document.createElement('style');
    style.innerHTML = `
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `;
    document.head.appendChild(style);
  }, []);

  // Inside your component
  const mobileScrollRef = useRef(null);

const mobileScroll = (direction) => {
  if (mobileScrollRef.current) {
    mobileScrollRef.current.scrollBy({
      left: direction === 'left' ? -100 : 100,
      behavior: 'smooth',
    });
  }
};

  const [changeIndex, setChangeIndex] = useState(0);

  const { data: productReview } = useQuery({
    queryKey: ["getorder", orderId],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(`${commenUrl}/api/v1/orderproduct/author/getsingle/order/${orderId}`, {
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
  // console.log("Product Review Data:", productReview?.order[0]);
  // const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : null);

  // const getStepIndexFromStatus = (status) => {
  //   switch (status) {
  //     case "Pending": return 0;
  //     case "Processing": return 1;
  //     case "Shipped": return 2;
  //     // case "On The Way": return 3;
  //     case "Delivered": return 4;
  //     default: return 0;
  //   }
  // };

     const {mutate:statusUpdate} = useMutation({
    mutationFn: async ({orderId, status}) => {
      try {
        console.log("Updating order status:", orderId, status);
        const res = await fetch(`${commenUrl}/api/v1/orderproduct/order/${orderId}/status`, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ status })
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Failed to update order status");
          throw new Error(data.error || "Failed to update order status");
        }

        return data;
      } catch (error) {
        toast.error("Network error or server not responding");
        throw error;
      }
    },
    onSuccess:() => {
        toast.success("Order status updated successfully");
        queryClient.invalidateQueries(["getallorders"]);
    }
  });


  if (!productReview) return <div className="p-4">Loading...</div>;

  const product = productReview.order;
  //  console.log(product[0].orderId)
  // const steps = [
  //   { label: 'Order Placed', date: formatDate(product.createdAt) },
  //   { label: 'Packed', date: formatDate(product.packedAt) },
  //   { label: 'Shipped', date: formatDate(product.shippedAt) },
  //   { label: 'On The Way', date: formatDate(product.outForDeliveryAt) },
  //   { label: 'Delivered', date: formatDate(product.deliveredAt) },
  // ];

const rating = productReview?.order[0].items[0].productId.ratings || 0;
const reviewCount = productReview?.order[0].items[0].productId.numOfReviews || 0;

  const cancelOrder = () => {
     userCancelData();
     console.log("hii")
  };


  return (
    <div className="container p-4">
      <div className='lg:max-w-9/10 lg:mx-auto'>
        <div className="product-show flex justify-between flex-wrap">
          <div className="product-image md:w-1/2">
            <div className='flex items-center'>
              <div className="hidden md:block justify-center items-center me-3">
                {productReview?.order[0].items[0].productId.images?.map((item, index) => (
                  <div className="w-h-16 h-16 shadow-md rounded my-2" key={index} onMouseOver={() => setChangeIndex(index)}>
                    <img src={item} alt="Product" className='w-full h-full object-cover' />
                  </div>
                ))}
              </div>
              <div>
                <img src={productReview?.order[0].items[0].productId.images[changeIndex]} alt="Main" className='w-full h-full object-cover rounded-2xl' />
              </div>
            </div>
          </div>

  {/* Mobile view image list */}
<div className='block md:hidden my-2 w-full'>
  <div className="flex justify-center items-center px-2 w-full">

               {/* {productReview?.order[0].items[0].productId.images?.map((items, index) => (
        <div
          key={index}
          className="w-12 h-w-12 shadow-md rounded flex-shrink-0"
          onMouseOver={() => setChangeIndex(index)}
        >
          <img src={items} alt="Product" className="w-full h-full object-cover" />
        </div>
      ))} */}
    {/* Scrollable Thumbnails */}
    <div
      ref={mobileScrollRef}
      className="flex overflow-x-auto gap-2 scrollbar-hide"
    >
      {productReview?.order[0].items[0].productId.images?.map((items, index) => (
        <div
          key={index}
          className="w-14 h-w-14 shadow-md rounded flex-shrink-0"
          onMouseOver={() => setChangeIndex(index)}
        >
          <img src={items} alt="Product" className="w-full h-full object-cover rounded" />
        </div>
      ))}
    </div>

  </div>
</div>

          <div className="product-details md:w-1/2 p-4">
            <h1 className='lg:text-3xl'>{productReview?.order[0].productName}</h1>
            <h2 className='text-xl font-semibold mt-4'>Price: ₹ {productReview?.order[0].items[0].productId.price.toLocaleString()}</h2>

       <div className="star-rating py-3">
  <div className='flex items-center'>
    {
      [...Array(5)].map((_, index) => (
        index < Math.round(rating)
          ? <IoStar key={index} className='text-green-500' />
          : <IoStarOutline key={index} className='text-gray-400' />
      ))
    }
    <span className='ms-2 bg-gray-400 px-2 py-1 text-xs rounded text-white'>
      {rating.toFixed(1)} ★ ({reviewCount} reviews)
    </span>
  </div>
</div>

            <div className="return-policy mt-4">
              <h3 className='text-lg font-semibold'>Return Policy:</h3>
              <p className='text-sm'>{product[0].items[0].productId.returnPolicy}</p>
            </div>

            <div className="product-status mt-4">
              <h3 className='text-lg font-semibold'>Tracking ID:</h3>
              <p className='text-sm mt-1'>{product[0].idActive ? (<div><span className='p-1 bg-green-400 rounded'>{product[0].orderId}</span><span className='block mt-1 text-blue-500'><a className='flex items-center text-base' href="https://app.shiprocket.in/newlogin?_gl=1*1upbfaz*_gcl_au*MjA1OTc3NTE5OC4xNzUxODg0NzA1*_ga*MTk3ODc3MTYxLjE3NTE4ODQ3MDU.*_ga_PGWFJGRBN7*czE3NTE4ODQ3MDQkbzEkZzAkdDE3NTE4ODQ3MDQkajYwJGwwJGgw*_ga_923W0EDVX1*czE3NTE4ODQ3MDQkbzEkZzAkdDE3NTE4ODQ3MDQkajYwJGwwJGgw" target='_blank'>Go To shiprocket <TiArrowRight /></a></span></div>) : (<span className='opacity-75'>Processing...</span>)}</p>
            </div>
            {/* Cancelled */}
            {/* {product[0].status == "Cancelled" ? (
              <p className='text-sm text-red-500'>This order has been cancelled.</p>
            ) : (
              <FlipkartOrderTracker steps={steps} currentStep={getStepIndexFromStatus(productReview?.order[0].status)} />
            )} */}

            <div className="warranty mt-4">
              <h3 className='text-lg font-semibold'>Warranty:</h3>
              <p className='text-sm'>{product[0].items[0].productId.warranty}</p>
            </div>

            <div className="product-specifications mt-4">
              <h3 className='text-lg font-semibold'>Product Specifications:</h3>
              <ul className='list-disc list-inside py-2'>
                {productReview?.order[0].items[0].productId.specifications.map((spec, index) => (
                  <li key={index}>{spec}</li>
                ))}
              </ul>
            </div>

            <p className='text-lg mt-2'><strong className='opacity-65'>Description:</strong> {productReview?.order[0].items[0].productId.description}</p>
             {/* order cancellation */}
            <div className="order-cancellation mt-4">
              <h3 className='text-lg font-semibold'>Order Cancellation:</h3>
              <p className='text-sm'>You can cancel your order within 24 hours of placing it.</p>
              <p className='text-sm'>To cancel your order, please contact our customer support.</p>
              <p className='text-sm'>You can reach us at <strong className='opacity-80'>sales@aurahomes.com</strong></p>
              {/* calcell button Cancelled*/}
              {
                product[0].status === "Cancelled" ? (
                  <p className='text-sm text-red-500 mt-2'>This order has already been cancelled.</p>
                ) : (
                  <p className='text-sm text-green-500 mt-2'>You can cancel this order.</p>
                )
              }
              {
                product[0].status !== "Cancelled" && (
                 <abbr title="Click to cancel your order">
                   <button
                     className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                     onClick={() => cancelOrderMutation()}
                     disabled={isCancelling}
                   >
                     Cancel Order
                   </button>
                 </abbr>

                )
              }
            </div>
            </div>
        </div>

        {/* Review Section */}
        <Review orderId={productReview?.order[0].items[0].productId._id} />
      </div>
    </div>
  );
};

export default ProductReview;
