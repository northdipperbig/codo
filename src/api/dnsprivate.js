import axios from '@/libs/api.request'

export const getprivatelist = (page, limit, key, value) => {
  return axios.request({
    url: '/dns/v1/dns/private/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value
    }
  })
}

export const operationprivate = (data, meth) => {
  return axios.request({
    url: '/dns/v1/dns/private/',
    method: meth,
    data
  })
}

export const getprivatetree = () => {
  return axios.request({
    url: '/dns/v1/dns/private/tree/',
    method: 'get'
  })
}

export const handleUpdatedomain = () => {
  return axios.request({
    url: '/dns/v1/dns/private/update/domains/',
    method: 'get'

  })
}
