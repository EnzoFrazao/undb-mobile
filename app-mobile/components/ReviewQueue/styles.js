import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.lg },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tab: { minHeight: 44, flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.sm, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface },
  tabText: { color: colors.ink, fontSize: 14, fontWeight: '600' },
  selected: { backgroundColor: colors.focusWash, borderColor: colors.actionPressed },
  selectedText: { color: colors.actionPressed, fontWeight: '700' },
  focused: { borderColor: colors.focusBorder },
  pressed: { backgroundColor: colors.focusWash },
  clear: { marginBottom: spacing.lg },
  count: { color: colors.muted, fontSize: 14, lineHeight: 20, marginBottom: spacing.sm },
  empty: { color: colors.ink, fontSize: 16, lineHeight: 24, padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.focusWash },
  row: { gap: spacing.xs, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderColor: colors.border },
  work: { color: colors.ink, fontSize: 17, lineHeight: 23, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  summary: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  more: { marginTop: spacing.lg },
});
