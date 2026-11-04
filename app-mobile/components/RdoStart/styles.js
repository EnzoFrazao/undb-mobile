import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  date: { color: colors.muted, fontSize: 14, marginBottom: spacing.sm },
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800' },
  intro: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.xl },
  group: { gap: spacing.sm, marginBottom: spacing.md },
  corrections: { gap: spacing.sm, marginBottom: spacing.xl },
  row: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.md, padding: spacing.lg, gap: spacing.xs },
  pressed: { backgroundColor: colors.focusWash, borderColor: colors.focusBorder },
  empty: { padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.focusWash, gap: spacing.sm },
  name: { color: colors.ink, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  action: { color: colors.actionPressed, fontSize: 15, lineHeight: 22, fontWeight: '700', marginTop: spacing.sm },
});
