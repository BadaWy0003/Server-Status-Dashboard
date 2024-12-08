"use client";
import React, { Fragment, useState, useEffect } from "react";
import ProtectedRoute from "../api/auth/[...nextauth]/route";
import { logOut } from "../../lib/firebase";

export default function Dashboard() {
  const [servers, setServers] = useState([]);
  const [filteredServers, setFilteredServers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedServer, setExpandedServer] = useState(null); // Track expanded server

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  // Filter states
  const [statusFilter, setStatusFilter] = useState("All");
  const [uptimeFilter, setUptimeFilter] = useState([0, 100]);

  // Popup visibility state
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState(false);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch("https://67544ed536bcd1eec850caa3.mockapi.io/servers");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setServers(data);
        setFilteredServers(data); // Initially set filtered servers to all servers
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    // Apply filters and then sort the servers
    let filtered = servers;

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((server) => server.status === statusFilter);
    }

    // Apply uptime filter
    filtered = filtered.filter(
      (server) => server.upTime >= uptimeFilter[0] && server.upTime <= uptimeFilter[1]
    );

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredServers(filtered);
  }, [servers, statusFilter, uptimeFilter, sortConfig]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">Error: {error}</div>;

  const handleLogOut = async () => {
    await logOut();
  };

  // Function to get response time color class
  const getResponseTimeColor = (responseTime) => {
    let time = responseTime;
    if (typeof responseTime === "string") {
      time = parseInt(responseTime.replace("ms", ""), 10); // Extract numeric value
    }

    if (time === 0) return "text-black";
    if (time <= 200) return "text-green-600";
    if (time <= 500) return "text-yellow-600";
    if (time < 2000) return "text-orange-500";
    return "text-red-500";
  };

  // Function to get uptime color class
  const getUptimeColor = (uptime) => {
    let value = uptime;

    if (typeof uptime === "string") {
      value = parseFloat(uptime.replace("%", ""));
    }

    if (value >= 99.8) return "text-green-600"; // Excellent uptime
    if (value >= 95) return "text-yellow-600"; // Good uptime
    if (value >= 90) return "text-orange-600"; // Average uptime
    return "text-red-500"; // Poor uptime
  };

  const toggleMoreInfo = (serverId) => {
    if (expandedServer === serverId) {
      setExpandedServer(null); // Close if already open
    } else {
      setExpandedServer(serverId); // Open the clicked server
    }
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Clear all filters function
  const clearFilters = () => {
    setStatusFilter("All");
    setUptimeFilter([0, 100]);
  };

  // Toggle the filter popup
  const toggleFilterPopup = () => {
    setIsFilterPopupVisible(!isFilterPopupVisible);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen p-8 bg-gray-900 text-white">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-semibold">Server Dashboard</h1>
          <button
            onClick={handleLogOut}
            className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
          >
            Log Out
          </button>
        </div>

        {/* Filter Button */}
        <button
          onClick={toggleFilterPopup}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 mb-4 transition duration-200"
        >
          Filters
        </button>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 mb-4 ml-4 transition duration-200"
        >
          Clear Filters
        </button>

        {/* Filter Popup (Modal) */}
        {isFilterPopupVisible && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Filters</h2>
              {/* Status Filter */}
              <div className="mb-4">
                <label className="mr-2">Status:</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1 border rounded-lg shadow-sm bg-gray-700 text-white w-full"
                >
                  <option value="All">All</option>
                  <option value="Up">Up</option>
                  <option value="Down/offline">Down</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              {/* Uptime Filter */}
              <div className="mb-4">
              <label className="mr-2">Uptime:</label>
              <input
                type="number"
                value={uptimeFilter[0]}
                onChange={(e) => setUptimeFilter([parseInt(e.target.value), uptimeFilter[1]])}
                className="px-3 py-1 border rounded-lg shadow-sm bg-gray-700 text-white w-full"
                placeholder="Min"
              />

                <span className="mx-2">to</span>
                <input
                  type="number"
                  value={uptimeFilter[1]}
                  onChange={(e) => setUptimeFilter([uptimeFilter[0], parseInt(e.target.value)])}
                  className="px-3 py-1 border rounded-lg shadow-sm bg-gray-700 text-white w-full"
                  placeholder="Max"
                />
              </div>

              {/* Close Button */}
              <button
                onClick={toggleFilterPopup}
                className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-gray-800 shadow rounded-lg p-6 mt-4">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-700 text-gray-300 text-left">
                <th
                  className="px-4 py-2 cursor-pointer text-sm font-semibold"
                  onClick={() => requestSort("name")}
                >
                  Name{" "}
                  {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th
                  className="px-4 py-2 cursor-pointer text-sm font-semibold"
                  onClick={() => requestSort("status")}
                >
                  Status{" "}
                  {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th className="px-4 py-2"></th> {/* For "More Info" button */}
              </tr>
            </thead>
            <tbody>
              {filteredServers.map((server) => (
                <Fragment key={server.id}>
                  <tr className="border-b hover:bg-gray-700 transition duration-200">
                    <td className="px-4 py-2 font-medium">{server.name}</td>
                    <td
                      className={`px-4 py-2 font-medium ${
                        server.status === "Up"
                          ? "text-green-600"
                          : server.status === "Down/offline"
                          ? "text-red-600"
                          : server.status === "Maintenance"
                          ? "text-orange-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {server.status}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => toggleMoreInfo(server.id)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        {expandedServer === server.id ? "Less Info" : "More Info"}
                      </button>
                    </td>
                  </tr>

                  {/* Render expanded info for the selected server */}
                  {expandedServer === server.id && (
                    <tr className="bg-gray-700">
                      <td colSpan="3" className="px-4 py-4">
                        <div className="space-y-2">
                          <p>
                            <strong>IP Address:</strong> {server.ip}
                          </p>
                          <p>
                            <strong>Response Time:</strong>{" "}
                            <span className={getResponseTimeColor(server.responseTime)}>
                              {server.responseTime} ms
                            </span>
                          </p>
                          <p>
                            <strong>Uptime:</strong>{" "}
                            <span className={getUptimeColor(server.upTime)}>
                              {server.upTime}%
                            </span>
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ProtectedRoute>
  );
}
