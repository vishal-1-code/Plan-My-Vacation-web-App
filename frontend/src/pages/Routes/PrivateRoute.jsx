import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);

  const authCheck = async () => {
    const token = localStorage.getItem("X_TTMS_access_token");
    const res = await fetch("http://localhost:8000/api/user/user-auth", {
      method: "GET",
      headers: {
        "Accept": "mutipart/form-data",
         "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
    });
    const data = await res.json();
    if (data.check) setOk(true);
    else setOk(false);
  };

  // useEffect(() => {
  //   if (currentUser !== null) authCheck();
  // }, [currentUser]);

  return  <Outlet />;
}
