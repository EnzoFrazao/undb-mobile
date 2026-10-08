import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  group: { marginBottom: 18 },
  label: { color: colors.ink, fontSize: 16, fontWeight: '700', marginBottom: 8 },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, color: colors.ink, fontSize: 16 },
  multiline: { minHeight: 116, textAlignVertical: 'top', lineHeight: 24 },
  focused: { borderColor: colors.action, backgroundColor: colors.focusWash },
  invalid: { borderColor: colors.error, backgroundColor: colors.errorWash },
  error: { color: colors.error, marginTop: 6, fontSize: 14, lineHeight: 20 },
  hint: { color: colors.muted, marginTop: 6, fontSize: 14, lineHeight: 20 },
});
