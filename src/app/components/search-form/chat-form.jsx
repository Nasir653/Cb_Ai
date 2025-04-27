"use client";

import React, { useState, useEffect, useContext } from 'react';
import SearchOtherTools from '../search-other-tools/search-other-tools';
import { GlobalContext } from '../../../../provider/context';

export default function ChatForm({ onChatDataChange, onSessionUpdate, sessionId }) {
    const { fetchDatabases, fetchModels, QuestionResponse } = useContext(GlobalContext);
    const [databases, setDatabases] = useState([]);
    const [models, setModels] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dbResponse = await fetchDatabases();
                const dbData = dbResponse.data?.map((item) => ({
                    id: item.id,
                    label: item.label,
                })) || [];
                setDatabases(dbData);

                const modelResponse = await fetchModels();
                const modelData = modelResponse.data?.map((item) => ({
                    id: item.id,
                    label: item.label,
                })) || [];
                setModels(modelData);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const sendRequest = async () => {
        const storedDb = localStorage.getItem("selectedDatabase");
        const storedModel = localStorage.getItem("selectedTool");

        if (!storedDb || !storedModel || !userInput) {
            alert("Please select a database, model, and enter your query.");
            return;
        }

        const selectedDatabase = JSON.parse(storedDb);
        const selectedModel = JSON.parse(storedModel);

        setLoading(true);
        try {
            const res = await QuestionResponse({
                user: 1,
                database: selectedDatabase.id,
                aiModel: selectedModel,
                question: userInput,
                sessionId: sessionId
            });

            if (onChatDataChange) onChatDataChange(res.data);
            if (onSessionUpdate) await onSessionUpdate();

            setUserInput("");
        } catch (err) {
            setError("Failed to send the request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200'>
            <div className='mx-auto w-full max-w-3xl px-4 py-3'>
                {loading && (
                    <div className="flex justify-center mb-2">
                        <div className="flex space-x-1.5">
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); sendRequest(); }}>
                    <div className="relative flex w-full flex-col rounded-lg border border-gray-300 px-3 py-1 bg-white">
                        <div className="flex min-h-[44px] items-start pl-1">
                            <div className="min-w-0 max-w-full flex-1">
                                <div className="max-h-[25dvh] max-h-52 overflow-auto [scrollbar-width:thin]">
                                    <textarea
                                        className="focus:outline-none block h-10 w-full resize-none border-0 bg-transparent px-0 py-2 placeholder:text-gray-400"
                                        placeholder="Ask anything"
                                        value={userInput}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 mt-1 flex items-center justify-between">
                            <div className="flex gap-x-1.5">
                                <SearchOtherTools disabled={loading} />
                            </div>

                            <div className="flex gap-x-1.5">
                                <button
                                    type="submit"
                                    aria-label="Chat send"
                                    className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${loading ? 'bg-gray-200' : 'bg-[#f4f3ee] hover:bg-[#dadada]'
                                        }`}
                                    disabled={loading}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 404.644 404.644"
                                        className={`transition-colors ${loading ? 'text-gray-400' : 'text-gray-500 group-hover:text-[#f58533]'
                                            }`}
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M5.535 386.177c-3.325 15.279 8.406 21.747 19.291 16.867l367.885-188.638h.037c4.388-2.475 6.936-6.935 6.936-12.08 0-5.148-2.548-9.611-6.936-12.085h-.037L24.826 1.6C13.941-3.281 2.21 3.189 5.535 18.469c.225 1.035 21.974 97.914 33.799 150.603l192.042 33.253-192.042 33.249C27.509 288.26 5.759 385.141 5.535 386.177"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}