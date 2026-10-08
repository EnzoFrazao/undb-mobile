import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppFrame from './components/AppFrame';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import Workspace from './components/Workspace';
import { request, setToken, setUnauthorizedHandler } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState('login');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(''); setUser(null); setScreen('login'); setNotice('Sua sessão expirou. Faça login novamente.');
    });
    return () => setUnauthorizedHandler(undefined);
  }, []);
  async function login(email, password) {
    const session = await request('/login', 'POST', { email, password });
    setToken(session.token); setUser(session.user); setNotice('');
  }
  async function register(fields) {
    await request('/register', 'POST', fields);
    setNotice('Cadastro realizado. Entre com seu e-mail e senha.'); setScreen('login');
  }
  async function logout() {
    await request('/logout', 'POST');
    setToken(''); setUser(null); setScreen('login');
  }
  return <SafeAreaProvider><AppFrame>
    {user ? <Workspace user={user} onLogout={logout} /> : screen === 'register' ?
      <RegisterScreen onRegistered={register} onLoginPress={() => setScreen('login')} /> :
      <LoginScreen notice={notice} onAuthenticated={login} onRegisterPress={() => { setNotice(''); setScreen('register'); }} />}
    <StatusBar style="dark" />
  </AppFrame></SafeAreaProvider>;
}
