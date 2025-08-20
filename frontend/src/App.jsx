
import './App.css'
import {Route, Routes} from "react-router";
import Home from './components/Home';
import Header from './components/layout/Header';
import ProductShow from './components/ProductShow';
import AddToCart from './components/AddToCart';
import Register from './components/Register';
import Login from './components/Login';
import AddNewProduct from './components/products/AddNewProduct';
import ProductUpdate from './components/updateProduct/ProductUpdate';
import MyOrders from './components/myorder/MyOrders';
import MyAccount from './account/MyAccount';  
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import DeleteProduct from './productDelete/DeleteProduct';
import ProductReview from './productReview/ProductReview';
import OrderStatus from './components/myorder/orderStatus/OrderStatus';
import AdminRoute from './admin/AdminRoute';
import ProductList from './admin/ProductList';
import ProductSearch from './productsearch/ProductSearch';
import PasswordForgot from './forgotpassword/PasswordForgot';
import ForgotTokenPassword from './forgotpassword/ForgotTokenPassword';
import DashBoard from './Dhashboard/DashBoard';
import ProductOrderDetails from './clientOrder/ProductOrderDetails';
import MobileMenu from './mobileMenu/MobileMenu';
import PaymentSuccess from './payment/PaymentSuccess';
import ProductRecover from './productrecover/ProductRecover';
// icons
import { FaWhatsapp } from "react-icons/fa";
import UserOrders from './admin/UserOrders';
function App() {


  const { data: authUser, isLoading } = useQuery({
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

  return (
      <div>
           <Header/>
           <div className='mb-18'>
          <Routes>
             <Route path='/' element={<Home/>} />
             <Route path='/product/:id' element={<ProductShow/>} /> 
             <Route path='/add-to-cart' element={<AddToCart/>} />
             <Route path='/register' element={<Register/>} />
             <Route path='/login' element={<Login/>} />
             <Route path='/myorders' element={<MyOrders/>} />
             <Route path='/myaccount' element={<MyAccount/>} />
             <Route path='/product/search/:keyword' element={<ProductSearch/>} />
             <Route path='/product/review/:orderId' element={<ProductReview/>} />
             <Route path='/auth/forgot' element={<PasswordForgot/>} />
             <Route path='/auth/forgot/reset/:token' element={<ForgotTokenPassword/>} />
             <Route path='/auth/order-details/:id' element={<ProductOrderDetails/>} />
             <Route path='/order-success' element={<PaymentSuccess/>} />

             {/* admin routers */}
             <Route path='/add-products' element={<AdminRoute><AddNewProduct/></AdminRoute> } />
             <Route path='/delete/product' element={<AdminRoute><DeleteProduct/></AdminRoute>} /> 
             <Route path='/admin/order-track' element={<AdminRoute><OrderStatus/></AdminRoute>} />
             <Route path='/admin/productlist' element={<AdminRoute><ProductList/></AdminRoute>} />
             <Route path='/dashboard' element={<AdminRoute><DashBoard/></AdminRoute>} />
            <Route path='/update-product/:id' element={<AdminRoute><ProductUpdate/></AdminRoute>} />
            <Route path='/admin/recover-product' element={<AdminRoute><ProductRecover/></AdminRoute>} />
            <Route path='/admin/user-orders' element={<AdminRoute><UserOrders/></AdminRoute>} />
          </Routes>

           </div>
           {/* whatsapp icons */}
           <div className='fixed bottom-12 right-6 mb-4 mr-4 z-50'>
               {/* whatsapp icons blink */}
               <a href="https://wa.me/8438221832" target="_blank" rel="noopener noreferrer" >
                   <FaWhatsapp className='pulse text-5xl text-green-500 hover:text-green-600' />
               </a>
           </div>
          {/* mobile view section */}
           <div className='fixed bottom-0 w-full bg-white md:hidden z-50'>
               <MobileMenu/>
           </div>
          <Toaster />
      </div>
  )
}

export default App
