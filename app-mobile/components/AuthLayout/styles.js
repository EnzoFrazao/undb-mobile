import { StyleSheet } from 'react-native';

import { colors, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scrollContent: { flexGrow: 1 },
  wide: { flexDirection: 'row' },
  surface: {
    flexGrow: 1,
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  wideSurface: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    paddingHorizontal: spacing.xxxl,
    paddingVertical: spacing.xxl,
  },
  form: { width: '100%', maxWidth: 420, alignSelf: 'center' },
  intro: { marginBottom: spacing.xl },
  heading: { color: colors.ink, fontSize: typography.display, lineHeight: 34, fontFamily: fonts.extraBold, letterSpacing: -0.5 },
  description: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 23, marginTop: spacing.sm },
});
