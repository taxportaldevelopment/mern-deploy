import { useState } from "react";
import {Link} from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { RiShoppingCartLine,RiDeviceRecoverLine} from "react-icons/ri";
import { MdOutlineTrackChanges } from "react-icons/md";
import { IoNotificationsSharp } from "react-icons/io5";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { IoSearch } from "react-icons/io5";
import {useQuery,useMutation,useQueryClient} from "@tanstack/react-query";
import { commenUrl } from "../../commen/CommenUrl";
import { IoLogOutOutline } from "react-icons/io5";
import { AiOutlineDelete } from "react-icons/ai";
import { CiBoxes } from "react-icons/ci";
import { VscAccount,VscListFlat} from "react-icons/vsc";
import { IoHomeOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import lgog from '../../assets/logo.png'
const Header = () => {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState('');

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const queryClient = useQueryClient();

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

    const {mutate:logout} = useMutation({
        mutationFn:async()=>{
            try {
                const res = await fetch(`${commenUrl}/api/v1/auth/logout`,{
                    method:"POST",
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
        onSuccess:()=>{
            toast.success("Logout Successfully");
            queryClient.invalidateQueries({queryKey:["authUser"]});
            navigate("/")
            // queryClient.setQueryData(["authUser"],null)
            // queryClient.invalidateQueries(["authUser"])
            // queryClient.invalidateQueries(["cartItems"])
            // queryClient.invalidateQueries(["orders"])  
        }
    });

   const searchProdcut = ()=>{
       if(keyword == ""){
           navigate("/")
           return
       }
       navigate(`/product/search/${keyword}`)
       toggleMenu();
   }

    const {data:CartData,isError,error}= useQuery({
          queryKey:["cart"],
          queryFn:async()=>{
              // eslint-disable-next-line no-useless-catch
              try { 
                 
                  const res = await fetch(`${commenUrl}/api/v1/addtocart/car/getallcart`,{
                       method:"GET",
                       credentials:"include",
                    //    headers:{
                    //         "Content-Type":"application/json"
                    //    }
                  });
                  const data = await res.json();
                  if(!res.ok){
                      console.error(error)
                  }
                  return data;
              } catch(error){
                   throw error
              }
          }
    });

  return (
<div>
    <div className="containers">
        {/* Create responsive navbar using Tailwind CSS with logo, search box, login, add to cart, notification */}
        <nav className="bg-gray-800 p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center text-white">
                    <Link to={"/"}><img src={lgog} alt="Logo" className="h-12 mr-2" /></Link>
                </div>

                {/* Mobile menu button */}
                <div className="lg:hidden">
                    <button
                        onClick={toggleMenu}
                        className="text-white text-3xl focus:outline-none"
                    >
                        {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
                    </button>
                </div>

                {/* Desktop Menu */}
                <div className="hidden lg:flex flex-grow items-center justify-between ml-6">
                    {/* Search */}
                   <div className="flex items-center bg-gray-700 px- w-full max-w-md">
                        <input
                             type="text"
                             name="keyword"
                             value={keyword}
                             placeholder="Search..."
                             className="bg-gray-700 text-white rounded px-3 py-2 w-full max-w-md"
                             onChange={(e) => setKeyword(e.target.value)}
                         />
                         <div className="bg-green-500 text-white rounded px-3 py-2 flex items-center justify-center cursor-pointer">
                           <IoSearch className="text-2xl" onClick={searchProdcut} />
                         </div>
                   </div>
                      {
                        authUser?.role == "admin" || authUser?.role == "superadmin" ? (
                               <div className=" bg-blue-500 px-2 py-1 rounded" >
                            <Link to={"/dashboard"}><button className="text-white cursor-pointer">Dashboard</button> </Link>
                       </div>   
                        ):""
                      }
                    {/* Right icons */}
                    <div className="flex items-center space-x-4 ml-6">
                         <div className="text-2xl">
                            <Link to={"/"}><IoHomeOutline className="text-white" /></Link>
                       </div>
                        {/* Login Dropdown */}
                        <div className="relative group border">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded flex items-center space-x-1">
                                <FaRegUserCircle />
                                {authUser?<span className="overflow-hidden whitespace-nowrap text-ellipsis">{authUser.firstname}</span>: <Link to={"/login"}><span>Login</span></Link>}
                               
                            </button>
                            <div className="absolute right-0 z-10 w-56 bg-white rounded-md shadow-lg hidden group-hover:block">
                                <ul className="text-gray-800 py-2">
                                    {authUser?"":
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between"><span>New customer?</span> <Link to={"/register"} className="text-blue-700 font-bold">Sign Up</Link></li>}
                                    <Link to={"/myaccount"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><VscAccount className="text-lg" /></span> <span className="ms-3">My Profile</span></li></Link>
                                    <Link to={"/myorders"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><CiBoxes className="text-lg" /></span> <span className="ms-3">Orders</span></li></Link>
                                    {authUser?.role == "admin" || authUser?.role == "superadmin" ?(<Link to={"/add-products"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><CiBoxes className="text-lg" /></span> <span className="ms-3">Add Product</span></li></Link>):""}
                                    {authUser?.role == "admin" || authUser?.role == "superadmin" ?(<Link to={"/admin/productlist"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><VscListFlat className="text-lg" /></span> <span className="ms-3">Products List</span></li></Link>):""}
                                    {authUser?.role == "admin" || authUser?.role == "superadmin" ?(<Link to={"/delete/product"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><AiOutlineDelete className="text-lg" /></span> <span className="ms-3">Delete Products</span></li></Link>):""}
                                    {authUser?.role == "admin" || authUser?.role == "superadmin" ?(<Link to={"/admin/order-track"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><MdOutlineTrackChanges className="text-lg" /></span> <span className="ms-3">Order Tracking</span></li></Link>):""}
                                    {authUser?.role == "superadmin" ?(<Link to={"/admin/recover-product"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><RiDeviceRecoverLine className="text-lg" /></span> <span className="ms-3">Recover Products</span></li></Link>):""}
                                    {authUser && <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" role="button" onClick={()=>logout()}><span><IoLogOutOutline  className="text-lg"/></span> <span className="ms-3"> Logout</span></li>}
                                </ul>
                            </div>
                        </div>

                        <div className="text-white text-2xl relative">
                             <Link to={"/add-to-cart"}>
                               <RiShoppingCartLine />
                         </Link>
                            {CartData?.success !== false ?
                             
                            <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold -translate-x-1/2 -translate-y-1/2">
                                 {CartData?.success === false ? "" : (CartData?.cartFind ? "+" + CartData.cartFind.length : "")}
                            </div>

                             :""
                            }
                        </div>
{/* 
                        <div className="text-white text-2xl relative">
                            <IoNotificationsSharp />
                        <div className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold -translate-x-1/2 -translate-y-1/2">
                                 +5
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden mt-4 space-y-4 px-2">
                         <div className="flex items-center bg-gray-700 px- w-full max-w-md">
                        <input
                             type="text"
                             name="keyword"
                             value={keyword}
                             placeholder="Search..."
                             className="bg-gray-700 text-white rounded px-3 py-2 w-full max-w-md"
                             onChange={(e) => setKeyword(e.target.value)}
                         />
                         <div className="bg-green-500 text-white rounded px-3 py-2 flex items-center justify-center cursor-pointer">
                           <IoSearch className="text-2xl" onClick={searchProdcut} />
                         </div>
                   </div>
                    {/* Login Dropdown (simplified for mobile) */}
                        <div className=" group">
                            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded flex items-center space-x-1">
                                <FaRegUserCircle />
                                {authUser?<span className="overflow-hidden whitespace-nowrap text-ellipsis" >{authUser.firstname}</span>: <Link to={"/login"} onClick={toggleMenu}><span>Login</span></Link>}
                               
                            </button>
                            <div className="mt-2 right-0 z-10 bg-white rounded-md shadow-lg group-hover:block">
                                <ul className="text-gray-800 py-2">
                                    {authUser?"":
                                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between" onClick={toggleMenu}><span>New customer?</span> <Link to={"/register"} className="text-blue-700 font-bold">Sign Up</Link></li>}
                                    <Link to={"/myaccount"} onClick={toggleMenu}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><VscAccount className="text-lg" /></span> <span className="ms-3" onClick={toggleMenu}>My Profile</span></li></Link>
                                    <Link to={"/myorders"} onClick={toggleMenu}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><CiBoxes className="text-lg" /></span> <span className="ms-3">Orders</span></li></Link>
                                    {authUser?.role == "admin" ?(<Link to={"/add-products"}><li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"><span><CiBoxes className="text-lg" /></span> <span className="ms-3">Add Product</span></li></Link>):""}
                                    {authUser && <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" role="button" onClick={()=>logout()}><span><IoLogOutOutline  className="text-lg"/></span> <span className="ms-3"> Logout</span></li>}
                                </ul>
                            </div>
                        </div>
                        <div className="text-white text-2xl relative">
                             <Link to={"/add-to-cart"}>
                               <RiShoppingCartLine />
                         </Link>
                            {CartData?.success !== false ?
                             
                            <div className="absolute top-0 left-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold -translate-x-1/2 -translate-y-1/2">
                                 {CartData?.success == false?"":"+"+CartData?.cartFind.length}
                            </div>

                             :""
                            }
                        </div>
                </div>
            )}
        </nav>
    </div>
</div>

  )
}

export default Header

// subikkhshamenterprises.in ==> ₹429.00
// subikkhshamenterprises.in ==> ₹928.00
// subikkhshamenterprises.in ==> ₹1,627.00