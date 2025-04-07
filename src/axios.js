const axios = require('axios');

var initializedAxios = false;

const startTimeInterceptor = (config) => {
  config.metadata = { startTime: new Date()}
  return config;
}

const endTimeInterceptor = (response) => {
  response.config.metadata.endTime = new Date()
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime
  return response;
}

const timeInterceptorError = (error) => {
  if(!! error?.config?.metadata?.startTime) {
    error.config.metadata.endTime = new Date();
    error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  }
  return Promise.reject(error);
}

/**
 * Configure interceptors to request/response and save duration time
 * 
 * @returns {object} axios with interceptors configured
 */
const initAxios = () => {
  if(!!initializedAxios) return axios;

  axios.interceptors.request.use(startTimeInterceptor, timeInterceptorError);
  axios.interceptors.response.use(endTimeInterceptor, timeInterceptorError);

  initializedAxios = true;

  return axios;
}

module.exports = {initAxios};