import axios from 'axios';

type dataType = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

export const registerCall = async (data: dataType) => {
  try {
    const res = await axios.post(`http://localhost:3009/register`, data);
    if (res) return Promise.resolve(res);
  } catch (err) {
    return Promise.reject(err);
  }
};
