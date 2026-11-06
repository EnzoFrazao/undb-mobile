import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.overlay },
  dialog: { width: '100%', maxWidth: 420, backgroundColor: colors.surface, padding: spacing.xl, borderRadius: radii.lg, gap: spacing.md },
  title: { color: colors.ink, fontSize: typography.title, fontWeight: '800' },
  message: { color: colors.muted, fontSize: typography.body, lineHeight: 24 },
});
