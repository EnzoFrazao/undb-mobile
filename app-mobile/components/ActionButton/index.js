import { Pressable, Text } from 'react-native';
import styles from './styles';

export default function ActionButton({ label, onPress, secondary = false, busy = false, disabled = false, accessibilityLabel }) {
  return <Pressable onPress={onPress} disabled={disabled || busy} accessibilityRole="button" accessibilityLabel={accessibilityLabel || label} accessibilityState={{ disabled: disabled || busy, busy }} style={({ pressed }) => [styles.button, secondary && styles.secondary, pressed && styles.pressed, (disabled || busy) && styles.disabled]}><Text style={[styles.label, secondary && styles.secondaryLabel]}>{busy ? 'Aguarde...' : label}</Text></Pressable>;
}
