import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router";

import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AppContext);
  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.h_logo} alt="logo" className="w-28 sm:w-32" />
      <button type="button" className="text-white text-sm bg-blue-800 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5 mb-2" onClick={() => navigate("/login")}>
        {isLoggedIn ? "User Logged In" : "Login"}
      </button>
    </div>
  );
};

export default Navbar;
