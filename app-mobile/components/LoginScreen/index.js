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
  validateLoginFields,
} from '../../services/auth';
import { colors } from '../../theme/tokens';
import styles from './styles';

export default function LoginScreen({
  notice = '',
  initialEmail = '',
  onEmailChange,
  onAuthenticated,
  onRegisterPress,
}) {
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState(notice);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const submittingRef = useRef(false);

  function updateEmail(value) {
    setEmail(value);
    onEmailChange?.(value);
    setFormError('');
    setFormNotice('');

    if (errors.email) {
      setErrors((currentErrors) => ({ ...currentErrors, email: undefined }));
    }
  }

  function updatePassword(value) {
    setPassword(value);
    setFormError('');
    setFormNotice('');

    if (errors.password) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        password: undefined,
      }));
    }
  }

  async function handleSubmit() {
    if (submittingRef.current) {
      return;
    }

    setFormError('');
    setFormNotice('');

    const nextErrors = validateLoginFields({ email, password });
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.email) emailInputRef.current?.focus();
      else passwordInputRef.current?.focus();
      return;
    }

    Keyboard.dismiss();
    submittingRef.current = true;
    setIsSubmitting(true);
    try { await onAuthenticated(email, password); }
    catch (error) { setFormError(error.message); }
    finally { submittingRef.current = false; setIsSubmitting(false); }
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
        <Header compact description="Registre e acompanhe suas obras." />

        <View style={styles.formSurface}>
          <View style={styles.form}>
            {formNotice ? (
              <View
                style={styles.formNoticeBox}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                <Text style={styles.formNoticeText}>{formNotice}</Text>
              </View>
            ) : null}

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
                  testID="login-email"
                  value={email}
                  onChangeText={updateEmail}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  placeholder="nome@exemplo.com"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect={false}
                  inputMode="email"
                  keyboardType="email-address"
                  returnKeyType="next"
                  submitBehavior="submit"
                  maxLength={254}
                  editable={!isSubmitting}
                  accessibilityLabel="E-mail"
                  accessibilityHint="Digite o e-mail usado para entrar"
                />
              </View>
              {errors.email ? (
                <Text
                  style={styles.fieldError}
                  accessibilityLiveRegion="polite"
                >
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
                  testID="login-password"
                  value={password}
                  onChangeText={updatePassword}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={handleSubmit}
                  placeholder="Digite sua senha"
                  placeholderTextColor={colors.placeholder}
                  style={styles.input}
                  autoCapitalize="none"
                  autoComplete="password"
                  autoCorrect={false}
                  secureTextEntry={!passwordVisible}
                  returnKeyType="done"
                  maxLength={128}
                  editable={!isSubmitting}
                  accessibilityLabel="Senha"
                  accessibilityHint="Digite sua senha de acesso"
                />
                <Pressable
                  onPress={() => setPasswordVisible((current) => !current)}
                  disabled={isSubmitting}
                  style={({ pressed }) => [
                    styles.passwordToggle,
                    pressed && styles.passwordTogglePressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={
                    passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  accessibilityState={{ disabled: isSubmitting }}
                  hitSlop={4}
                >
                  <Text style={styles.passwordToggleText}>
                    {passwordVisible ? 'Ocultar' : 'Mostrar'}
                  </Text>
                </Pressable>
              </View>
              {errors.password ? (
                <Text
                  style={styles.fieldError}
                  accessibilityLiveRegion="polite"
                >
                  {errors.password}
                </Text>
              ) : null}
            </View>

            {formError ? (
              <View
                style={styles.formErrorBox}
                accessibilityRole="alert"
                accessibilityLiveRegion="assertive"
              >
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            ) : null}

            <Pressable
              testID="login-submit"
              onPress={handleSubmit}
              disabled={isSubmitting}
              style={({ pressed }) => [
                styles.submitButton,
                pressed && styles.submitButtonPressed,
                isSubmitting && styles.submitButtonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Entrar"
              accessibilityHint="Valida os dados e entra no aplicativo"
              accessibilityState={{ busy: isSubmitting, disabled: isSubmitting }}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </Text>
            </Pressable>

            <View style={styles.switchRow}>
              <Text style={styles.switchPrompt}>Primeiro acesso como cliente?</Text>
              <Pressable
                onPress={onRegisterPress}
                disabled={isSubmitting}
                style={({ pressed }) => [
                  styles.switchLink,
                  pressed && styles.switchLinkPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Criar conta de cliente"
                accessibilityState={{ disabled: isSubmitting }}
              >
                <Text style={styles.switchLinkText}>Criar conta</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.footer}>Dono e responsável entram com a conta fornecida pela empresa.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
