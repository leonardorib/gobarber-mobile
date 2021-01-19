import axios from 'axios';

const api = axios.create({
  // Dev:http://10.0.2.2:3333
  // Prod: https://nodedeploy.leonardoribeiro.com
  baseURL: 'https://nodedeploy.leonardoribeiro.com',
});

export default api;
