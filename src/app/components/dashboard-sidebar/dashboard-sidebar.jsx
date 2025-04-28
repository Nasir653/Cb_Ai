"use client";
import { useGlobalContext } from '../../../provider/context';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';

export default function DashboardSidebar() {
    const router = useRouter();
    const {
        store,
        fetchAllSessions,
        fetchSessionById,
        createNewSession,
        loading,
        sidebarToggleBtn
    } = useGlobalContext();

    const [dropdownOpen, setDropdownOpen] = useState(null);
    const dropdownRef = useRef(null);
    const buttonRefs = useRef([]);

    useEffect(() => {
        fetchAllSessions();
    }, [fetchAllSessions]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleNewChat = async () => {
        try {
            await createNewSession();
        } catch (error) {
            console.error("Failed to create new session:", error);
        }
    };

    const handleSessionClick = async (sessionId) => {
        try {
            await fetchSessionById(sessionId);
        } catch (error) {
            console.error("Failed to load session:", error);
        }
    };

    const deleteSession = async (sessionId, index) => {
        try {
            await axios.delete(`http://localhost:1337/api/chat-sessions/${sessionId}`);
            fetchAllSessions(); // Refresh the list
            if (store.currentSessionId === sessionId) {
                await createNewSession();
            }
            setDropdownOpen(null);
        } catch (error) {
            console.error("Failed to delete session:", error);
        }
    };

    const toggleDropdown = (index, sessionId) => {
        setDropdownOpen(dropdownOpen === index ? null : index);
    };

    return (
        <div className="flex">
            <div className={`sidebar-bg-color transition-all duration-300 ${sidebarToggleBtn ? "w-[260px]" : "w-0 opacity-0 overflow-hidden sidebarActive"
                }`}>
                <div className="h-full flex flex-col">
                    <nav className="flex h-full w-full flex-col px-3" aria-label="Chat history">
                        {/* Logo */}
                        <div className="flex justify-between h-[80px] items-center">
                            <Image
                                src="/images/rodic-logo.png"
                                alt="logo"
                                width={80}
                                height={90}
                                className="object-contain"
                            />
                        </div>

                        {/* New Chat Button */}
                        <div className="mt-4 mb-2">
                            <button
                                onClick={handleNewChat}
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 transition-all"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="12" y1="5" x2="12" y2="19"></line>
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                New Chat
                            </button>
                        </div>

                        {/* Conversations List */}
                        <div className="flex-1 overflow-y-auto">
                            <h3 className="text-md font-medium mb-2 sticky top-0 bg-white py-2 z-10">
                                Conversations
                            </h3>

                            {loading && !store.allSessions.length ? (
                                <div className="flex justify-center py-2">
                                    <div className="animate-pulse text-gray-500">
                                        Loading sessions...
                                    </div>
                                </div>
                            ) : (
                                <ol className="space-y-1">
                                    {store.allSessions.map((session, idx) => {
                                        const { id, attributes } = session;
                                        return (
                                            <li
                                                key={id}
                                                className={`group relative rounded-lg transition-colors ${store.currentSessionId === id
                                                    ? 'bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div
                                                    onClick={() => handleSessionClick(id)}
                                                    className="flex items-center justify-between p-3 cursor-pointer"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-medium truncate ${store.currentSessionId === id
                                                            ? 'text-orange-700'
                                                            : 'text-gray-700'
                                                            }`}>
                                                            {attributes.label || `Session ${idx + 1}`}
                                                        </p>
                                                    </div>
                                                    <button
                                                        ref={el => buttonRefs.current[idx] = el}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleDropdown(idx, id);
                                                        }}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-gray-200 transition-all"
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width="16"
                                                            height="16"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        >
                                                            <circle cx="12" cy="12" r="1"></circle>
                                                            <circle cx="12" cy="5" r="1"></circle>
                                                            <circle cx="12" cy="19" r="1"></circle>
                                                        </svg>
                                                    </button>
                                                </div>

                                                {dropdownOpen === idx && (
                                                    <div
                                                        ref={dropdownRef}
                                                        className="absolute z-50 bg-white rounded-md shadow-lg border border-gray-200 py-1"
                                                        style={{
                                                            right: '1rem',
                                                            top: `${buttonRefs.current[idx]?.offsetTop + buttonRefs.current[idx]?.offsetHeight}px`,
                                                            minWidth: '120px'
                                                        }}
                                                    >
                                                        <ul>
                                                            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                                Rename
                                                            </li>
                                                            <li className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                                                Share
                                                            </li>
                                                            <li
                                                                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                                                                onClick={() => deleteSession(id, idx)}
                                                            >
                                                                Delete
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
}