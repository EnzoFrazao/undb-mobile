import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  date: { color: colors.muted, fontSize: typography.caption, marginBottom: spacing.sm },
  title: { color: colors.ink, fontSize: typography.title, lineHeight: 32, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.xl },
  group: { gap: spacing.sm, marginBottom: spacing.md },
  corrections: { gap: spacing.sm, marginBottom: spacing.xl },
  row: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.md, padding: spacing.lg, gap: spacing.xs },
  pressed: { backgroundColor: colors.focusWash, borderColor: colors.focusBorder },
  empty: { padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.focusWash, gap: spacing.sm },
  name: { color: colors.ink, fontSize: typography.bodyLarge, lineHeight: 24, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: typography.caption, lineHeight: 20 },
  action: { color: colors.actionPressed, fontSize: typography.body, lineHeight: 22, fontWeight: '700', marginTop: spacing.sm },
});
