import { StyleSheet } from 'react-native';

import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  container: {
    minHeight: 220,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.brand,
    justifyContent: 'flex-end',
  },
  compact: { minHeight: 184, paddingTop: spacing.xxl, paddingBottom: spacing.xl },
  brandMark: {
    position: 'absolute',
    top: 28,
    right: spacing.xl,
    width: 52,
    height: 44,
  },
  brandMarkBack: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.action,
  },
  brandMarkFront: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 32,
    height: 32,
    borderRadius: radii.md,
    backgroundColor: colors.brandMarkLight,
  },
  brand: {
    maxWidth: '78%',
    color: colors.white,
    fontSize: typography.display,
    lineHeight: 34,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heading: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: typography.title,
    lineHeight: 29,
    fontWeight: '700',
  },
  description: {
    marginTop: spacing.sm,
    maxWidth: 360,
    color: colors.textOnBrand,
    fontSize: typography.body,
    lineHeight: 24,
    fontWeight: '500',
  },
});
