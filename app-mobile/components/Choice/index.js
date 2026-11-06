import { Pressable, Text, View } from 'react-native';
import Icon from '../Icon';
import styles from './styles';

export default function Choice({ label, selected, onPress, detail, disabled = false }) {
  return <Pressable disabled={disabled} onPress={onPress} accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked: selected, disabled }} style={({ pressed, focused }) => [styles.row, focused && styles.focused, selected && styles.selected, pressed && styles.pressed]}><View style={[styles.box, selected && styles.checked]}>{selected ? <Icon name="check" light /> : null}</View><View style={styles.copy}><Text style={styles.label}>{label}</Text>{detail ? <Text style={styles.detail}>{detail}</Text> : null}</View></Pressable>;
}
