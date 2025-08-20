import {useState} from 'react'
import { useMutation } from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import { Link ,useParams,useNavigate} from 'react-router-dom';
import toast from "react-hot-toast";
import LoadingSpenner from '../commen/LoadingSpenner';
const ForgotTokenPassword = () => {
      const navigate = useNavigate();
      const {token} = useParams();
     const [formData,setFormData] = useState({
          password:"",
          confirmpassword:""
     })
  const {
    mutate: forgotToken,
    isError,
    error,
    isPending
  } = useMutation({
    mutationFn: async ({password,confirmpassword}) => {
      try {
        const res = await fetch(`${commenUrl}/api/v1/auth/password/reset/${token}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
             body:JSON.stringify({password,confirmpassword})
        }); 
        const data = await res.json();
        if(!res.ok){
             throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    onSuccess:()=>{
       toast.success("password updated successfully");
       navigate("/");
    }
  });

   const onSubmit = (e)=>{
        e.preventDefault();
        forgotToken(formData);
   }

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
                  <form className="mt-4" onSubmit={onSubmit}>
                    <div className="form-group mb-4">
                      <label htmlFor="password" className="block text-lg py-2">
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({...formData,password:e.target.value})
                        }
                        placeholder="password...."
                        className="border rounded-md w-full h-10 p-2"
                        required
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="block text-lg py-2"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmpassword}
                        onChange={(e) =>
                          setFormData({...formData,confirmpassword:e.target.value})
                        }
                        placeholder="confirm Password...."
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
  )
}

export default ForgotTokenPassword