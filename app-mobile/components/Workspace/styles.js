import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  layout: { flex: 1, minHeight: 0 },
  wideLayout: { flexDirection: 'row' },
  main: { flex: 1, minWidth: 0, minHeight: 0 },
  scroll: { flex: 1 },
  columns: { flex: 1, minHeight: 0, flexDirection: 'row' },
  workPane: { width: 296, backgroundColor: colors.surface, borderRightWidth: 1, borderColor: colors.borderSubtle },
  paneContent: { padding: spacing.md, paddingBottom: spacing.xl },
  sideNavigation: { width: 160, padding: spacing.sm, flexDirection: 'column', borderTopWidth: 0, borderRightWidth: 1, gap: spacing.sm },
  sideItem: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: spacing.md, borderTopWidth: 0, borderRadius: radii.sm },
  content: { width: '100%', maxWidth: 840, alignSelf: 'center', padding: spacing.lg, paddingBottom: spacing.xxl },
  navigation: { flexDirection: 'row', minHeight: 68, backgroundColor: colors.surface, borderTopWidth: 1, borderColor: colors.borderSubtle },
  navItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.xs, borderTopWidth: 3, borderColor: 'transparent' },
  selected: { borderColor: colors.action, backgroundColor: colors.focusWash },
  navLabel: { color: colors.muted, fontSize: typography.caption, fontWeight: '600', textAlign: 'center' },
  navActive: { color: colors.actionPressed, fontWeight: '800' },
  navIcon: { position: 'relative' },
  mobileBadge: { position: 'absolute', top: -spacing.xs, left: 17 },
  badge: { color: colors.white, backgroundColor: colors.actionPressed, fontSize: typography.caption, fontWeight: '700', paddingHorizontal: spacing.sm, borderRadius: radii.sm },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: -2 } : {},
  pressed: { opacity: 0.75 },
});

export function transitionStyle(progress) {
  return {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }),
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
  };
}
