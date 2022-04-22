/* eslint-disable no-param-reassign */
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from '@clients/axios.client';
import { HttpRequestException } from '@helpers/customError/exceptions/httpRequest.exception';
import { isSuccessStatusCode } from '@helpers/customError';

type Body = string | object | ArrayBuffer | ArrayBufferView;

export class BaseApi {
    public async get<TResult = any>(baseUrl: string, path: string, params?: AxiosRequestConfig): Promise<AxiosResponse<TResult, any>> {
        params = params ?? {};

        const response = await axios.get(`${baseUrl}${path}`, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response.data;
    }

    public async put<TResult = any>(baseUrl: string, path: string, body?: Body, params?: AxiosRequestConfig): Promise<AxiosResponse<TResult, any>> {
        params = params ?? {};

        const response = await axios.put(`${baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response;
    }

    public async post<TResult = any>(baseUrl: string, path: string, body?: Body, params?: AxiosRequestConfig): Promise<AxiosResponse<TResult, any>> {
        params = params ?? {};

        const response = await axios.post(`${baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response;
    }

    public async patch<TResult = any>(baseUrl: string, path: string, body?: Body, params?: AxiosRequestConfig): Promise<AxiosResponse<TResult, any>> {
        params = params ?? {};

        const response = await axios.patch(`${baseUrl}${path}`, body, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response;
    }

    public async delete<TResult = any>(baseUrl: string, path: string, params?: AxiosRequestConfig): Promise<AxiosResponse<TResult, any>> {
        params = params ?? {};

        const response = await axios.delete(`${baseUrl}${path}`, params);

        if (!isSuccessStatusCode(response.status)) {
            throw new HttpRequestException(response.status, response.config?.url as string);
        }

        return response;
    }
}
