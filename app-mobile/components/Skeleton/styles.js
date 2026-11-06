import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';
export default StyleSheet.create({
  loading: { flexDirection: 'row', gap: spacing.md, padding: spacing.lg, alignItems: 'center' },
  mark: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.action },
  label: { color: colors.ink, fontSize: typography.body },
});
export const pulseStyle = (opacity) => ({ opacity });
