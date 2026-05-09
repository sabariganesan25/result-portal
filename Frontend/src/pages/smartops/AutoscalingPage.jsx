import MetricCard from '../../components/smartops/MetricCard'
import DataTable from '../../components/smartops/DataTable'
import { formatNumber, formatTimestamp } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const AutoscalingPage = () => {
  const { snapshot } = useSmartOpsContext()
  const autoscaling = snapshot?.autoscaling || {}

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard hint="Current HPA replica count from live telemetry" label="Current Replicas" value={formatNumber(autoscaling.currentReplicas, 0)} />
        <MetricCard hint="Desired HPA replica count from live telemetry" label="Desired Replicas" value={formatNumber(autoscaling.desiredReplicas, 0)} />
        <MetricCard hint="HPA resources observed in cluster" label="HPA Objects" value={autoscaling.hpas?.length ?? 0} />
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'HPA' },
          { key: 'namespace', label: 'Namespace' },
          { key: 'currentReplicas', label: 'Current' },
          { key: 'desiredReplicas', label: 'Desired' },
          { key: 'minReplicas', label: 'Min' },
          { key: 'maxReplicas', label: 'Max' },
        ]}
        rows={autoscaling.hpas || []}
        title="Horizontal Pod Autoscalers"
      />

      <DataTable
        columns={[
          { key: 'timestamp', label: 'Timestamp', render: (value) => formatTimestamp(value) },
          { key: 'reason', label: 'Reason' },
          { key: 'object', label: 'Object' },
          { key: 'message', label: 'Message' },
        ]}
        rows={autoscaling.scalingEvents || []}
        title="Scaling Events"
      />
    </div>
  )
}

export default AutoscalingPage
