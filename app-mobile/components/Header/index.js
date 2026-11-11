import { Image, Text, View } from 'react-native';

import { expo } from '../../app.json';
import styles from './styles';

export default function Header({ wide }) {
  return (
    <View style={[styles.container, wide && styles.wide]}>
      <Image
        source={require('../../assets/planengen-pattern.png')}
        style={[styles.pattern, wide ? styles.widePattern : styles.compactPattern]}
        resizeMode="cover"
        accessible={false}
        importantForAccessibility="no"
        pointerEvents="none"
      />
      <Image
        source={require('../../assets/planengen-signature.png')}
        style={[styles.signature, wide && styles.wideSignature]}
        resizeMode="contain"
        accessible
        accessibilityLabel="Planengen Consultoria e Construção"
      />
      <View style={[styles.copy, wide && styles.wideCopy]}>
        <Text style={[styles.title, wide && styles.wideTitle]}>{expo.name}</Text>
        <Text style={styles.description}>Registre e acompanhe o andamento das suas obras.</Text>
      </View>
    </View>
  );
}
