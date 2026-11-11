import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  actions: { marginBottom: spacing.lg },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  intro: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24, marginTop: spacing.sm, marginBottom: spacing.lg },
  row: { gap: spacing.xs, padding: spacing.lg, marginBottom: spacing.sm, borderRadius: radii.sm, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  unread: { backgroundColor: colors.focusWash },
  pressed: { borderColor: colors.focusBorder },
  name: { color: colors.ink, fontSize: typography.body, fontFamily: fonts.bold, lineHeight: 22 },
  meta: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
});
