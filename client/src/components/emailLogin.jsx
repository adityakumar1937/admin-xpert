import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmailLogin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const res = await axios.post(
          "http://localhost:5000/api/auth/log-in",
          values
        );
        if (res && res.data) {
          localStorage.setItem("token", res.data.token); // Store token in local storage
          localStorage.setItem("userId", res.data.user['id']); // Store userId in local storage
          console.log(res.data)
          toast.success("Login successful");
          navigate("/user-dashboard"); // Redirect to user-dashboard page
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        const errorMsg =
          err.response && err.response.data && err.response.data.msg
            ? err.response.data.msg
            : "Login failed";
        toast.error(errorMsg);
      }
    },
  });

  return (
    <>
      <h1 className="text-slate-600 text-3xl font-bold mb-4">Email Login</h1>
      <p className="text-slate-400 text-sm">
        Log in with your email and password, or use your phone for quick access
        via OTP.Thanks for choosing us!
      </p>
      <form
        onSubmit={formik.handleSubmit}
        className="form-login mt-10 flex flex-col w-full"
      >
        <input
          {...formik.getFieldProps("email")}
          className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
          type="email"
          name="email"
          placeholder="Email-ID"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500">{formik.errors.email}</div>
        ) : null}
        <input
          {...formik.getFieldProps("password")}
          className="bg-slate-50 border-l-4 border-purple mb-4 pl-2 py-2 focus:outline-none"
          type="password"
          name="password"
          placeholder="Password"
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500">{formik.errors.password}</div>
        ) : null}
        <button
          className="bg-gradient-to-tr from-purple to-blue text-white font-semibold rounded-full px-2 py-3"
          type="submit"
        >
          Login Now
        </button>
      </form>
      <ToastContainer />
    </>
  );
};

export default EmailLogin;
