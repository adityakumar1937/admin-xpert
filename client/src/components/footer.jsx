import React from "react";

const Footer = () => {
  return (
    <div className="h-[10vh] px-8 flex justify-between items-center bg-white">
      <div className="copywrite">
        All Rights Reserved. Copyright &#169;2024{" "}
        <a className="text-" href="https://www.adaan.com/">
          Adaan
        </a>
      </div>
      <div className="author">
        Designed & Developed by{" "}
        <a className="text-purple-800" href="https://www.adityakumar.website/">
          Aditya Kumar
        </a>
      </div>
    </div>
  );
};

export default Footer;

