"use client";
import ProtectedRoute from "../api/auth/[...nextauth]/route";
import { logOut } from "../../lib/firebase";
import { useState, useEffect } from "react";


export default function Dashboard() {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);



    useEffect(() => {
        const fetchServers = async () => {
          try {
            const response = await fetch("https://67544ed536bcd1eec850caa3.mockapi.io/servers");
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setServers(data);
          } catch (err) {
            setError(err.message);
          } finally {
            setLoading(false);
          }
        };
    
        fetchServers();
      }, []);
    
      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error: {error}</div>;
    

      
  const handleLogOut = async () => {
    await logOut();
    // alert("Logged out successfully!");
  };

  return (
    <ProtectedRoute>
    <div>
      <button
        onClick={handleLogOut}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Log Out
      </button>
      <div>
      <h1>Server Status</h1>
      <ul>
        {servers.map((server) => (
          <li key={server.id} className={`status-${server.status.toLowerCase()}`}>
            <h2>{server.name}</h2>
            <p>IP: {server.ip}</p>
            <p>Status: {server.status}</p>
            <p>Response Time: {server.responseTime}</p>
            <p>Uptime: {server.uptime}</p>
          </li>
        ))}
      </ul>

      <style jsx>{`
        .status-up {
          color: green;
        }
        .status-down {
          color: red;
        }
        .status-degraded {
          color: orange;
        }
      `}</style>
    </div>
    </div>
    </ProtectedRoute>
  );
}