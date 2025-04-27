"use client";
import React, { useState, useEffect } from 'react';
import ChatForm from '../search-form/chat-form';
import ChatContentBlock from '../chat-content-block/chat-content-block';
import { useSearchParams } from 'next/navigation';

export default function MainContent() {
    // Fetch sessionId from query params dynamically
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('sessionId');

    // State to hold chat data
    const [chatData, setChatData] = useState('');

    // Reset chatData when sessionId changes
    useEffect(() => {
        setChatData(''); // Clear chat data
    }, [sessionId]);

    // Function to handle chat data change
    const handleChatDataChange = (data) => {
        setChatData(data); // Update chat data
    };

    return (
        <div className='relative flex h-full max-w-full flex-1 flex-col overflow-hidden'>
            <main className="relative h-full w-full flex-1 transition-width">
                <div className="h-full w-full @container/thread">
                    <div role="presentation" className="composer-parent flex h-full flex-col focus-visible:outline-0">
                        <div className="flex flex-1 grow basis-auto flex-col overflow-hidden">
                            <div className="text-base my-auto mx-auto px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5 h-full overflow-y-auto items-center flex flex-col mt-1.5 md:pb-9 md:pt-9">
                                {/* Pass sessionId and chatData to the ChatContentBlock */}
                                <ChatContentBlock sessionId={sessionId} Data={chatData} />
                                {/* Chat form to submit new messages */}
                                <ChatForm onChatDataChange={handleChatDataChange} sessionId={sessionId} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
