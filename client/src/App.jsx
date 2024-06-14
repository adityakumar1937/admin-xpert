import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import UserDashboard from "./pages/user";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log-in" element={<Login />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/sign-up" element={<Signup />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
