import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  caption: { color: colors.muted, fontSize: typography.caption, lineHeight: 20, marginBottom: spacing.md },
  title: { color: colors.ink, fontSize: typography.display, fontWeight: '800', lineHeight: 35, marginBottom: spacing.md, letterSpacing: -0.4 },
  subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 24, marginBottom: spacing.xl },
  section: { color: colors.ink, fontSize: typography.bodyLarge, lineHeight: 26, fontWeight: '700', marginTop: spacing.md, marginBottom: spacing.md },
  body: { color: colors.ink, fontSize: typography.body, lineHeight: 25, marginBottom: spacing.xl },
  guideItem: { flexDirection: 'row', gap: spacing.md, paddingVertical: spacing.lg, borderBottomWidth: 1, borderColor: colors.border },
  guideNumber: { color: colors.actionPressed, fontSize: typography.title, fontWeight: '800' },
  guideText: { color: colors.ink, fontSize: typography.body, lineHeight: 26, flex: 1 },
});
