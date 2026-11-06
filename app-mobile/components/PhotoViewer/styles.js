import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme/tokens';

export default StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ink, padding: spacing.lg, gap: spacing.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.sm },
  caption: { color: colors.white, fontSize: typography.bodyLarge, fontWeight: '700' },
  body: { flex: 1, minHeight: 0 },
  scroll: { flex: 1 },
  footer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.sm },
});
export const imageSize = ({ width, height }, zoomed) => ({ width: width * (zoomed ? 2 : 1), height: height * (zoomed ? 2 : 1) });
