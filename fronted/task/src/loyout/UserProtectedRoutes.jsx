import React, { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

function UserProtectedRoutes({ children }) {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkLogin() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/admin/islogin`,
          {
            ...(token && {
              headers: { Authorization: `Bearer ${token}` },
            }),
            timeout: 15000,
          }
        );

        if (active) {
          setIsLogin(Boolean(res.data?.success));
        }
      } catch (error) {
        if (active) {
          setIsLogin(false);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    checkLogin();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  return isLogin ? children : <Navigate to="/login" replace />;
}

export default UserProtectedRoutes;