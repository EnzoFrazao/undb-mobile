import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  action: { marginBottom: spacing.lg },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.sm, backgroundColor: colors.overlay },
  scroll: { flexGrow: 0, width: '100%', maxWidth: 460, backgroundColor: colors.surface, borderRadius: radii.lg },
  dialog: { padding: spacing.md, gap: spacing.md },
  title: { color: colors.ink, fontSize: typography.title, fontWeight: '800' },
});
