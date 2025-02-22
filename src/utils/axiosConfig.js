const axios = require('axios');
const axiosRetry = require('axios-retry').default;

axiosRetry(axios, {
    retries: 2,
    retryDelay: (retryCount) => {
        return retryCount * 500;
    },
    retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response.status >= 500;
    }
});

module.exports = axios;