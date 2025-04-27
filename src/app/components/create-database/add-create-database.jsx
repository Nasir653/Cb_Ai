
// "use client"
// import React, { useState, useEffect, useRef } from 'react';


// export default function AddCreateDatabase() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");
//     const dropdownRef = useRef(null);

//     const projects = ["Project Alpha", "Project Beta", "Project Gamma", "Project Delta"];

//     // Toggle dropdown visibility
//     const toggleDropdown = () => {
//         setIsOpen(!isOpen);
//     };

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsOpen(false);
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     return (
//         <div className="relative" ref={dropdownRef}>
//             <button
//                 onClick={toggleDropdown}
//                 className='create-database-topic cursor-pointer flex items-center justify-center h-6 rounded-full border  w-6 can-hover:hover:bg-black/5 dark:can-hover:hover:bg-white/5 min-h-8 min-w-[34px] hover:bg-[#ebebeb]'
//             >
//                 <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" className="h-[15px] w-[15px]" viewBox="0 0 24 24">
//                     <path fill="#808080" fillRule="evenodd" d="M12 3a1 1 0 0 1 1 1v7h7a1 1 0 1 1 0 2h-7v7a1 1 0 1 1-2 0v-7H4a1 1 0 1 1 0-2h7V4a1 1 0 0 1 1-1" clipRule="evenodd"></path>
//                 </svg>

//             </button>

//             {isOpen && (
//                 <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg z-10">
//                     <div className="p-3 border-b border-[#ebebeb]">
//                         <div className="flex items-center mb-2">
//                             <span className="text-sm font-semibold text-gray-700">Add to Dashboard</span>
//                         </div>

//                         <input
//                             type="text"
//                             placeholder="Create Database"
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full p-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border border-[#ebebeb]"
//                         />
//                     </div>
//                     <div className="p-3">
//                         <h3 className="text-sm font-semibold text-gray-700  mb-2">Available Dashboards</h3>
//                         <ul className="text-gray-700">
//                             {projects.filter(project => project.toLowerCase().includes(searchQuery.toLowerCase())).map((project, index) => (
//                                 <li key={index} className="px-2 py-2 hover:bg-gray-100 cursor-pointer font-normal rounded-lg">
//                                     <a href="#" className="text-sm leading-none font-normal text-gray-700 flex">
//                                         {project}
//                                     </a>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 </div>

//             )}
//         </div>
//     );
// }
