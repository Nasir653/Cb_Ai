"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../../../provider/context';

export default function ChatForm({ initialPosition = 'center', setUserQuestion, setIsProcessing }) {
    const { store, questionResponse } = useGlobalContext();
    const [userInput, setUserInput] = useState("");
    const [error, setError] = useState(null);
    const [position, setPosition] = useState(initialPosition);
    const [isSending, setIsSending] = useState(false);
    const textareaRef = useRef(null);

    const sanitizeInput = (input) => {
        // Basic sanitization - remove leading/trailing whitespace and multiple spaces
        return input.trim().replace(/\s+/g, ' ');
    };

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
        const sanitizedInput = sanitizeInput(userInput);
        if (!sanitizedInput) {
            setError("Please enter a valid message");
            return;
        }

        const storedDb = localStorage.getItem("selectedDatabase");
        const storedModel = localStorage.getItem("selectedTool");

        if (!storedDb || !storedModel) {
            setError("Please select a database and model");
            return;
        }

        const selectedDatabase = JSON.parse(storedDb);
        const selectedModel = JSON.parse(storedModel);

        setIsSending(true);
        setUserQuestion(sanitizedInput);
        setIsProcessing(true);

        try {
            await questionResponse({
                user: 1,
                database: selectedDatabase.id,
                aiModel: selectedModel,
                question: sanitizedInput,
                sessionId: store.currentSessionId
            });

            // Reset form after successful send
            setUserInput("");
            setError(null);
            setPosition('bottom');
            if (textareaRef.current) {
                textareaRef.current.style.height = '40px';
            }
        } catch (err) {
            setError("Failed to send the request");
        } finally {
            setIsSending(false);
            setIsProcessing(false);
        }
    };

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(
                textareaRef.current.scrollHeight,
                200
            )}px`;
        }
    }, [userInput]);

    // Reset position when initialPosition changes
    useEffect(() => {
        setPosition(initialPosition);
    }, [initialPosition]);

    return (
        <div className={`w-full transition-all duration-300 ${position === 'center' ?
            'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%]' :
            'relative bottom-0 left-0 right-0 z-40 bg-white'}`}
        >
            <div className='mx-auto w-full'>
                {position === 'center' && (
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-medium text-gray-800 mb-2">A! Assistant</h2>
                        <div className="text-xs text-gray-400">
                            <span>GPT-4o (openai)</span>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-2 text-red-500 text-sm text-center">{error}</div>
                )}

                <form onSubmit={(e) => { e.preventDefault(); sendRequest(); }}>
                    <div className={`relative flex w-full flex-col rounded-xl border border-gray-200 px-3 py-2 bg-white ${position === 'center' ? 'shadow-lg' : ''}`}>
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
                                        disabled={isSending}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-1 mt-1 flex items-center justify-between">
                            <div className="flex gap-x-1.5">
                                {/* Additional tools can go here */}
                            </div>

                            <div className="flex gap-x-1.5">
                                <button
                                    type="submit"
                                    aria-label="Send message"
                                    disabled={isSending || !userInput.trim()}
                                    className={`cursor-pointer relative flex h-9 w-9 items-center justify-center rounded-full ${isSending || !userInput.trim() ? 'bg-gray-200' : 'bg-[#6E45E2] hover:bg-[#5D3AC1]'} text-white transition-colors focus-visible:outline-none focus-visible:outline-black disabled:text-gray-50 disabled:opacity-30`}
                                >
                                    {isSending ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <line x1="22" y1="2" x2="11" y2="13"></line>
                                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}