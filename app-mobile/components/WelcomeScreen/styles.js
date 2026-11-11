import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  profile: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  profileCaption: { color: colors.muted, fontSize: typography.caption, fontFamily: fonts.semibold },
  profileName: { color: colors.ink, fontSize: typography.title, fontFamily: fonts.extraBold, marginTop: spacing.xs },
  welcomeMessage: { color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24, marginTop: spacing.md },
  actions: { gap: spacing.md },
});
