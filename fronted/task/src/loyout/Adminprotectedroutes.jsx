import React, { useState, useEffect } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function AdminProtectedRoutes({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function getRoles() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/isadmin`,
          {
            ...(token && {
              headers: { Authorization: `Bearer ${token}` },
            }),
            timeout: 15000,
          }
        );

        if (active) {
          setIsAdmin(Boolean(res.data?.success));
        }
      } catch (error) {
        if (active) {
          setIsAdmin(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    getRoles();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return isAdmin ? children : <Navigate to="/login" replace />;
}

export default AdminProtectedRoutes;