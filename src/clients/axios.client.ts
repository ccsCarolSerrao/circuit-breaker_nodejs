import axios from 'axios';
import { isSuccessStatusCode } from '@helpers/customError';

const axiosInstance = axios.create({
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const isTimeOutError = (error: any) => error.code && error.code === 'ECONNABORTED';

axiosInstance.interceptors.request.use(
    async (request) => {
        logRequest(request);

        return request;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    async (response) => {
        logResponse(response);

        return response;
    },
    (error) => {
        const response = isTimeOutError(error) ? error : error.response;
        logResponse(response);

        return Promise.reject(error);
    }
);

const logRequest = (request: any) => {
    const method = request.method?.toUpperCase();
    const url = request.url;
    const payload = request.data;

    console.info(`${method} ${url}`, {
        url: url,
        method: method,
        statusType: 'request',
        payload,
        params: request.params,
    });
};

const logResponse = (response: any) => {
    const method = response.config?.method.toUpperCase();
    const url = response.config?.url;
    const payload = response.data;
    const statusCode = response.status;

    console.info(`${method} ${url}`, {
        url,
        method,
        isSuccessStatusCode: isSuccessStatusCode(statusCode),
        statusCode,
        statusType: 'response',
        payload,
    });
};

export default axiosInstance;
