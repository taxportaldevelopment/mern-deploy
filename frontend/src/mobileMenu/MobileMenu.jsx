import React from 'react'
// icons
import { GoHome } from "react-icons/go";  
import { BsBoxes } from "react-icons/bs";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { VscAccount } from "react-icons/vsc";
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
const MobileMenu = () => {
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
        <div className="mobile-view-section p-2 flex justify-evenly">
              <Link to={"/"}>
                    <div className="menu-section text-2xl flex flex-col items-center cursor-pointer">
                  <GoHome/>
                  <p className='text-xs'>Home</p>
             </div>
               </Link>
              <Link to={"/myorders"}>
                <div className="menu-section text-2xl flex flex-col items-center cursor-pointer">
                  <BsBoxes/>
                  <p className='text-xs'>Orders</p>
                </div>
              </Link>
             
             <Link to={"/add-to-cart"}>
             <div className="menu-section text-2xl flex flex-col items-center cursor-pointer">
                  <MdOutlineShoppingCartCheckout/>
                  <p className='text-xs'>Cart</p>
             </div>
             </Link>
            {authUser?
             (
             <Link to={"/myaccount"}>
             <div className="menu-section text-2xl flex flex-col items-center cursor-pointer">
                  <VscAccount/>
                  <p className='text-xs'>Account</p>
             </div>
             </Link>

             ):
             (
                  <Link to={"/login"}>
             <div className="menu-section text-2xl flex flex-col items-center cursor-pointer">
                  <VscAccount/>
                  <p className='text-xs'>Account</p>
             </div>
             </Link>
             )
          }
        </div>
    </div>
  )
}

export default MobileMenu