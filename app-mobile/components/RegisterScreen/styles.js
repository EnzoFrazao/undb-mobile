import { StyleSheet } from 'react-native';

import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.ink,
    fontSize: typography.body,
    lineHeight: 20,
    fontFamily: fonts.bold,
  },
  inputShell: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
  },
  inputShellFocused: {
    borderWidth: 2,
    borderColor: colors.focusBorder,
    backgroundColor: colors.focusWash,
  },
  inputShellError: {
    borderWidth: 2,
    borderColor: colors.error,
    backgroundColor: colors.errorWash,
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    color: colors.ink,
    fontFamily: fonts.regular,
    fontSize: typography.body,
    lineHeight: 22,
  },
  passwordToggle: {
    minWidth: 64,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  passwordTogglePressed: {
    backgroundColor: colors.focusWash,
  },
  passwordToggleText: {
    color: colors.actionPressed,
    fontSize: typography.caption,
    lineHeight: 20,
    fontFamily: fonts.bold,
  },
  fieldError: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: typography.caption,
    lineHeight: 20,
    fontFamily: fonts.semibold,
  },
  submitButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    backgroundColor: colors.action,
  },
  submitButtonPressed: {
    backgroundColor: colors.actionPressed,
    transform: [{ scale: 0.99 }],
  },
  submitButtonText: {
    color: colors.white,
    fontSize: typography.body,
    lineHeight: 22,
    fontFamily: fonts.bold,
  },
  switchRow: {
    minHeight: 48,
    marginTop: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: spacing.xs,
  },
  switchPrompt: {
    color: colors.muted,
    fontFamily: fonts.regular,
    fontSize: typography.body,
    lineHeight: 22,
  },
  switchLink: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
    borderRadius: radii.sm,
  },
  switchLinkPressed: {
    backgroundColor: colors.focusWash,
  },
  switchLinkText: {
    color: colors.actionPressed,
    fontSize: typography.body,
    lineHeight: 22,
    fontFamily: fonts.bold,
  },
});
