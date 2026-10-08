import { StyleSheet } from 'react-native';

import { colors, radii, spacing } from '../../theme/tokens';

export default StyleSheet.create({
  container: {
    minHeight: 220,
    paddingTop: 28,
    paddingBottom: 32,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.brand,
    justifyContent: 'flex-end',
  },
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
    fontSize: 28,
    lineHeight: 34,
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
