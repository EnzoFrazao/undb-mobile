import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  title: { color: colors.ink, fontSize: 25, lineHeight: 32, fontWeight: '800', marginBottom: 14 },
  section: { color: colors.ink, fontSize: 20, fontWeight: '700', marginTop: 20, marginBottom: 14 },
  caption: { color: colors.muted, fontSize: 14, fontWeight: '700', marginBottom: 6, marginTop: 22 },
  text: { color: colors.ink, fontSize: 16, lineHeight: 25 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, backgroundColor: '#FFF1D6' },
  signedBadge: { backgroundColor: colors.successWash },
  badgeText: { color: colors.ink, fontSize: 13, fontWeight: '700' },
  progress: { marginTop: 20, flexDirection: 'row', alignItems: 'baseline', gap: 10 },
  progressNumber: { color: colors.brand, fontSize: 30, fontWeight: '800' },
  progressLabel: { color: colors.muted, fontSize: 15 },
  photo: { width: '100%', height: 240, borderRadius: 12, marginBottom: 12 },
  signature: { backgroundColor: colors.successWash, borderRadius: 12, paddingHorizontal: 16, paddingBottom: 16, marginTop: 22 },
  small: { color: colors.muted, fontSize: 14, lineHeight: 21, marginVertical: 6 },
  hash: { color: colors.ink, fontSize: 12, lineHeight: 19 },
  versionRow: { borderBottomWidth: 1, borderColor: colors.border, paddingBottom: 14, marginBottom: 14, gap: 4 },
  versionTitle: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  versionNotice: { padding: 14, backgroundColor: colors.focusWash, borderRadius: 10, marginTop: 16, gap: 10 },
  actions: { marginTop: 20, gap: 12 },
  error: { color: colors.error, backgroundColor: colors.errorWash, padding: 14, borderRadius: 8, marginTop: 12, lineHeight: 22 },
});
