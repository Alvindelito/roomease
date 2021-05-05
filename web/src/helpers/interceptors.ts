import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { clearToken, getNewToken } from './tokenStorage';

const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  if (config.url?.includes('/api')) {
    config.headers['Authorization'] = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`;
    config.withCredentials = true;
  }

  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  if (error?.response?.status === 403 || error?.response?.status === 401) {
    // logout user if token refresh didn't work
    if (error.config.url?.includes('/token')) {
      clearToken();
      return new Promise((resolve, reject) => {
        reject(error);
      });
    }

    // try request again with new token
    return getNewToken().then((token): any => {
      const config = error.config;

      return new Promise((resolve, reject) => {
        axios
          .request(config)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    });
  } else {
    return new Promise((resolve, reject) => {
      console.log('hittin that thing');
      reject(error);
    });
  }
};

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}
