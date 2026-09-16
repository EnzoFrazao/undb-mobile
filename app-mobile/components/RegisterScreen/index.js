import { useRef, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import Header from '../Header';
import {
  createClientUser,
  validateRegistrationFields,
} from '../../services/registration';
import { colors } from '../../theme/tokens';
import styles from './styles';

export default function RegisterScreen({ users, onRegistered, onLoginPress }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmationInputRef = useRef(null);

  function updateField(field, value) {
    const setters = {
      name: setName,
      email: setEmail,
      password: setPassword,
      passwordConfirmation: setPasswordConfirmation,
    };

    setters[field](value);

    if (
      errors[field] ||
      (field === 'password' && errors.passwordConfirmation)
    ) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [field]: undefined,
        ...(field === 'password'
          ? { passwordConfirmation: undefined }
          : {}),
      }));
    }
  }

  function handleSubmit() {
    Keyboard.dismiss();

    const fields = { name, email, password, passwordConfirmation };
    const nextErrors = validateRegistrationFields(fields, users);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onRegistered(createClientUser(fields));
  }

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Header
          heading="Crie sua conta"
          description="O novo acesso será criado com o perfil Cliente."
        />

        <View style={styles.formSurface}>
          <View style={styles.form}>
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Nome</Text>
              <View
                style={[
                  styles.inputShell,
                  focusedField === 'name' && styles.inputShellFocused,
                  errors.name && styles.inputShellError,
                ]}
              >
                <TextInput
                  value={name}
                  onChangeText={(value) => updateField('name', value)}
                  onFocus={() => setFocusedField('name')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  placeholder="Digite seu nome"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="words"
                  autoComplete="name"
                  returnKeyType="next"
                  accessibilityLabel="Nome"
                />
              </View>
              {errors.name ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {errors.name}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View
                style={[
                  styles.inputShell,
                  focusedField === 'email' && styles.inputShellFocused,
                  errors.email && styles.inputShellError,
                ]}
              >
                <TextInput
                  ref={emailInputRef}
                  value={email}
                  onChangeText={(value) => updateField('email', value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  placeholder="seuemail@empresa.com.br"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  accessibilityLabel="E-mail"
                />
              </View>
              {errors.email ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {errors.email}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Senha</Text>
              <View
                style={[
                  styles.inputShell,
                  focusedField === 'password' && styles.inputShellFocused,
                  errors.password && styles.inputShellError,
                ]}
              >
                <TextInput
                  ref={passwordInputRef}
                  value={password}
                  onChangeText={(value) => updateField('password', value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() =>
                    confirmationInputRef.current?.focus()
                  }
                  placeholder="Mínimo de 6 caracteres"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  returnKeyType="next"
                  accessibilityLabel="Senha"
                />
                <Pressable
                  onPress={() => setPasswordVisible((current) => !current)}
                  style={({ pressed }) => [
                    styles.passwordToggle,
                    pressed && styles.passwordTogglePressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? 'Ocultar senhas' : 'Mostrar senhas'
                  }
                  accessibilityState={{ expanded: passwordVisible }}
                  hitSlop={4}
                >
                  <Text style={styles.passwordToggleText}>
                    {passwordVisible ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              </View>
              {errors.password ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {errors.password}
                </Text>
              ) : null}
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View
                style={[
                  styles.inputShell,
                  focusedField === 'passwordConfirmation' &&
                    styles.inputShellFocused,
                  errors.passwordConfirmation && styles.inputShellError,
                ]}
              >
                <TextInput
                  ref={confirmationInputRef}
                  value={passwordConfirmation}
                  onChangeText={(value) =>
                    updateField('passwordConfirmation', value)
                  }
                  onFocus={() => setFocusedField('passwordConfirmation')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={handleSubmit}
                  placeholder="Digite a senha novamente"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  returnKeyType="done"
                  accessibilityLabel="Confirmar senha"
                />
              </View>
              {errors.passwordConfirmation ? (
                <Text style={styles.fieldError} accessibilityLiveRegion="polite">
                  {errors.passwordConfirmation}
                </Text>
              ) : null}
            </View>

            <Pressable
              onPress={handleSubmit}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Criar conta"
              accessibilityHint="Cria uma conta local com o perfil Cliente"
            >
              <Text style={styles.submitButtonText}>Criar conta</Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>Já possui uma conta?</Text>
              <Pressable
                onPress={onLoginPress}
                style={({ pressed }) => [
                  styles.switchLink,
                  pressed && styles.switchLinkPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Fazer login"
              >
                <Text style={styles.switchLinkText}>Fazer login</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>Diário de Obra Mobile</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
