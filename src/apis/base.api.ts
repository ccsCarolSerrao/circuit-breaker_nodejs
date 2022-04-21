/* eslint-disable no-param-reassign */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from '@clients/axios';
import { HttpRequestException } from '@helpers/customError/exceptions/httpRequest.exception';
import { isSuccessStatusCode } from '@helpers/customError';

type Body = string | object | ArrayBuffer | ArrayBufferView;

class BaseApi {
    constructor(protected baseUrl: string) {}

    public async get<TResult = any, R = AxiosResponse<TResult>>(path: string, params?: AxiosRequestConfig): Promise<R> {
        params = params ?? {};

        const response = await axios.get(`${this.baseUrl}${path}`, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response as any;
    }

    public async put<TResult = any, R = AxiosResponse<TResult>>(path: string, body?: Body, params?: AxiosRequestConfig): Promise<R> {
        params = params ?? {};

        const response = await axios.put(`${this.baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response as any;
    }

    public async post<TResult = any, R = AxiosResponse<TResult>>(path: string, body?: Body, params?: AxiosRequestConfig): Promise<R> {
        params = params ?? {};

        const response = await axios.post(`${this.baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response as any;
    }

    public async patch<TResult = any, R = AxiosResponse<TResult>>(path: string, body?: Body, params?: AxiosRequestConfig): Promise<R> {
        params = params ?? {};

        const response = await axios.patch(`${this.baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response as any;
    }

    public async delete<TResult = any, R = AxiosResponse<TResult>>(path: string, params?: AxiosRequestConfig): Promise<R> {
        params = params ?? {};

        const response = await axios.delete(`${this.baseUrl}${path}`, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response as any;
    }
}

export default BaseApi;
