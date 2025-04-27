
"use client"
import React, { useState, useEffect, useRef, useContext } from 'react';
import DatabaseDropdownMenu from '@/app/database-dropdown/database-dropdown-menu';
import UserProfile from '@/app/user-profile/user-profile';
import { GlobalContext } from '../../../../provider/context';
// import { useGlobalContext } from '../../../../provider/context'

export default function Header() {
    const { toggleSidebar } = useContext(GlobalContext);

    return (
        <div>


            {/* <div className="draggable sticky top-0 z-10 flex min-h-[60px] items-center justify-center  pl-0 md:hidden  mobile-header">
                <div className="no-draggable absolute bottom-0 left-0 top-0 ml-3 inline-flex items-center justify-center">
                    <button
                        onClick={() => toggleSidebar()}
                        type="button"
                        className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white active:opacity-50"

                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlSpace="preserve"
                            width="24"
                            height="24"
                            viewBox="0 0 512 512"
                        >
                            <path
                                fill="#242424"
                                d="M469.333 256A21.32 21.32 0 0 1 448 277.333H115.5L228.417 390.25a21.331 21.331 0 1 1-30.167 30.167L48.917 271.083a21.324 21.324 0 0 1 0-30.166L198.25 91.583a21.331 21.331 0 1 1 30.167 30.167L115.5 234.667H448A21.32 21.32 0 0 1 469.333 256"
                                data-name="arrow-left-Bold"
                                data-original="#000000"
                            ></path>
                        </svg>
                    </button>

                    <span className="flex static group">
                        <button
                            aria-label="New chat"
                            className="cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30 hover:bg-[#f4f3ee] group"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                xmlSpace="preserve"
                                width="28"
                                height="28"
                                viewBox="0 0 24 24"
                                className="transition-colors duration-200 text-[#242424] group-hover:text-[#f58533]"
                            >
                                <g fill="currentColor">
                                    <path
                                        d="M16 22.75H3c-.96 0-1.75-.79-1.75-1.75V8c0-4.42 2.33-6.75 6.75-6.75h8c4.42 0 6.75 2.33 6.75 6.75v8c0 4.42-2.33 6.75-6.75 6.75m-8-20C4.42 2.75 2.75 4.42 2.75 8v13c0 .14.11.25.25.25h13c3.58 0 5.25-1.67 5.25-5.25V8c0-3.58-1.67-5.25-5.25-5.25z"
                                    ></path>
                                    <path
                                        d="M7.95 17.75c-.47 0-.9-.17-1.22-.48-.38-.38-.55-.92-.46-1.5l.28-1.98c.06-.43.33-.98.64-1.29l5.19-5.19c1.78-1.78 3.33-.98 4.31 0 .77.77 1.12 1.58 1.04 2.39-.06.66-.41 1.28-1.04 1.92l-5.19 5.19c-.31.31-.85.58-1.29.65l-1.98.28c-.09 0-.19.01-.28.01m6.58-10c-.37 0-.7.24-1.08.61l-5.19 5.19c-.08.08-.2.33-.22.44l-.28 1.98c-.01.1 0 .19.04.23s.13.05.23.04l1.98-.28c.12-.02.36-.14.44-.22l5.19-5.19c.38-.38.58-.71.61-1.01.03-.34-.17-.74-.61-1.18-.44-.42-.79-.61-1.11-.61"
                                    ></path>
                                    <path
                                        d="M15.42 12.58c-.07 0-.14-.01-.2-.03a5.48 5.48 0 0 1-3.77-3.77.76.76 0 0 1 .52-.93c.4-.11.81.12.92.52a3.99 3.99 0 0 0 2.73 2.73.755.755 0 0 1-.2 1.48"
                                    ></path>
                                </g>
                            </svg>
                        </button>

                    </span>
                </div>
                <div className="no-draggable">
                    <button
                        aria-label=""
                        type="button"
                        aria-haspopup="menu"
                        aria-expanded="false"
                        data-state="closed"
                        className="group flex cursor-pointer items-center gap-1 rounded-lg py-1.5 px-3 text-lg  font-semibold overflow-hidden whitespace-nowrap"
                    >
                        <div className="">Rodic Conversational BI <span className=""></span></div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="#ebebeb"
                            viewBox="0 0 24 24"
                        >
                            <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M5.293 9.293a1 1 0 0 1 1.414 0L12 14.586l5.293-5.293a1 1 0 1 1 1.414 1.414l-6 6a1 1 0 0 1-1.414 0l-6-6a1 1 0 0 1 0-1.414"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                    </button>
                </div>

                <div className="no-draggable absolute bottom-0 right-0 top-0 mr-3 inline-flex items-center justify-center">


                    <UserProfile />

                </div>
            </div>
            <div className="no-draggable flex w-full items-center justify-center  md:hidden"></div> */}


            {/* Desktop header */}
            <div className="dashboard-header draggable no-draggable-children top-0 p-3 flex items-center justify-between z-10 font-semibold motion-safe:transition-shadow  relative md:absolute left-0 right-0 bg-white desktop-header">
                <div className="absolute start-1/2 ltr:-translate-x-1/2 rtl:translate-x-1/2"></div>

                {/* Database dropdown */}
                <DatabaseDropdownMenu />


                {/* Profile Icon and Dropdown */}
                <UserProfile />

            </div>
        </div>




    );
}
