import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  group: { marginBottom: spacing.lg },
  label: { color: colors.ink, fontSize: typography.body, fontFamily: fonts.bold, marginBottom: spacing.sm },
  input: { minHeight: 52, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, borderRadius: radii.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md, color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body },
  multiline: { minHeight: 116, textAlignVertical: 'top', lineHeight: 24 },
  focused: { borderColor: colors.action, backgroundColor: colors.focusWash },
  invalid: { borderColor: colors.error, backgroundColor: colors.errorWash },
  error: { color: colors.error, marginTop: spacing.sm, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
  hint: { color: colors.muted, marginTop: spacing.sm, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
});
