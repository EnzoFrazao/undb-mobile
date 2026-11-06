import { memo, useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Calendar from '../Calendar';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import StatusBadge from '../StatusBadge';
import { displayDate } from '../../services/dates';
import { reportStatus, reportStatusLabel } from '../../services/reportStatus.cjs';
import { pluralize } from '../../services/text.cjs';
import styles from './styles';

const statuses = [['all', 'Todos'], ['pending', 'Pendentes'], ['returned', 'Em correção'], ['signed', 'Assinados']];

const ReportRow = memo(function ReportRow({ report, open }) {
  const status = reportStatus(report);
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir relatório de ${displayDate(report.date)}, ${reportStatusLabel(report)}`}
    onPress={() => open(report)} style={({ pressed, focused }) => [styles.reportRow, pressed && styles.pressed, focused && styles.focused]}>
    <View style={styles.dateBlock}><Text style={styles.dateDay}>{report.date.slice(8)}</Text><Text style={styles.dateMonth}>{displayDate(report.date).slice(3)}</Text></View>
    <View style={styles.reportCopy}>
      <StatusBadge status={status} />
      <Text numberOfLines={2} style={styles.rowDescription}>{report.activities}</Text>
      <Text style={styles.small}>{pluralize(report.photos.length, 'foto', 'fotos')} · Avanço {report.progress.toLocaleString('pt-BR')}%</Text>
    </View>
    <Icon name="next" active />
  </Pressable>;
});

export default function WorkHistory({ work, reports, selectedDate, setSelectedDate, status, setStatus, activeUser, onNew, onEdit, onReport, onClear, listProps }) {
  const results = useMemo(() => reports.filter((report) => (!selectedDate || report.date === selectedDate)
    && (status === 'all' || reportStatus(report) === status)), [reports, selectedDate, status]);
  const filtered = Boolean(selectedDate) || status !== 'all';
  return <FlatList {...listProps} data={results} keyExtractor={(item) => item.id}
    ListHeaderComponent={<View>
      <Text style={styles.subtitle}>{work.address}</Text>
      {activeUser.role !== 'client' ? <View style={styles.primaryAction}><ActionButton label="Novo RDO" onPress={onNew} /></View> : null}
      {activeUser.role === 'owner' ? <View style={styles.primaryAction}><ActionButton label="Gerenciar pessoas da obra" secondary onPress={onEdit} /></View> : null}
      <Text accessibilityRole="header" style={styles.section}>Histórico da obra</Text>
      <Calendar reports={reports} selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      <View style={styles.statuses} accessibilityRole="tablist">
        {statuses.map(([value, label]) => <Pressable key={value} accessibilityRole="tab" accessibilityState={{ selected: status === value }}
          onPress={() => setStatus(value)} style={({ focused, pressed }) => [styles.status, status === value && styles.selected, focused && styles.focused, pressed && styles.pressed]}>
          <Text maxFontSizeMultiplier={1.4} style={styles.statusLabel}>{label}</Text>
        </Pressable>)}
      </View>
      {selectedDate ? <View style={styles.filter}><Text style={styles.body}>{displayDate(selectedDate)}</Text>
        <ActionButton label="Limpar data" secondary onPress={() => setSelectedDate('')} /></View> : null}
    </View>}
    ListEmptyComponent={<EmptyState title={filtered ? 'Nenhum RDO neste filtro' : 'Nenhum RDO enviado'}
      message={filtered ? 'Escolha outra data ou situação.' : 'Os relatórios aparecerão aqui após o envio.'}
      actionLabel={filtered ? 'Limpar filtros' : 'Novo RDO'} onAction={filtered ? onClear : activeUser.role !== 'client' ? onNew : undefined} />}
    renderItem={({ item }) => <ReportRow report={item} open={onReport} />} />;
}
