"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function UserProfile() {
    const [isOpen, setIsOpen] = useState(false);
    const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Toggle dropdown menu
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleOpenChangePassword = () => {
        setIsChangePasswordOpen(true);
        setIsOpen(false); // Close the dropdown when opening the modal
    };

    const handleCloseChangePassword = () => {
        setIsChangePasswordOpen(false);
    };

    const handleOverlayClick = (event) => {
        if (event.target === event.currentTarget) {
            setIsChangePasswordOpen(false);
        }
    };

    return (
        <div>
            <div className="flex items-center gap-2 pr-1 leading-[0] relative" ref={dropdownRef}>
                <button
                    aria-label="Open Profile Menu"
                    className="cursor-pointer profile-icon flex h-10 w-10 items-center justify-center rounded-full focus-visible:outline-0"
                    type="button"
                    onClick={toggleDropdown}
                >
                    <div className="relative">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#f58533] text-white font-normal text-sm">
                            DA
                        </div>
                    </div>
                </button>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute top-10 right-4 mt-2 w-55 bg-white shadow-lg rounded-lg border border-gray-200 z-20">
                        <ul className="p-3">
                            <li
                                className="flex items-center px-4 py-3 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg"
                                onClick={handleOpenChangePassword}
                            >
                                <a href="#" className="flex items-center w-full text-gray-700 text-sm gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlSpace="preserve"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 34 34"
                                    >
                                        <g fill="#242424">
                                            <path
                                                d="M17 1c-5 0-9 4-9 9v4c-1.7 0-3 1.3-3 3v13c0 1.7 1.3 3 3 3h18c1.7 0 3-1.3 3-3V17c0-1.7-1.3-3-3-3v-4c0-5-4-9-9-9m10 16v13c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1V17c0-.6.4-1 1-1h18c.6 0 1 .4 1 1m-17-3v-4c0-3.9 3.1-7 7-7s7 3.1 7 7v4z"
                                                data-original="#000000"
                                            ></path>
                                            <path
                                                d="M17 19c-1.7 0-3 1.3-3 3 0 1.3.8 2.4 2 2.8V27c0 .6.4 1 1 1s1-.4 1-1v-2.2c1.2-.4 2-1.5 2-2.8 0-1.7-1.3-3-3-3m0 4c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1"
                                                data-original="#000000"
                                            ></path>
                                        </g>
                                    </svg>
                                    Change Password
                                </a>
                            </li>
                            <li className="flex items-center px-4 py-3 hover:bg-[#f4f3ee] cursor-pointer font-normal rounded-lg">
                                <a href="#" className="flex items-center w-full text-gray-700 text-sm gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        xmlSpace="preserve"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 512 512"
                                        className="shrink-0"
                                    >
                                        <path
                                            fill="#242424"
                                            d="M277.347 448a21.327 21.327 0 0 1-21.333 21.333h-85.333A106.79 106.79 0 0 1 64.014 362.667V149.333A106.79 106.79 0 0 1 170.681 42.667h85.333a21.333 21.333 0 0 1 0 42.666h-85.333a64.07 64.07 0 0 0-64 64v213.334a64.07 64.07 0 0 0 64 64h85.333A21.327 21.327 0 0 1 277.347 448m169.021-183.849a21.4 21.4 0 0 0-4.622-23.253l-85.315-85.315a21.331 21.331 0 1 0-30.167 30.167l48.917 48.917H213.347a21.333 21.333 0 1 0 0 42.666h161.834l-48.917 48.917a21.331 21.331 0 1 0 30.167 30.167l85.315-85.317a21.3 21.3 0 0 0 4.622-6.949"
                                            data-name="log-out-Bold"
                                            data-original="#000000"
                                        ></path>
                                    </svg>
                                    Log out
                                </a>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Change Password Modal */}
            {isChangePasswordOpen && (
                <div
                    className="fixed inset-0 bg-[rgba(0,0,0,0.6)] flex items-center justify-center z-30"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                        <button
                            onClick={handleCloseChangePassword}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>

                        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                        {/* Change Password Form Fields */}
                        <form>
                            <div className="mb-4">
                                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="currentPassword"
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                                />
                            </div>
                            <div className="flex justify-start">
                                <button type="submit" className="px-4 py-2 bg-[#f58533] hover:bg-[#d9732b] text-white rounded-md cursor-pointer">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}