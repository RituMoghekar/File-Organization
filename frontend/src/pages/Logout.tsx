import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔴 remove token
    localStorage.removeItem("token");

    // redirect to login
    navigate("/login");
  }, [navigate]);

  return null;
}
