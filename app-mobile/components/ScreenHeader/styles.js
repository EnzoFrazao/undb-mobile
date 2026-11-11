import { Platform, StyleSheet } from 'react-native';
import { colors, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  header: { backgroundColor: colors.brand, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  wideHeader: { backgroundColor: colors.surface, borderBottomWidth: 1, borderColor: colors.borderSubtle, paddingHorizontal: spacing.xl },
  line: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  mark: { width: 22, height: 38 },
  copy: { flex: 1, minWidth: 0 },
  title: { color: colors.white, fontSize: typography.title, fontFamily: fonts.extraBold },
  wideTitle: { color: colors.ink },
  subtitle: { color: colors.textOnBrand, fontFamily: fonts.regular, fontSize: typography.caption, marginTop: spacing.xs },
  wideSubtitle: { color: colors.muted },
  back: { minHeight: 44, minWidth: 44, gap: spacing.sm, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: spacing.sm },
  pressed: { opacity: 0.75 },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.accent, outlineOffset: -2 } : {},
  link: { color: colors.white, fontSize: typography.body, fontFamily: fonts.bold, flexShrink: 1 },
  wideLink: { color: colors.actionPressed },
});
