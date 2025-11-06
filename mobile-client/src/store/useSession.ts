import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

type SessionState = {
  token: string | null;
  phone: string | null;
  setToken: (t: string | null) => Promise<void>;
  setPhone: (p: string | null) => void;
};

export const useSession = create<SessionState>((set) => ({
  token: null,
  phone: null,
  setPhone: (p) => set({ phone: p }),
  setToken: async (t) => {
    if (t) await SecureStore.setItemAsync('token', t);
    else await SecureStore.deleteItemAsync('token');
    set({ token: t });
  },
}));
