import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, sizes } from '../../theme/tokens';
export default StyleSheet.create({
  calendar: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radii.md, padding: spacing.sm, marginBottom: spacing.xl },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { minWidth: sizes.touchMin, minHeight: sizes.touchMin, justifyContent: 'center', alignItems: 'center' },
  month: { color: colors.ink, fontWeight: '700', fontSize: typography.body },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', paddingVertical: spacing.sm, textAlign: 'center', color: colors.muted, fontWeight: '700', fontSize: typography.caption },
  cell: { width: '14.2857%', minHeight: sizes.touchMin, justifyContent: 'center', alignItems: 'center', borderRadius: radii.sm },
  selected: { backgroundColor: colors.action },
  day: { color: colors.ink, fontSize: typography.body },
  selectedText: { color: colors.white, fontWeight: '700' },
  dot: { width: 4, height: 4, marginTop: spacing.xs, borderRadius: 2, backgroundColor: 'transparent' },
  dotActive: { backgroundColor: colors.action },
  dotSelected: { backgroundColor: colors.white },
  legend: { color: colors.muted, fontSize: typography.caption, marginTop: spacing.sm, textAlign: 'center' },
});
