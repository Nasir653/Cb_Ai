"use client";
import React, { useState, useEffect } from 'react';
import ChatForm from '../search-form/chat-form';
import ChatContentBlock from '../chat-content-block/chat-content-block';
import { useGlobalContext } from '../../../provider/context';

export default function MainContent() {
    const { store } = useGlobalContext();
    const [hasMessages, setHasMessages] = useState(false);
    const [userQuestion, setUserQuestion] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [formPosition, setFormPosition] = useState('center');
    const [isNewChat, setIsNewChat] = useState(true);

    // Reset form position when conversation is empty (new chat)
    useEffect(() => {
        const newIsNewChat = store.conversation.length === 0 && !userQuestion && !isProcessing;
        setIsNewChat(newIsNewChat);

        if (newIsNewChat) {
            setFormPosition('center');
            setHasMessages(false);
        } else {
            setFormPosition('bottom');
        }
    }, [store.conversation.length, userQuestion, isProcessing]);

    return (
        <div className='relative flex h-full max-w-full flex-1 flex-col overflow-hidden'>
            <main className="relative h-full w-full flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-y-auto w-full">
                    <div className={`text-base mx-auto px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5 h-full overflow-y-auto flex flex-col ${isNewChat ? 'justify-center' : ''}`}>
                        <ChatContentBlock
                            onHasMessagesChange={setHasMessages}
                            userQuestion={userQuestion}
                            isProcessing={isProcessing}
                        />
                    </div>
                </div>
                <div className="w-full bg-white">
                    <div className="mx-auto md:max-w-3xl lg:max-w-[47rem] xl:max-w-[55rem] pb-5">
                        <ChatForm
                            key={store.conversation.length} // Force re-render on new chat
                            initialPosition={formPosition}
                            setUserQuestion={setUserQuestion}
                            setIsProcessing={setIsProcessing}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}