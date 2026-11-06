import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: typography.display, fontWeight: '800', lineHeight: 35, marginBottom: spacing.md, letterSpacing: -0.4 },
  subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 24, marginBottom: spacing.xl },
  section: { color: colors.ink, fontSize: typography.bodyLarge, lineHeight: 26, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.md },
  body: { color: colors.ink, fontSize: typography.body, lineHeight: 25, marginBottom: spacing.xl },
  small: { color: colors.muted, fontSize: typography.caption, lineHeight: 20 },
  question: { color: colors.ink, fontWeight: '700', fontSize: typography.body, marginBottom: spacing.sm },
  account: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: spacing.xl, marginBottom: spacing.xl },
});
