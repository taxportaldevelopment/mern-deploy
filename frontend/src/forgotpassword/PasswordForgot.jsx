import React, { useState } from "react";
import LoadingSpenner from "../commen/LoadingSpenner";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import toast from "react-hot-toast";

const PasswordForgot = () => {
  const [multiForm, setMultiForm] = useState(false);
  const [getEmail, setGetEmail] = useState("");

  const {
    mutate: emailSendToken,
    isError,
    error,
    isPending
  } = useMutation({
    mutationFn: async (useremail) => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/auth/password/forgot`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
             body:JSON.stringify({email:useremail})
        }); 
        const data = await res.json();
        if(!res.ok){
             throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error.error || "something went wrong");
      }
    },
    onSuccess:()=>{
         toast.success(`Email send to ${getEmail}`);
    }
  });

  const forGotEmail = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", getEmail);
    emailSendToken(getEmail);
  };
//    send password and cpassword

  return (
    <div>
      <div>
        <div className="container p-4 mt-5">
          <div className="lg:max-w-7/12 lg:mx-auto shadow rounded-2xl">
            <div
              className="rounded-2xl flex items-center justify-center flex-col md:flex-row p-3"
              style={{
                background: "linear-gradient(to right, #FDEDCC, #e9ecef)",
              }}
            >
              <div className="md:w-1/2 w-full">
                <div className="p-2">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0632/2526/6422/files/wall-accents-daisy-bloom-wall-decor-blue-1.jpg?v=1715976354"
                    alt="Login"
                    className="w-full h-96 object-cover"
                  />
                </div>
              </div>
              <div className="md:w-1/2 w-full">
                <h1 className="text-3xl font-bold product-font text-center">
                  Forgot Password
                </h1>
                  <form className="mt-4" onSubmit={forGotEmail}>
                    <div className="form-group mb-4">
                      <label htmlFor="email" className="block text-lg py-2">
                        Email:
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={getEmail}
                        onChange={(e) => setGetEmail(e.target.value)}
                        placeholder="email...."
                        className="border rounded-md w-full h-10 p-2"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <button
                        type="submit"
                        className="bg-green-400 hover:bg-green-300 text-white rounded-md px-4 py-2 me-1"
                      >
                        {isPending ? <LoadingSpenner /> : "Send"}
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
    </div>
  );
};

export default PasswordForgot;
