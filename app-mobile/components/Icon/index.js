import { View } from 'react-native';
import styles from './styles';

const shapes = {
  work: ['building', 'windowTop', 'windowBottom'],
  report: ['page', 'lineTop', 'lineBottom'],
  review: ['reviewBox', 'check'],
  notice: ['bell', 'clapper'],
  account: ['head', 'shoulders'],
  calendar: ['reviewBox', 'lineTop', 'bindingLeft', 'bindingRight'],
  gallery: ['reviewBox', 'landscape'],
  camera: ['cameraBody', 'lens', 'flash'],
  check: ['check'],
  pending: ['clock', 'hand'],
  returned: ['turn', 'returnArrow'],
  back: ['left'],
  next: ['right'],
  close: ['crossDown', 'crossUp'],
};

export default function Icon({ name, active = false, light = false }) {
  const color = light ? styles.light : active ? styles.active : styles.muted;
  return <View style={styles.frame} accessible={false} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
    {shapes[name]?.map((shape) => <View key={shape} style={[styles.piece, color, styles[shape]]} />)}
  </View>;
}
