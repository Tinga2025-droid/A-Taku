import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../theme';
import { useSession } from '../store/useSession';
export default function SettingsScreen() {
  const setToken = useSession(s => s.setToken);
  const setPhone = useSession(s => s.setPhone);
  const logout = async () => { await setToken(null); setPhone(null); };
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Definições</Text>
      <TouchableOpacity onPress={logout} style={{ backgroundColor: colors.card, padding: 14, borderRadius: 12 }}>
        <Text style={{ color: colors.gold, textAlign: 'center', fontWeight: '700' }}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}
