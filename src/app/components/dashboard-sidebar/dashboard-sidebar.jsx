"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GlobalContext } from "../../../../provider/context";

export default function DashboardSidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { sidebarToggleBtn, FetchAllSessions, FetchSessionById, store } = useContext(GlobalContext);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [sessions, setSessions] = useState([]);
    const dropdownRef = useRef(null);

    // Load all chat sessions on mount
    useEffect(() => {
        handlerFetchSessions();
    }, []);

    const handlerFetchSessions = async () => {
        try {
            const res = await FetchAllSessions();
            if (res?.data) {
                const sorted = [...res.data].sort((a, b) =>
                    new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
                );
                setSessions(sorted);
            }
        } catch (err) {
            console.error("Failed to fetch sessions:", err);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = (index) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    const handleSessionClick = async (sessionId) => {
        try {
            router.push(`/${sessionId}`, undefined, { shallow: true });
            await FetchSessionById(sessionId);
        } catch (err) {
            console.error("Failed to fetch session by id:", err);
            router.push(pathname);
        }
    };

    const handleNewChat = () => {
        // Force a full page navigation to root with reload
        window.location.href = "/";
    };

    return (
        <div className="flex">
            <div
                className={`sidebar-bg-color transition-all duration-300 ${sidebarToggleBtn ? "w-[260px]" : "w-0 opacity-0 overflow-hidden sidebarActive"
                    }`}
            >
                <div className="h-full flex flex-col">
                    <nav className="flex h-full w-full flex-col pl-3" aria-label="Chat history">
                        {/* Logo */}
                        <div className="flex justify-between h-[80px] items-center pl-3">
                            <Image src="/images/rodic-logo.png" alt="logo" width={80} height={90} />
                        </div>

                        {/* New Chat Button */}
                        <div className="mt-5 pl-3">
                            <button
                                onClick={handleNewChat}
                                className="flex items-center gap-2 px-2 py-2 text-md font-medium hover:text-orange-500 rounded-md transition-colors duration-300"
                            >
                                New Chat
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" className="text-[#242424]">
                                    <g fill="currentColor">
                                        <path d="M16 22.75H3c-.96 0-1.75-.79-1.75-1.75V8c0-4.42 2.33-6.75 6.75-6.75h8c4.42 0 6.75 2.33 6.75 6.75v8c0 4.42-2.33 6.75-6.75 6.75m-8-20C4.42 2.75 2.75 4.42 2.75 8v13c0 .14.11.25.25.25h13c3.58 0 5.25-1.67 5.25-5.25V8c0-3.58-1.67-5.25-5.25-5.25z" />
                                        <path d="M7.95 17.75c-.47 0-.9-.17-1.22-.48-.38-.38-.55-.92-.46-1.50l.28-1.98c.06-.43.33-.98.64-1.29l5.19-5.19c1.78-1.78 3.33-.98 4.31 0 .77.77 1.12 1.58 1.04 2.39-.06.66-.41 1.28-1.04 1.92l-5.19 5.19c-.31.31-.85.58-1.29.65l-1.98.28c-.09 0-.19.01-.28.01m6.58-10c-.37 0-.7.24-1.08.61l-5.19 5.19c-.08.08-.2.33-.22.44l-.28 1.98c-.01.1 0 .19.04.23s.13.05.23.04l1.98-.28c.12-.02.36-.14.44-.22l5.19-5.19c.38-.38.58-.71.61-1.01.03-.34-.17-.74-.61-1.18-.44-.42-.79-.61-1.11-.61" />
                                        <path d="M15.42 12.58c-.07 0-.14-.01-.20-.03a5.48 5.48 0 0 1-3.77-3.77c-.13-.48.23-.93.72-.8.4.11.81.12.92.52a3.99 3.99 0 0 0 2.73 2.73.755.755 0 0 1-.2 1.48" />
                                    </g>
                                </svg>
                            </button>
                        </div>

                        {/* Conversations */}
                        <div className="mt-5 pl-3 flex-1 overflow-auto">
                            <h3 className="text-md font-medium mb-2">Conversations</h3>
                            <ol>
                                {sessions.length > 0 ? (
                                    sessions.map((session, idx) => {
                                        const { id, attributes } = session;
                                        return (
                                            <li key={id} className="group relative hover:bg-[#ebebeb] rounded-lg mb-1">
                                                <div
                                                    onClick={() => handleSessionClick(id)}
                                                    className="flex justify-between items-center p-2 h-9 text-sm rounded-lg cursor-pointer"
                                                >
                                                    <span className="truncate text-gray-700">
                                                        {attributes.label}
                                                    </span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleDropdown(idx); }}
                                                        className="hidden group-hover:flex"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" className="text-gray-500 group-hover:text-[#f58533]">
                                                            <path fill="currentColor" d="M3 12a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0m7 0a2 2 0 1 1 4 0 2 2 0 0 1-4 0" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                {dropdownOpen === idx && (
                                                    <div ref={dropdownRef} className="absolute z-10 right-3 top-10 w-40 bg-white border rounded-md shadow-lg">
                                                        <ul>
                                                            <li className="px-4 py-2 hover:bg-[#f4f3ee] cursor-pointer">Share</li>
                                                            <li className="px-4 py-2 hover:bg-[#f4f3ee] cursor-pointer">Archive</li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="text-gray-500">No conversations yet.</li>
                                )}
                            </ol>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}