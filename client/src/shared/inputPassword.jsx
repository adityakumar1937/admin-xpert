import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const InputPassword = ({ placeholder, value, name, onChange, onPaste }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-full mb-4">
      <input
        className="bg-slate-50 border-l-4 border-purple pl-2 py-2 w-full focus:outline-none"
        type={showPassword ? "text" : "password"}
        name={name}
        value={value || ""}
        placeholder={placeholder}
        onChange={onChange}
        onPaste={onPaste}
      />
      <span
        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <AiFillEye className="h-6 w-6 text-gray-700" />
        ) : (
          <AiFillEyeInvisible className="h-6 w-6 text-gray-700" />
        )}
      </span>
    </div>
  );
};

export default InputPassword;
