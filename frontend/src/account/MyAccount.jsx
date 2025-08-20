import {useEffect} from 'react'
import {useQuery} from "@tanstack/react-query";
import { commenUrl } from '../commen/CommenUrl';
import toast from 'react-hot-toast';

const MyAccount = () => {

         useEffect(()=>{
      function getRefresh() {
         window.scrollTo(0, 0);
      }
      getRefresh();
         },[]);

  const { data: getAllOrders } = useQuery({
    queryKey: ["getallorders"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/orderproduct/author/orders`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    retry: false    
  });
  const {data:authUser} = useQuery({queryKey:["authUser"],
    queryFn:async()=>{
            try {

                 const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/me`, {
                          method: "GET",
                          credentials: "include",
                          headers: {
                              "Content-Type": "application/json"
                          }
                 });
                      const data = await res.json();
                      
                      if(data.error) return null;
                      if(!res.ok){
                          throw new Error(data.error || "Something went wrong");
                      }
               return data;
            }catch(error){
                throw new Error(error);
            }
    },
    retry: false,
   });
  return (
    <div>
      
      <div className='lg:max-w-9/10 lg:mx-auto'>
            <div className="md:flex md:flex-nowrap">
                 <div className="w-full lg:w-1/2 p-3">
                    <h1 className='text-2xl font-bold text-center py-5'>My Account</h1>
                    {getAllOrders?.success !== true?<p className='font-serif my-3 text-lg'>You haven't placed any orders yet.</p>:""}

                    {/* orders table overflow x-axis auto scroll table */} 
     <div className="orders overflow-x-auto w-full">
  <table className="min-w-[600px] w-full border border-gray-300">
    <thead>
      <tr className="bg-gray-200">
        <th className="border border-gray-300 p-2">No.</th>
        <th className="border border-gray-300 p-2">Order ID</th>
        <th className="border border-gray-300 p-2 whitespace-nowrap md:w-56 text-ellipsis overflow-hidden">Product Name</th>
        <th className="border border-gray-300 p-2">Price</th>
        <th className="border border-gray-300 p-2">Status</th>  
      </tr>
    </thead> 
    <tbody>
      {
        getAllOrders?.orders.map((items, index) => (
          <tr key={index} title={items.productName}>
            <td className="border border-gray-300 p-2">{index + 1}</td>
            <td className="border border-gray-300 p-2">{items.orderId}</td>
            <td className="border border-gray-300 p-2 max-w-[8rem] md:max-w-[10rem] truncate">{items.productName}</td>
            <td className="border border-gray-300 p-2">₹ {items.items[0].productId.price.toLocaleString("en-IN")}</td>
            <td className="border border-gray-300 p-2" style={{ color: items.status === "Delivered" ? "red" : "green" }}>
              {items.status}
            </td>
          </tr>
        ))
      }
    </tbody>
  </table>
</div>

                 </div>
                 <div className="w-full lg:w-1/2 p-3">
                     <div className="user-name">
                            <h1 className='text-2xl font-bold text-center py-5'>User Name</h1>
                          {/* email */}
                          <p className='py-3 font-serif text-lg text-center'>{authUser?.firstname}</p>
                     </div>
                 </div>
            </div>
      </div>
    </div>
  )
}

export default MyAccount
