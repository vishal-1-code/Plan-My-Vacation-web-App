import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  logOutStart,
  logOutSuccess,
  logOutFailure,
  deleteUserAccountStart,
  deleteUserAccountSuccess,
  deleteUserAccountFailure,
} from "../redux/user/userSlice";

import MyBookings from "./user/MyBookings";
import UpdateProfile from "./user/UpdateProfile";
import MyHistory from "./user/MyHistory";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser} = useSelector((state) => state.user);
  // const [profilePhoto, setProfilePhoto] = useState(undefined);
  const [photoPercentage, setPhotoPercentage] = useState(0);
  const [activePanelId, setActivePanelId] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    address: "",
    phone: "",
    avatar: "",
  });

  useEffect(() => {
    if (currentUser !== null) {
      setFormData({
        username: currentUser?.username,
        email: currentUser?.email,
        address: currentUser?.address,
        phone: currentUser?.phone,
        avatar: currentUser?.avatar,
      });
    }
  }, [currentUser]);

  const handleProfilePhoto = async (e) => {
    e.preventDefault();
    const photo = e.target.files[0];
    // console.log(photo);
    const myForm = new FormData();
    if(photo){
      myForm.append("profilePhoto", photo);
    } 
    try {
      dispatch(updateUserStart());
      const token = localStorage.getItem("X_TTMS_access_token");
      const res = await fetch(
        `http://localhost:8000/api/user/update-profile-photo/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`, // Do NOT set "Content-Type"
          },
          body: myForm, // Attach FormData here
        }
      );
      const data = await res.json();
      // const url = data.url;
      // console.log(data);
      if (data?.success) {
        toast.success(data?.message);
        //setFormData({ ...formData, avatar: downloadUrl });
        dispatch(updateUserSuccess(data?.user));
        return;
      } else {
        
      dispatch(updateUserFailure(data?.message));
      toast.error(data?.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(logOutStart());

      const res = await fetch("http://localhost:8000/api/auth/logout");
      const data = await res.json();
      if (data?.success !== true) {
        localStorage.removeItem("X_TTMS_access_token");
        toast.error("Logout failed!");
        dispatch(logOutFailure(data?.message));
        return;
      }
      dispatch(logOutSuccess());
      navigate("/login");
      toast.success(data?.message);
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    const CONFIRM = confirm(
      "Are you sure ? the account will be permenantly deleted!"
    );
    if (CONFIRM) {
      try {

        dispatch(deleteUserAccountStart());
        const res = await fetch(`http://localhost:8000/api/user/delete/${currentUser._id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data?.success === false) {
          localStorage.removeItem("X_TTMS_access_token");
          dispatch(deleteUserAccountFailure(data?.message));
          toast.error("Something went wrong!");
          return;
        }
        dispatch(deleteUserAccountSuccess());
        toast.success(data?.message);
      } catch (error) { 
        toast.error(error);
        console.log(error);
      }
    }
  };

  return (
    <div className="flex w-full flex-wrap max-sm:flex-col p-2">
    
      {currentUser && (
        <>
          <div className="w-[40%] p-3 max-sm:w-full">
            <div className="flex flex-col items-center gap-4 p-3">
              <div className="w-full flex flex-col items-center relative">
                <img
                  src={
                    currentUser.avatar
                  }
                  alt="Profile photo"
                  className="w-64 min-h-52 max-h-64 rounded-lg"
                  onClick={() => fileRef.current.click()}
                  onMouseOver={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.add("block");
                  }}
                  onMouseOut={() => {
                    document
                      .getElementById("photoLabel")
                      .classList.remove("block");
                  }}
                />
                <input
                  type="file"
                  name="photo"
                  id="photo"
                  hidden
                  ref={fileRef}
                  accept="image/*"
                  onChange={handleProfilePhoto}
                />
                <label
                  htmlFor="photo"
                  id="photoLabel"
                  className="w-64 bg-slate-300 absolute bottom-0 p-2 text-center text-lg text-white font-semibold rounded-b-lg"
                  hidden
                >
                  Choose Photo
                </label>
              </div>
            
              <p
                style={{
                  width: "100%",
                  borderBottom: "1px solid black",
                  lineHeight: "0.1em",
                  margin: "10px",
                }}
              >
                <span className="font-semibold" style={{ background: "#fff" }}>
                  Details
                </span>
              </p>
            
              <div className="w-full flex justify-between px-1">
                <button
                  onClick={handleLogout}
                  className="text-red-600 text-lg font-semibold self-start border border-red-600 p-1 rounded-lg hover:bg-red-600 hover:text-white"
                >
                  Log-out
                </button>
                <button
                  onClick={() => setActivePanelId(3)}
                  className="text-white text-lg self-end bg-gray-500 p-1 rounded-lg hover:bg-gray-700"
                >
                  Edit Profile
                </button>
              </div>
              <div className="w-full shadow-2xl rounded-lg p-3 break-all">
                <p className="text-3xl font-semibold m-1">
                  Hi {currentUser?.username} !
                </p>
                <p className="text-lg font-semibold">
                  Email:{currentUser?.email}
                </p>
                <p className="text-lg font-semibold">
                  Phone:{currentUser?.phone}
                </p>
                <p className="text-lg font-semibold">
                  Address:{currentUser?.address}
                </p>
              </div>
              <button
                onClick={handleDeleteAccount}
                className="text-red-600 hover:underline"
              >
                Delete account
              </button>
            </div>
          </div>
          {/* ---------------------------------------------------------------------------------------- */}
          <div className="w-[60%] max-sm:w-full">
            <div>
              <nav className="w-full border-blue-500 border-b-4">
                <div className="w-full flex gap-2">
                  <button
                    className={
                      activePanelId === 1
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="bookings"
                    onClick={() => setActivePanelId(1)}
                  >
                    Bookings
                  </button>
                  <button
                    className={
                      activePanelId === 2
                        ? "p-1 rounded-t transition-all duration-300 bg-blue-500 text-white"
                        : "p-1 rounded-t transition-all duration-300"
                    }
                    id="updateProfile"
                    onClick={() => setActivePanelId(2)}
                  >
                    History
                  </button>
                </div>
              </nav>
              {/* bookings */}
              <div className="main flex flex-wrap">
                {activePanelId === 1 && <MyBookings />}
                {/* History */}
                {activePanelId === 2 && <MyHistory />}
                {/* Update profile */}
                {activePanelId === 3 && <UpdateProfile />}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
