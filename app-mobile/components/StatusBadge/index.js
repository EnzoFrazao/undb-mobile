import { Text, View } from 'react-native';
import Icon from '../Icon';
import styles from './styles';

const labels = { pending: 'Pendente', signed: 'Assinado', returned: 'Em correção' };
const icons = { pending: 'pending', signed: 'check', returned: 'returned' };

export default function StatusBadge({ status, label = labels[status] }) {
  return <View style={[styles.badge, styles[status]]}>
    <Icon name={icons[status]} />
    <Text maxFontSizeMultiplier={1.4} style={[styles.label, styles[`${status}Label`]]}>{label}</Text>
  </View>;
}
