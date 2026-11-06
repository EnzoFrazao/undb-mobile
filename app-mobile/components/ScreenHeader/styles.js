import { Platform, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  header: { backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.borderSubtle, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg, minHeight: 44 },
  copy: { flex: 1 },
  title: { color: colors.ink, fontSize: typography.title, fontWeight: '800' },
  subtitle: { color: colors.muted, fontSize: typography.caption, marginTop: spacing.xs },
  back: { minHeight: 44, minWidth: 44, gap: spacing.sm, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing.sm },
  pressed: { opacity: 0.75 },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  link: { color: colors.actionPressed, fontSize: typography.body, fontWeight: '700', flexShrink: 1 },
});
