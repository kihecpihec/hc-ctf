import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = () => {
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const [userStats, setUserStats] = useState({
    totalUsers: 15234,
    activeUsers: 3289,
    suspendedUsers: 123,
  });

  const [bettingTrends, setBettingTrends] = useState({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Total Bets",
        data: [4000, 5200, 6100, 6900, 8500, 9200, 8800, 9500],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
      },
    ],
  });

  const [winLossRatio] = useState({
    labels: ["Wins", "Losses"],
    datasets: [
      {
        data: [37, 63],
        backgroundColor: ["#55b85c", "#c21b13"],
      },
    ],
  });

  const [topPlayers, setTopPlayers] = useState([
    { username: "highroller_1", totalBets: "$16,245" },
    { username: "betKing99", totalBets: "$12,588" },
    { username: "LuckyLuke", totalBets: "$11,220" },
    { username: "RNGod", totalBets: "$9,122" },
    { username: "SpinMaster", totalBets: "$8,501" },
  ]);

  useEffect(() => {
    const userStatsInterval = setInterval(() => {
      setUserStats((prevStats) => ({
        totalUsers: prevStats.totalUsers + Math.floor(Math.random() * 10),
        activeUsers: prevStats.activeUsers + Math.floor(Math.random() * 5),
        suspendedUsers: prevStats.suspendedUsers + Math.floor(Math.random() * 2),
      }));
    }, 1000);

    const bettingTrendsInterval = setInterval(() => {
      setBettingTrends((prevTrends) => ({
        ...prevTrends,
        datasets: [
          {
            ...prevTrends.datasets[0],
            data: prevTrends.datasets[0].data.map(
              (value) => value + Math.floor(Math.random() * 200)
            ),
          },
        ],
      }));
    }, 3000);

    const topPlayersInterval = setInterval(() => {
      setTopPlayers((prevPlayers) => {
        return prevPlayers.map((player) => ({
          ...player,
          totalBets: player.totalBets,
        }));
      });
    }, 4000);

    return () => {
      clearInterval(userStatsInterval);
      clearInterval(bettingTrendsInterval);
      clearInterval(topPlayersInterval);
    };
  }, []);

  const handleLogout = () => {
    fetch("http://localhost:8888/Dashboard/backend/logout.php", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      localStorage.removeItem("username");
      navigate("/");
    });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-white">

      <nav className="w-full md:w-64 bg-gray-800 p-6 flex flex-col justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-6">Casino Dashboard</h1>
          <ul>
            <li className="mb-4">
              <Link to="/dashboard" className="block p-2 hover:bg-gray-700 rounded">
                Overview
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/profile" className="block p-2 hover:bg-gray-700 rounded">
                Profile
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/analytics" className="block p-2 bg-gray-700 rounded">
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
        <button onClick={handleLogout} className="w-full bg-red-600 p-2 rounded hover:bg-red-500">
          Logout
        </button>
      </nav>

      <main className="flex-1 p-6 overflow-auto">
        <h2 className="text-3xl font-semibold">Casino Analytics</h2>
        <p className="mt-2 text-gray-400">Insights & Statistics</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold">Total Users</h3>
            <p className="text-2xl mt-2">{userStats.totalUsers}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold">Active Users</h3>
            <p className="text-2xl mt-2">{userStats.activeUsers}</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold">Suspended Users</h3>
            <p className="text-2xl mt-2 text-red-400">{userStats.suspendedUsers}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Betting Trends</h3>
            <Line data={bettingTrends} />
          </div>
          <div className="bg-gray-800 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-4">Win/Loss Ratio</h3>
            <div className="h-85 flex justify-center">
              <Pie data={winLossRatio} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow mt-6 overflow-x-auto">
          <h3 className="text-lg font-bold mb-4">Top Players</h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Username</th>
                <th className="p-2">Total Bets</th>
              </tr>
            </thead>
            <tbody>
              {topPlayers.map((player, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="p-2">{player.username}</td>
                  <td className="p-2">{player.totalBets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Analytics;