import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8888/sql_inj/backend/reports.php", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setReports);
  }, []);

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

  useEffect(() => {
    if (username === "admin") {
      console.log("admin viewing");
    }
  }, [username]);

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

      <main className='flex-1 p-6 overflow-auto'>
        <h2 className='text-3xl font-semibold'>Developer Reports</h2>
        <p className='mt-2 text-gray-400'>
          Submitted by developers for admin review
        </p>

        <div className='grid grid-cols-1 gap-6 mt-6 max-w-4xl'>
          {reports.map((r) => (
            <div key={r.id} className='bg-gray-800 p-6 rounded-lg shadow'>
              <h3 className='text-xl font-semibold'>{r.title}</h3>
              <p className='text-gray-400 mt-1 mb-2'>From: {r.submitted_by}</p>

              <div
                className='text-gray-200 mb-4'
                dangerouslySetInnerHTML={{ __html: r.description }}></div>

              {r.file_path && (
                <div className='border border-gray-700 p-2 rounded bg-black'>
                  <iframe
                    src={`http://localhost:8888/sql_inj/backend/${r.file_path}`}
                    title='report'
                    width='100%'
                    height='200'
                    sandbox=''
                    className='rounded'></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;
