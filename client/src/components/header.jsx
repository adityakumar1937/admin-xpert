import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className="header px-14 bg-cover bg-no-repeat h-[80vh] flex">
        <div className="left w-1/2 flex flex-col justify-center items-left">
          <h1 className="text-slate-600 text-5xl font-bold mb-4">
            Seamlessly Manage Users <br /> with Admin Expert
          </h1>
          <p className="text-slate-500 mb-4">
            Effortlessly control, organize, and monitor your user base with our
            intuitive <br />
            and powerful web application designed for efficient user management{" "}
          </p>
          <div className="">
            <Link to="/log-in">
              <button className="px-4 py-2 border-2 rounded-md font-semibold backdrop-blur-sm">
                Access Account
              </button>
            </Link>
            <Link to="/sign-up">
              <button className="bg-gradient-to-tr from-purple to-blue px-4 py-2 ml-5 border-2 border-purple-800 rounded-md font-semibold bg-purple-800/80 text-white">
                Create Account
              </button>
            </Link>
          </div>
        </div>
        <div className="right w-1/2 flex justify-center items-center">
        <img src="../images/hero-image.png" alt="" />
        </div>
      </header>
    </>
  );
};

export default Header;
