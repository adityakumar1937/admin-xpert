import React from "react";
import Logo from "/images/logo.png";
import { Link } from "react-router-dom";
import CallToAction from "../shared/callToAction";

const Navbar = () => {
  return (
    <nav className="navbar h-[10vh] px-5 flex justify-between items-center shadow-sm">
      <div className="logo pl-5 ">
        <a href="http://localhost:5173/" className="flex justifu-center items-center">
        <img className="w-16 h-16" src={Logo} alt="Admin Xpert Logo"/>
        <h2 className="text-slate-500 text-xl font-bold">
          Admin<span className="text-puprle-800">Xpert</span>
        </h2>
        </a>
      </div>

      <div className="btn-group flex justify-between gap-4 w-max">
        <Link to="/log-in">
          <CallToAction text="Log In" />
        </Link>

        <Link to="/sign-up">
          <CallToAction
            text="Sign Up"
            bgColor="bg-gradient-to-tr from-purple to-blue"
            textColor="text-white"
            borderColor="border-purple-800"
          />
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
