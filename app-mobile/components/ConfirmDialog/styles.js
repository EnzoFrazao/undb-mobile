import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  dialog: { width: '100%', maxWidth: 420, backgroundColor: colors.surface, padding: spacing.xl, borderRadius: radii.lg, gap: spacing.md },
  title: { color: colors.ink, fontSize: typography.title, fontFamily: fonts.extraBold },
  message: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 24 },
});
