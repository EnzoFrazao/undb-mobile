import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.title, lineHeight: 32, fontFamily: fonts.extraBold, marginBottom: spacing.md },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontFamily: fonts.bold, marginTop: spacing.xl, marginBottom: spacing.md },
  caption: { color: colors.muted, fontSize: typography.caption, fontFamily: fonts.bold, marginBottom: spacing.sm, marginTop: spacing.xl },
  text: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 25 },
  overview: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radii.md, padding: spacing.lg },
  overviewTop: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  contract: { color: colors.muted, fontSize: typography.caption, fontFamily: fonts.semibold },
  progress: { marginTop: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderColor: colors.borderSubtle, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', gap: spacing.sm },
  progressNumber: { color: colors.brand, fontSize: typography.display, fontFamily: fonts.extraBold },
  progressLabel: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radii.md, marginBottom: spacing.md },
  signature: { backgroundColor: colors.successWash, borderRadius: radii.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, marginTop: spacing.xl },
  small: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 21, marginVertical: spacing.sm },
  hash: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 19 },
  versionRow: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.md, marginBottom: spacing.md, gap: spacing.xs },
  versionTitle: { color: colors.ink, fontSize: typography.body, fontFamily: fonts.bold },
  versionNotice: { padding: spacing.md, backgroundColor: colors.focusWash, borderRadius: radii.md, marginTop: spacing.lg, gap: spacing.md },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: spacing.md, borderRadius: radii.sm, marginTop: spacing.md, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 22 },
  success: { color: colors.success, backgroundColor: colors.successWash, padding: spacing.md, borderRadius: radii.sm, marginBottom: spacing.md, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 22 },
});
