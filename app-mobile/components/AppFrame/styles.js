import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  canvas: { flex: 1, backgroundColor: '#E8EDF4', alignItems: 'center' },
  device: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: colors.canvas },
});
