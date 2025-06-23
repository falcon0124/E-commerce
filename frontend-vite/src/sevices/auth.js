import axios from './api/index'; 

export const registerUser = async (formData) => {
  const response = await axios.post('/auth/register', formData);
  return response.data;
};
