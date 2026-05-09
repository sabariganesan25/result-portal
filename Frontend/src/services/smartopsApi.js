import axios from 'axios'

const baseUrl = (import.meta.env.VITE_SMARTOPS_API_URL || import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

export const getSmartOpsSnapshot = async () => {
  const response = await axios.get(`${baseUrl}/observability/snapshot`)
  return response.data?.data
}

export const refreshSmartOpsSnapshot = async () => {
  const response = await axios.post(`${baseUrl}/observability/refresh`)
  return response.data?.data
}
