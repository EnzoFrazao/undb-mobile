import { Pressable, Text } from 'react-native';
import Icon from '../Icon';
import styles from './styles';

export default function ActionButton({ label, onPress, secondary = false, busy = false, busyLabel = 'Aguarde…', disabled = false, accessibilityLabel, testID, buttonRef, icon }) {
  return <Pressable ref={buttonRef} testID={testID} onPress={onPress} disabled={disabled || busy}
    accessibilityRole="button" accessibilityLabel={accessibilityLabel || (busy ? busyLabel : label)}
    accessibilityState={{ disabled: disabled || busy, busy }}
    style={({ pressed, focused }) => [styles.button, secondary && styles.secondary, pressed && styles.pressed, focused && styles.focused, (disabled || busy) && styles.disabled]}>
    {icon && !busy ? <Icon name={icon} active={secondary} light={!secondary} /> : null}
    <Text style={[styles.label, secondary && styles.secondaryLabel]}>{busy ? busyLabel : label}</Text>
  </Pressable>;
}
