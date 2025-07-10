import axios from 'axios';

// 创建axios实例
const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  // timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 例如：添加token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 如果是FormData格式，不设置Content-Type，让浏览器自动设置
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }
    
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 如果是blob类型，直接返回数据
    if (response.config.responseType === 'blob') {
      return response.data;
    }
    
    // 其他情况返回响应的data部分
    const res = response.data;
    return res;
  },
  error => {
    // 对响应错误做点什么
    console.error('请求错误:', error);
    if (error.response) {
      // 服务器返回了错误状态码
      const { status } = error.response;
      if (status === 401) {
        // 未授权，可能是token过期
        localStorage.removeItem('token');
        // 可以在这里添加跳转到登录页的逻辑
      }
    }
    return Promise.reject(error);
  }
);

// 封装GET请求
export const get = (url, params = {}, config = {}) => {
  return instance({
    method: 'get',
    url,
    params,
    ...config
  });
};

// 封装POST请求
export const post = (url, data = {}, config = {}) => {
  return instance({
    method: 'post',
    url,
    data,
    ...config
  });
};

// 封装PUT请求
export const put = (url, data = {}, config = {}) => {
  return instance({
    method: 'put',
    url,
    data,
    ...config
  });
};

// 封装DELETE请求
export const del = (url, params = {}, config = {}) => {
  return instance({
    method: 'delete',
    url,
    params,
    ...config
  });
};

// 导出axios实例
export default instance; 