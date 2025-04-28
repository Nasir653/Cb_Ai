"use client";
import React, { useState } from 'react';
import ChatForm from '../search-form/chat-form';
import ChatContentBlock from '../chat-content-block/chat-content-block';

export default function MainContent() {
    const [hasMessages, setHasMessages] = useState(false);

    return (
        <div className='relative flex h-full max-w-full flex-1 flex-col overflow-hidden'>
            <main className="relative h-full w-full flex-1 transition-width">
                <div className="h-full w-full @container/thread">
                    <div role="presentation" className="composer-parent flex h-full flex-col focus-visible:outline-0">
                        <div className="flex flex-1 grow basis-auto flex-col overflow-hidden">
                            <div className={`text-base my-auto mx-auto px-3 md:px-4 w-full md:px-5 lg:px-4 xl:px-5 h-full overflow-y-auto items-center flex flex-col ${hasMessages ? 'md:pb-9 md:pt-9' : ''}`}>
                                <ChatContentBlock onHasMessagesChange={setHasMessages} />
                                <ChatForm initialPosition={!hasMessages ? 'center' : 'bottom'} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}