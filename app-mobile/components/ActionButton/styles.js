import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  button: { minHeight: 50, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.action, alignItems: 'center', justifyContent: 'center' },
  secondary: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: { color: colors.white, fontSize: 16, fontWeight: '700', textAlign: 'center' },
  secondaryLabel: { color: colors.ink },
});
