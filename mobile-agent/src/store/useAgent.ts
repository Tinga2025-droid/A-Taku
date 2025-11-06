import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
export const useAgent = create<{token:string|null,setToken:(t:string|null)=>Promise<void>}>((set)=>({ 
  token:null, setToken: async (t)=>{ if(t) await SecureStore.setItemAsync('agent_token',t); else await SecureStore.deleteItemAsync('agent_token'); set({token:t}); }
}));
