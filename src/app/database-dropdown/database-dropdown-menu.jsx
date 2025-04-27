"use client";
import React, { useState, useEffect, useRef, useContext } from "react";
import { GlobalContext } from "../../../provider/context";

export default function DatabaseDropdownMenu() {
  const { toggleSidebar, fetchDatabases } = useContext(GlobalContext);
  const [isOpen, setIsOpen] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDatabase, setSelectedDatabase] = useState(null); // State for selected database
  const dropdownRef = useRef(null);

  // Fetch databases from API
  const fetchDb = async () => {
    try {
      setLoading(true);
      const res = await fetchDatabases();
      console.log("API response:", res);

      // Adjust this based on your actual API response structure
      const dbData =
        res.data?.map((item) => ({
          id: item.id,
          ...item.attributes,
        })) || [];

      console.log("Processed data:", dbData);
      setDatabases(dbData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching databases:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDb();

    // Retrieve the selected database from localStorage when the component mounts
    const storedDb = localStorage.getItem("selectedDatabase");
    if (storedDb) {
      const db = JSON.parse(storedDb);
      setSelectedDatabase(db); // Set the selected database from localStorage
    }
  }, []);

  // Save the selected database to localStorage whenever it changes
  const handleDatabaseSelect = (dbId) => {
    const selectedDb = databases.find((db) => db.id === dbId);
    setSelectedDatabase(selectedDb); // Update the selected database
    localStorage.setItem("selectedDatabase", JSON.stringify(selectedDb)); // Save to localStorage
    setIsOpen(false); // Close the dropdown after selecting
  };

  const toggleDropdown = () => {
    if (!loading && !error) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            className="open-sidebar-btn cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 512 512"
              className="group-hover:text-[#f58533] text-[#242424]"
            >
              <path d="M469.333 256A21.32 21.32 0 0 1 448 277.333H115.5L228.417 390.25a21.331 21.331 0 1 1-30.167 30.167L48.917 271.083a21.324 21.324 0 0 1 0-30.166L198.25 91.583a21.331 21.331 0 1 1 30.167 30.167L115.5 234.667H448A21.32 21.32 0 0 1 469.333 256" />
            </svg>
          </button>
        </div>

        <button
          aria-label="Database"
          className="database-btn group flex cursor-pointer items-center gap-1 rounded-lg text-lg font-semibold overflow-hidden whitespace-nowrap"
          onClick={toggleDropdown}
          disabled={loading || error}
        >
          <div className="font-medium text-gray-500">
            {loading
              ? "Loading..."
              : error
              ? "Error"
              : selectedDatabase
              ? selectedDatabase.label
              : "Select Database"}
          </div>
          {!loading && !error && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="#808080"
              viewBox="0 0 24 24"
            >
              <path
                fill="#808080"
                fillRule="evenodd"
                d="M5.293 9.293a1 1 0 0 1 1.414 0L12 14.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414"
                clipRule="evenodd"
              ></path>
            </svg>
          )}
        </button>

        {isOpen && !loading && !error && (
          <ul className="absolute mt-2 w-56 bg-white border border-gray-300 shadow-lg rounded-lg p-2 max-h-70 overflow-y-auto z-50 top-7">
            {databases.length === 0 ? (
              <li className="px-4 py-2 text-sm text-gray-500">No databases available</li>
            ) : (
              databases.map((db) => (
                <li
                  key={db.id}
                  className={`px-4 py-2 hover:bg-[#f4f3ee] cursor-pointer font-medium rounded-lg ${
                    selectedDatabase?.id === db.id ? "bg-[#f4f3ee]" : ""
                  }`}
                  onClick={() => handleDatabaseSelect(db.id)}
                >
                  <span className="text-sm leading-none font-normal text-gray-700">
                    {db.label}
                  </span>
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
}
