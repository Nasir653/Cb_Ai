"use client";
import React, { useState, useEffect, useRef } from 'react';
import SearchOtherTools from '../search-other-tools/search-other-tools';
import { useGlobalContext } from '../../../provider/context';

export default function ChatForm({ initialPosition = 'bottom' }) {
    const { store, questionResponse } = useGlobalContext();
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(initialPosition);
    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200
            )}px`;
        }
    }, [userInput]);

    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendRequest();
        }
    };

    const sendRequest = async () => {
        const storedDb = localStorage.getItem("selectedDatabase");
        const storedModel = localStorage.getItem("selectedTool");

        if (!storedDb || !storedModel || !userInput) {
            setError("Please select a database, model, and enter your query.");
            return;
        }

        const selectedDatabase = JSON.parse(storedDb);
        const selectedModel = JSON.parse(storedModel);

        try {
            await questionResponse({
                user: 1,
                database: selectedDatabase.id,
                aiModel: selectedModel,
                question: userInput,
                sessionId: store.currentSessionId
            });
            setUserInput("");
            setError(null);
            setPosition('bottom');
            if (textareaRef.current) {
                textareaRef.current.style.height = '40px';
            }
        } catch (err) {
            setError("Failed to send the request.");
        }
    };

    return (
        <div className={`w-full max-w-3xl mx-auto ${position === 'center' ?
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]' :
            'fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200'}`}
        >
            <div className='mx-auto w-full px-4 py-3'>
                {position === 'center' && (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-gray-800 mb-2">What can I help with?</h2>
                        <p className="text-gray-500">Ask me anything about projects in Bihar</p>
                    </div>
                )}

                {error && (
                    <div className="mb-2 text-red-500 text-sm">{error}</div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); sendRequest(); }}>
                    <div className={`relative flex w-full flex-col rounded-lg border border-gray-300 px-3 py-1 bg-white ${position === 'center' ? 'shadow-lg' : ''}`}>
                        <div className="flex min-h-[44px] items-start pl-1">
                            <div className="min-w-0 max-w-full flex-1">
                                <div className="max-h-[25dvh] max-h-52 overflow-auto [scrollbar-width:thin]">
                                    <textarea
                                        ref={textareaRef}
                                        className="focus:outline-none block w-full resize-none border-0 bg-transparent px-0 py-2 placeholder:text-gray-400 max-h-[200px]"
                                        placeholder="Ask anything"
                                        value={userInput}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        style={{ minHeight: '40px' }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-2 mt-1 flex items-center justify-between">
                            <div className="flex gap-x-1.5">
                                <SearchOtherTools />
                            </div>

                            <div className="flex gap-x-1.5">
                                <button
                                    type="submit"
                                    aria-label="Chat send"
                                    className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors bg-[#f4f3ee] hover:bg-[#dadada]`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 404.644 404.644"
                                        className={`text-gray-500 group-hover:text-[#f58533]`}
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

                {position === 'center' && (
                    <div className="text-center mt-4 text-xs text-gray-400">
                        <span>GPT-4o (openai)</span>
                    </div>
                )}
            </div>
        </div>
    );
}