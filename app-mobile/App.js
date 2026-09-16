import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import WelcomeScreen from './components/WelcomeScreen';
import { mockUsers } from './data/mockUsers';

export default function App() {
  const [users, setUsers] = useState(() => [...mockUsers]);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [loginFeedback, setLoginFeedback] = useState('');

  function handleAuthenticated(user) {
    setLoginFeedback('');
    setAuthenticatedUser(user);
  }

  function handleRegistered(user) {
    setUsers((currentUsers) => [...currentUsers, user]);
    setLoginFeedback('Cadastro realizado. Entre com seu e-mail e senha.');
    setCurrentScreen('login');
  }

  function handleLogout() {
    setAuthenticatedUser(null);
    setCurrentScreen('login');
  }

  return (
    <>
      {authenticatedUser ? (
        <WelcomeScreen user={authenticatedUser} onLogout={handleLogout} />
      ) : currentScreen === 'register' ? (
        <RegisterScreen
          users={users}
          onRegistered={handleRegistered}
          onLoginPress={() => setCurrentScreen('login')}
        />
      ) : (
        <LoginScreen
          users={users}
          notice={loginFeedback}
          onAuthenticated={handleAuthenticated}
          onRegisterPress={() => {
            setLoginFeedback('');
            setCurrentScreen('register');
          }}
        />
      )}
      <StatusBar style="light" />
    </>
  );
}
