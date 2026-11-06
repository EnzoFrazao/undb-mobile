import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppFrame from './components/AppFrame';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Skeleton from './components/Skeleton';
import Workspace from './components/Workspace';
import { ToastProvider, useToast } from './components/Toast';
import { API_URL, request, setToken, setUnauthorizedHandler } from './services/api';
import { createSessionStore } from './services/sessionStore.cjs';

const sessions = createSessionStore(AsyncStorage, API_URL);

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

  const auth = !restoring && !user;
  let content;
  if (restoring) content = <Skeleton label="Abrindo Diário de Obra…" />;
  else if (user) content = <Workspace user={user} skipWelcome={restored || user.guideSeen} restoreTab={restored} onLogout={logout} />;
  else if (screen === 'register') content = <RegisterScreen initial={registerDraft} onDraftChange={setRegisterDraft} onRegistered={register} onLoginPress={() => setScreen('login')} />;
  else content = <LoginScreen initialEmail={loginDraft.email} onEmailChange={(email) => setLoginDraft({ email })} notice={notice} onAuthenticated={login} onRegisterPress={() => { setNotice(''); setScreen('register'); }} />;
  return <AppFrame auth={auth}>{content}<StatusBar style={auth ? 'light' : 'dark'} /></AppFrame>;
}

export default function App() {
  return <SafeAreaProvider><ToastProvider><AppContent /></ToastProvider></SafeAreaProvider>;
}
