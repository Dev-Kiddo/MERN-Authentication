import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn, userData, backendUrl } = useContext(AppContext);

  console.log("userData:", userData);

  const handleLogout = async function () {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      console.log("data:", data);
      navigate("/");
      setIsLoggedIn(false);
      toast.success(data.message);
    } catch (error) {
      console.log(error.message);
      toast.error(error.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.h_logo} alt="logo" className="w-28 sm:w-32" />

      {isLoggedIn ? (
        <div className="w-10 h-10 flex justify-center items-center rounded-full bg-blue-800 text-white relative group">
          {userData.name[0].toUpperCase()}

          <div className="w-[120px] absolute hidden group-hover:block top-0 left-0 z-10 text-black rounded pt-14">
            <ul className="lins-none m-0 p-2 bg-gray-100 text-sm">
              {isLoggedIn && !userData.isVerified && <li className="cursor-pointer hover:text-blue-600 py-1 px-2">Verify Email</li>}

              <li className="cursor-pointer hover:text-blue-600 py-1 px-2" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button type="button" className="text-white text-sm bg-blue-800 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5 mb-2" onClick={() => navigate("/login")}>
          {isLoggedIn ? "User Logged In" : "Login"}
        </button>
      )}
    </div>
  );
};

export default Navbar;
