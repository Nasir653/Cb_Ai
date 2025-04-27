"use client"
import React, { useState } from 'react';
import NestedDataTable from './datatable';

export default function DatabaseSchema() {
    const [step, setStep] = useState(1);
    const [expandedTables, setExpandedTables] = useState({});
    const [expandedColumns, setExpandedColumns] = useState({});

    const tables = [
        { name: "Users" },
        { name: "Orders" }
    ];

    const toggleTable = (tableName) => {
        setExpandedTables((prev) => {
            const newState = {
                ...prev,
                [tableName]: !prev[tableName]
            };
            return newState;
        });
    };

    const toggleColumn = (tableName, columnName) => {
        setExpandedColumns((prev) => ({
            ...prev,
            [`${tableName}-${columnName}`]: !prev[`${tableName}-${columnName}`]
        }));
    };

    return (

        <main className="relative h-full w-full flex-1 transition-width">
            <div className="h-full w-full @container/thread">
                <div role="presentation" className="composer-parent flex h-full flex-col focus-visible:outline-0">
                    <div className="flex flex-1 grow basis-auto flex-col overflow-hidden">
                        <div className="text-base my-auto mx-auto px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5 h-full overflow-y-auto items-center flex flex-col mt-1.5 md:pb-9 md:pt-9">


                            {step === 1 && (
                                <div className='mx-auto mt-0 flex h-full w-full flex-col text-base relative md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]'>
                                    <div className="bg-white md:p-8 md:px-0 pt-0 pb-5">
                                        <h1 className="text-2xl font-bold  text-[#f58533]">Database Details</h1>
                                    </div>

                                    <div className="relative w-auto">
                                        <div className="relative w-auto border border-gray-300 rounded-lg bg-white text-gray-700 text-sm hover:bg-[#ebebeb]">
                                            <select className="w-full cursor-pointer appearance-none focus:outline-none px-4 py-4">
                                                <option value="sql">SQL</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mt-6 w-full space-y-4">
                                        <div className="md:flex  space-x-2">
                                            <div className="md:w-1/2 w-full">
                                                <label className="block text-gray-700 font-medium mb-1">Host</label>
                                                <input type="text" placeholder="Enter host (e.g., localhost)" className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  text-gray-700" />
                                            </div>
                                            <div className="md:w-1/2 w-full">
                                                <label className="block text-gray-700 font-medium mb-1">Port</label>
                                                <input type="text" placeholder="Enter port (e.g., 5432)" className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  text-gray-700" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-1">Database Name</label>
                                            <input type="text" placeholder="Enter database name" className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  text-gray-700" />
                                        </div>
                                        <div className="md:flex space-x-2">
                                            <div className="md:w-1/2 w-full">
                                                <label className="block text-gray-700 font-medium mb-1">Username</label>
                                                <input type="text" placeholder="Enter username" className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  text-gray-700" />
                                            </div>
                                            <div className="md:w-1/2 w-full">
                                                <label className="block text-gray-700 font-medium mb-1">Password</label>
                                                <input type="password" placeholder="Enter password" className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none  text-gray-700" />
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-between">
                                            <div className="flex space-x-4">
                                                <button className="cursor-pointer px-4 py-2 border border-[#f58533] text-[#f58533] rounded-lg hover:bg-[#f58533] hover:text-white focus:outline-none">Test</button>
                                                <button className="cursor-pointer px-4 py-2 border border-[#f58533] text-[#f58533] rounded-lg hover:bg-[#f58533] hover:text-white focus:outline-none">Save</button>
                                            </div>
                                            <button
                                                className="cursor-pointer px-4 py-2 bg-[#f58533] text-white rounded-lg hover:bg-orange-600 focus:outline-none"
                                                onClick={() => setStep(2)}
                                            >
                                                Continue
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {step === 2 && (


                                <div className='mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 max-w-full md:max-w-3xl lg:max-w-[75rem] xl:max-w-[80rem] flex-col'>


                                    <NestedDataTable />



                                    <div className="flex justify-between">
                                        <div className="flex space-x-4">
                                            <button
                                                className="cursor-pointer px-4 py-2 border border-gray-400 text-gray-500 rounded-lg hover:bg-gray-600 hover:text-white focus:outline-none"
                                                onClick={() => setStep(1)}
                                            >
                                                Back
                                            </button>
                                            <button className="cursor-pointer px-4 py-2 border border-[#f58533] text-[#f58533] rounded-lg hover:bg-[#f58533] hover:text-white focus:outline-none">Save</button>
                                        </div>
                                        <button className="cursor-pointer px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 focus:outline-none">Generate Embedding</button>
                                    </div>

                                </div>
                            )}

                            {/* <div className='mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[70rem] xl:max-w-[75rem]'>

                                <NestedDataTable />

                            </div> */}

                        </div>
                    </div>
                </div>
            </div>
        </main>

    );
}