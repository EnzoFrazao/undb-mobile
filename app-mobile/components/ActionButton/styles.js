import { Platform, StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, sizes, fonts } from '../../theme/tokens';
export default StyleSheet.create({
  button: { minHeight: sizes.buttonPrimary, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderRadius: radii.md, backgroundColor: colors.action, flexDirection: 'row', gap: spacing.sm, alignItems: 'center', justifyContent: 'center' },
  focused: Platform.OS === 'web' ? { outlineStyle: 'solid', outlineWidth: 2, outlineColor: colors.focusBorder, outlineOffset: 2 } : {},
  secondary: { minHeight: sizes.buttonSecondary, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.5 },
  label: { color: colors.white, fontSize: typography.body, fontFamily: fonts.bold, textAlign: 'center', flexShrink: 1 },
  secondaryLabel: { color: colors.ink },
});
