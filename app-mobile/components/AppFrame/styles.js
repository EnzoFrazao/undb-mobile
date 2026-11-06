import { StyleSheet } from 'react-native';
import { colors } from '../../theme/tokens';
export default StyleSheet.create({
  canvas: { flex: 1, backgroundColor: colors.outerCanvas, alignItems: 'center' },
  body: { flex: 1, backgroundColor: colors.canvas },
  brandTop: { backgroundColor: colors.brand },
  wide: { maxWidth: 1280 },
  device: { flex: 1, width: '100%', maxWidth: 480, backgroundColor: colors.canvas },
});
