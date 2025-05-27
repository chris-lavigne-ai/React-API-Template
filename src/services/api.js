import axios from 'axios';

const api = axios.create({
  baseURL: process.env.SCRIBE_API_URL,
  headers: {
    Accept: 'application/json',
    'X-Authorization': process.env.SCRIBE_AUTH_TOKEN,  // ← match Postman
  },
});

export default api;
