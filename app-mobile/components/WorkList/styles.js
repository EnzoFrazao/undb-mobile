import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  compact: { flex: 1 },
  caption: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20, marginBottom: spacing.sm },
  title: { color: colors.ink, fontSize: typography.display, fontFamily: fonts.extraBold, marginBottom: spacing.sm },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24, marginBottom: spacing.xl },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontFamily: fonts.extraBold, marginBottom: spacing.md },
  small: { flex: 1, color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
  summary: { borderRadius: radii.md, padding: spacing.lg, backgroundColor: colors.brand, flexDirection: 'row', marginBottom: spacing.lg },
  summaryItem: { flex: 1, gap: spacing.xs },
  summaryValue: { color: colors.white, fontSize: typography.display, fontFamily: fonts.extraBold },
  summaryLabel: { color: colors.textOnBrand, fontFamily: fonts.regular, fontSize: typography.caption },
  summaryDivider: { width: 1, backgroundColor: colors.brandDivider, marginHorizontal: spacing.lg },
  actions: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.md, marginBottom: spacing.xl },
  action: { flexGrow: 1, flexBasis: 220 },
  workRow: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.md },
  workTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
  contract: { color: colors.muted, fontSize: typography.caption, fontFamily: fonts.semibold },
  workStatus: { color: colors.success, backgroundColor: colors.successWash, paddingVertical: spacing.xs, paddingHorizontal: spacing.sm, borderRadius: radii.sm, fontSize: typography.caption, fontFamily: fonts.semibold },
  workName: { color: colors.ink, fontSize: typography.bodyLarge, fontFamily: fonts.bold, marginBottom: spacing.sm },
  workBottom: { borderTopWidth: 1, borderColor: colors.borderSubtle, marginTop: spacing.md, paddingTop: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  rowDescription: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24 },
  count: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, marginBottom: spacing.md },
  selected: { borderColor: colors.focusBorder, backgroundColor: colors.focusWash },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  pressed: { opacity: 0.75 },
});
