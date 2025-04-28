"use client";
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../../provider/context';

export default function ChatContentBlock({ onHasMessagesChange }) {
    const { store, loading } = useGlobalContext();
    const [copiedItem, setCopiedItem] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage] = useState(10);

    useEffect(() => {
        onHasMessagesChange(store.conversation.length > 0);
    }, [store.conversation.length, onHasMessagesChange]);

    const copyToClipboard = (text, itemId) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setCopiedItem(itemId);
                setTimeout(() => setCopiedItem(null), 2000);
            })
            .catch(err => console.error('Failed to copy:', err));
    };

    const renderSQLTable = (data, answerId) => {
        if (!data || data.length === 0) return null;

        const indexOfLastRow = currentPage * rowsPerPage;
        const indexOfFirstRow = indexOfLastRow - rowsPerPage;
        const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
        const totalPages = Math.ceil(data.length / rowsPerPage);

        const paginate = (pageNumber) => setCurrentPage(pageNumber);

        // Determine column types by sampling first row
        const columnTypes = {};
        if (data.length > 0) {
            Object.keys(data[0]).forEach(key => {
                const value = data[0][key];
                if (!isNaN(Date.parse(value))) {
                    columnTypes[key] = 'date';
                } else if (typeof value === 'number') {
                    columnTypes[key] = 'number';
                } else {
                    columnTypes[key] = 'text';
                }
            });
        }

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-blue-600 to-blue-800">
                            <tr>
                                {Object.keys(data[0]).map((column, index) => (
                                    <th
                                        key={index}
                                        className="px-6 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
                                    >
                                        {column}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {currentRows.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
                                >
                                    {Object.entries(row).map(([key, cell], cellIndex) => {
                                        let cellContent = cell;
                                        let cellClass = 'px-6 py-4 whitespace-nowrap text-sm ';

                                        if (columnTypes[key] === 'date') {
                                            cellClass += 'text-gray-600 font-mono';
                                        } else if (columnTypes[key] === 'number') {
                                            cellClass += 'text-right font-medium text-gray-900';
                                        } else {
                                            // Highlight special values
                                            if (typeof cell === 'string') {
                                                if (cell.toLowerCase() === 'sole') {
                                                    cellClass += 'text-green-600 font-bold';
                                                } else if (cell.toLowerCase() === 'jv') {
                                                    cellClass += 'text-blue-600 font-bold';
                                                } else if (cell.toLowerCase() === 'select') {
                                                    cellClass += 'text-purple-600 font-bold';
                                                } else if (['transport', 'aviation', 'energy'].includes(cell.toLowerCase())) {
                                                    cellClass += 'text-orange-600 font-medium';
                                                } else {
                                                    cellClass += 'text-gray-700';
                                                }
                                            }
                                        }

                                        return (
                                            <td key={cellIndex} className={cellClass}>
                                                {cellContent}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data.length > rowsPerPage && (
                    <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
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
                                        onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                                        <button
                                            key={number}
                                            onClick={() => paginate(number)}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    >
                                        Next
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

    const renderAnswer = (answerData, answerId) => {
        if (!answerData?.response) return null;

        const response = answerData.response;
        const sqlData = response.query_sql_answer?.[0];
        const hasValidSQLOutput = sqlData?.executed_sql_output?.length > 0;

        return (
            <div className="space-y-4">
                {response.refined_query_list?.length > 0 && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center mb-3">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                            <h3 className="text-lg font-semibold text-gray-800">Refined Query</h3>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-md">
                            <code className="text-gray-700 font-mono">{response.refined_query_list[0]}</code>
                        </div>
                    </div>
                )}

                {sqlData?.generated_sql && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-800">Generated SQL Query</h3>
                            </div>
                            <button
                                onClick={() => copyToClipboard(sqlData.generated_sql, `sql-${answerId}`)}
                                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                {copiedItem === `sql-${answerId}` ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="mt-2 p-4 bg-gray-50 rounded-md overflow-x-auto">
                            <pre className="text-sm text-gray-800 font-mono">{sqlData.generated_sql}</pre>
                        </div>
                    </div>
                )}

                {hasValidSQLOutput && (
                    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <h3 className="text-lg font-semibold text-gray-800">Executed SQL Output</h3>
                            </div>
                            <button
                                onClick={() => copyToClipboard(
                                    JSON.stringify(sqlData.executed_sql_output, null, 2),
                                    `output-${answerId}`
                                )}
                                className="flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 transition-colors text-sm"
                            >
                                {copiedItem === `output-${answerId}` ? (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Copied
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                                        </svg>
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        {renderSQLTable(sqlData.executed_sql_output, answerId)}
                    </div>
                )}

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
        );
    };

    return (
        <div className="mx-auto flex flex-1 text-base gap-4 md:gap-5 lg:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem] w-full">
            <div className="flex flex-col gap-4 mx-auto w-full">
                {loading && store.conversation.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative w-16 h-16">
                                <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin"></div>
                                <div className="absolute inset-2 rounded-full border-4 border-orange-400 border-b-transparent animate-spin-reverse"></div>
                            </div>
                            <span className="text-gray-600 font-medium">Generating response...</span>
                        </div>
                    </div>
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
                                        <div className="flex items-end mb-1">
                                            <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold mr-2">
                                                AI
                                            </div>
                                            <span className="text-xs text-gray-500">Assistant</span>
                                        </div>
                                        <div className="bg-white p-5 rounded-tr-xl rounded-bl-xl rounded-br-xl shadow-sm border border-gray-200">
                                            {renderAnswer(item.content, item.id)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}