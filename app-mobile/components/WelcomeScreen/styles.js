import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: colors.brand,
  },
  contentSurface: {
    flexGrow: 1,
    marginTop: -16,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.canvas,
  },
  content: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  profileCaption: {
    marginBottom: spacing.xs,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  profileName: {
    marginBottom: spacing.lg,
    color: colors.ink,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '800',
  },
  welcomeMessage: {
    marginBottom: spacing.xxl,
    color: colors.ink,
    fontSize: 17,
    lineHeight: 26,
  },
  logoutButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.action,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  logoutButtonPressed: {
    backgroundColor: colors.focusWash,
    transform: [{ scale: 0.99 }],
  },
  logoutButtonText: {
    color: colors.actionPressed,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.xxl,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
