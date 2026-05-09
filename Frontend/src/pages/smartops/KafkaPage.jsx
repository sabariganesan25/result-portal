import DataTable from '../../components/smartops/DataTable'
import StatusBadge from '../../components/smartops/StatusBadge'
import { formatTimestamp } from '../../components/smartops/smartopsFormatters'
import { useSmartOpsContext } from './useSmartOpsContext'

const KafkaPage = () => {
  const { snapshot } = useSmartOpsContext()
  const kafka = snapshot?.kafka || {}
  const topicRows = (kafka.topics || []).map((topic) => ({
    id: topic,
    topic,
    eventCount: kafka.eventCounts?.[topic] || 0,
    consumerLag: kafka.consumerLag?.[topic] ?? 'N/A',
  }))

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Kafka Status</div>
          <div className="mt-4"><StatusBadge status={kafka.connected ? 'CONNECTED' : 'DISCONNECTED'} /></div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Topics</div>
          <div className="mt-4 font-['Space_Grotesk'] text-3xl font-semibold text-white">{(kafka.topics || []).length}</div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Throughput / min</div>
          <div className="mt-4 font-['Space_Grotesk'] text-3xl font-semibold text-white">{kafka.throughputPerMinute ?? 0}</div>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500">Brokers</div>
          <div className="mt-4 text-sm text-slate-300">{(kafka.brokers || []).join(', ') || 'Not configured'}</div>
        </div>
      </div>

      <DataTable
        columns={[
          { key: 'topic', label: 'Topic' },
          { key: 'eventCount', label: 'Event Count' },
          { key: 'consumerLag', label: 'Consumer Lag' },
        ]}
        rows={topicRows}
        title="Kafka Topic Activity"
      />

      <DataTable
        columns={[
          { key: 'timestamp', label: 'Timestamp', render: (value) => formatTimestamp(value) },
          { key: 'topic', label: 'Topic' },
          { key: 'partition', label: 'Partition' },
          { key: 'offset', label: 'Offset' },
          { key: 'value', label: 'Payload' },
        ]}
        rows={(kafka.recentMessages || []).map((message) => ({
          ...message,
          timestamp: message.timestamp,
          value: message.value?.slice(0, 140) || '',
        }))}
        title="Recent Kafka Messages"
      />
    </div>
  )
}

export default KafkaPage
