import { Pressable, ScrollView, Text, View } from 'react-native';

import Header from '../Header';
import { getWelcomeMessage } from '../../services/welcome';
import styles from './styles';

export default function WelcomeScreen({ user, onLogout }) {
  const welcomeMessage = getWelcomeMessage(user.role);

  return (
    <ScrollView
      contentContainerStyle={styles.screen}
      showsVerticalScrollIndicator={false}
    >
      <Header
        heading={`Olá, ${user.name}`}
        description="Seu acesso foi identificado com sucesso."
      />

      <View style={styles.contentSurface}>
        <View style={styles.content}>
          <Text style={styles.profileCaption}>Perfil de acesso</Text>
          <Text style={styles.profileName}>{user.roleLabel}</Text>
          <Text style={styles.welcomeMessage}>{welcomeMessage}</Text>

          <Pressable
            onPress={onLogout}
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.logoutButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sair"
            accessibilityHint="Encerra o acesso e volta para a tela de login"
          >
            <Text style={styles.logoutButtonText}>Sair</Text>
          </Pressable>
        </View>

        <Text style={styles.footer}>Diário de Obra Mobile</Text>
      </View>
    </ScrollView>
  );
}
