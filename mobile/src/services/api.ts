import Constants from 'expo-constants';
import { Platform } from 'react-native';

function getApiUrl(): string {
  const hostUri = Constants.expoConfig?.hostUri;

  const basePort = ':3333/api';

  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}${basePort}`;
  }

  if (Platform.OS === 'android') {
    return `http://10.0.2.2${basePort}`;
  }

  return `http://localhost${basePort}`;
}

export const API_URL = getApiUrl();

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || `Erro na requisição (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
