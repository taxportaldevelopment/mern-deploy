import React, { useState, useMemo } from 'react';
import { useQuery,useMutation ,useQueryClient} from '@tanstack/react-query';
import { IoSearch } from "react-icons/io5";
import { commenUrl } from '../../../commen/CommenUrl';
import toast from 'react-hot-toast';

const OrderStatus = () => {
    const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderAddress, setOrderAddress] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState("");

  // Get all orders
  const { data: allorders = { orders: [] } } = useQuery({
    queryKey: ["getallorders"],
    queryFn: async () => {
      try {
        const res = await fetch(`${commenUrl}/api/v1/orderproduct/allorder`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || "Something went wrong");
          throw new Error(data.error || "Failed to fetch orders");
        }

        return data;
      } catch (error) {
        toast.error("Network error or server not responding");
        throw error;
      }
    }
  });

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);

    if (!value.trim()) {
      setSuggestions([]);
      setFilteredOrders([]);
      return;
    }

    const matches = allorders?.orders.filter(order =>
      order.productName.toLowerCase().includes(value.toLowerCase())
    );

    setSuggestions(matches);
  };

  const handleSuggestionClick = (order) => {
    setSearchText(order.productName);
    setFilteredOrders([order]);
    setSuggestions([]);
  };

  // Handle status filter
  const handleStatusFilterChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  // Filter logic
  const ordersToDisplay = useMemo(() => {
    let baseOrders = filteredOrders.length > 0 ? filteredOrders : allorders.orders;
    if (selectedStatus) {
      return baseOrders.filter(order => order.status === selectedStatus);
    }
    return baseOrders;
  }, [filteredOrders, allorders.orders, selectedStatus]);

  //  order status update
   
   const {mutate:statusUpdate} = useMutation({
    mutationFn: async ({orderId, status}) => {
      try {
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
  const handleStatusUpdate = (orderId, status) => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }

    statusUpdate({orderId, status});
  };
  return (
    <div className="container">
      <div className='lg:max-w-9/10 lg:mx-auto p-4'>
        <h1 className='py-2 text-2xl'>CUSTOMER ORDERS</h1>

        <div className='flex justify-between items-center relative'>
          {/* Search box */}
          <div className='w-5/6 border rounded p-2'>
            <div className='relative'>
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                className='h-8 p-2 w-full outline-none rounded'
                placeholder='Search Orders by Product Name...'
              />
              <IoSearch className='absolute right-2 top-0 text-3xl text-green-500' />
            </div>
            {suggestions.length > 0 && (
              <ul className='absolute z-10 bg-white w-5/6 border shadow max-h-40 overflow-y-auto mt-1'>
                {suggestions.map((order, index) => (
                  <li
                    key={index}
                    className='p-2 hover:bg-green-100 cursor-pointer'
                    onClick={() => handleSuggestionClick(order)}
                  >
                    {order.productName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Status Filter */}
          <div className="status-section ml-4">
            <select
              className='border p-2 rounded'
              value={selectedStatus}
              onChange={handleStatusFilterChange}
            >
              <option value="">--check status--</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders and Address Display */}
        <div className="customer-order-track mt-8 flex justify-between">
          <div className='order-track w-2/3 h-2/3'>
            {ordersToDisplay.map((order, index) => (
              <div key={index} className='flex shadow p-4 w-full'>
                <div className="image w-56 h-56">
                  <img src={order?.items[0].productId.images[0] || "https://via.placeholder.com/200"} className='w-full h-full object-contain' alt={order.productName} />
                </div>
                <div className="product-more-details p-4">
                  <h1 className='text-lg font-semibold'>{order.productName}</h1>
                  <p>Price : ₹ {order.items[0].price}</p>
                  <p>Stock : {order.items[0].productId.stock}</p>
                  <p><strong>Order ID</strong> : {order.orderId}</p>
                  <button className='mt-2 hover:text-white hover:bg-green-400 px-4 py-2 bg-green-500 rounded' onClick={() => setOrderAddress(index)}>View Status</button>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="shipping-address shadow w-96">
            <div>
              <h1 className='py-2 bg-green-500 text-white p-2'>SHIPPING ADDRESS</h1>
              <div className='p-2'>
                <p>{ordersToDisplay[orderAddress]?.productName}</p>
                <p className='py-2'><strong>Price :</strong> ₹ {ordersToDisplay[orderAddress]?.items[0].price}</p>
                <p><strong>Tax :</strong> ₹ {ordersToDisplay[orderAddress]?.items[0].productId.taxPrice}</p>
                <p className='py-2'><strong>Address :</strong> {ordersToDisplay[orderAddress]?.shippingAddress.addressLine}</p>
                <p className='py-2'><strong>City : </strong>{ordersToDisplay[orderAddress]?.shippingAddress.city}</p>
                <p className='py-2'><strong>Postal Code : </strong>{ordersToDisplay[orderAddress]?.shippingAddress.postalCode}</p>
                <p className='py-2'><strong>State : </strong>{ordersToDisplay[orderAddress]?.shippingAddress.state}</p>
                <p className='py-2'><strong>Country : </strong>{ordersToDisplay[orderAddress]?.shippingAddress.country}</p>
                <p className='py-2'><strong>Mobile No : </strong>{ordersToDisplay[orderAddress]?.phoneNumber}</p>
                <p className='py-2'>
                  <strong>Order Status : </strong>
                  <span style={{ color: (ordersToDisplay[orderAddress]?.status === "Delivered" ? "green" : "red") }}>
                    {ordersToDisplay[orderAddress]?.status}
                  </span>
                </p>
                <form>
                  <div className="status-section py-2">
<select
  className="border p-2 rounded w-full"
  value=""
  onChange={(e) =>
    handleStatusUpdate(ordersToDisplay[orderAddress]?.orderId, e.target.value)
  }
>
  <option value="" disabled>
    Current: {ordersToDisplay[orderAddress]?.status}
  </option>
  {(() => {
    const statusFlow = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    const currentStatus = ordersToDisplay[orderAddress]?.status;
    const currentIndex = statusFlow.indexOf(currentStatus);

    // Show all statuses after the current one
    const nextStatuses = statusFlow.slice(currentIndex + 1);

    return nextStatuses.map((status) => (
      <option key={status} value={status}>
        {status}
      </option>
    ));
  })()}
</select>




                  </div>
                  {/* <button className='my-3 px-6 py-2 border-green-500 border rounded hover:bg-green-500 hover:text-white'>Submit</button> */}
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderStatus;
