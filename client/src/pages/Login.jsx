import React, { useContext } from "react";
import { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isSignIn, setisSignIn] = useState(false);

  const navigate = useNavigate();

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleChange = function (e) {
    e.preventDefault();

    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async function (e) {
    try {
      e.preventDefault();

      axios.defaults.withCredentials = true;

      const response = isSignIn
        ? await axios.post(`${backendUrl}/api/auth/register`, formData)
        : await axios.post(`${backendUrl}/api/auth/login`, { email: formData.email, password: formData.password });

      console.log("response:", response);

      toast.success(response.data.message, {
        position: "top-left",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      if (isSignIn) {
        setisSignIn(false);
        formData.name = "";
        formData.email = "";
        formData.password = "";
        isSignIn && navigate("/login");
      } else {
        formData.email = "";
        formData.password = "";
        await getUserData();

        setIsLoggedIn((isLoggedIn) => !isLoggedIn);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
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
    <div className="flex items-center justify-center min-h-screen px-6 text-center sm:px-0 bg-gradient-to-br from-blue-200 to-blue-600">
      <img src={assets.h_logo} className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" onClick={() => navigate("/")} />

      <div className="w-2/5 bg-blue-800 p-10 rounded-2xl">
        <h2 className="text-white text-4xl font-bold mb-2">{isSignIn ? "Create account" : "Login"}</h2>
        <p className="text-white text-lg">{isSignIn ? "Create your account" : "Login to you account"}</p>

        <form className="max-w-md mx-auto mt-8" onSubmit={handleSubmit}>
          {isSignIn && (
            <div className="mb-5">
              <label className="block mb-2 text-sm font-medium text-white text-start">Name</label>
              <input
                type="text"
                className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                placeholder="Enter Name"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-white text-start">Email</label>
            <input
              type="email"
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              placeholder="Enter Email"
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-sm font-medium text-white text-start">Password</label>
            <input
              type="password"
              className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
              placeholder="Enter Password"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <p className="text-white text-sm text-start underline mb-5 cursor-pointer" onClick={() => navigate("/reset-password")}>
            Forgot password?
          </p>

          <button
            type="submit"
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 w-3/5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            {isSignIn ? "Signup" : "Login"}
          </button>
          <p className="text-white text-sm text-center mt-5 cursor-pointer">
            {isSignIn ? "Already have an account?" : "Don't have an account?"}{" "}
            <span className="underline" onClick={() => setisSignIn(!isSignIn)}>
              {isSignIn ? " Login here" : " Signup here"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
