"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const router = useRouter();
    const [store, setStore] = useState({
        databases: [],
        models: [],
        currentResponse: null,
        allSessions: [],
        currentSession: null,
        currentSessionId: null,
        conversation: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sidebarToggleBtn, setSideToggleBtn] = useState(true);

    const toggleSidebar = () => setSideToggleBtn(!sidebarToggleBtn);

    const apiCall = async (url, method = 'get', data = null) => {
        try {
            setLoading(true);
            const response = await axios({
                method,
                url: `http://localhost:1337/api${url}`,
                data
            });
            return response.data;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fetch all sessions sorted by createdAt (newest first)
    const fetchAllSessions = useCallback(async () => {
        const data = await apiCall('/chat-sessions?sort=createdAt:desc');
        setStore(prev => ({ ...prev, allSessions: data?.data || [] }));
        return data;
    }, []);

    const fetchDatabases = useCallback(async () => {
        const data = await apiCall('/databases');
        setStore(prev => ({ ...prev, databases: data?.data || [] }));
        return data;
    }, []);

    const fetchModels = useCallback(async () => {
        const data = await apiCall('/ai-models');
        setStore(prev => ({ ...prev, models: data?.data || [] }));
        return data;
    }, []);

    const fetchSessionById = useCallback(async (sessionId) => {
        const data = await apiCall(`/chat-sessions/${sessionId}?populate=*`);

        const formattedMessages = data.data?.attributes?.chat_messages?.data?.map(item => ({
            id: item.id,
            type: item.attributes.sender_type === 'User' ? 'question' : 'answer',
            content: item.attributes.sender_type === 'User'
                ? { question: item.attributes.question }
                : { response: item.attributes.response },
            timestamp: item.attributes.createdAt
        })) || [];

        setStore(prev => ({
            ...prev,
            currentSession: data.data,
            currentSessionId: sessionId,
            conversation: formattedMessages
        }));

        router.push(`/?sessionId=${sessionId}`, { shallow: true });
        return data;
    }, [router]);

    const questionResponse = useCallback(async (data) => {
        const response = await apiCall('/AskQuestions', 'post', data);

        if (!data.sessionId) {
            await fetchAllSessions();
            if (response.data?.sessionId) {
                await fetchSessionById(response.data.sessionId);
            }
        }

        setStore(prev => ({
            ...prev,
            currentResponse: response.data,
            conversation: [
                ...prev.conversation,
                { type: 'question', content: { question: data.question }, timestamp: new Date().toISOString() },
                { type: 'answer', content: { response: response.data }, timestamp: new Date().toISOString() }
            ]
        }));

        return response;
    }, [fetchAllSessions, fetchSessionById]);


    // Add this method to your context provider
    const deleteSession = useCallback(async (sessionId) => {
        try {
            await apiCall(`/chat-sessions/${sessionId}`, 'delete');
            setStore(prev => ({
                ...prev,
                allSessions: prev.allSessions.filter(s => s.id !== sessionId),
                ...(prev.currentSessionId === sessionId ? {
                    currentSessionId: null,
                    currentSession: null,
                    conversation: []
                } : {})
            }));
            return true;
        } catch (error) {
            console.error("Error deleting session:", error);
            throw error;
        }
    }, []);



    const createNewSession = useCallback(async () => {
        router.push('/');
        setStore(prev => ({
            ...prev,
            currentSessionId: null,
            currentSession: null,
            conversation: []
        }));
    }, [router]);

    // Initialize data
    useEffect(() => {
        const initialize = async () => {
            await Promise.all([
                fetchDatabases(),
                fetchModels(),
                fetchAllSessions()
            ]);
        };
        initialize();
    }, [fetchDatabases, fetchModels, fetchAllSessions]);

    return (
        <GlobalContext.Provider
            value={{
                store,
                loading,
                error,
                sidebarToggleBtn,
                toggleSidebar,
                fetchDatabases,
                fetchModels,
                questionResponse,
                fetchAllSessions,
                fetchSessionById,
                createNewSession,
                deleteSession
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobal must be used within a GlobalContextProvider');
    }
    return context;
};