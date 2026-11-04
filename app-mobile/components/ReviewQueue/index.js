import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import FormField from '../FormField';
import { displayDate } from '../../services/dates';
import { filterReviewReports, validReviewDate } from '../../services/reviewQueue.cjs';
import { reportStatusLabel } from '../../services/reportStatus.cjs';
import styles from './styles';

const statuses = [['pending', 'Pendentes'], ['returned', 'Em correção'], ['signed', 'Assinados'], ['all', 'Todos']];
const pageSize = 20;

export default function ReviewQueue({ works, reports, filters, onFilter, onOpen }) {
  const [limit, setLimit] = useState(pageSize);
  const results = filterReviewReports(reports, works, filters);
  const incompleteDate = Boolean(filters.date) && filters.date.length < 10;
  const badDate = filters.date.length === 10 && !validReviewDate(filters.date);
  function update(next) {
    setLimit(pageSize);
    onFilter(next);
  }

  return <View>
    <Text accessibilityRole="header" style={styles.title}>Revisão de RDOs</Text>
    <Text style={styles.intro}>Abra um registro para revisar os dados e, se estiver tudo certo, assinar.</Text>
    <View style={styles.statuses} accessibilityRole="tablist">
      {statuses.map(([status, label]) => {
        const selected = filters.status === status;
        return <Pressable key={status} onPress={() => update({ ...filters, status })}
          accessibilityRole="tab" accessibilityState={{ selected }}
          style={({ pressed, focused }) => [styles.tab, selected && styles.selected, pressed && styles.pressed, focused && styles.focused]}>
          <Text style={[styles.tabText, selected && styles.selectedText]}>{label}</Text>
        </Pressable>;
      })}
    </View>
    <FormField label="Obra ou contrato" value={filters.query} maxLength={120}
      placeholder="Buscar por nome ou número" onChangeText={(query) => update({ ...filters, query })} />
    <FormField label="Data do RDO" value={filters.date} maxLength={10} placeholder="AAAA-MM-DD"
      hint="Deixe em branco para consultar todas as datas."
      error={badDate ? 'Informe uma data válida no formato AAAA-MM-DD.' : undefined}
      onChangeText={(date) => update({ ...filters, date })} />
    {filters.query || filters.date ? <View style={styles.clear}>
      <ActionButton label="Limpar busca e data" secondary onPress={() => update({ ...filters, query: '', date: '' })} />
    </View> : null}
    {!incompleteDate && !badDate ? <Text style={styles.count} accessibilityLiveRegion="polite">{results.length === 1 ? '1 RDO encontrado' : `${results.length} RDOs encontrados`}</Text> : null}
    {incompleteDate || badDate ? <Text style={styles.empty}>Complete a data ou limpe o filtro para consultar os RDOs.</Text> : results.length === 0 ? <Text style={styles.empty}>
      {filters.query || filters.date ? 'Nenhum RDO corresponde aos filtros. Tente outra obra ou data.'
        : filters.status === 'pending' ? 'Não há RDOs aguardando revisão. Use Assinados para consultar os concluídos.'
          : 'Ainda não há registros neste status.'}
    </Text> : results.slice(0, limit).map(({ report, work }) => (
      <Pressable key={report.id} accessibilityRole="button"
        accessibilityLabel={`Abrir RDO de ${work.name}, ${displayDate(report.date)}, ${reportStatusLabel(report)}`}
        onPress={() => onOpen(work, report)}
        style={({ pressed, focused }) => [styles.row, pressed && styles.pressed, focused && styles.focused]}>
        <Text style={styles.meta}>{displayDate(report.date)} · {reportStatusLabel(report)}</Text>
        <Text style={styles.work}>{work.name}</Text>
        <Text style={styles.meta}>{work.contract} · {report.authorName}</Text>
        <Text style={styles.summary} numberOfLines={2}>{report.activities}</Text>
      </Pressable>
    ))}
    {results.length > limit ? <View style={styles.more}>
      <ActionButton label="Mostrar mais RDOs" secondary onPress={() => setLimit(limit + pageSize)} />
    </View> : null}
  </View>;
}
