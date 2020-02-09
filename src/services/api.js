import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com/users/pmtavares',
});

export default api;