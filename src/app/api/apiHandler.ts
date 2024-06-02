import axios, { AxiosResponse } from "axios";
import { CRYPTO_COMPARE_API_URI } from "../constants";

export const httpGet = async <TResponse, TRequest = Record<string, unknown>>(
    relativeUrl: string,
    data?: TRequest
): Promise<AxiosResponse<TResponse>> => {
    return axios.get<TResponse>(`${CRYPTO_COMPARE_API_URI}${relativeUrl}`, {
        params: data,
    });
};