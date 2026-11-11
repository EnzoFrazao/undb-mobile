import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  box: { padding: spacing.lg, gap: spacing.sm, backgroundColor: colors.focusWash, borderRadius: radii.md, marginVertical: spacing.sm },
  title: { color: colors.ink, fontFamily: fonts.extraBold, fontSize: typography.bodyLarge },
  message: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24 },
});
