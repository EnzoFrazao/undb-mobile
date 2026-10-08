import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 10, gap: 10, borderRadius: 10, marginBottom: 8, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.action, backgroundColor: colors.focusWash },
  pressed: { opacity: 0.75 },
  box: { width: 22, height: 22, borderRadius: 5, borderWidth: 1, borderColor: colors.muted, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: colors.action, borderColor: colors.action },
  check: { color: colors.white, fontWeight: '700', fontSize: 15 },
  copy: { flex: 1 },
  label: { color: colors.ink, fontSize: 15, fontWeight: '600', lineHeight: 22 },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 20 },
});
