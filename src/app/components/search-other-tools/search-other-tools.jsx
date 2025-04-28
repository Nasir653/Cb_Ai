"use client";

import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../../../provider/context';

export default function SearchOtherTools() {

    const { fetchModels } = useContext(GlobalContext);

    const [models, setModels] = useState([]);  // Store models
    const [selectedTool, setSelectedTool] = useState('');  // State for selected tool

    // Fetch models from API
    const Models = async () => {
        try {
            const res = await fetchModels();
            console.log("API response:", res);

            // Extract and process model data
            const modelData = res.data?.map((item) => ({
                id: item.id,
                ...item.attributes,
            })) || [];

            console.log("Processed models:", modelData);
            setModels(modelData);  // Set the models in state
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    };

    useEffect(() => {
        Models();
    }, []);

    // Retrieve selected model from localStorage if available
    useEffect(() => {
        const storedTool = localStorage.getItem('selectedTool');
        if (storedTool) {
            setSelectedTool(storedTool);  // Set selected tool from localStorage
        }
    }, []);

    // Save selected model to localStorage whenever it changes
    const handleSelectChange = (event) => {
        const selectedId = event.target.value;
        setSelectedTool(selectedId);
        localStorage.setItem('selectedTool', selectedId);  // Save to localStorage
    };

    return (
        <div className="relative w-auto">
            <div className="relative">
                <select
                    className="w-auto px-4 py-2 border border-gray-300 rounded-full text-gray-500 bg-white focus:outline-none hover:bg-[#f4f3ee] appearance-none pr-8 text-sm cursor-pointer custom-select"
                    value={selectedTool}
                    onChange={handleSelectChange}
                >
                    <option value="">Select a tool</option>
                    {models.length > 0 ? (
                        models.map((model) => (
                            <option key={model.id} value={model.id}>
                                {model.label} ({model.platform})  {/* Display label and platform */}
                            </option>
                        ))
                    ) : (
                        <option value="">No tools available</option>
                    )}
                </select>

                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>

            </div>
        </div>
    );
}
