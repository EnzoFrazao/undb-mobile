import { Platform } from 'react-native';
import Constants from 'expo-constants';

const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_URL = process.env.EXPO_PUBLIC_API_URL || (
  Platform.OS === 'web' ? `http://${window.location.hostname}:3001` : `http://${host || 'localhost'}:3001`
);
let token = '';
let unauthorizedHandler;
export const setUnauthorizedHandler = (handler) => { unauthorizedHandler = handler; };
export const setToken = (value) => { token = value; };

export async function request(route, method = 'GET', body) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${API_URL}/api${route}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok) {
      if (response.status === 401 && token && route !== '/login') unauthorizedHandler?.();
      const error = new Error(data.message || 'Não foi possível concluir a operação.');
      error.fields = data.fields; error.status = response.status;
      throw error;
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('A conexão demorou demais. Tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e o backend.');
    throw error;
  } finally { clearTimeout(timeout); }
}
