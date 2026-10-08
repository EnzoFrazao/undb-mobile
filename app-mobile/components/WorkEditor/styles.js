import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 18 },
  section: { color: colors.ink, fontSize: 19, fontWeight: '700', marginVertical: 14 },
  actions: { marginTop: 24, gap: 12 },
  operator: { marginTop: 16, gap: 10 },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: 14, borderRadius: 8, lineHeight: 22, marginTop: 14 },
});
