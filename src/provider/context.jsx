"use client";
import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "./AxiosInstance";



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

    // Fetch all sessions sorted by createdAt (newest first)
    const fetchAllSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/chat-sessions?sort=createdAt:desc');
            setStore(prev => ({ ...prev, allSessions: data?.data || [] }));
            return data;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDatabases = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/databases');
            setStore(prev => ({ ...prev, databases: data?.data || [] }));
            return data;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchModels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get('/ai-models');
            setStore(prev => ({ ...prev, models: data?.data || [] }));
            return data;
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSessionById = useCallback(async (sessionId) => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await api.get(`/chat-sessions/${sessionId}?populate=*`);

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
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [router]);

    const questionResponse = useCallback(async (data) => {
        try {
            setLoading(true);
            setError(null);
            const { data: response } = await api.post('/AskQuestions', data);

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
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [fetchAllSessions, fetchSessionById]);

    const deleteSession = useCallback(async (sessionId) => {
        try {
            setLoading(true);
            setError(null);
            await api.delete(`/chat-sessions/${sessionId}`);
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
            setError(error.response?.data?.message || error.message);
            throw error;
        } finally {
            setLoading(false);
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
            try {
                setLoading(true);
                await Promise.all([
                    fetchDatabases(),
                    fetchModels(),
                    fetchAllSessions()
                ]);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
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