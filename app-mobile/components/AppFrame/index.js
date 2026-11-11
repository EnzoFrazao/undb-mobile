import { Platform, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function AppFrame({ children, branded }) {
  const { width } = useWindowDimensions();
  const wide = Platform.OS === 'web' && width >= 900;
  return <View style={styles.canvas}>
    <SafeAreaView style={[styles.device, wide && styles.wide, branded && styles.brandTop]} edges={['top', 'left', 'right']}>
      <SafeAreaView style={styles.body} edges={['bottom']}>{children}</SafeAreaView>
    </SafeAreaView>
  </View>;
}
