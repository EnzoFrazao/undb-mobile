import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 22, marginBottom: spacing.lg },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontFamily: fonts.bold, marginVertical: spacing.md },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  operator: { marginTop: spacing.lg, gap: spacing.md },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: spacing.md, borderRadius: radii.sm, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 22, marginTop: spacing.md },
});
