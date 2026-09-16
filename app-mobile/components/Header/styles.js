import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  container: {
    minHeight: 276,
    paddingTop: 60,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.brand,
    justifyContent: 'flex-end',
  },
  brandMark: {
    position: 'absolute',
    top: 52,
    right: spacing.xl,
    width: 76,
    height: 64,
  },
  brandMarkBack: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.action,
  },
  brandMarkFront: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.brandMarkLight,
  },
  brand: {
    maxWidth: '78%',
    color: colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  heading: {
    marginTop: spacing.lg,
    color: colors.white,
    fontSize: 24,
    lineHeight: 29,
    fontWeight: '700',
  },
  description: {
    marginTop: spacing.sm,
    maxWidth: 360,
    color: colors.textOnBrand,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
});
