import { memo, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import EmptyState from '../EmptyState';
import SearchField from '../SearchField';
import { displayDate, displayTime } from '../../services/dates';
import { normalizeText } from '../../services/text.cjs';
import styles from './styles';

const titles = {
  submitted: 'Novo RDO enviado',
  returned: 'Correção solicitada',
  resubmitted: 'RDO atualizado',
  updated: 'RDO editado',
  signed: 'RDO assinado',
};

const NoticeRow = memo(function NoticeRow({ item, workName, onOpen }) {
  const title = titles[item.type] || 'Atualização de RDO';
  return <Pressable accessibilityRole="button"
    accessibilityLabel={`${title}, ${workName}, RDO de ${displayDate(item.date)}${item.readAt ? '' : ', não lido'}`}
    onPress={() => onOpen(item)}
    style={({ pressed, focused }) => [styles.row, !item.readAt && styles.unread, pressed && styles.pressed, focused && styles.focused]}>
    <Text style={styles.name}>{title}{item.readAt ? '' : ' · Novo'}</Text>
    <Text style={styles.meta}>{workName} · RDO de {displayDate(item.date)}</Text>
    <Text style={styles.meta}>{displayTime(item.at)}</Text>
  </Pressable>;
});

export default function NoticeInbox({ notices, works, onOpen, onMarkAll, listProps, query, onQuery }) {
  const [busy, setBusy] = useState(false);
  const unread = notices.filter((item) => !item.readAt).length;
  const workById = useMemo(() => new Map(works.map((work) => [work.id, work.name])), [works]);
  const visible = useMemo(() => {
    const search = normalizeText(query);
    return notices.filter((item) => normalizeText(`${titles[item.type]} ${workById.get(item.workId)} ${displayDate(item.date)}`).includes(search));
  }, [query, notices, workById]);

  return <FlatList {...listProps} data={visible} keyExtractor={(item) => item.id}
    ListHeaderComponent={<View>
      <Text style={styles.intro}>Abra um aviso para consultar o relatório correspondente.</Text>
      {unread ? <View style={styles.actions}><ActionButton secondary label={`Marcar todos como lidos (${unread})`} busy={busy} busyLabel="Marcando avisos…" onPress={async () => {
        setBusy(true);
        try { await onMarkAll(); } finally { setBusy(false); }
      }} /></View> : null}
      {notices.length ? <SearchField label="Buscar avisos" value={query} onChangeText={onQuery} placeholder="Obra, data ou assunto" /> : null}
    </View>}
    ListEmptyComponent={query ? <EmptyState title="Nenhum aviso encontrado" actionLabel="Limpar busca" onAction={() => onQuery('')} />
      : <EmptyState title="Tudo em dia" message="As atualizações dos seus RDOs aparecerão aqui." />}
    renderItem={({ item }) => <NoticeRow item={item} workName={workById.get(item.workId) || 'Obra'} onOpen={onOpen} />} />;
}
