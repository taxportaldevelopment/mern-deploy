import React from 'react'
import { useQuery } from '@tanstack/react-query';    
const UserOrders = () => {
  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['userOrders'],
    queryFn: async () => {
      const res = await fetch('http://localhost:4000/api/v1/orderproduct/allorder', {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      return res.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
//   console.log(orders);
  return (
    <div>
        <h1>User Orders</h1>
        <ul>
          {orders?.orders.map(order => (
            <li key={order.id}>{order.id}: {order.total} - {order.status}</li>
          ))}
        </ul>
    </div>
  )
}

export default UserOrders