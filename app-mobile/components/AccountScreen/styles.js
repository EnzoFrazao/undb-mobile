import { StyleSheet } from 'react-native';
import { colors, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.display, fontFamily: fonts.extraBold, lineHeight: 35, marginBottom: spacing.md, letterSpacing: -0.4 },
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24, marginBottom: spacing.xl },
  section: { color: colors.ink, fontSize: typography.bodyLarge, lineHeight: 26, fontFamily: fonts.bold, marginTop: spacing.md, marginBottom: spacing.md },
  body: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 25, marginBottom: spacing.xl },
  small: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
  question: { color: colors.ink, fontFamily: fonts.bold, fontSize: typography.body, marginBottom: spacing.sm },
  account: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.xl, marginBottom: spacing.xl },
});
