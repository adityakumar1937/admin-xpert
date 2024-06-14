import React from "react";

const CallToAction = ({ text, textColor, borderColor, bgColor }) => {
  return (
    <div className={`cta px-4 py-2 border-2 rounded-md font-semibold w-min ${bgColor} ${borderColor}`}>
      <span className={`text text-nowrap ${textColor}`}>{text}</span>
    </div>
  );
};

export default CallToAction;
