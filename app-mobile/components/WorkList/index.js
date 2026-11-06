import { memo, useMemo } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import EmptyState from '../EmptyState';
import Icon from '../Icon';
import SearchField from '../SearchField';
import { displayDate } from '../../services/dates';
import { normalizeText, pluralize } from '../../services/text.cjs';
import styles from './styles';

const WorkRow = memo(function WorkRow({ work, lastDate, open, selected }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`Abrir ${work.name}`}
    accessibilityState={{ selected }} onPress={() => open(work)}
    style={({ pressed, focused }) => [styles.workRow, selected && styles.selected, pressed && styles.pressed, focused && styles.focused]}>
    <View style={styles.workTop}>
      <Text style={styles.contract}>{work.contract}</Text>
      <Text style={styles.workStatus}>{work.status}</Text>
    </View>
    <Text style={styles.workName}>{work.name}</Text>
    <Text style={styles.rowDescription}>{work.address}</Text>
    <View style={styles.workBottom}>
      <Text style={styles.small}>{lastDate ? `Último diário: ${displayDate(lastDate)}` : 'Primeiro diário ainda não enviado'}</Text>
      <Icon name="next" active />
    </View>
  </Pressable>;
});

export default function WorkList({ works, reports, activeUser, pendingCount, onNew, onReview, onRdo, openWork, listProps, compact, selectedId, query, onQuery }) {
  const results = useMemo(() => {
    const search = normalizeText(query);
    return works.filter((work) => normalizeText(`${work.name} ${work.address} ${work.contract}`).includes(search));
  }, [works, query]);
  const lastDates = useMemo(() => {
    const dates = new Map();
    for (const report of reports) if (report.date > (dates.get(report.workId) || '')) dates.set(report.workId, report.date);
    return dates;
  }, [reports]);
  const isOwner = activeUser.role === 'owner';
  const intro = { owner: 'Uma visão de todos os contratos da empresa.', operator: 'Registre o trabalho realizado em cada obra.', client: 'Acompanhe cada etapa da sua obra.' };
  return <FlatList {...listProps} style={[listProps?.style, compact && styles.compact]} data={results}
    keyExtractor={(item) => item.id}
    ListHeaderComponent={<View>
      {!compact ? <>
        <Text style={styles.caption}>{new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</Text>
        <Text accessibilityRole="header" style={styles.title}>Obras e contratos</Text>
        <Text style={styles.subtitle}>{intro[activeUser.role]}</Text>
        <View style={styles.summary}>
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{works.length}</Text><Text style={styles.summaryLabel}>{works.length === 1 ? 'obra vinculada' : 'obras vinculadas'}</Text></View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}><Text style={styles.summaryValue}>{isOwner ? pendingCount : reports.length}</Text><Text style={styles.summaryLabel}>{isOwner ? 'para assinatura' : 'relatórios enviados'}</Text></View>
        </View>
        {isOwner && works.length > 0 ? <View style={styles.primaryAction}><ActionButton label="Cadastrar obra" onPress={onNew} /></View> : null}
        {isOwner && pendingCount > 0 ? <View style={styles.primaryAction}><ActionButton label="Revisar RDOs pendentes" secondary onPress={onReview} /></View> : null}
        {activeUser.role === 'operator' && works.length > 0 ? <View style={styles.primaryAction}><ActionButton label="Registrar RDO" onPress={onRdo} /></View> : null}
      </> : <Text accessibilityRole="header" style={styles.section}>Obras e contratos</Text>}
      {works.length > 0 ? <>
        <SearchField label="Buscar obra" value={query} onChangeText={onQuery} placeholder="Nome, endereço ou contrato" />
        <Text accessibilityLiveRegion="polite" style={styles.count}>{pluralize(results.length, 'obra')}</Text>
      </> : null}
    </View>}
    ListEmptyComponent={query ? <EmptyState title="Nenhuma obra encontrada" message="Busque por outro nome, endereço ou contrato."
      actionLabel="Limpar busca" onAction={() => onQuery('')} />
      : <EmptyState title={isOwner ? 'Cadastre a primeira obra' : 'Seu acesso está pronto'}
        message={isOwner ? 'Adicione o contrato e escolha as pessoas que terão acesso.' : 'Peça ao dono da empresa para vincular sua conta a uma obra.'}
        actionLabel="Cadastrar obra" onAction={isOwner ? onNew : undefined} />}
    renderItem={({ item }) => <WorkRow work={item} lastDate={lastDates.get(item.id)} open={openWork} selected={item.id === selectedId} />} />;
}
