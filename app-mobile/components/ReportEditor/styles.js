import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 22, marginBottom: spacing.xl },
  draftNote: { color: colors.ink, backgroundColor: colors.focusWash, borderRadius: radii.sm, padding: spacing.md, marginBottom: spacing.lg, fontSize: typography.caption, lineHeight: 20 },
  section: { color: colors.ink, fontSize: typography.bodyLarge, fontWeight: '700', marginBottom: spacing.sm },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  footer: { gap: spacing.md, marginTop: spacing.xl },
  photoRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm, gap: spacing.md },
  thumbnail: { width: 52, height: 52, borderRadius: radii.sm },
  photoLabel: { flex: 1, color: colors.ink, fontSize: typography.body },
  remove: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  removeText: { color: colors.error, fontWeight: '600' },
});
