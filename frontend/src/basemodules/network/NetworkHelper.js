import ApiConfig from './ApiConfig';

const NetworkHelper = {
    get: async (url, config = {}) => {
        const response = await ApiConfig.get(url, config);
        return response.data;
    },

    post: async (url, data, config = {}) => {
        const response = await ApiConfig.post(url, data, config);
        return response.data;
    },

    put: async (url, data, config = {}) => {
        const response = await ApiConfig.put(url, data, config);
        return response.data;
    },

    delete: async (url, config = {}) => {
        const response = await ApiConfig.delete(url, config);
        return response.data;
    },
};

export default NetworkHelper;
