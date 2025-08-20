import React, { useEffect, useState } from "react";
import { Link } from "react-router";
import { useMutation,useQuery,useQueryClient } from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import LoadingSpenner from "../commen/LoadingSpenner";
import logo from "../assets/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
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
                      console.log(data);
                      
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

   useEffect(()=>{
        function getRefresh() {
       window.scrollTo(0, 0);
    }
    getRefresh();
    authUser && navigate("/")
 },[authUser,navigate]);

  const queryClient = useQueryClient();
     const {mutate:signUp,isPending,isError,error} = useMutation({
      mutationFn: async ({firstname,lastname,email,password}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            const res = await fetch(`${commenUrl}/api/v1/auth/sigup`,{
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({firstname,lastname,email,password}),
            });

            const data = await res.json();
            if (!res.ok){
                throw new Error(data.error || "Something went wrong");
            }
            return data; 
        } catch (error) {
            throw error;
        }
    },
    onSuccess: () => {
        toast.success("Account created successfully");
        queryClient.invalidateQueries({ queryKey:["authUser"]});
    }
      });

   const onSubmit = async (e) => {
    e.preventDefault();
     signUp(formData)
    };
  return (
    <div>
      <div className="container p-4 mt-5">
        <div className="lg:max-w-7/12 lg:mx-auto shadow rounded-2xl">
          <div
            className="rounded-2xl flex items-center justify-center flex-col md:flex-row p-3"
            style={{
              background: "#F9F6EE",
            }}
          >
            <div className="md:w-1/2 w-full">
              <div className="p-3 hidden md:block">
                <img
                  src={logo}
                  alt="Register"
                  className="w-full lg:h-96 object-contain"
                />
              </div>
            </div>
            <div className="md:w-1/2 w-full">
              <h1 className="text-3xl font-bold product-font text-center">
                Create Account
              </h1>
              <form className="mt-4" onSubmit={onSubmit}>
                <div className="form-group mb-4">
                  <label htmlFor="firstname" className="block text-lg py-2">
                    First Name:
                  </label>
                  <input
                    type="text"
                    id="firstname"
                    name="firstname"
                    value={formData.firstname}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        firstname: e.target.value,
                      })
                    }
                    placeholder="fisrt name...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="lastname" className="block text-lg py-2">
                    Last Name:
                  </label>
                  <input
                    type="text"
                    id="lastname"
                    name="lastname"
                    value={formData.lastname}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lastname: e.target.value,
                      })
                    }
                    placeholder="fisrt name...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="email" className="block text-lg py-2">
                    Email:
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    placeholder="email...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="password" className="block text-lg py-2">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="password...."
                    className="border rounded-md w-full h-10 p-2"
                    required
                  />
                </div>
                <div className="form-group">
                  <button
                    type="submit"
                    className="bg-green-400 hover:bg-green-300 text-white rounded-md px-4 py-2 me-1"
                  >
                    {isPending ? <LoadingSpenner/> : "Sign Up"}
                  </button>
                  (or){" "}
                  <Link
                    to="/login"
                    className="text-blue-500 hover:text-blue-400"
                  >
                    Sign In
                  </Link>
                </div>
                {isError && (
                  <div className="text-red-500 text-center mt-2">
                    {error.message}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
