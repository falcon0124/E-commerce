import axios from './api/index';

export const registerUser = (data) => {
  return axios.post('/auth/register', data);
};

export const loginUser = (data) => {
  return axios.post('/auth/login', data);
};
