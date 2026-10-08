import { Pressable, Text, View } from 'react-native';
import styles from './styles';

export default function Choice({ label, selected, onPress, detail }) {
  return <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityLabel={label} accessibilityState={{ checked: selected }} style={({ pressed }) => [styles.row, selected && styles.selected, pressed && styles.pressed]}><View style={[styles.box, selected && styles.checked]}><Text style={styles.check}>{selected ? '✓' : ''}</Text></View><View style={styles.copy}><Text style={styles.label}>{label}</Text>{detail ? <Text style={styles.detail}>{detail}</Text> : null}</View></Pressable>;
}
