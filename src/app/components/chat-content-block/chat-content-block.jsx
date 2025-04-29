"use client";
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../provider/context';

export default function ChatContentBlock({ onHasMessagesChange, userQuestion, isProcessing }) {
    const { store, loading } = useGlobalContext();
    const [copiedItem, setCopiedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const [displayedQuestions, setDisplayedQuestions] = useState([]);

    useEffect(() => {
        onHasMessagesChange(store.conversation.length > 0 || userQuestion.length > 0);
    }, [store.conversation.length, userQuestion, onHasMessagesChange]);

    useEffect(() => {
        if (isProcessing && userQuestion) {
            setDisplayedQuestions(prev => [...prev, {
                id: Date.now(),
                content: userQuestion,
                isProcessing: true
            }]);

            const timer = setTimeout(() => {
                setShowTypingIndicator(true);
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setShowTypingIndicator(false);
        }
    }, [isProcessing, userQuestion]);

    useEffect(() => {
        if (store.conversation.length > 0) {
            setDisplayedQuestions(prev => prev.filter(q => !q.isProcessing));
        }
    }, [store.conversation]);

    const copyToClipboard = (text, itemId) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedItem(itemId);
                setTimeout(() => setCopiedItem(null), 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const renderSQLTable = (data, answerId) => {
        if (!data || data.length === 0) return (
            <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-500">No data available</p>
            </div>
        );

        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
        const totalPages = Math.ceil(data.length / rowsPerPage);

        const paginate = (pageNumber) => setCurrentPage(pageNumber);

        const columns = data.length > 0 ? Object.keys(data[0]) : [];

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentRows.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {columns.map((column) => (
                                        <td
                                            key={`${rowIndex}-${column}`}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                        >
                                            {row[column] !== null && row[column] !== undefined
                                                ? String(row[column])
                                                : 'NULL'}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {totalPages > 1 && (
                    <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => paginate(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstRow + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastRow, data.length)}
                                    </span>{' '}
                                    of <span className="font-medium">{data.length}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => paginate(1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">First</span>
                                        &laquo;
                                    </button>
                                    <button
                                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &lsaquo;
                                    </button>
                                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = i + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = currentPage - 2 + i;
                                        }

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => paginate(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNum
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Next</span>
                                        &rsaquo;
                                    </button>
                                    <button
                                        onClick={() => paginate(totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        <span className="sr-only">Last</span>
                                        &raquo;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const renderAIResponseHeader = () => {
        return (
            <div className="flex items-center mb-3">
                <div className="relative w-10 h-10 mr-3">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center animate-gradient-rotate">
                        <svg
                            className="h-6 w-6 text-white animate-float"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M9 9H9.01M15 9H15.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M17 7L19 5M19 5L21 3M19 5L17 3M19 5L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="absolute inset-0 rounded-full border-2 border-[#2563EB] opacity-0 animate-ping-slow"></div>
                </div>
                <span className="text-sm font-semibold bg-gradient-to-r from-[#2563EB] to-[#7C3AED] bg-clip-text text-transparent">
                    A2 AI Assistant
                </span>

                <style jsx>{`
                    @keyframes gradient-rotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    @keyframes ping-slow {
                        0% { transform: scale(0.8); opacity: 0.8; }
                        70%, 100% { transform: scale(1.3); opacity: 0; }
                    }
                    .animate-gradient-rotate {
                        animation: gradient-rotate 8s linear infinite;
                    }
                    .animate-float {
                        animation: float 3s ease-in-out infinite;
                    }
                    .animate-ping-slow {
                        animation: ping-slow 2s cubic-bezier(0,0,0.2,1) infinite;
                    }
                `}</style>
            </div>
        );
    };

    const renderAnswer = (answerData, answerId) => {
        if (!answerData?.response) return null;

        const response = answerData.response;
        const sqlData = response.query_sql_answer?.[0];
        const hasValidSQLOutput = sqlData?.executed_sql_output && Array.isArray(sqlData.executed_sql_output) && sqlData.executed_sql_output.length > 0;

        return (
            <div className="mr-auto max-w-[90%]">
                {renderAIResponseHeader()}
                <div className="space-y-4">
                    {response.refined_query_list?.length > 0 && (
                        <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                            <div className="bg-gray-50 p-4 rounded-md">
                                <code className="text-gray-700 font-mono">{response.refined_query_list[0]}</code>
                            </div>
                        </div>
                    )}

                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-800">Executed SQL Output</h3>
                            </div>
                            {hasValidSQLOutput && (
                                <button
                                    onClick={() => copyToClipboard(
                                        JSON.stringify(sqlData.executed_sql_output, null, 2),
                                        `output-${answerId}`
                                    )}
                                    className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                                >
                                    {copiedItem === `output-${answerId}` ? 'Copied' : 'Copy'}
                                </button>
                            )}
                        </div>
                        {hasValidSQLOutput ? (
                            renderSQLTable(sqlData.executed_sql_output, answerId)
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-md">
                                <p className="text-gray-500">No data available from the SQL query</p>
                            </div>
                        )}
                    </div>

                    {response.summary && (
                        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                            <div className="flex items-center mb-3">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-800">Summary</h3>
                            </div>
                            <p className="text-gray-700">{response.summary}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderTypingIndicator = () => {
        return (
            <div className="mr-auto max-w-[90%]">
                <div className="flex items-center mb-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center text-white shadow-md animate-gradient-pulse">
                        <svg
                            className="h-5 w-5 animate-float"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                                fill="white"
                            />
                            <path
                                d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-[#FF6B6B] ml-2">AI Assistant</span>
                </div>

                <div className="flex items-center">
                    <div className="flex space-x-1.5 mr-3">
                        <div className="w-2.5 h-2.5 bg-[#FF6B6B] rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#FF6B6B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Just a second...</span>
                </div>

                <style jsx>{`
                    @keyframes gradient-pulse {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    .animate-gradient-pulse {
                        background-size: 200% 200%;
                        animation: gradient-pulse 3s ease infinite;
                    }
                    .animate-float {
                        animation: float 2s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    };

    const renderLoadingIndicator = () => {
        return (
            <div className="mr-auto max-w-[90%]">
                <div className="flex items-center mb-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center text-white shadow-md animate-gradient-pulse">
                        <svg
                            className="h-5 w-5 animate-float"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                                fill="white"
                            />
                            <path
                                d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14M9 9H9.01M15 9H15.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <span className="text-xs font-medium text-[#FF6B6B] ml-2">AI Assistant</span>
                </div>

                <div className="flex items-center">
                    <div className="flex space-x-1.5 mr-3">
                        <div className="w-2.5 h-2.5 bg-[#FF6B6B] rounded-full animate-bounce"></div>
                        <div className="w-2.5 h-2.5 bg-[#4ECDC4] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2.5 h-2.5 bg-[#FF6B6B] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">Just a second...</span>
                </div>

                <style jsx>{`
                    @keyframes gradient-pulse {
                        0%, 100% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-3px); }
                    }
                    .animate-gradient-pulse {
                        background-size: 200% 200%;
                        animation: gradient-pulse 3s ease infinite;
                    }
                    .animate-float {
                        animation: float 2s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    };

    return (
        <div className="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[47rem] xl:max-w-[55rem] md:pt-10 pt-0 w-full">
            <div className="flex flex-col gap-4 mx-auto w-full">
                {loading && store.conversation.length === 0 ? (
                    renderLoadingIndicator()
                ) : (
                    <>
                        {store.conversation.map((item, index) => (
                            <div key={index} className="space-y-4">
                                {item.type === 'question' ? (
                                    <div className="ml-auto max-w-[90%]">
                                        <div className="flex items-end justify-end mb-1">
                                            <span className="text-xs text-gray-500 mr-2">You</span>
                                            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                                U
                                            </div>
                                        </div>
                                        <div className="bg-blue-600 text-white p-4 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-sm">
                                            <p>{item.content.question}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mr-auto max-w-[90%]">
                                        <div className="bg-white">
                                            {renderAnswer(item.content, item.id)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {displayedQuestions.map((question) => (
                            <div key={question.id} className="space-y-4">
                                <div className="ml-auto max-w-[90%]">
                                    <div className="flex items-end justify-end mb-1">
                                        <span className="text-xs text-gray-500 mr-2">You</span>
                                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                            U
                                        </div>
                                    </div>
                                    <div className="bg-blue-600 text-white p-4 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-sm">
                                        <p>{question.content}</p>
                                    </div>
                                </div>
                                {question.isProcessing && renderTypingIndicator()}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}