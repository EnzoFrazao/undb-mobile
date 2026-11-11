import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  toast: { position: 'absolute', alignSelf: 'center', width: '94%', maxWidth: 560, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, gap: spacing.sm, flexDirection: 'row', alignItems: 'center', borderRadius: radii.md, backgroundColor: colors.ink, zIndex: 2 },
  success: { backgroundColor: colors.success },
  error: { backgroundColor: colors.error },
  message: { flex: 1, color: colors.white, fontFamily: fonts.regular, fontSize: typography.body },
  button: { minHeight: 44, minWidth: 44, justifyContent: 'center' },
  link: { color: colors.white, fontSize: typography.caption, fontFamily: fonts.bold },
});

export const toastPosition = (safeBottom, opacity) => ({ bottom: safeBottom + 68 + spacing.lg, opacity });
