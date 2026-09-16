import { Text, View } from 'react-native';

import styles from './styles';

export default function Header({
  title = 'Diário de Obra',
  heading = 'Acesse sua conta',
  description = 'Entre com seu e-mail e senha para continuar.',
}) {
  return (
    <View style={styles.container} accessibilityRole="header">
      <View
        style={styles.brandMark}
        importantForAccessibility="no-hide-descendants"
      >
        <View style={styles.brandMarkBack} />
        <View style={styles.brandMarkFront} />
      </View>

      <Text style={styles.brand}>{title}</Text>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}
