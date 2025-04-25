import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    const response = await fetch("http://localhost:8888/sql_inj/backend/index.php", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
    
    const textResponse = await response.text(); 
    
    try {
      const data = JSON.parse(textResponse);
  
      if (data.success) {
        localStorage.setItem("username", username);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials!");
      }
    } catch (error) {
      alert("Invalid response from server!");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="p-6 bg-gray-800 text-white rounded-md shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-700 rounded text-white"
          />
          <button className="w-full p-2 bg-green-600 hover:bg-green-500 rounded">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;