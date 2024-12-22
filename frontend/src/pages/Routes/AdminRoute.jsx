import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [ok, setOk] = useState(false);
  const token = localStorage.getItem("X_TTMS_access_token");
  // console.log(token);
  const authCheck = async () => {
    const res = await fetch("http://localhost:8000/api/user/admin-auth", {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });
    const data = await res.json();
    if (data.check) setOk(true);
    else setOk(false);
  };

  // useEffect(() => {
  //   if (currentUser !== null) authCheck();
  // }, [currentUser]);

  return <Outlet />;
}
