"use client";
import './dashboard.css';
import React, { useState, useEffect, Fragment } from "react";
import ProtectedRoute from "../api/auth/[...nextauth]/route";
import { logOut } from "../../lib/firebase";

export default function Dashboard() {
  // State Management
  const [servers, setServers] = useState([]); // Stores all servers data
  const [filteredServers, setFilteredServers] = useState([]); // Stores filtered servers data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [expandedServer, setExpandedServer] = useState(null); // Track expanded server

  // Sorting and Filtering states
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });
  const [statusFilter, setStatusFilter] = useState("All");
  const [uptimeFilter, setUptimeFilter] = useState([0, 100]);

  // Filter Popup visibility state
  const [isFilterPopupVisible, setIsFilterPopupVisible] = useState(false);

  // Fetch server data on initial render
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
        setError(err.message); // Handle any errors during fetch
      } finally {
        setLoading(false); // Set loading state to false when data fetch is complete
      }
    };

    fetchServers();
  }, []); // Only run on initial component mount

  // Apply filters and sorting whenever any filter or sort changes
  useEffect(() => {
    let filtered = servers;

    // Apply status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((server) => server.status === statusFilter);
    }

    // Apply uptime filter
    filtered = filtered.filter((server) => server.upTime >= uptimeFilter[0] && server.upTime <= uptimeFilter[1]);

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredServers(filtered); // Set filtered data to display
  }, [servers, statusFilter, uptimeFilter, sortConfig]); // Depend on these states to trigger re-filtering and re-sorting

  // Logout function to log the user out of the application
  const handleLogOut = async () => {
    await logOut();
  };

  // Function to get response time color class
  const getResponseTimeColor = (responseTime) => {
    let time = typeof responseTime === "string" ? parseInt(responseTime.replace("ms", ""), 10) : responseTime;
    if (time === 0) return "text-white";
    if (time <= 200) return "text-green";
    if (time <= 500) return "text-yellow";
    if (time < 2000) return "text-orange";
    return "text-red";
  };

  // Function to get uptime color class
  const getUptimeColor = (uptime) => {
    let value = typeof uptime === "string" ? parseFloat(uptime.replace("%", "")) : uptime;
    if (value >= 99.8) return "text-green";
    if (value >= 95) return "text-yellow";
    if (value >= 90) return "text-orange";
    return "text-red";
  };

  // Toggle expanded info for a specific server
  const toggleMoreInfo = (serverId) => {
    setExpandedServer(expandedServer === serverId ? null : serverId);
  };

  // Sorting function triggered by column header click
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

  // Toggle the visibility of the filter popup
  const toggleFilterPopup = () => {
    setIsFilterPopupVisible(!isFilterPopupVisible);
  };

  // Loading or Error message
  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <ProtectedRoute>
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="header">
          <h1 className="title">Server Dashboard</h1>
          <button onClick={handleLogOut} className="logout-button">Log Out</button>
        </div>

        {/* Main Content */}
        <div className="inner-content">
          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button onClick={toggleFilterPopup} className="filter-button">Filters</button>
            <button onClick={clearFilters} className="clear-filters-button">Clear Filters</button>
          </div>

          {/* Filter Popup Modal */}
          {isFilterPopupVisible && (
            <div className="filter-popup-overlay">
              <div className="filter-popup">
                <h2 className="filter-title">Filters</h2>
                {/* Status Filter */}
                <div className="filter-section">
                  <label className="filter-label">Status:</label>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="filter-select">
                    <option value="All">All</option>
                    <option value="Up">Up</option>
                    <option value="Down/offline">Down</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Uptime Filter */}
                <div className="filter-section">
                  <label className="filter-label">Uptime:</label>
                  <input type="number" value={uptimeFilter[0]} onChange={(e) => setUptimeFilter([parseInt(e.target.value), uptimeFilter[1]])} className="filter-input" placeholder="Min" />
                  <span className="filter-to">to</span>
                  <input type="number" value={uptimeFilter[1]} onChange={(e) => setUptimeFilter([uptimeFilter[0], parseInt(e.target.value)])} className="filter-input" placeholder="Max" />
                </div>

                <button onClick={toggleFilterPopup} className="close-button">Close</button>
              </div>
            </div>
          )}

          {/* Table Section */}
          <div className="table-container">
            <table className="server-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell" onClick={() => requestSort("name")}>Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                  <th className="table-header-cell" onClick={() => requestSort("status")}>Status {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                  <th className="table-header-cell"></th>
                </tr>
              </thead>
              <tbody>
                {filteredServers.map((server) => (
                  <Fragment key={server.id}>
                    <tr className="table-row">
                      <td className="table-cell">{server.name}</td>
                      <td className={`table-cell ${server.status === "Up" ? "status-up" : server.status === "Down/offline" ? "status-down" : server.status === "Maintenance" ? "status-maintenance" : "status-degraded"}`}>{server.status}</td>
                      <td className="table-cell">
                        <button onClick={() => toggleMoreInfo(server.id)} className="more-info-button">{expandedServer === server.id ? "Less Info" : "More Info"}</button>
                      </td>
                    </tr>

                    {/* Expanded Server Info */}
                    {expandedServer === server.id && (
                      <tr className="expanded-row">
                        <td colSpan="3" className="expanded-cell">
                          <div className="expanded-info">
                            <p><strong>IP Address:</strong> {server.ip}</p>
                            <p><strong>Response Time:</strong> <span className={getResponseTimeColor(server.responseTime)}>{server.responseTime} ms</span></p>
                            <p><strong>Uptime:</strong> <span className={getUptimeColor(server.upTime)}>{server.upTime}%</span></p>
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
      </div>
    </ProtectedRoute>
  );
}
