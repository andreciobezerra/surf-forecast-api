import { AxiosPromise, AxiosRequestConfig, AxiosResponse } from "axios";

export interface Response<T = any> extends AxiosResponse<T> {}

export interface RequestConfig extends AxiosRequestConfig {}

export interface ResponsePromise<T> extends AxiosPromise<T> {}
