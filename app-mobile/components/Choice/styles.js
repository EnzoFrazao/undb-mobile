import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: 2 } : {},
  row: { minHeight: 52, flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.md, gap: spacing.md, borderRadius: radii.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  selected: { borderColor: colors.action, backgroundColor: colors.focusWash },
  pressed: { opacity: 0.75 },
  box: { width: 22, height: 22, borderRadius: radii.sm, borderWidth: 1, borderColor: colors.muted, justifyContent: 'center', alignItems: 'center' },
  checked: { backgroundColor: colors.action, borderColor: colors.action },
  copy: { flex: 1 },
  label: { color: colors.ink, fontSize: typography.body, fontWeight: '600', lineHeight: 22 },
  detail: { color: colors.muted, fontSize: typography.caption, lineHeight: 20 },
});
