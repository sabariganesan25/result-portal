import LiveLogViewer from '../../components/smartops/LiveLogViewer'
import { useSmartOpsContext } from './useSmartOpsContext'

const LogsPage = () => {
  const { snapshot } = useSmartOpsContext()

  return <LiveLogViewer logs={snapshot?.logs || []} />
}

export default LogsPage
