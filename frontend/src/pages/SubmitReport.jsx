import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SubmitReport = () => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("title", title);
    form.append("description", desc);
    if (attachment) form.append("attachment", attachment);

    try {
      const res = await fetch(
        "http://localhost:8888/sql_inj/backend/submit_report.php",
        {
          method: "POST",
          body: form,
          credentials: "include",
        }
      );

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTitle("");
        setDesc("");
        setAttachment(null);
      } else {
        alert(data.error || "Failed to submit report");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong");
    }
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

  const username = localStorage.getItem("username");

  return (
    <div className='flex h-screen bg-gray-900 text-white'>
      {/* Sidebar */}
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
              <Link
                to='/profile'
                className='block p-2 hover:bg-gray-700 rounded'>
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
                className='block p-2 bg-gray-700 rounded'>
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

      <main className='flex-1 flex items-center justify-center p-8 overflow-y-auto'>
        <div className='w-full max-w-xl'>
          <h2 className='text-2xl mb-4 text-center'>Submit Report</h2>
          {success && (
            <div className='text-green-500 mb-4 text-center'>
              Report submitted!
            </div>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <input
              className='w-full p-2 bg-gray-800 rounded'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className='w-full p-2 bg-gray-800 rounded min-h-10'
              placeholder='Description'
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <input
              type='file'
              onChange={(e) => setAttachment(e.target.files[0])}
              className='w-full p-2 bg-gray-800 rounded-lg text-white file:bg-gray-700 file:border-none file:p-2 file:rounded-lg file:text-white file:cursor-pointer'
            />
            <button className='bg-blue-600 p-2 rounded hover:bg-blue-500 w-full'>
              Submit
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SubmitReport;
