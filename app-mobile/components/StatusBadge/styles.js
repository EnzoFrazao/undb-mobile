import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  badge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.sm },
  label: { fontSize: typography.caption, fontWeight: '700' },
  pending: { backgroundColor: colors.focusWash },
  pendingLabel: { color: colors.actionPressed },
  signed: { backgroundColor: colors.successWash },
  signedLabel: { color: colors.success },
  returned: { backgroundColor: colors.warningWash },
  returnedLabel: { color: colors.warning },
});
