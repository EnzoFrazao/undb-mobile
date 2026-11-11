import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  layout: { flex: 1, minHeight: 0 },
  wideLayout: { flexDirection: 'row' },
  main: { flex: 1, minWidth: 0, minHeight: 0 },
  scroll: { flex: 1 },
  columns: { flex: 1, minHeight: 0, flexDirection: 'row' },
  workPane: { width: 296, backgroundColor: colors.surface, borderRightWidth: 1, borderColor: colors.borderSubtle },
  paneContent: { padding: spacing.md, paddingBottom: spacing.xl },
  sidebar: { width: 204, backgroundColor: colors.brand },
  sidebarBrand: { padding: spacing.lg, paddingTop: spacing.xl, borderBottomWidth: 1, borderColor: colors.brandDivider },
  signature: { width: 156, height: 40 },
  sidebarTitle: { color: colors.textOnBrand, fontSize: typography.caption, fontFamily: fonts.bold, marginTop: spacing.md },
  sideNavigation: { padding: spacing.md, flexDirection: 'column', borderTopWidth: 0, gap: spacing.xs },
  sideItem: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', gap: spacing.sm, paddingHorizontal: spacing.md, borderTopWidth: 0, borderRadius: radii.sm },
  content: { width: '100%', maxWidth: 840, alignSelf: 'center', padding: spacing.lg, paddingBottom: spacing.xxl },
  navigation: { flexDirection: 'row', minHeight: 62, backgroundColor: colors.brand, borderTopWidth: 1, borderColor: colors.brandDivider },
  navItem: { flex: 1, minHeight: 44, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, padding: spacing.xs, borderTopWidth: 3, borderColor: 'transparent' },
  selected: { borderColor: colors.accent, backgroundColor: colors.brandSelected },
  navLabel: { color: colors.textOnBrand, fontSize: typography.caption, fontFamily: fonts.semibold, textAlign: 'center' },
  navActive: { color: colors.white, fontFamily: fonts.extraBold },
  navIcon: { position: 'relative' },
  mobileBadge: { position: 'absolute', top: -spacing.xs, left: 17 },
  badge: { color: colors.brand, backgroundColor: colors.accent, fontSize: typography.caption, fontFamily: fonts.extraBold, paddingHorizontal: spacing.sm, borderRadius: radii.sm },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.accent, outlineOffset: -2 } : {},
  pressed: { opacity: 0.75 },
});

export function transitionStyle(progress) {
  return {
    opacity: progress.interpolate({ inputRange: [0, 1], outputRange: [0.86, 1] }),
    transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }],
  };
}
