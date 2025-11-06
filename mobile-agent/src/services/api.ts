import axios from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
const api = axios.create({ baseURL: (Constants.expoConfig as any)?.extra?.apiUrl });
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('agent_token');
  if (token) (config.headers as any).Authorization = `Bearer ${token}`;
  return config;
});
export const AgentAPI = {
  login: (phone: string, pin: string) => api.post('/agent/login', { phone, pin }).then(r => r.data as { token: string }),
  deposit: (customer_phone: string, amount: number, idem?: string) => api.post('/agent/deposit', { customer_phone, amount, idempotency_key: idem }).then(r => r.data),
  cashout: (customer_phone: string, amount: number, idem?: string) => api.post('/agent/cashout', { customer_phone, amount, idempotency_key: idem }).then(r => r.data),
};
