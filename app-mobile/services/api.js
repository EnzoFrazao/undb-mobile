import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { fetch as expoFetch } from 'expo/fetch';

const host = Constants.expoConfig?.hostUri?.split(':')[0];
export const API_URL = process.env.EXPO_PUBLIC_API_URL || (
  Platform.OS === 'web' ? `http://${window.location.hostname}:3001` : `http://${host || 'localhost'}:3001`
).replace(/\/+$/, '').replace(/\/api$/, '');
let token = '';
let unauthorizedHandler;
export const setUnauthorizedHandler = (handler) => { unauthorizedHandler = handler; };
export const setToken = (value) => { token = value; };

export async function request(route, method = 'GET', body, format = 'json', { handleUnauthorized = true } = {}) {
  const requestToken = token;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), format === 'pdf' ? 45000 : 20000);
  try {
    const send = format === 'pdf' && Platform.OS !== 'web' ? expoFetch : fetch;
    const response = await send(`${API_URL}/api${route}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(requestToken ? { Authorization: `Bearer ${requestToken}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) {
      if (handleUnauthorized && response.status === 401 && requestToken && requestToken === token && route !== '/login') unauthorizedHandler?.();
      const data = await response.json().catch(() => ({}));
      const error = new Error(data.message || 'Não foi possível concluir a operação.');
      error.fields = data.fields; error.status = response.status;
      throw error;
    }
    if (format === 'pdf') {
      if (!response.headers.get('content-type')?.startsWith('application/pdf')) {
        throw new Error('O servidor não retornou um PDF válido.');
      }
      return new Uint8Array(await response.arrayBuffer());
    }
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('A conexão demorou demais. Tente novamente.');
    if (error instanceof TypeError) throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão e o backend.');
    throw error;
  } finally { clearTimeout(timeout); }
}
