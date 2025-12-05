import ApiConfig from './ApiConfig';

// Request interceptor
ApiConfig.interceptors.request.use(
    (config) => {
        // Add any auth tokens here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
ApiConfig.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle errors globally
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 400:
                    console.error('Bad Request:', data.message);
                    break;
                case 404:
                    console.error('Not Found:', data.message);
                    break;
                case 500:
                    console.error('Server Error:', data.message);
                    break;
                default:
                    console.error('Error:', data.message);
            }
        } else if (error.request) {
            console.error('Network Error: No response received');
        } else {
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

export default ApiConfig;
