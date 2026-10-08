import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  calendar: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 10, marginBottom: 20 },
  heading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  arrow: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  arrowText: { color: colors.actionPressed, fontSize: 30 },
  month: { color: colors.ink, fontWeight: '700', fontSize: 16, textTransform: 'capitalize' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  weekday: { width: '14.2857%', paddingVertical: 8, textAlign: 'center', color: colors.muted, fontWeight: '700', fontSize: 14 },
  cell: { width: '14.2857%', minHeight: 44, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
  selected: { backgroundColor: colors.action },
  day: { color: colors.ink, fontSize: 15 },
  selectedText: { color: colors.white, fontWeight: '700' },
  dot: { width: 4, height: 4, marginTop: 3, borderRadius: 2, backgroundColor: 'transparent' },
  dotActive: { backgroundColor: colors.action },
  dotSelected: { backgroundColor: colors.white },
  legend: { color: colors.muted, fontSize: 13, marginTop: 8, textAlign: 'center' },
});
