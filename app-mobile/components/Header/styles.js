import { StyleSheet } from 'react-native';

import { colors, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  container: {
    backgroundColor: colors.brand,
    overflow: 'hidden',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  wide: {
    width: '43%',
    minHeight: 560,
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxxl,
    justifyContent: 'center',
  },
  signature: { width: 156, height: 40 },
  wideSignature: { position: 'absolute', top: spacing.xxxl, left: spacing.xxxl, width: 198, height: 51 },
  copy: { marginTop: spacing.xl },
  wideCopy: { marginTop: 0, marginBottom: spacing.xxl },
  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.8,
  },
  wideTitle: { fontSize: 36, lineHeight: 42, letterSpacing: -1 },
  description: {
    marginTop: spacing.sm,
    maxWidth: 320,
    color: colors.textOnBrand,
    fontFamily: fonts.regular,
    fontSize: typography.body,
    lineHeight: 24,
  },
  pattern: {
    position: 'absolute',
  },
  compactPattern: {
    width: 280,
    height: 145,
    top: -28,
    right: -132,
    opacity: 0.26,
  },
  widePattern: {
    width: 560,
    height: 291,
    bottom: -88,
    right: -48,
    opacity: 0.38,
  },
});
