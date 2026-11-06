import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.title, lineHeight: 32, fontWeight: '800', marginBottom: spacing.md },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontWeight: '700', marginTop: spacing.xl, marginBottom: spacing.md },
  caption: { color: colors.muted, fontSize: typography.caption, fontWeight: '700', marginBottom: spacing.sm, marginTop: spacing.xl },
  text: { color: colors.ink, fontSize: typography.body, lineHeight: 25 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radii.sm, backgroundColor: colors.warningWash },
  signedBadge: { backgroundColor: colors.successWash },
  badgeText: { color: colors.ink, fontSize: typography.caption, fontWeight: '700' },
  progress: { marginTop: spacing.xl, flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  progressNumber: { color: colors.brand, fontSize: typography.display, fontWeight: '800' },
  progressLabel: { color: colors.muted, fontSize: typography.body },
  photo: { width: '100%', aspectRatio: 4 / 3, borderRadius: radii.md, marginBottom: spacing.md },
  signature: { backgroundColor: colors.successWash, borderRadius: radii.md, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, marginTop: spacing.xl },
  small: { color: colors.muted, fontSize: typography.caption, lineHeight: 21, marginVertical: spacing.sm },
  hash: { color: colors.ink, fontSize: typography.caption, lineHeight: 19 },
  versionRow: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.md, marginBottom: spacing.md, gap: spacing.xs },
  versionTitle: { color: colors.ink, fontSize: typography.body, fontWeight: '700' },
  versionNotice: { padding: spacing.md, backgroundColor: colors.focusWash, borderRadius: radii.md, marginTop: spacing.lg, gap: spacing.md },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: spacing.md, borderRadius: radii.sm, marginTop: spacing.md, lineHeight: 22 },
  success: { color: colors.success, backgroundColor: colors.successWash, padding: spacing.md, borderRadius: radii.sm, marginBottom: spacing.md, fontSize: typography.body, lineHeight: 22 },
});
