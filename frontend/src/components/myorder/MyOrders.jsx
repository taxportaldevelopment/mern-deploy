import React, { useState,useEffect} from 'react';
import myOrder from "../../assets/myorder/my-order.png";
import myOrder1 from "../../assets/myorder/Barcode-rafiki.png";
import { useQuery } from "@tanstack/react-query";
import { IoSearch } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { commenUrl } from '../../commen/CommenUrl';

const MyOrders = () => {
  useEffect(() => {
    function getRefresh() {
      window.scrollTo(0, 0);
    }
    getRefresh();
  }, []);
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [statusFilters, setStatusFilters] = useState([]);
  const [timeFilters, setTimeFilters] = useState([]);

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

  const handleStatusChange = (status) => {
    setStatusFilters(prev =>
      prev.includes(status)
        ? prev.filter(item => item !== status)
        : [...prev, status]
    );
  };

  const handleTimeChange = (year) => {
    setTimeFilters(prev =>
      prev.includes(year)
        ? prev.filter(item => item !== year)
        : [...prev, year]
    );
  };

  const filterOrders = () => {
    if (!getAllOrders?.orders) return [];

    return getAllOrders.orders.filter(order => {
      const productName = order.items[0].productId.name.toLowerCase();
      const orderDate = new Date(order.createdAt);
      const orderYear = orderDate.getFullYear();
      const last30 = new Date();
      last30.setDate(last30.getDate() - 30);

      const matchSearch =
        searchText === '' ||
        productName.includes(searchText.toLowerCase()) ||
        order.orderId.toLowerCase().includes(searchText.toLowerCase());

      const matchStatus =
        statusFilters.length === 0 ||
        statusFilters.includes(order.status);

      const matchTime =
        timeFilters.length === 0 ||
        (timeFilters.includes("Last 30 days") && orderDate >= last30) ||
        timeFilters.includes(String(orderYear));

      return matchSearch && matchStatus && matchTime;
    });
  };

  const filteredOrders = filterOrders();

  return (
    <div className='bg-gray-400'>
      <div className="container">
        <div className='lg:max-w-9/10 lg:mx-auto p-4'>
          <div className="md:flex my-4">
            {/* Sidebar Filters */}
            <div className='p-5 lg:w-80 bg-white'>
              <div className='flex justify-center items-center'>
                <img src={myOrder} alt="My Orders" className='h-18 object-cover' />
                <h1 className='text-2xl font-bold ms-2'>My Orders</h1>
              </div>

              <h1 className='mt-3 text-2xl font-serif'>Filter</h1>

              <p className='py-1 text-md font-serif'>ORDER STATUS</p>
              {["On The Way", "Delivered", "Cancelled", "Returned"].map((status, idx) => (
                <div key={idx} className='flex items-center py-1'>
                  <input
                    type="checkbox"
                    className='h-4 w-4'
                    checked={statusFilters.includes(status)}
                    onChange={() => handleStatusChange(status)}
                  />
                  <label className='text-md ms-6'>{status}</label>
                </div>
              ))}

              <p className='py-1 text-md font-serif'>ORDER TIME</p>
              {["Last 30 days", "2024", "2023", "2022", "2021"].map((year, idx) => (
                <div key={idx} className='flex items-center py-1'>
                  <input
                    type="checkbox"
                    className='h-4 w-4'
                    checked={timeFilters.includes(year)}
                    onChange={() => handleTimeChange(year)}
                  />
                  <label className='text-md ms-6'>{year}</label>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className='lg:w-4/5 p-4 lg:ms-3 bg-white'>
              <div className="search-box flex mb-4">
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder='Search by order number or product name'
                  className='border rounded-md w-2/4 h-11 p-2'
                />
                <button className='bg-green-400 hover:bg-green-300 text-white rounded-md px-4 py-2 flex items-center ms-2'>
                  <IoSearch /><span className='ms-1'>Search</span>
                </button>
              </div>

              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
<div
  key={order._id}
  className="flex flex-col sm:flex-row p-2 mt-2 bg-white border-b cursor-pointer hover:shadow-sm transition"
  onClick={() => navigate(`/product/review/${order._id}`)}
>
  {/* Product Image */}
  <div className="w-full sm:w-48 h-48 sm:h-48 p-2 flex-shrink-0">
    <img
      src={order.items[0].productId.images[0]}
      alt={order.items[0].productId.name}
      className="w-full h-full object-contain rounded"
    />
  </div>

  {/* Product Details */}
  <div className="flex flex-col justify-between p-2 w-full">
    {/* Name */}
    <h1 className="text-base sm:text-lg font-medium truncate sm:whitespace-normal sm:overflow-visible">
      {order.items[0].productId.name}
    </h1>

    {/* Info */}
    <div className="text-sm sm:text-base mt-1 space-y-1">
      <p>Price : ₹ {order.items[0].productId.price}</p>
      <p>Stock : {order.items[0].productId.stock}</p>
      <p>Tax : ₹ {order.items[0].productId.taxPrice}</p>
    </div>

    {/* Link */}
    <p className="text-blue-600 pt-2 text-sm sm:text-base font-medium">
      View Product
    </p>
  </div>
</div>

                ))
              ) : (
                <div className="shopping-now flex items-center justify-center mt-4 h-96">
                  <div>
                    <img src={myOrder1} alt="My Orders" className='h-44 object-cover' />
                    <Link to={"/"}>
                      <button className='px-7 py-3 font-semibold bg-green-500 hover:text-white hover:bg-green-400'>Start Shopping</button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;