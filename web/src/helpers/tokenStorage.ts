import axios, { AxiosResponse } from 'axios';

const storeToken = (token: string) => {
  localStorage.setItem('accessToken', token);
};

const getToken = () => {
  return localStorage.getItem('accessToken');
};

const clearToken = () => {
  localStorage.removeItem('accessToken');
};

const getNewToken = (): Promise<AxiosResponse<string>> => {
  return new Promise((resolve, reject) => {
    axios
      .post('http://localhost:4000/token', {}, { withCredentials: true })
      .then((response) => {
        storeToken(response.data.accessToken);

        resolve(response.data.token);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export { storeToken, getToken, clearToken, getNewToken };
