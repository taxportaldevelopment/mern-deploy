// admin/AdminRoute.jsx
import { Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const AdminRoute = ({ children }) => {
  const { data: authUser, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.error) return null;
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      return data;
    },
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!authUser || authUser.role !== "admin" && authUser.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
