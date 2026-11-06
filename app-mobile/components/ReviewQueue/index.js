import { memo, useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import DateField from '../DateField';
import EmptyState from '../EmptyState';
import FormField from '../FormField';
import StatusBadge from '../StatusBadge';
import { displayDate } from '../../services/dates';
import { parseDisplayDate } from '../../services/dateMask.cjs';
import { filterReviewReports } from '../../services/reviewQueue.cjs';
import { reportStatus, reportStatusLabel } from '../../services/reportStatus.cjs';
import { pluralize } from '../../services/text.cjs';
import styles from './styles';

const statuses = [['pending', 'Pendentes'], ['returned', 'Em correção'], ['signed', 'Assinados'], ['all', 'Todos']];

const ReviewRow = memo(function ReviewRow({ report, work, onOpen }) {
  return <Pressable accessibilityRole="button"
    accessibilityLabel={`Abrir RDO de ${work.name}, ${displayDate(report.date)}, ${reportStatusLabel(report)}`}
    onPress={() => onOpen(work, report)}
    style={({ pressed, focused }) => [styles.row, pressed && styles.pressed, focused && styles.focused]}>
    <StatusBadge status={reportStatus(report)} />
    <Text style={styles.work}>{work.name}</Text>
    <Text style={styles.meta}>{displayDate(report.date)} · {work.contract} · {report.authorName}</Text>
    <Text style={styles.summary} numberOfLines={2}>{report.activities}</Text>
  </Pressable>;
});

export default function ReviewQueue({ works, reports, filters, onFilter, onOpen, listProps }) {
  const date = parseDisplayDate(filters.date);
  const incompleteDate = Boolean(filters.date) && !date;
  const badDate = filters.date.length === 10 && !date;
  const results = useMemo(() => incompleteDate ? [] : filterReviewReports(reports, works, { ...filters, date }), [reports, works, filters, incompleteDate, date]);
  function clear() { onFilter({ ...filters, query: '', date: '' }); }

  return <FlatList {...listProps} data={results} keyExtractor={({ report }) => report.id}
    ListHeaderComponent={<View>
      <Text accessibilityRole="header" style={styles.title}>Revisão de RDOs</Text>
      <Text style={styles.intro}>Abra um registro para revisar os dados e, se estiver tudo certo, assinar.</Text>
      <View style={styles.statuses} accessibilityRole="tablist">
        {statuses.map(([status, label]) => {
          const selected = filters.status === status;
          return <Pressable key={status} onPress={() => onFilter({ ...filters, status })}
            accessibilityRole="tab" accessibilityState={{ selected }}
            style={({ pressed, focused }) => [styles.tab, selected && styles.selected, pressed && styles.pressed, focused && styles.focused]}>
            <Text maxFontSizeMultiplier={1.4} style={[styles.tabText, selected && styles.selectedText]}>{label}</Text>
          </Pressable>;
        })}
      </View>
      <FormField label="Obra ou contrato" value={filters.query} maxLength={120}
        placeholder="Buscar por nome ou número" onChangeText={(query) => onFilter({ ...filters, query })} />
      <DateField label="Data do RDO" value={filters.date} maxLength={10} hint="Deixe em branco para consultar todas as datas."
        error={badDate ? 'Informe uma data válida no formato dia/mês/ano.' : undefined}
        onChangeText={(value) => onFilter({ ...filters, date: value })} />
      {results.length && (filters.query || filters.date) ? <View style={styles.clear}>
        <ActionButton label="Limpar busca e data" secondary onPress={clear} />
      </View> : null}
      {!incompleteDate ? <Text style={styles.count} accessibilityLiveRegion="polite">{pluralize(results.length, 'RDO encontrado', 'RDOs encontrados')}</Text> : null}
    </View>}
    ListEmptyComponent={<EmptyState title={incompleteDate ? 'Complete a data' : 'Nenhum RDO encontrado'}
      message={incompleteDate ? 'Digite uma data válida ou limpe o filtro.' : filters.query || filters.date ? 'Tente outra obra ou data.' : 'Ainda não há registros neste status.'}
      actionLabel={filters.query || filters.date ? 'Limpar filtros' : 'Ver todos os status'}
      onAction={filters.query || filters.date ? clear : filters.status !== 'all' ? () => onFilter({ ...filters, status: 'all' }) : undefined} />}
    renderItem={({ item }) => <ReviewRow {...item} onOpen={onOpen} />} />;
}
