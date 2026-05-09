import { io } from 'socket.io-client'

const apiUrl = import.meta.env.VITE_SMARTOPS_API_URL || import.meta.env.VITE_API_URL
let derivedSocketUrl

if (apiUrl) {
  try {
    derivedSocketUrl = new URL(apiUrl).origin
  } catch (error) {
    derivedSocketUrl = undefined
  }
}

const socketUrl = import.meta.env.VITE_SMARTOPS_SOCKET_URL || derivedSocketUrl

export const createSmartOpsSocket = () => io(socketUrl, {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
  withCredentials: true,
})
