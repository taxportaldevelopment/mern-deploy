import { useState, useReducer } from "react";
import { commenUrl } from "./commen/CommenUrl";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpenner from "./commen/LoadingSpenner";
import axios from "axios";
import Razorpay from "razorpay";

// Define the reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: Math.max(1, state.count - 1) };
    default:
      return state;
  }
};

// Define the initial state
const initialState = { count: 1 };
 
const UserCart = ({ productId, price }) => {
  const navigater = useNavigate()
  // Use the useReducer hook
  const [state, dispatch] = useReducer(reducer, initialState);
  const [types, setTypes] = useState("increment");

  //    const [addToCart,setAddToCart] = useState();
  const { data: addtoCart } = useQuery({
    queryKey: ["addtocartuser"],
    queryFn: async () => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(
          `${commenUrl}/api/v1/addtocart/car/add/${productId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await res.json();

        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw error;
      }
    },
  });

  // console.log(addtoCart?.message[0].quantity)

  const { data: authUser} = useQuery({
    // we use queryKey to give a unique name to our query and refer to it later
    queryKey: ["authUser"],

    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });
  const queryClient = useQueryClient();

  const addCart = () => {
    dispatch({ type: "INCREMENT" });
    setTypes("increment");
  };
  const descreCart = () => {
    if (state.count == 1) {
      return;
    }
    dispatch({ type: "DECREMENT" });
    setTypes("decrement");
  };
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
      queryClient.invalidateQueries({ queryKey: ["addtocartuser"] });
    },
    onError: (error) => {
      toast.error(error.message); // Optional: handle errors gracefully
    },
  });

  const handleAddQuantity = () => {
    addQuantity("increment"); // or whatever action string you're sending
  };
  const handleAddQuantityDec = () => {
    addQuantity("decrement"); // or whatever action string you're sending
  };

  // add new cart

  const { mutate: AddNewCart ,isError,error} = useMutation({
    mutationFn: async ({ quantity }) => {
      // eslint-disable-next-line no-useless-catch
      try {
        const res = await fetch(
          `${commenUrl}/api/v1/addtocart/car/add/${productId}`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ quantity }),
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
         toast.success("Add to cart successfully")
         queryClient.invalidateQueries("addtocartuser")
    }
  });

  const onSubmit = (e) => {
    //  e.preventDefault();
    if (authUser) {
      let formData = { quantity: state.count };
      AddNewCart(formData);
    } else {
      toast.error("First Login Next Go");
    }
  };

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
          toast.success("Remove Cart")
          queryClient.invalidateQueries("addtocartuser")
    }
  });

const checkoutHandler = async (amount) => {
  try {
    // Validate amount
    if (!amount || isNaN(amount)) {
      throw new Error("Invalid payment amount");
    }

    const amountInPaise = Math.round(amount * 100);

    // 1. Get Razorpay LIVE key (from environment variables)
    const { data: getKey } = await axios.get(`${commenUrl}/api/v1/orderproduct/getkey`, {
      timeout: 5000
    });

    if (!getKey?.key) {
      throw new Error("Failed to retrieve Razorpay key");
    }

    // 2. Create Razorpay order with live credentials
    const orderResponse = await fetch(`${commenUrl}/api/v1/orderproduct/payment/process`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ 
        amount: amountInPaise,
        currency: 'INR' // Explicitly specify currency
      }),
    });

    if (!orderResponse.ok) {
      const errorData = await orderResponse.json();
      throw new Error(errorData.message || errorData.error || "Failed to create order");
    }

    const orderData = await orderResponse.json();

    if (!orderData?.order?.id) {
      throw new Error("Invalid order data received from server");
    }

    const openRazorpay = () => {
      const options = {
        key: getKey.key, // This should now be your LIVE key
        amount: amountInPaise.toString(),
        currency: 'INR',
        name: 'Aura Homes',
        description: 'Product purchase',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            const verificationResponse = await fetch(`${commenUrl}/api/v1/orderproduct/verify/payment`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: amountInPaise // Include amount for additional verification
              }),
            });

            if (!verificationResponse.ok) {
              throw new Error("Payment verification failed");
            }
            
            const verificationData = await verificationResponse.json();
            console.log("Payment verification successful:", verificationData);
            
            // Redirect only after successful verification
            if (verificationData.success) {
              navigater('/order-success');
            } else {  
              throw new Error("Payment verification failed on server");
            }
          } catch (verificationError) {
            console.error("Payment verification error:", verificationError);
            alert("Payment verification failed. Please contact support with your Order ID: " + orderData.order.id);
          }
        },
        prefill: {
          name: authUser?.name || 'Guest',
          email: authUser?.email || 'aurahomeshopping@gmail.com',
          contact: authUser?.contact || '8438221832'
        },
        theme: {
          color: '#F37254'
        },
        method: {
          wallet: false, // Enable wallets in live mode
          emi: false
        },
        modal: {
          ondismiss: function() {
            console.log("Payment modal dismissed");
            // Consider tracking abandoned payments
          }
        }
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function(response) {
        console.error("Payment failed:", response.error);
        alert(`Payment failed: ${response.error.description}`);
        // Track failed payments for analytics
      });

      rzp.open();
    };

    // Load Razorpay script if not loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = openRazorpay;
      script.onerror = () => {
        throw new Error("Failed to load Razorpay SDK");
      };
      document.body.appendChild(script);
    } else {
      openRazorpay();
    }

  } catch (error) {
    console.error("Checkout error:", error);
    alert(`Payment error: ${error.message}`);
    // Consider implementing error tracking
  }
};


  return (
    <div>
      {addtoCart?.success ? (
        <div>
          <div className="quantity mt-4">
            <label htmlFor="quantity" className="text-lg block py-2">
              Quantity:
            </label>
            <div className="flex">
              <div
                className="add-quantity cursor-pointer w-7 h-7 lg:w-9 lg:h-9 hover:text-white rounded-3xl flex justify-center items-center bg-green-500 text-2xl p-1"
                role="button"
                onClick={() => handleAddQuantityDec()}
              >
                -
              </div>
              <div className="add-quantity cursor-pointer w-7 h-7  lg:w-10 lg:h-10 flex justify-center items-center ">
                {addtoCart?.message[0].quantity}
              </div>
              <div
                className="add-quantity cursor-pointer w-7 h-7 rounded-3xl lg:w-9 lg:h-9 hover:text-white flex justify-center items-center bg-green-500  text-2xl p-1"
                role="button"
                onClick={() => handleAddQuantity()}
              >
                +
              </div>
            </div>
          </div>
          <div>
            <button className="bg-orange-600 text-white rounded-md px-4 py-2 mt-4 me-2" onClick={()=>navigater(`/auth/order-details/${productId}`)}>
              Buy Now
            </button>
            {addtoCart?.success ? (
              <button onClick={()=>RemoveCart({cartId:addtoCart?.message[0].productId})} className="bg-green-600 text-white rounded-md px-4 py-2 mt-4 cursor-pointer">
                {
                  isPending?<LoadingSpenner/>:"Remove Cart"
                }
              </button>
            ) : (
              <button className="bg-green-600 text-white rounded-md px-4 py-2 mt-4">
                Add to Cart
              </button>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="quantity mt-4">
            <label htmlFor="quantity" className="text-lg block py-2">
              Quantity:
            </label>
            <div className="flex">
              <div
                className="add-quantity cursor-pointer w-7 h-7 lg:w-9 rounded-3xl lg:h-9  flex justify-center items-center bg-green-500 text-2xl p-1"
                role="button"
                onClick={() => descreCart()}
              >
                -
              </div>
              <div className="add-quantity cursor-pointer w-7 h-7  lg:w-10 lg:h-10 flex justify-center items-center">
                {state.count}
              </div>
              <div
                className="add-quantity cursor-pointer w-7 h-7 rounded-3xl lg:w-9 lg:h-9 flex justify-center items-center bg-green-500  text-2xl p-1"
                role="button"
                onClick={() => addCart()}
              >
                +
              </div>
            </div>
          </div>
          <div>
            <button className="bg-orange-600 text-white rounded-md px-4 py-2 mt-4 me-2 cursor-pointer" onClick={()=>checkoutHandler(price)}>
              Buy Now
            </button>
            <button
              className="bg-green-600 text-white rounded-md px-4 py-2 mt-4 cursor-pointer"
              onClick={() => onSubmit()}
            >
              Add to Cart
            </button>
            {isError && <p className="py-2 text-red-600">{error.error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
