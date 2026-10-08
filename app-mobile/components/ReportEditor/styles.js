import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: 26, lineHeight: 32, fontWeight: '800', marginBottom: 6 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  section: { color: colors.ink, fontSize: 19, fontWeight: '700', marginBottom: 8 },
  actions: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  footer: { gap: 12, marginTop: 24 },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: 14, borderRadius: 8, fontSize: 15, lineHeight: 22, marginTop: 12 },
  photoRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 8, gap: 10 },
  thumbnail: { width: 52, height: 52, borderRadius: 8 },
  photoLabel: { flex: 1, color: colors.ink, fontSize: 15 },
  remove: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8 },
  removeText: { color: colors.error, fontWeight: '600' },
});
