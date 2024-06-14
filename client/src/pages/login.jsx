import React, { useState } from "react";
import Navbar from "../components/navbar";
import EmailLogin from "../components/emailLogin";
import PhoneLogin from "../components/phoneLogin";
import Footer from "../components/footer";



const Login = () => {
  const [isPhoneLogin, setIsPhoneLogin] = useState(false); // State to track which component to render

  // Function to toggle between PhoneLogin and EmailLogin components
  const toggleLoginComponent = () => {
    setIsPhoneLogin(!isPhoneLogin);
  };


  return (
    <>
      <Navbar />
      <div className="main-container flex justify-center items-center">
        <div className="container m-12 w-7/12 h-auto flex rounded-md isolate bg-white/20 shadow-lg ring-1 ring-black/5">
          <div className="bg-login-img bg-cover bg-no-repeat left-col flex flex-col justify-center items-center w-2/4 text-center rounded-l-md">
          
      
          </div>

          <div className="right-col w-1/2 flex flex-col justify-center items-center text-center px-16 py-10 h-full rounded-r-md backdrop-blur-sm">
            {/* Conditionally render PhoneLogin or EmailLogin based on state */}
            {isPhoneLogin ? <PhoneLogin /> : <EmailLogin />}

            {/* Toggle text between "Try logging in with your phone" and "Try logging in with your email" */}
            <p className="my-8 text-left">
              {isPhoneLogin
                  ? "OTP issue? "
                  : "Password trouble? "}
              <span
                className="text-purple cursor-pointer"
                onClick={toggleLoginComponent}
              >
                {isPhoneLogin
                  ? "Try using E-mail"
                  : "Try using OTP"}
              </span>
            </p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Login;
