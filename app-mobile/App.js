import { useEffect, useState } from 'react';
import { Manrope_400Regular } from '@expo-google-fonts/manrope/400Regular';
import { Manrope_600SemiBold } from '@expo-google-fonts/manrope/600SemiBold';
import { Manrope_700Bold } from '@expo-google-fonts/manrope/700Bold';
import { Manrope_800ExtraBold } from '@expo-google-fonts/manrope/800ExtraBold';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppFrame from './components/AppFrame';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Skeleton from './components/Skeleton';
import Workspace from './components/Workspace';
import { expo } from './app.json';
import { ToastProvider, useToast } from './components/Toast';
import { API_URL, request, setToken, setUnauthorizedHandler } from './services/api';
import { createSessionStore } from './services/sessionStore.cjs';
import { fonts } from './theme/tokens';

const sessions = createSessionStore(AsyncStorage, API_URL);
const fontAssets = {
  [fonts.regular]: Manrope_400Regular,
  [fonts.semibold]: Manrope_600SemiBold,
  [fonts.bold]: Manrope_700Bold,
  [fonts.extraBold]: Manrope_800ExtraBold,
};

function AppContent() {
  const [user, setUser] = useState(null);
  const [restoring, setRestoring] = useState(true);
  const [restored, setRestored] = useState(false);
  const [screen, setScreen] = useState('login');
  const [notice, setNotice] = useState('');
  const [loginDraft, setLoginDraft] = useState({ email: '' });
  const [registerDraft, setRegisterDraft] = useState({ name: '', email: '' });
  const toast = useToast();

  useEffect(() => {
    let active = true;
    setUnauthorizedHandler(() => {
      setToken(''); setUser(null); setScreen('login'); setNotice('Sua sessão expirou. Faça login novamente.');
      sessions.clear().catch(() => {});
    });
    sessions.load().then((session) => {
      if (!active || !session) return;
      setToken(session.token);
      setUser(session.user);
      setRestored(true);
    }).catch(() => {}).finally(() => { if (active) setRestoring(false); });
    return () => { active = false; setUnauthorizedHandler(undefined); };
  }, []);

  async function login(email, password) {
    const session = await request('/login', 'POST', { email, password });
    try { await sessions.save(session); }
    catch { toast.show({ message: 'O acesso funciona nesta tela, mas não pôde ser salvo neste dispositivo.', type: 'info' }); }
    setToken(session.token); setUser(session.user); setRestored(false); setNotice('');
    setLoginDraft({ email: '' }); setRegisterDraft({ name: '', email: '' });
  }
  async function register(fields) {
    await request('/register', 'POST', fields);
    setLoginDraft({ email: fields.email }); setRegisterDraft({ name: '', email: '' });
    setNotice('Cadastro realizado. Entre com seu e-mail e senha.'); setScreen('login');
  }
  async function logout() {
    const revocation = request('/logout', 'POST', undefined, 'json', { handleUnauthorized: false });
    setToken('');
    try { await sessions.clear(); }
    catch { toast.show({ message: 'Não foi possível remover a sessão salva neste dispositivo.', type: 'error' }); }
    setUser(null); setScreen('login'); setNotice('');
    revocation.catch((error) => {
      if (error.status !== 401) toast.show({ message: 'Você saiu neste aparelho. A sessão no servidor pode continuar ativa até expirar.', type: 'info' });
    });
  }

  let content;
  if (restoring) content = <Skeleton label={`Abrindo ${expo.name}…`} />;
  else if (user) content = <Workspace user={user} skipWelcome={restored || user.guideSeen} restoreTab={restored} onLogout={logout} />;
  else if (screen === 'register') content = <RegisterScreen initial={registerDraft} onDraftChange={setRegisterDraft} onRegistered={register} onLoginPress={() => setScreen('login')} />;
  else content = <LoginScreen initialEmail={loginDraft.email} onEmailChange={(email) => setLoginDraft({ email })} notice={notice} onAuthenticated={login} onRegisterPress={() => { setNotice(''); setScreen('register'); }} />;
  return <AppFrame branded={!restoring}>{content}<StatusBar style={restoring ? 'dark' : 'light'} /></AppFrame>;
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  if (!fontsLoaded && !fontError) return null;
  return <SafeAreaProvider><ToastProvider><AppContent /></ToastProvider></SafeAreaProvider>;
}
