import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AiFillEdit, AiOutlineLogout } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/footer";
import Compressor from "compressorjs";

const UserDashboard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    id: "",
    photo: "",
    name: "",
    email: "",
    phone: "",
    designation: "",
    experience: "",
    skills: "",
    education: "",
  });
  const navigate = useNavigate();
  const [base64Image, setBase64Image] = useState(null);
  const toggleEditing = () => {
    if (isEditing) {
      handleSave(); // Save the data when toggling off editing
    }
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        navigate("/log-in");
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/users/profile/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const user = response.data;
      console.log("User Photo: ", user.photo);
      setProfile({
        id: userId,
        photo: user.photo
          ? `data:image/jpeg;base64,${user.photo.toString("base64")}`
          : "",
        name: `${user.firstName} ${user.lastName}` || "",
        email: user.email || "",
        phone: user.telephone || "",
        designation: user.designation || "",
        experience: user.pastExperience || "",
        skills: user.skillSets || "",
        education: user.education || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      navigate("/log-in");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleFileChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        console.error("Selected file is not an image.");
        return;
      }
  
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 800,
        maxHeight: 600,
        convertSize: 250000,
        success: async (result) => {
          const base64 = await blobToBase64(result);
          setBase64Image(base64);
          setProfile({ ...profile, photo: base64 });
          console.log("Image compressed successfully!");
          
        },
        error(err) {
          console.error("Image compression error:", err);
        },
      });
    } catch (err) {
      console.error("Error handling file change:", err);
    }
  };
  
  const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  };
  

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
  
      if (!token || !userId) {
        navigate("/log-in");
        return;
      }
  
      let photo = profile.photo;
      if (photo instanceof Blob) {
        photo = await blobToBase64(photo);
      }

      console.log("Blob to Base Photo:", photo);

      console.log("Profile Photo:", profile.photo);
  
      const formData = {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        designation: profile.designation,
        pastExperience: profile.experience,
        skillSets: profile.skills,
        education: profile.education,
        photo: profile.photo,
      };

      console.log("Form Photo:", formData);

      const response = await axios.put(
        `http://localhost:5000/api/users/update/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      if (response.status === 200) {
        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        console.log("Profile updated successfully!")
      } else {
        console.log("Failed to update profile. Please try again.")
        toast.error("Failed to update profile. Please try again.", {
          position: "top-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error("Failed to update profile. Please try again.", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/log-in");
  };

  return (
    <>
      <div className="w-full h-auto flex flex-col items-center">
        <nav className="w-full bg-white shadow-md p-4 flex justify-between items-center">
          <div className="text-md font-semibold">Hi, <span className="text-purple"> {profile.name}</span></div>
          <div className="flex space-x-4">
            <button
              className="flex items-center border-2 border-slate-200 text-purple-800 font-semibold px-4 py-2 rounded-md hover:border-purple-800 transition duration-300"
              onClick={toggleEditing}
            >
              <AiFillEdit className="mr-2" /> {isEditing ? "Save" : "Edit"}
            </button>
            <button
              className="flex items-center border-2 border-purple-800 font-semibold bg-gradient-to-tr from-purple to-blue text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-300"
              onClick={handleLogout}
            >
              <AiOutlineLogout className="mr-2" /> Logout
            </button>
          </div>
        </nav>
        <div className="isolate backdrop-blur-sm ring-1 bg-white/60 ring-black/5 shadow-md rounded-lg p-6 my-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 mb-4 relative ring-1 ring-black/5 rounded-full">
              {base64Image ? (
                <img
                  src={base64Image}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  No Photo
                </div>
              )}
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-gradient-to-tr from-purple to-blue text-white p-1 rounded-full cursor-pointer hover:bg-blue-700 transition duration-300">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <AiFillEdit />
                </label>
              )}
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={!isEditing}
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                disabled={true}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                disabled={true}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={profile.designation}
                onChange={handleChange}
                disabled={!isEditing}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Experience
              </label>
              <textarea
                name="experience"
                value={profile.experience}
                onChange={handleChange}
                disabled={!isEditing}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline h-24 ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Skills
              </label>
              <textarea
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                disabled={!isEditing}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline h-24 ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="w-full mb-4">
              <label className="block text-slate-800 text-sm font-semibold mb-2">
                Education
              </label>
              <textarea
                name="education"
                value={profile.education}
                onChange={handleChange}
                disabled={!isEditing}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-slate-800 leading-tight focus:outline-none focus:shadow-outline h-24 ${
                  !isEditing ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
            </div>
          </div>
        </div>
        {loading && <div className="loading-spinner">Saving...</div>}
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default UserDashboard;
