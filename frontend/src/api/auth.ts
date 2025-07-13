import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

/**
 * User signup
 */
export const signup = async (name: string, email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/signup`, {
    name,
    email,
    password,
  });

  return response.data;
};

/**
 * User login
 */
export const login = async (email: string, password: string) => {
  const response = await axios.post(`${API_URL}/auth/login`, {
    email,
    password,
  });

  return response.data;
};
