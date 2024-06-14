import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/sendOtp",
          { telephone: phoneNumber.toString() }
        );
        if (response.data.success) {
          setOtpSent(true);
          setTimer(30);
          toast.success("OTP sent successfully");
        } else {
          toast.error("Failed to send OTP");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to send OTP");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/verifyOtp",
          { telephone: phoneNumber.toString(), otp }
        );
        if (response.data.success) {
          // Store token and userId in local storage
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("userId", response.data.userId);
          toast.success("OTP verified successfully");
          navigate("/user-dashboard"); // Redirect to user-dashboard
        } else {
          toast.error("OTP verification failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Network error");
      }
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer]);

  const handleResendOtp = async () => {
    if (timer === 0) {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/users/sendOtp",
          { telephone: phoneNumber.toString() }
        );
        if (response.data.success) {
          setTimer(30);
          toast.success("OTP resent successfully");
        } else {
          toast.error("Failed to resend OTP");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to resend OTP");
      }
    }
  };

  return (
    <>
    <h1 className="text-slate-600 text-3xl font-bold mb-4">Phone Login</h1>
      <p className="text-slate-400 text-sm">
        Log in with your phone for quick access
        via OTP.Thanks for choosing us!
      </p>

      <form
        onSubmit={handleSubmit}
        className="form-login mt-10 flex flex-col w-full"
      >
        <input
          className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
          type="tel"
          name="phone"
          value={phoneNumber}
          placeholder="Phone Number"
          required
          onChange={handlePhoneNumberChange}
        />
        {otpSent && (
          <input
            className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
            type="text"
            name="otp"
            value={otp}
            placeholder="Enter your OTP"
            required
            onChange={handleOtpChange}
          />
        )}
        <button
          className="w-full bg-gradient-to-tr from-purple to-blue text-white uppercase font-semibold rounded-full px-2 py-3"
          type="submit"
        >
          {otpSent ? "Verify OTP" : "Send OTP"}
        </button>
        {otpSent && timer > 0 && <p>Resend OTP in {timer} seconds</p>}
        {otpSent && timer === 0 && (
          <p
            onClick={handleResendOtp}
            style={{ cursor: "pointer", color: "blue" }}
          >
            Resend OTP
          </p>
        )}
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default PhoneLogin;
