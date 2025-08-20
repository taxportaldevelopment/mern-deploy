import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ShoppingCart, Box, Star, DollarSign } from "lucide-react";
import {useQuery} from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import toast from "react-hot-toast";
import { formatPostDate } from "../utils/data";
import AdminUpdatePop from "../poup/AdminUpdatePop";
// Static product list (for chart + summary)

// Detailed order list (for date-wise table)
// const orders = [
//   { id: "ORD001", product: "iPhone 14", quantity: 2, date: "2025-05-20", revenue: 240000, rating: 4.8 },
//   { id: "ORD002", product: "HP Laptop", quantity: 1, date: "2025-05-22", revenue: 350000, rating: 4.3 },
//   { id: "ORD003", product: "Realme 11x", quantity: 3, date: "2025-05-21", revenue: 192000, rating: 4.0 },
//   { id: "ORD004", product: "iPhone 14", quantity: 1, date: "2025-05-23", revenue: 120000, rating: 4.7 },
// ];

// Sort by newest date
// orders.sort((a, b) => new Date(b.date) - new Date(a.date));

const DashboardCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex items-center space-x-4">
    <div className={`p-2 rounded-full ${color} text-white`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const DashBoard = () => {

  // user id get
  const [userId, setUserId] = useState();
  const [showPopup, setShowPopup] = useState(false);
    const handleOpen = () => setShowPopup(true);
  const handleClose = () => setShowPopup(false);

  const handleUserId = (id) => {
    setUserId(id);
    handleOpen();
  };

const { data: allproducts = { products: [] } } = useQuery({
  queryKey: ["getallproducts"],
  queryFn: async () => {
    try {
      const res = await fetch(`${commenUrl}/api/v1/products/getallproducts`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        throw new Error(data.error || "Failed to fetch products");
      }

      return data;
    } catch (error) {
      toast.error("Network error or server not responding");
      throw error;
    }
  }
});

// get all orders
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
  
const orders = useMemo(() => {
  return allorders?.orders?.map((item) => ({
    id: item.orderId,
    product: item.items[0]?.productId?.name || "Unknown Product",
    status: item.status,
    quantity: item.items.reduce((sum, i) => sum + i.quantity, 0),
    date: new Date(item.createdAt).toLocaleDateString("en-IN"),
    revenue: item.items.reduce((sum, i) => sum + (i.quantity * i.productId.price), 0),
    rating: item.items[0]?.productId?.ratings || 0,
  })) || [];
}, [allorders]);

  const products = useMemo(() => {
    return allproducts?.products?.map((item) => ({
      name: item.name,
      stock: item.stock,
      rating: item.ratings,
      orders: item.totalOrders,
      revenue: item.revenue,
    })) || [];
  }, [allproducts]);

//  get all users
const { data: allusers } = useQuery({
  queryKey: ["getallusers"],
  queryFn: async () => {
    try {  
      const res = await fetch(`${commenUrl}/api/v1/auth/getalluser`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        throw new Error(data.error || "Failed to fetch users");
      }
      return data;
    } catch (error) {
      toast.error("Network error or server not responding");
      throw error;
    }
  }
});
// get admin and super admin
const { data: adminAndSuperAdmin } = useQuery({
  queryKey: ["getadminandsuperadmin"],
  queryFn: async () => {
    try {
      const res = await fetch(`${commenUrl}/api/v1/auth/getadminandsuperadmin`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Sng womethient wrong");
        throw new Error(data.error || "Failed to fetch users");
      }
      return data;
    } catch (error) {
      toast.error("Network error or server not responding");
      throw error;
    }
  }
});
 const {data:authUser} = useQuery({queryKey:["authUser"],
    queryFn:async()=>{
            try {
                
                 const res = await fetch(`${commenUrl}/api/v1/auth/me`,{
                          method:"GET",
                          credentials:"include",
                          headers:{
                              "Content-Type":"application/json"
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
  const totalOrders = products.reduce((sum, p) => sum + p.orders, 0);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalRevenue = products.reduce((sum, p) => sum + p.revenue, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">🛍️ Aura Homes Seller Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard icon={ShoppingCart} label="Total Orders" value={totalOrders} color="bg-blue-500" />
        <DashboardCard icon={Box} label="Stock Available" value={totalStock} color="bg-green-500" />
        <DashboardCard icon={DollarSign} label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} color="bg-yellow-500" />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">📊 Orders per Product</h2>
<ResponsiveContainer width="100%" height={300}>
  <BarChart data={products && products}>
    <XAxis 
      dataKey="name" 
      interval={0}
      height={80}
      tick={({ x, y, payload }) => (
        <text 
          x={x} 
          y={y + 10} 
          textAnchor="end" 
          fontSize={12} 
          transform={`rotate(-45, ${x}, ${y})`}
        >
          {payload.value}
        </text>
      )}
    />
    <Tooltip />
    <Bar dataKey="orders" fill="#0ea5e9" />
  </BarChart>
</ResponsiveContainer>

      </div>

      {/* Product Summary Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">📦 Product Summary</h2>
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Product</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Orders</th>
              <th className="p-2">Rating</th>
              <th className="p-2">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, i) => (
  <tr key={i} className="border-b">
    <td className="p-2" title={p.name}>
      {p.name.length > 15 ? `${p.name.slice(0, 15)}...` : p.name}
    </td>
    <td className="p-2">{p.stock}</td>
    <td className="p-2">{p.orders}</td>
    <td className="p-2">⭐ {p.rating}</td>
    <td className="p-2">₹{p.revenue.toLocaleString()}</td>
  </tr>
))}
          </tbody>
        </table>
      </div>

      {/* Order Details with Date */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">📅 Order Details (Date-wise)</h2>
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Order ID</th>
              <th className="p-2">Product</th>
              <th className="p-2">Status</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Date</th>
              <th className="p-2">Revenue</th>
              <th className="p-2">Rating</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} title={order.product} className="border-b">
                <td className="p-2">{order.id}</td>
                <td className="p-2">{order.product}</td>
                <td className="p-2" ><span className="p-1 rounded text-white" style={{ background: order.status === "Delivered" ? "green" : "red" }}>{order.status}</span></td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">{order.date}</td>
                <td className="p-2">₹{order.revenue.toLocaleString()}</td>
                <td className="p-2">⭐ {order.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Admin and Super Admin Details with Table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">👮‍♂️ Admin and Super Admin Details</h2>
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {adminAndSuperAdmin?.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.firstname}</td>
                <td className="p-2">{user.lastname}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* users details with table */}
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">👥 User Details</h2>
        <table className="w-full text-left table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Joined</th>
              <th className="p-2">Role</th>
              {/* actions access only superadmin*/}

              { authUser?.role === "superadmin" && (
              <th className="p-2">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {allusers?.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{user.firstname}</td>
                <td className="p-2">{user.lastname}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{formatPostDate(user.createdAt)}</td>
                <td className="p-2">{user.role}</td>
                {/* actions access only superadmin*/}
                { authUser?.role === "superadmin" && (
                <td className="p-2">
                  <button 
                    onClick={() => handleUserId(user._id)} 
                    className="text-blue-500 hover:bg-blue-200 bg-blue-100 px-2 py-1 rounded"
                  >
                    Update
                  </button>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Admin Update Popup */}
      { showPopup && (
        <AdminUpdatePop
          userId={userId}
          handleOpen={handleOpen}
          handleClose={handleClose}
          showPopup={showPopup}
        />
      )}
    </div>
  );
};

export default DashBoard;
