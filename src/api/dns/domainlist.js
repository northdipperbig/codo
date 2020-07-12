import axios from '@/libs/api.request'

export const getdomainlist = (page, limit, key, value) => {
  return axios.request({
    url: '/dns/v1/dns/domains/',
    method: 'get',
    params: {
      page,
      limit,
      key,
      value
    }
  })
}

export const getdomaindetaillist = (dname) => {
  return axios.request({
    url: '/dns/v1/dns/domains/detail/',
    method: 'get',
    params: {
      dname
    }
  })
}

export const operationdomains = (data, meth) => {
  return axios.request({
    url: '/dns/v1/dns/domains/',
    method: meth,
    data
  })
}
