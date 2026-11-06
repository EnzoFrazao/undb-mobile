import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  subtitle: { color: colors.muted, fontSize: typography.body, lineHeight: 24, marginBottom: spacing.xl },
  section: { color: colors.ink, fontSize: typography.title, fontWeight: '700', marginTop: spacing.sm, marginBottom: spacing.md },
  body: { color: colors.ink, fontSize: typography.body, lineHeight: 24 },
  small: { color: colors.muted, fontSize: typography.caption, lineHeight: 20 },
  primaryAction: { marginBottom: spacing.md },
  rowDescription: { color: colors.ink, fontSize: typography.body, lineHeight: 24 },
  statuses: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  status: { minHeight: 44, paddingHorizontal: spacing.md, justifyContent: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radii.sm },
  statusLabel: { color: colors.ink, fontSize: typography.caption, fontWeight: '700' },
  selected: { borderColor: colors.focusBorder, backgroundColor: colors.focusWash },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  pressed: { opacity: 0.75 },
  filter: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md, gap: spacing.sm },
  reportRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg, borderBottomWidth: 1, borderColor: colors.borderSubtle },
  dateBlock: { minWidth: 64, backgroundColor: colors.focusWash, padding: spacing.sm, alignItems: 'center', borderRadius: radii.sm },
  dateDay: { fontSize: typography.title, fontWeight: '800', color: colors.brand },
  dateMonth: { fontSize: typography.caption, color: colors.muted },
  reportCopy: { flex: 1, gap: spacing.xs },
});
