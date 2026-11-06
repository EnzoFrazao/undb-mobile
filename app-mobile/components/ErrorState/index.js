import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import styles from './styles';

export default function ErrorState({ message, onRetry, retryLabel = 'Tentar novamente' }) {
  return <View style={styles.box}>
    <Text style={styles.message} accessibilityRole="alert">{message}</Text>
    {onRetry ? <ActionButton label={retryLabel} secondary onPress={onRetry} /> : null}
  </View>;
}
