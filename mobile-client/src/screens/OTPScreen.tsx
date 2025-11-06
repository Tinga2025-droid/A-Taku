import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme';
import { AuthAPI } from '../services/api';
import { useSession } from '../store/useSession';

export default function OTPScreen() {
  const [otp, setOtp] = useState('');
  const phone = useSession(s => s.phone);
  const setToken = useSession(s => s.setToken);

  const submit = async () => {
    try {
      if (!phone) return;
      const r = await AuthAPI.loginWithOTP(phone, otp);
      await setToken(r.token);
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.detail || e.message);
    }
  };

  return (
    <View style={{ flex:1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Confirmar OTP</Text>
      <Text style={{ color: colors.sub, marginBottom: 8 }}>Código recebido</Text>
      <TextInput placeholder="000000" placeholderTextColor="#777" value={otp} onChangeText={setOtp} keyboardType="number-pad"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 14, borderRadius: 12, marginBottom: 16 }} />
      <TouchableOpacity onPress={submit} style={{ backgroundColor: colors.gold, padding: 14, borderRadius: 12 }}>
        <Text style={{ textAlign: 'center', color: '#111', fontWeight: '700' }}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
