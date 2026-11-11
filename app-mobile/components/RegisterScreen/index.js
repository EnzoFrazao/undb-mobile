import { useRef, useState } from 'react';
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { focusFirstError } from '../../services/formErrors';
import AuthLayout from '../AuthLayout';
import Choice from '../Choice';
import {
  validateRegistrationFields,
} from '../../services/registration';
import { colors } from '../../theme/tokens';
import styles from './styles';

export default function RegisterScreen({ onRegistered, onLoginPress, initial, onDraftChange }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [consent, setConsent] = useState(false);
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const sending = useRef(false);
  const scrollRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmationInputRef = useRef(null);

  function focusError(nextErrors) {
    const refs = { name: nameInputRef, email: emailInputRef, password: passwordInputRef, passwordConfirmation: confirmationInputRef };
    focusFirstError(nextErrors, Object.keys(refs), refs, scrollRef);
  }

  function updateField(field, value) {
    const setters = {
      name: setName,
      email: setEmail,
      password: setPassword,
      passwordConfirmation: setPasswordConfirmation,
    };

    setters[field](value);
    if (field === 'name' || field === 'email') onDraftChange?.({ name, email, [field]: value });

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

  async function handleSubmit() {
    if (sending.current) return;

    const fields = { name, email, password, passwordConfirmation };
    const nextErrors = validateRegistrationFields(fields);
    if (!consent) nextErrors.consent = 'Confirme o consentimento para criar sua conta.';
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      focusError(nextErrors);
      return;
    }
    Keyboard.dismiss();
    sending.current = true;

    setBusy(true); setFormError('');
    try { await onRegistered({ ...fields, consent }); }
    catch (error) { setFormError(error.message); if (error.fields) { setErrors(error.fields); focusError(error.fields); } }
    finally { sending.current = false; setBusy(false); }
  }

  return (
    <AuthLayout
      heading="Crie sua conta"
      description="O novo acesso será criado com o perfil Cliente."
      scrollRef={scrollRef}
    >
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
            ref={nameInputRef}
            maxLength={100}
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
            submitBehavior="submit"
            returnKeyType="next"
            editable={!busy}
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
            maxLength={254}
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
            submitBehavior="submit"
            returnKeyType="next"
            editable={!busy}
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
            placeholder="Digite uma senha"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            autoCapitalize="none"
            maxLength={128}
            autoComplete="new-password"
            autoCorrect={false}
            secureTextEntry={!passwordVisible}
            submitBehavior="submit"
            returnKeyType="next"
            editable={!busy}
            accessibilityLabel="Senha"
          />
          <Pressable
            disabled={busy}
            onPress={() => setPasswordVisible((current) => !current)}
            style={({ pressed }) => [
              styles.passwordToggle,
              pressed && styles.passwordTogglePressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? 'Ocultar senha' : 'Mostrar senha'
            }
            accessibilityState={{ expanded: passwordVisible }}
            hitSlop={4}
          >
            <Text style={styles.passwordToggleText}>
              {passwordVisible ? 'Ocultar' : 'Mostrar'}
            </Text>
          </Pressable>
        </View>
        <Text style={styles.switchPrompt}>Use de 6 a 128 caracteres.</Text>
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
            placeholder="Repita a senha"
            placeholderTextColor={colors.placeholder}
            style={styles.input}
            autoCapitalize="none"
            maxLength={128}
            autoComplete="new-password"
            autoCorrect={false}
            secureTextEntry={!confirmationVisible}
            returnKeyType="done"
            editable={!busy}
            accessibilityLabel="Confirmar senha"
          />
          <Pressable disabled={busy} accessibilityRole="button" accessibilityLabel={confirmationVisible ? 'Ocultar confirmação' : 'Mostrar confirmação'}
            onPress={() => setConfirmationVisible(!confirmationVisible)} style={styles.passwordToggle}>
            <Text style={styles.passwordToggleText}>{confirmationVisible ? 'Ocultar' : 'Mostrar'}</Text>
          </Pressable>
        </View>
        {errors.passwordConfirmation ? (
          <Text style={styles.fieldError} accessibilityLiveRegion="polite">
            {errors.passwordConfirmation}
          </Text>
        ) : null}
      </View>

      <Choice disabled={busy} label="Concordo com o uso do meu nome e e-mail para identificação e acesso às minhas obras." selected={consent} onPress={() => { setConsent(!consent); setErrors((previous) => ({ ...previous, consent: undefined })); }} />
      {errors.consent ? <Text style={styles.fieldError}>{errors.consent}</Text> : null}
      {formError ? <Text style={styles.fieldError} accessibilityRole="alert">{formError}</Text> : null}
      <Pressable
        onPress={handleSubmit}
        disabled={busy}
        style={({ pressed }) => [
          styles.submitButton,
          pressed && styles.submitButtonPressed,
        ]}
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        accessibilityLabel="Criar conta"
        accessibilityHint="Cria uma conta local com o perfil Cliente"
      >
        <Text style={styles.submitButtonText}>{busy ? 'Criando conta...' : 'Criar conta'}</Text>
      </Pressable>

      <View style={styles.switchRow}>
        <Text style={styles.switchPrompt}>Já possui uma conta?</Text>
        <Pressable
          onPress={onLoginPress}
          disabled={busy}
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
    </AuthLayout>
  );
}
