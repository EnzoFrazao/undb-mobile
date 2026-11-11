import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.title, lineHeight: 32, fontFamily: fonts.extraBold },
  intro: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.lg },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  tab: { minHeight: 44, flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md, borderRadius: radii.sm, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface },
  tabText: { color: colors.ink, fontSize: typography.caption, fontFamily: fonts.semibold },
  selected: { backgroundColor: colors.focusWash, borderColor: colors.actionPressed },
  selectedText: { color: colors.actionPressed, fontFamily: fonts.bold },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  pressed: { backgroundColor: colors.focusWash },
  clear: { marginBottom: spacing.lg },
  count: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20, marginBottom: spacing.sm },
  row: { gap: spacing.xs, paddingVertical: spacing.lg, paddingHorizontal: spacing.md, borderBottomWidth: 1, borderColor: colors.border },
  work: { color: colors.ink, fontSize: typography.body, lineHeight: 23, fontFamily: fonts.bold },
  meta: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
  summary: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 22 },
});
