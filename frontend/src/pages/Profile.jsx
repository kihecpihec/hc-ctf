import { useState, useEffect } from "react";
import {Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [userData, setUserData] = useState({
    display_name: "",
    username: "",
    email: "",
    profile_pic: "",
  });

  const [newDisplayName, setNewDisplayName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState(
    "http://localhost:8888/sql_inj/backend/uploads/default.jpg"
  );

  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const fetchUserData = () => {
    fetch("http://localhost:8888/sql_inj/backend/profile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          navigate("/");
        } else {
          setUserData(data);
          setNewDisplayName(data.display_name);
          setNewUsername(data.username);
          setNewEmail(data.email);
          setPreviewPic(
            data.profile_pic
              ? `http://localhost:8888/sql_inj/backend/${data.profile_pic}`
              : "http://localhost:8888/sql_inj/backend/uploads/default.jpg"
          );
        }
      })
      .catch(() => navigate("/"));
  };

  const handleLogout = () => {
    fetch("http://localhost:8888/sql_inj/backend/logout.php", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("username");
      navigate("/");
    });
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfilePic(file);
      setPreviewPic(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("display_name", newDisplayName || userData.display_name);
    formData.append("username", newUsername || userData.username);
    formData.append("email", newEmail || userData.email);
    if (newProfilePic) formData.append("profile_pic", newProfilePic);

    try {
      const response = await fetch(
        "http://localhost:8888/sql_inj/backend/profile.php",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      const data = await response.json();
      if (data.success) {
        setUserData((prevUserData) => ({
          ...prevUserData,
          display_name: data.user?.display_name || prevUserData.display_name,
          username: data.user?.username || prevUserData.username,
          email: data.user?.email || prevUserData.email,
          profile_pic: data.user?.profile_pic || prevUserData.profile_pic,
        }));

        if (data.user?.profile_pic) {
          setPreviewPic(
            `http://localhost:8888/sql_inj/backend/${data.user.profile_pic}`
          );
        }
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
        fetchUserData();
      } else {
        alert(data.message || "Error updating profile.");
      }
    } catch (error) {
      alert("Failed to update profile.");
    }
  };

  return (
    <div className='flex h-screen bg-gray-900 text-white'>

      {showMessage && (
        <div className='fixed top-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg'>
          ✅ Changes saved successfully!
        </div>
      )}

      <nav className='w-full md:w-64 bg-gray-800 p-6 flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-bold mb-6'>Casino Dashboard</h1>
          <ul>
            <li className='mb-4'>
              <Link
                to='/dashboard'
                className='block p-2 hover:bg-gray-700 rounded'>
                Overview
              </Link>
            </li>
            <li className='mb-4'>
              <Link to='/profile' className='block p-2 bg-gray-700 rounded'>
                Profile
              </Link>
            </li>
            <li className='mb-4'>
              <Link
                to='/analytics'
                className='block p-2 hover:bg-gray-700 rounded'>
                Analytics
              </Link>
            </li>
            <li className='mb-4'>
              <Link
                to={username === "admin" ? "/admin-reports" : "/reports"}
                className='block p-2 hover:bg-gray-700 rounded'>
                {username === "admin" ? "Reports" : "Submit Report"}
              </Link>
            </li>
          </ul>
        </div>
        <button
          onClick={handleLogout}
          className='w-full bg-red-600 p-2 rounded hover:bg-red-500'>
          Logout
        </button>
      </nav>

      <main className='flex-1 p-6'>
        <h2 className='text-3xl font-semibold mb-4'>Profile</h2>

        <div className='bg-gray-800 p-6 rounded-lg shadow-md text-center mb-6'>
          <img
            src={previewPic}
            alt='Profile'
            className='w-32 h-32 rounded-full mx-auto border-4 border-gray-700 object-cover shadow-md'
          />
          <h3 className='text-xl font-bold mt-4'>{userData.display_name}</h3>
          <p className='text-gray-400'>@{userData.username}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className='bg-gray-800 p-6 rounded-lg shadow-md'>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Display Name
              </label>
              <input
                type='text'
                value={newDisplayName}
                onChange={(e) => setNewDisplayName(e.target.value)}
                className='w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Username</label>
              <input
                type='text'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className='w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>Email</label>
              <input
                type='email'
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className='w-full p-3 bg-gray-700 rounded-lg text-white focus:ring-2 focus:ring-green-500'
              />
            </div>
            {userData.username === "admin" && (
              <div>
                <label className='block text-sm font-medium mb-1'>
                  Profile Picture
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleProfilePicChange}
                  className='w-full p-2 bg-gray-700 rounded-lg text-white file:bg-gray-600 file:border-none file:p-2 file:rounded-lg file:text-white file:cursor-pointer'
                />
              </div>
            )}

            <button className='w-full p-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold text-white transition'>
              Save Changes
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Profile;
