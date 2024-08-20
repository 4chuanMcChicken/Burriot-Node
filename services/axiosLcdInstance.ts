import axios from 'axios';

const axiosLcdInstance = axios.create({
  baseURL: 'https://terra-classic-lcd.publicnode.com/', // 设置基础URL
  timeout: 10000, // 请求超时时间
});

// 设置请求拦截器
axiosLcdInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 设置响应拦截器
axiosLcdInstance.interceptors.response.use(
  (response) => {
    return response; // 正常的响应直接返回
  },
  (error) => {
    // 处理响应错误：记录错误的状态码和状态文本
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error:',
        error.response?.status,
        error.response?.statusText,
      );
    } else {
      console.error('Unknown error:', error);
    }
    return Promise.reject(error); // 继续抛出错误，以便在具体调用中进行进一步处理
  },
);

export default axiosLcdInstance;
