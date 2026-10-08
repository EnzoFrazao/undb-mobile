import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/tokens';
import styles from './styles';

export default function FormField({ label, value, onChangeText, error, multiline = false, hint, ...props }) {
  const [focused, setFocused] = useState(false);
  return <View style={styles.group}><Text style={styles.label}>{label}</Text><TextInput {...props} value={value} onChangeText={onChangeText} multiline={multiline} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} accessibilityLabel={label} placeholderTextColor={colors.placeholder} style={[styles.input, multiline && styles.multiline, focused && styles.focused, error && styles.invalid]} />{error ? <Text style={styles.error} accessibilityLiveRegion="polite">{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}</View>;
}
