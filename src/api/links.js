import axios from '@/libs/api.request'

export const getlinkslist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/links/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const newlinks = (data) => {
    return axios.request({
        url: '/mg/v2/links/',
        method: 'post',
        data
    })
}

export const dellinks = (data) => {
    return axios.request({
        url: '/mg/v2/links/',
        method: 'delete',
        data
    })
}

export const updatelinks = (data) => {
    return axios.request({
        url: '/mg/v2/linksr/',
        method: 'put',
        data
    })
}

export const patchlinks = (data) => {
    return axios.request({
        url: '/mg/v2/links/',
        method: 'patch',
        data
    })
}

    // role
export const getlinksgrouplist = (page, limit, key, value) => {
    return axios.request({
        url: '/mg/v2/links/groups/',
        method: 'get',
        params: {
            page,
            limit,
            key,
            value
        }
    })
}

export const getUserByGroup = (groupId) => {
    return axios.request({
        url: '/mg/v2/links/groups/',
        method: 'get',
        params: {
            groupid: groupId
        }
    })
}

export const newlinksgroup = (data) => {
	return axios.request({
        url: '/mg/v2/links/groups/',
        method: 'post',
        data
    })
}

export const dellinksgroup = (data) => {
    return axios.request({
        url: '/mg/v2/links/groups/',
        method: 'delete',
        data
    })
}

export const updatelinksgroup = (data) => {
    return axios.request({
        url: '/mg/v2/linksr/groups/',
        method: 'put',
        data
    })
}

export const patchlinksgroup = (data) => {
    return axios.request({
        url: '/mg/v2/links/groups/',
        method: 'patch',
        data
    })
}