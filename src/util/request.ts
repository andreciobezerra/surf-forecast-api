import axios, { AxiosError, AxiosStatic } from "axios";
import { RequestConfig, Response, ResponsePromise } from "@src/interfaces/request";

export class Request {
  private request: AxiosStatic;

  constructor(request = axios) {
    this.request = request;
  }

  public get<T>(url: string, config: RequestConfig = {}): ResponsePromise<T> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError(error: AxiosError): boolean {
    return !!(error.response && error.response.status);
  }
}
