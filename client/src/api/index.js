import axios from 'axios';
// axios instance
export const FETCH_WRAPPER = axios.create({
  baseURL: 'http://localhost:3001/api/',
  timeout: 5000,
  headers: {
    Accept: 'application/json',
    // The value of "Authorization" is null at the start of the application and stays null
    // throughout the whole workflow until first refresh
    Authorization: `Bearer ${sessionStorage?.getItem('authToken')}`,
  },
});
