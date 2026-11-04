import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import { displayDate, localDate } from '../../services/dates';
import { reportDraftKey, reportDrafts } from '../../services/reportDrafts';
import styles from './styles';

export default function RdoStart({ works, reports, userId, onStart }) {
  const today = localDate();
  const corrections = reports.filter((r) => r.status === 'returned' && r.authorId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));
  const workIds = JSON.stringify(works.map((work) => work.id));
  const [drafts, setDrafts] = useState({});
  useEffect(() => {
    let active = true;
    Promise.all(JSON.parse(workIds).map(async (id) => [
      id, await reportDrafts.load(reportDraftKey(userId, id)).catch(() => null),
    ])).then((entries) => { if (active) setDrafts(Object.fromEntries(entries)); });
    return () => { active = false; };
  }, [userId, workIds]);
  return <View>
    <Text style={styles.date}>{displayDate(today)}</Text>
    <Text accessibilityRole="header" style={styles.title}>Relatório diário de obra</Text>
    <Text style={styles.intro}>Selecione uma obra para registrar o dia ou consultar o RDO já enviado.</Text>
    {corrections.length ? <View style={styles.corrections}>
      <Text style={styles.name}>Aguardando sua correção</Text>
      {corrections.map((report) => {
        const work = works.find((item) => item.id === report.workId);
        return work ? <ActionButton key={report.id} label={`${work.name} · ${displayDate(report.date)}`}
          accessibilityLabel={`Abrir correção de ${work.name}, RDO de ${displayDate(report.date)}`}
          secondary onPress={() => onStart(work, report)} /> : null;
      })}
    </View> : null}
    {!works.length ? <View style={styles.empty}>
      <Text style={styles.name}>Nenhuma obra vinculada</Text>
      <Text style={styles.meta}>Peça ao dono da empresa para vincular sua conta a uma obra.</Text>
    </View> : works.map((work) => {
      const existing = reports.find((r) => r.workId === work.id && r.date === today);
      const hasDraft = Boolean(drafts[work.id]);
      const action = hasDraft ? 'Retomar rascunho' : existing ? 'Ver RDO de hoje' : 'Preencher RDO';
      return <View key={work.id} style={styles.group}><Pressable accessibilityRole="button"
        accessibilityLabel={`${action}: ${work.name}`} onPress={() => onStart(work, hasDraft ? null : existing)}
        style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <Text style={styles.meta}>{work.contract}</Text>
        <Text style={styles.name}>{work.name}</Text>
        <Text style={styles.action}>{action} ›</Text>
      </Pressable>
      {hasDraft && existing ? <ActionButton label="Ver RDO de hoje" accessibilityLabel={`Ver RDO de hoje: ${work.name}`}
        secondary onPress={() => onStart(work, existing)} /> : null}
      </View>;
    })}
  </View>;
}
