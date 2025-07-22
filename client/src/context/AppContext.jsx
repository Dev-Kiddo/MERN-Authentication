import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState();

  const getUserData = async function () {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);

      data.success ? setUserData(data.data) : toast.error(data.message);

      // console.log("Data:", data);

      return data;
    } catch (error) {
      console.log(error);
      return error.message;
    }
  };

  const getAuthState = async function () {
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/is-auth`);
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      } else {
      }
    } catch (error) {
      return error.message;
    }
  };

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    getAuthState,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
