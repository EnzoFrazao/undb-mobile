import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './styles';

export default function AppFrame({ children }) {
  return <View style={styles.canvas}><SafeAreaView style={styles.device} edges={['top', 'bottom']}>{children}</SafeAreaView></View>;
}
