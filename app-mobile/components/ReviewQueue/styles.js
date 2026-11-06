import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.title, lineHeight: 32, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.lg },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tab: { minHeight: 44, flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.sm, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface },
  tabText: { color: colors.ink, fontSize: typography.caption, fontWeight: '600' },
  selected: { backgroundColor: colors.focusWash, borderColor: colors.actionPressed },
  selectedText: { color: colors.actionPressed, fontWeight: '700' },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  pressed: { backgroundColor: colors.focusWash },
  clear: { marginBottom: spacing.lg },
  count: { color: colors.muted, fontSize: typography.caption, lineHeight: 20, marginBottom: spacing.sm },
  row: { gap: spacing.xs, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderColor: colors.border },
  work: { color: colors.ink, fontSize: typography.body, lineHeight: 23, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: typography.caption, lineHeight: 20 },
  summary: { color: colors.ink, fontSize: typography.body, lineHeight: 22 },
});
