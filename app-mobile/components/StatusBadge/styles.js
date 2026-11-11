import { StyleSheet } from 'react-native';
import { colors, radii, spacing, typography, fonts } from '../../theme/tokens';

export default StyleSheet.create({
  badge: { alignSelf: 'flex-start', maxWidth: '100%', flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs, borderRadius: radii.sm },
  label: { flexShrink: 1, fontSize: typography.caption, fontFamily: fonts.bold },
  pending: { backgroundColor: colors.focusWash },
  pendingLabel: { color: colors.actionPressed },
  signed: { backgroundColor: colors.successWash },
  signedLabel: { color: colors.success },
  returned: { backgroundColor: colors.warningWash },
  returnedLabel: { color: colors.warning },
});
