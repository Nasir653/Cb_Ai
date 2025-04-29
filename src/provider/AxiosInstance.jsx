// utils/api.js
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://15.207.186.88:1337/api',
    timeout: 30000, // 30 seconds timeout
    headers: {
        'Content-Type': 'application/json'
    }
});
