import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({ baseURL: (Constants.expoConfig as any)?.extra?.apiUrl });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
});

export const AuthAPI = {
  requestOTP: (phone: string) => api.post('/auth/otp', { phone }).then(r => r.data),
  loginWithOTP: (phone: string, otp: string) => api.post('/auth/login', { phone, otp }).then(r => r.data as { token: string }),
};

export const WalletAPI = {
  balance: () => api.get('/wallet/balance').then(r => r.data as { balance: number }),
  send: (to: string, amount: number, idempotencyKey?: string) =>
    api.post('/wallet/send', { to, amount, idempotency_key: idempotencyKey }, { headers: { 'X-Idempotency-Key': idempotencyKey } }).then(r => r.data),
  history: () => api.get('/wallet/history').then(r => r.data as { items: Array<{ref:string, amount:number, created_at:string, direction:'IN'|'OUT'}> }),
};
