import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 22, marginBottom: spacing.lg },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontWeight: '700', marginVertical: spacing.md },
  actions: { marginTop: spacing.xl, gap: spacing.md },
  operator: { marginTop: spacing.lg, gap: spacing.md },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: spacing.md, borderRadius: radii.sm, lineHeight: 22, marginTop: spacing.md },
});
