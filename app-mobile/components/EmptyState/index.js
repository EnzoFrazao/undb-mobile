import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import styles from './styles';

export default function EmptyState({ title, message, actionLabel, onAction }) {
  return <View style={styles.box}>
    <Text accessibilityRole="header" style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}
    {onAction ? <ActionButton label={actionLabel} secondary onPress={onAction} /> : null}
  </View>;
}
