import axios from 'axios'
import { message } from 'antd'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  // baseURL: '', // api的base_url
  timeout: 5000, // request timeoutheaders: { 'Content-Type': 'application/x-www-form-urlencoded' },
  transformRequest: [function(data) {
    data = qs.stringify(data)
    return data
  }]
})

// request interceptor
service.interceptors.request.use(config => {
  message.loading('网络请求中')
  return config
}, error => {
  message.info('network request error:' + error)
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    message.destroy()
    if (response.data.status !== 0) {
      if (response.data.status === 10) {
        message.warning('请先登录')
        window.location.href = '#/login'
      } else {
        message.info('网络警告:'+ response.data.msg)
      }
    }
    return response.data
  },
  error => {
    message.info('network error:'+ error.message)
    return Promise.reject(error)
  })

export default service