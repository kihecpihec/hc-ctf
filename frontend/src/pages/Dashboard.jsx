import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(15234);
  const [activePlayers, setActivePlayers] = useState(3289);
  const [totalRevenue, setTotalRevenue] = useState(1245678);
  const [recentTransactions, setRecentTransactions] = useState([
    { id: 1, user: "player_123", amount: "$50", status: "Win" },
    { id: 2, user: "player_456", amount: "$200", status: "Loss" },
    { id: 3, user: "player_789", amount: "$100", status: "Win" },
    { id: 4, user: "player_654", amount: "$500", status: "Loss" },
    { id: 5, user: "player_234", amount: "$150", status: "Win" },
  ]);

  useEffect(() => {
    const totalPlayersInterval = setInterval(() => {
      setTotalPlayers((prev) => prev + Math.floor(Math.random() * 10));
    }, 1000);

    const activePlayersInterval = setInterval(() => {
      setActivePlayers((prev) => prev + Math.floor(Math.random() * 5));
    }, 1000);

    const revenueInterval = setInterval(() => {
      setTotalRevenue((prev) => prev + Math.floor(Math.random() * 2000));
    }, 1000);

    const transactionsInterval = setInterval(() => {
      const newTransactions = Array.from({ length: 5 }).map((_, idx) => ({
        id: idx + 1,
        user: `player_${Math.floor(Math.random() * 1000)}`,
        amount: `$${Math.floor(Math.random() * 500)}`,
        status: Math.random() > 0.5 ? "Win" : "Loss",
      }));

      setRecentTransactions(newTransactions);
    }, 5000);

    return () => {
      clearInterval(totalPlayersInterval);
      clearInterval(activePlayersInterval);
      clearInterval(revenueInterval);
      clearInterval(transactionsInterval);
    };
  }, []);

  useEffect(() => {
    fetch("http://localhost:8888/sql_inj/backend/profile.php", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          navigate("/");
        } else {
          setUser(data);
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  const handleLogout = () => {
    fetch("http://localhost:8888/sql_inj/backend/logout.php", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("username");
      navigate("/");
    })
  };

  const stats = {
    totalPlayers,
    activePlayers,
    totalRevenue: `$${totalRevenue.toLocaleString()}`,
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [15000, 22000, 18000, 25000, 30000, 28000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
      },
    ],
  };
  const usersData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Active Users",
        data: [220, 320, 290, 400, 390, 450, 500],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
      },
    ],
  };

  const username = localStorage.getItem("username");

  return (
    <div className='flex flex-col md:flex-row h-screen bg-gray-900 text-white'>
      <nav className='w-full md:w-64 bg-gray-800 p-6 flex flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-bold mb-6'>Casino Dashboard</h1>
          <ul>
            <li className='mb-4'>
              <Link to='/dashboard' className='block p-2 bg-gray-700 rounded'>
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

      <main className='flex-1 p-6 overflow-auto'>
        <h2 className='text-3xl font-semibold'>
          Welcome, {user?.display_name}!
        </h2>
        <p className='mt-4 text-gray-400'>Casino Dashboard Overview</p>

        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6'>
          <div className='bg-gray-800 p-6 rounded-lg text-center'>
            <h3>Total Players</h3>
            <p className='text-3xl'>{stats.totalPlayers}</p>
          </div>
          <div className='bg-gray-800 p-6 rounded-lg text-center'>
            <h3>Active Players</h3>
            <p className='text-3xl'>{stats.activePlayers}</p>
          </div>
          <div className='bg-gray-800 p-6 rounded-lg text-center'>
            <h3>Total Revenue</h3>
            <p className='text-3xl'>{stats.totalRevenue}</p>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
          <div className='bg-gray-800 p-6 rounded-lg'>
            <h3>Revenue Trends</h3>
            <Line data={revenueData} />
          </div>
          <div className='bg-gray-800 p-6 rounded-lg'>
            <h3>Active Users</h3>
            <Bar data={usersData} />
          </div>
        </div>

        <div className='bg-gray-800 p-6 rounded-lg mt-6 overflow-x-auto'>
          <h3 className='text-lg font-bold mb-4'>Recent Transactions</h3>
          <table className='w-full text-left min-w-[300px]'>
            <thead>
              <tr>
                <th className='p-2'>User</th>
                <th className='p-2'>Amount</th>
                <th className='p-2'>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className='p-2'>{tx.user}</td>
                  <td className='p-2'>{tx.amount}</td>
                  <td
                    className={`p-2 ${
                      tx.status === "Win" ? "text-green-400" : "text-red-400"
                    }`}>
                    {tx.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
