import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  subtitle: { color: colors.muted, fontFamily: fonts.regular, fontSize: typography.body, lineHeight: 22, marginBottom: spacing.xl },
  panel: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radii.md, padding: spacing.lg, marginBottom: spacing.md },
  draftNote: { color: colors.ink, backgroundColor: colors.focusWash, borderRadius: radii.sm, padding: spacing.md, marginBottom: spacing.lg, fontFamily: fonts.regular, fontSize: typography.caption, lineHeight: 20 },
  section: { color: colors.brand, fontSize: typography.bodyLarge, fontFamily: fonts.extraBold, marginBottom: spacing.md },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.md },
  footer: { gap: spacing.md, marginTop: spacing.md },
  photoRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border, paddingVertical: spacing.sm, gap: spacing.md },
  thumbnail: { width: 52, height: 52, borderRadius: radii.sm },
  photoLabel: { flex: 1, color: colors.ink, fontFamily: fonts.regular, fontSize: typography.body },
  remove: { minHeight: 44, justifyContent: 'center', paddingHorizontal: spacing.sm },
  removeText: { color: colors.error, fontFamily: fonts.semibold },
});
