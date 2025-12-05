import axios from 'axios';

const ApiConfig = axios.create({
    baseURL: '/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default ApiConfig;
