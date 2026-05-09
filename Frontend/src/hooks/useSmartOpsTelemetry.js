import { useEffect, useState } from 'react'
import { getSmartOpsSnapshot } from '../services/smartopsApi'
import { createSmartOpsSocket } from '../services/smartopsSocket'

const initialState = {
  snapshot: null,
  socketConnected: false,
  loading: true,
  error: '',
}

export const useSmartOpsTelemetry = () => {
  const [state, setState] = useState(initialState)

  useEffect(() => {
    let active = true
    const socket = createSmartOpsSocket()

    const loadSnapshot = async () => {
      try {
        const snapshot = await getSmartOpsSnapshot()
        if (!active) return
        setState((current) => ({
          ...current,
          snapshot,
          loading: false,
          error: '',
        }))
      } catch (error) {
        if (!active) return
        setState((current) => ({
          ...current,
          loading: false,
          error: error.message || 'Unable to load SmartOps telemetry.',
        }))
      }
    }

    loadSnapshot()

    socket.on('connect', () => {
      if (!active) return
      setState((current) => ({
        ...current,
        socketConnected: true,
      }))
      socket.emit('smartops:request-snapshot')
    })

    socket.on('disconnect', () => {
      if (!active) return
      setState((current) => ({
        ...current,
        socketConnected: false,
      }))
    })

    socket.on('smartops:telemetry', (snapshot) => {
      if (!active) return
      setState((current) => ({
        ...current,
        snapshot,
        loading: false,
        error: '',
      }))
    })

    return () => {
      active = false
      socket.disconnect()
    }
  }, [])

  return state
}
