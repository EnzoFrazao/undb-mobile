import { Text, View } from 'react-native';

import AuthLayout from '../AuthLayout';
import ActionButton from '../ActionButton';
import { getWelcomeMessage } from '../../services/welcome';
import styles from './styles';

export default function WelcomeScreen({ user, onLogout, onContinue }) {
  const welcomeMessage = getWelcomeMessage(user.role);

  return (
    <AuthLayout
      heading={`Olá, ${user.name}`}
      description="Seu acesso foi identificado com sucesso."
    >
      <View style={styles.profile}>
        <Text style={styles.profileCaption}>Perfil de acesso</Text>
        <Text style={styles.profileName}>{user.roleLabel}</Text>
        <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>
      </View>
      <View style={styles.actions}>
        <ActionButton label="Continuar" onPress={onContinue} />
        <ActionButton label="Sair" onPress={onLogout} secondary />
      </View>
    </AuthLayout>
  );
}
