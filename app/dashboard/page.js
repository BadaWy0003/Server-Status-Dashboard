"use client";
import './dashboard.css';
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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  const handleLogOut = async () => {
    await logOut();
  };

  // Function to get response time color class
  const getResponseTimeColor = (responseTime) => {
    let time = responseTime;
    if (typeof responseTime === "string") {
      time = parseInt(responseTime.replace("ms", ""), 10); // Extract numeric value
    }

    if (time === 0) return "text-white";
    if (time <= 200) return "text-green";
    if (time <= 500) return "text-yellow";
    if (time < 2000) return "text-orange";
    return "text-red";
  };

  // Function to get uptime color class
  const getUptimeColor = (uptime) => {
    let value = uptime;

    if (typeof uptime === "string") {
      value = parseFloat(uptime.replace("%", ""));
    }

    if (value >= 99.8) return "text-green"; // Excellent uptime
    if (value >= 95) return "text-yellow"; // Good uptime
    if (value >= 90) return "text-orange"; // Average uptime
    return "text-red"; // Poor uptime
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
      <div className="dashboard-container">
        <div className="header">
          <h1 className="title">Server Dashboard</h1>
          <button onClick={handleLogOut} className="logout-button">
            Log Out
          </button>
        </div>
        <div className="inner-content">
          <div className="filter-buttons">
            {/* Filter Button */}
            <button onClick={toggleFilterPopup} className="filter-button">
              Filters
            </button>

            {/* Clear Filters Button */}
            <button onClick={clearFilters} className="clear-filters-button">
              Clear Filters
            </button>
          </div>
          {/* Filter Popup (Modal) */}
          {isFilterPopupVisible && (
            <div className="filter-popup-overlay">
              <div className="filter-popup">
                <h2 className="filter-title">Filters</h2>
                {/* Status Filter */}
                <div className="filter-section">
                  <label className="filter-label">Status:</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="All">All</option>
                    <option value="Up">Up</option>
                    <option value="Down/offline">Down</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Uptime Filter */}
                <div className="filter-section">
                  <label className="filter-label">Uptime:</label>
                  <input
                    type="number"
                    value={uptimeFilter[0]}
                    onChange={(e) => setUptimeFilter([parseInt(e.target.value), uptimeFilter[1]])}
                    className="filter-input"
                    placeholder="Min"
                  />
                  <span className="filter-to">to</span>
                  <input
                    type="number"
                    value={uptimeFilter[1]}
                    onChange={(e) => setUptimeFilter([uptimeFilter[0], parseInt(e.target.value)])}
                    className="filter-input"
                    placeholder="Max"
                  />
                </div>

                {/* Close Button */}
                <button onClick={toggleFilterPopup} className="close-button">
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="table-container">
            <table className="server-table">
              <thead>
                <tr className="table-header">
                  <th className="table-header-cell" onClick={() => requestSort("name")}>
                    Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="table-header-cell" onClick={() => requestSort("status")}>
                    Status{" "}
                    {sortConfig.key === "status" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                  </th>
                  <th className="table-header-cell"></th> {/* For "More Info" button */}
                </tr>
              </thead>
              <tbody>
                {filteredServers.map((server) => (
                  <Fragment key={server.id}>
                    <tr className="table-row">
                      <td className="table-cell">{server.name}</td>
                      <td
                        className={`table-cell ${
                          server.status === "Up"
                            ? "status-up"
                            : server.status === "Down/offline"
                            ? "status-down"
                            : server.status === "Maintenance"
                            ? "status-maintenance"
                            : "status-degraded"
                        }`}
                      >
                        {server.status}
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={() => toggleMoreInfo(server.id)}
                          className="more-info-button"
                        >
                          {expandedServer === server.id ? "Less Info" : "More Info"}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row with Colored Uptime and Response Time */}
                    {expandedServer === server.id && (
                      <tr className="expanded-row">
                        <td colSpan="3" className="expanded-cell">
                          <div className="expanded-info">
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
      </div>
    </ProtectedRoute>
  );
}
