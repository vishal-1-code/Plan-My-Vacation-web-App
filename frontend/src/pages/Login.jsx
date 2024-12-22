import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  // console.log(formData);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      dispatch(loginStart());
      const res = await fetch(`http://localhost:8000/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await res.json();
      if (data?.success) {
        localStorage.setItem("X_TTMS_access_token", data?.token);
        dispatch(loginSuccess(data?.user));
        toast.success("Login Success");
        navigate("/");
      } else {
        dispatch(loginFailure(data?.message));
        toast.error("Login Failed !");
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      console.log(error);
    }
    setLoading(false);
  };

  return (
    <div
      className="flex justify-center items-center"
      style={{
        width: "100%",
        height: "90vh",
        background:
          "linear-gradient(0deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
      }}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col border border-black rounded-lg p-4 w-72 h-fit gap-5 sm:w-[320px] bg-white bg-opacity-60">
          <h1 className="text-3xl text-center font-semibold">Login</h1>
          <div className="flex flex-col">
            <label htmlFor="email" className="font-semibold">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="p-3 rounded border border-black bg-white bg-opacity-80"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="font-semibold">
              Password:
            </label>
            <input
              type="password"
              id="password"
              className="p-3 rounded border border-black bg-white bg-opacity-80"
              onChange={handleChange}
            />
          </div>
          <p className="text-blue-700 text-sm hover:underline">
            <Link to={`/signup`}>Dont have an account? Signup</Link>
          </p>
          <button
            disabled={loading}
            className="p-3 text-white bg-slate-700 rounded hover:opacity-95"
          >

            {loading ? "Loading..." : "Login"}
          </button>
          {user && <p className="text-sm text-red-600">{user}</p>}
        </div>
      </form>
    </div>
  );
};

export default Login;
