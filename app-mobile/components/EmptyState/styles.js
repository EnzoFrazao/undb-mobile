import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  box: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.focusWash, borderRadius: radii.md, marginVertical: spacing.sm },
  title: { color: colors.ink, fontWeight: '800', fontSize: typography.bodyLarge },
  message: { color: colors.ink, fontSize: typography.body, lineHeight: 24 },
});
