import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

axios.interceptors.request.use(function (config) {
  config.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');
  return config;
}, function (error) {
  return Promise.reject(error);
});
