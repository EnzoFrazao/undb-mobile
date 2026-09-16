import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.brand,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: colors.brand,
  },
  formSurface: {
    flexGrow: 1,
    marginTop: -16,
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    borderTopLeftRadius: radii.lg,
    borderTopRightRadius: radii.lg,
    backgroundColor: colors.canvas,
  },
  form: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  fieldGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
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
    minHeight: 54,
    paddingHorizontal: spacing.lg,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
  },
  passwordToggle: {
    minWidth: 72,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
  },
  passwordTogglePressed: {
    backgroundColor: colors.focusWash,
  },
  passwordToggleText: {
    color: colors.actionPressed,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  fieldError: {
    marginTop: spacing.sm,
    color: colors.error,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
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
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
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
    fontSize: 15,
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
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '700',
  },
  footer: {
    marginTop: spacing.xl,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
});
