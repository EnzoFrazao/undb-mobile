import { StyleSheet } from 'react-native';
import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  title: { color: colors.ink, fontSize: 26, fontWeight: '800', lineHeight: 32 },
  intro: { color: colors.muted, fontSize: 16, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.lg },
  row: { gap: spacing.xs, padding: spacing.lg, marginBottom: spacing.sm, borderRadius: radii.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  unread: { backgroundColor: colors.focusWash },
  pressed: { borderColor: colors.focusBorder },
  name: { color: colors.ink, fontSize: 16, fontWeight: '700', lineHeight: 22 },
  meta: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  empty: { color: colors.ink, fontSize: 16, lineHeight: 24, padding: spacing.lg, borderRadius: radii.md, backgroundColor: colors.focusWash },
});
