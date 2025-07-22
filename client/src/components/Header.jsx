import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { isLoggedIn, userData } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <img src={assets.header_img2} alt="" className="w-36 mb-6 rounded-full" />
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">Hey {isLoggedIn && userData ? userData.name : "Dev"} 👋</h1>
      <h2 className="text-4xl sm;text-5xl font-bold mb-4">Welcome to our app!</h2>
      <p className="mb-8 max-w-md">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Odio illo suscipit aspernatur aliquam porro qui eaque.</p>
      <button type="button" className="text-white text-sm bg-blue-800 hover:bg-purple-800 font-medium rounded-lg px-5 py-2.5 mb-2">
        Get started
      </button>
    </div>
  );
};

export default Header;
