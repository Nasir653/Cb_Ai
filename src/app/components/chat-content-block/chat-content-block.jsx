"use client";
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:1337/api',
});

export default function ChatContentBlock({ sessionId, Data }) {
    const chatEndRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [conversation, setConversation] = useState([]);
    const [copiedItem, setCopiedItem] = useState(null);
    const [responseError, setResponseError] = useState(false);
    const [waitingForResponse, setWaitingForResponse] = useState(false);

    // Set timeout for server response
    useEffect(() => {
        let timeoutId;
        if (waitingForResponse) {
            timeoutId = setTimeout(() => {
                setResponseError(true);
                setWaitingForResponse(false);
            }, 10000); // 10 seconds timeout
        }
        return () => clearTimeout(timeoutId);
    }, [waitingForResponse]);

    const copyToClipboard = (text, itemId) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedItem(itemId);
                setTimeout(() => setCopiedItem(null), 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    useEffect(() => {
        if (sessionId) {
            async function fetchChatHistory() {
                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/chat-sessions/${sessionId}?populate=*`);
                    const chatMessages = response.data.data.attributes.chat_messages.data;

                    const formattedMessages = chatMessages.map(item => ({
                        id: item.id,
                        type: item.attributes.sender_type === 'User' ? 'question' : 'answer',
                        content: item.attributes.sender_type === 'User'
                            ? { question: item.attributes.question }
                            : {
                                response: item.attributes.response,
                                sqlData: item.attributes.response?.query_sql_answer?.[0]
                            },
                        timestamp: item.attributes.createdAt
                    }));

                    setConversation(formattedMessages);
                } catch (error) {
                    console.error("Failed to fetch chat history:", error);
                    setResponseError(true);
                } finally {
                    setLoading(false);
                }
            }
            fetchChatHistory();
        }
    }, [sessionId]);

    useEffect(() => {
        if (Data) {
            setWaitingForResponse(true);
            setResponseError(false);

            setConversation(prev => [
                ...prev,
                {
                    type: 'question',
                    content: { question: Data.question },
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    }, [Data]);

    useEffect(() => {
        if (Data?.response) {
            setWaitingForResponse(false);
            setResponseError(false);

            setConversation(prev => [
                ...prev.filter(item => item.type !== 'pending'),
                {
                    type: 'answer',
                    content: {
                        response: Data,
                        sqlData: Data.query_sql_answer?.[0]
                    },
                    timestamp: new Date().toISOString()
                }
            ]);
        }
    }, [Data]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [conversation]);

    const renderAnswer = (answerData, answerId) => {
        if (!answerData) return null;

        const hasValidSQLOutput = answerData.sqlData?.executed_sql_output &&
            Array.isArray(answerData.sqlData.executed_sql_output) &&
            answerData.sqlData.executed_sql_output.length > 0;

        return (
            <div className="space-y-4">
                {/* Refined Query */}
                {answerData.response?.refined_query_list?.length > 0 && (
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="font-semibold text-lg">Refined Query</div>
                        <p>{answerData.response.refined_query_list[0]}</p>
                    </div>
                )}

                {/* SQL Query */}
                {answerData.sqlData?.generated_sql && (
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-lg">Generated SQL Query</div>
                            <button
                                onClick={() => copyToClipboard(answerData.sqlData.generated_sql, `sql-${answerId}`)}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                            >
                                {copiedItem === `sql-${answerId}` ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="mt-2 p-2 bg-gray-50 rounded">
                            <code className="text-sm">{answerData.sqlData.generated_sql}</code>
                        </div>
                    </div>
                )}

                {/* Executed SQL Output Table */}
                {hasValidSQLOutput && (
                    <div className="bg-white p-4 rounded-md border border-gray-200">
                        <div className="flex justify-between items-center">
                            <div className="font-semibold text-lg">Executed SQL Output</div>
                            <button
                                onClick={() => copyToClipboard(
                                    JSON.stringify(answerData.sqlData.executed_sql_output, null, 2),
                                    `output-${answerId}`
                                )}
                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors"
                            >
                                {copiedItem === `output-${answerId}` ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <div className="overflow-x-auto mt-2">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-100">
                                        {Object.keys(answerData.sqlData.executed_sql_output[0]).map((column, index) => (
                                            <th key={index} className="border p-2 text-left">{column}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {answerData.sqlData.executed_sql_output.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <td key={cellIndex} className="border p-2">{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Summary */}
                {answerData.response?.summary && (
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                        <div className="font-semibold text-lg">Summary</div>
                        <p>{answerData.response.summary}</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] md:pt-10 pt-0">
            <div className="flex flex-col gap-4 mx-auto w-full">
                {loading ? (
                    <div className="flex justify-center py-6">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                            <span className="text-sm text-gray-500">Loading conversation...</span>
                        </div>
                    </div>
                ) : (
                    <>
                        {conversation.map((item, index) => (
                            <div key={index} className="space-y-4">
                                {item.type === 'question' ? (
                                    <div className="ml-auto p-4 rounded-md bg-blue-50 max-w-[90%]">
                                        <div className="font-semibold text-blue-800">You</div>
                                        <p>{item.content.question}</p>
                                    </div>
                                ) : (
                                    <div className="mr-auto max-w-[90%]">
                                        {renderAnswer(item.content, item.id)}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Show error message if server doesn't respond */}
                        {responseError && (
                            <div className="mr-auto p-4 rounded-md bg-red-50 max-w-[90%] border border-red-200">
                                <div className="font-semibold text-red-800">Error</div>
                                <p>We're having trouble connecting to the server. Please try again later.</p>
                            </div>
                        )}

                        {/* Show loading indicator while waiting for response */}
                        {waitingForResponse && !responseError && (
                            <div className="mr-auto p-4 rounded-md bg-gray-50 max-w-[90%] border border-gray-200">
                                <div className="flex flex-col items-center space-y-2">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                    <span className="text-sm text-gray-500">Generating response...</span>
                                </div>
                            </div>
                        )}

                        <div ref={chatEndRef} />
                    </>
                )}
            </div>
        </div>
    );
}