import {useQuery,useQueryClient} from "@tanstack/react-query";
import { commenUrl } from "../commen/CommenUrl";
import toast from "react-hot-toast";

const AdminUpdatePop = ({userId,handleOpen,handleClose,showPopup}) => {

  const queryClient = useQueryClient();

  const {data: userData, isLoading, error} = useQuery({
       queryKey: ['user', userId],
       enabled: !!userId,
         queryFn: async () => {
           const response = await fetch(`${commenUrl}/api/v1/auth/getsingleuser/${userId}`,{
                method: 'GET',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json',
               },
           });
           if (!response.ok) {
             throw new Error('Network response was not ok');
           }
           return response.json();
         }
  });
    if (isLoading) return <div>Loading...</div>;

    const handleChange = (e) => {
        // confirm change the user role
      if (!window.confirm('Are you sure you want to change the user role?')) {
        e.preventDefault();
        return;
      }
      const selectedRole = e.target.value;
      // Call the API to update the user role
      fetch(`${commenUrl}/api/v1/auth/set/admin/${userId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(() => {
          toast.success('User role updated successfully');
          //   close the popup after updating
          handleClose();
          queryClient.invalidateQueries(["getallusers"]);
        })
        .catch((error) => {
          console.error('Error updating user role:', error);
        });
    };

  return (
    <div className="p-4">
      <button
        onClick={handleOpen}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Show Popup
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-gray-950 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-xl text-center">
            <h2 className="text-xl font-semibold mb-4">Popup Message</h2>
            {/* confirm change user role */}
            <p>Are you sure you want to change the role of this user?</p>
            <p>Email ID: {userData?.email}</p>
            {/* admin role select and update */}
            <div className="mt-4">
              <label className="block mb-2">Select Role:</label>
              <select className="border rounded p-2 w-full" onChange={handleChange}>
                <option  className='py-1' value="" disabled selected>Select Role</option>
                <option disabled={userData?.role === "admin"} className='py-1' value="admin">Admin</option>
                <option disabled={userData?.role === "user"} className='py-1' value="user">User</option>
                <option disabled={userData?.role === "superadmin"} className='py-1' value="superadmin">Super Admin</option>
              </select>
            </div>
            <button
              onClick={handleClose}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUpdatePop;
