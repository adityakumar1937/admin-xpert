import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputPassword from "../shared/inputPassword";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChanges = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "telephone":
        setTelephone(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const user = {
      firstName,
      lastName,
      email,
      telephone,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/users/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create user");
      }

      // Clear the form after successful submission
      setFirstName("");
      setLastName("");
      setEmail("");
      setTelephone("");
      setPassword("");
      setConfirmPassword("");

      const data = await response.json();
      toast.success("User created successfully");
      console.log("Form submitted with:", data);
    } catch (error) {
      toast.error("Error creating user: " + error.message);
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="main-container flex justify-center items-center">
        <div className="container w-9/12 h-auto flex mx-10 my-10 rounded-md isolate bg-white/20 shadow-lg ring-1 ring-black/5">
          <div className="bg-login-img bg-cover left-col flex flex-col justify-center align-middle w-1/2 text-center px-10 rounded-l-md">
            
          </div>
          <div className="right-col w-1/2 flex flex-col justify-center align-middle text-center px-16 py-10 backdrop-blur-sm">
            <h1 className="text-slate-600 text-3xl font-bold mb-4">Sign Up</h1>
            <p className="text-slate-400 text-sm">
              Join us now! Just a few details and you're in.
            </p>
            <form
              onSubmit={handleSubmit}
              className="form-login mt-8 flex flex-col"
            >
              <div className="flex justify-between mb-4">
                <input
                  className="w-[47.5%] bg-slate-50 border-l-4 border-purple pl-2 py-2 focus:outline-none"
                  type="text"
                  name="firstName"
                  value={firstName}
                  placeholder="First Name"
                  onChange={handleInputChanges}
                />
                <input
                  className="w-[47.5%] bg-slate-50 border-l-4 border-purple pl-2 py-2 focus:outline-none"
                  type="text"
                  name="lastName"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={handleInputChanges}
                />
              </div>
              <input
                className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
                type="email"
                name="email"
                value={email}
                placeholder="Email-ID"
                onChange={handleInputChanges}
              />
              <input
                className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
                type="tel"
                name="telephone"
                value={null}
                placeholder="Phone Number"
                onChange={handleInputChanges}
              />
              <InputPassword
                placeholder="Enter Password"
                value={password}
                name="password"
                onChange={handleInputChanges}
              />
              <InputPassword
                placeholder="Re-type Password"
                value={confirmPassword}
                name="confirmPassword"
                onChange={handleInputChanges}
              />
              <p className="my-4 text-left">
                Already have an account?{" "}
                <Link to="/log-in">
                  <span className="text-purple hover:cursor-pointer">
                    Log In
                  </span>
                </Link>
              </p>
              <button
                className="w-full bg-gradient-to-tr from-purple to-blue text-white font-semibold rounded-full px-2 py-3"
                type="submit"
              >
                Register Now
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Signup;
