import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  box: { backgroundColor: colors.errorWash, borderRadius: radii.md, padding: spacing.md, gap: spacing.sm, marginBottom: spacing.lg },
  message: { color: colors.error, fontSize: typography.body, lineHeight: 24 },
});
