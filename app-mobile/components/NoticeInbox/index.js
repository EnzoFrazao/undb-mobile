import { Pressable, Text, View } from 'react-native';
import { displayDate, displayTime } from '../../services/dates';
import styles from './styles';

const titles = {
  submitted: 'Novo RDO enviado',
  returned: 'Correção solicitada',
  resubmitted: 'RDO atualizado',
  updated: 'RDO editado',
  signed: 'RDO assinado',
};

export default function NoticeInbox({ notices, works, onOpen }) {
  const workById = new Map(works.map((work) => [work.id, work]));
  return <View>
    <Text accessibilityRole="header" style={styles.title}>Avisos</Text>
    <Text style={styles.intro}>Toque em um aviso para abrir o relatório.</Text>
    {notices.length ? notices.map((item) => {
      const title = titles[item.type] || 'Atualização de RDO';
      const workName = workById.get(item.workId)?.name;
      return <Pressable key={item.id} accessibilityRole="button"
        accessibilityLabel={`${title}, ${workName}, RDO de ${displayDate(item.date)}${item.readAt ? '' : ', não lido'}`}
        onPress={() => onOpen(item)}
        style={({ pressed }) => [styles.row, !item.readAt && styles.unread, pressed && styles.pressed]}>
        <Text style={styles.name}>{title}{item.readAt ? '' : ' · Novo'}</Text>
        <Text style={styles.meta}>{workName} · RDO de {displayDate(item.date)}</Text>
        <Text style={styles.meta}>{displayTime(item.at)}</Text>
      </Pressable>;
    }) : <Text style={styles.empty}>Nenhum aviso por enquanto. As atualizações dos seus RDOs aparecerão aqui.</Text>}
  </View>;
}
