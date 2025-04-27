"use client";
import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js
// or: import { useNavigate } from "react-router-dom"; // For React Router

export const GlobalContext = createContext();

export const GlobalContextProvider = ({ children }) => {
    const [sidebarToggleBtn, setSideToggleBtn] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter(); // For Next.js
    // const navigate = useNavigate(); // For React Router

    const [store, setStore] = useState({
        databases: [],
        models: [],
        Response: [],
        AllSessions: [],
        SessionById: null // Changed to null for better initial state
    });

    const toggleSidebar = () => {
        setSideToggleBtn(!sidebarToggleBtn);
    };

    const fetchDatabases = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:1337/api/databases');

            setStore(prevState => ({
                ...prevState,
                databases: response.data?.data || []
            }));

            return response.data;
        } catch (error) {
            setError(error.message);
            console.error("Error fetching databases:", error);
            throw new Error("Something went wrong! Please try again");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchModels = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get('http://localhost:1337/api/ai-models');

            setStore(prevState => ({
                ...prevState,
                models: response.data?.data || []
            }));

            return response.data;
        } catch (error) {
            setError(error.message);
            console.error("Error fetching models:", error);
            throw new Error("No models available at this time! Please try again");
        } finally {
            setLoading(false);
        }
    }, []);

    const QuestionResponse = useCallback(async (data) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.post('http://localhost:1337/api/AskQuestions', data);

            setStore(prevState => ({
                ...prevState,
                Response: response.data?.data || []
            }));

            return response.data;
        } catch (error) {
            setError(error.message);
            console.error("Error getting response:", error);
            throw new Error("Failed to get response. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const FetchAllSessions = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get("http://localhost:1337/api/chat-sessions");

            setStore(prevState => ({
                ...prevState,
                AllSessions: res.data?.data || []
            }));

            return res.data;
        } catch (error) {
            setError(error.message);
            console.error("Error fetching sessions:", error);
            throw new Error("Failed to load sessions. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    const FetchSessionById = useCallback(async (sessionId) => {
        try {
            setLoading(true);
            setError(null);
            const res = await axios.get(
                `http://localhost:1337/api/chat-sessions/${sessionId}?populate=*`
            );

            setStore(prevState => ({
                ...prevState,
                SessionById: res.data?.data || null
            }));

            // Update URL without page refresh
            router.push(`/?sessionId=${sessionId}`, { shallow: true });

            // For React Router: navigate(`/sessions/${sessionId}`, { replace: true });

            return res.data;
        } catch (error) {
            setError(error.message);
            console.error("Error fetching session:", error);
            throw new Error("Session not found or unavailable");
        } finally {
            setLoading(false);
        }
    }, [router]); // Add navigate if using React Router

    // Initialize data
    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchDatabases(),
                    fetchModels(),
                    FetchAllSessions()
                ]);
            } catch (error) {
                console.error("Initialization error:", error);
            }
        };

        initializeData();
    }, [fetchDatabases, fetchModels, FetchAllSessions]);

    return (
        <GlobalContext.Provider
            value={{
                store,
                toggleSidebar,
                sidebarToggleBtn,
                fetchDatabases,
                fetchModels,
                QuestionResponse,
                FetchAllSessions,
                FetchSessionById,
                loading,
                error,
                setStore // Added for flexibility
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};