import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme';
import { AuthAPI } from '../services/api';
import { useSession } from '../store/useSession';

export default function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const setPhoneStore = useSession(s => s.setPhone);
  const submit = async () => {
    try {
      if (!phone) return Alert.alert('Atenção', 'Informe o telemóvel');
      await AuthAPI.requestOTP(phone);
      setPhoneStore(phone);
      navigation.navigate('OTP');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.detail || e.message);
    }
  };
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center' }}>
      <Text style={{ color: colors.text, fontSize: 28, fontWeight: '700', marginBottom: 16 }}>A‑Taku</Text>
      <Text style={{ color: colors.sub, marginBottom: 8 }}>Telemóvel</Text>
      <TextInput placeholder="Ex: 84xxxxxxx" placeholderTextColor="#777" value={phone} onChangeText={setPhone}
        style={{ backgroundColor: colors.card, color: colors.text, padding: 14, borderRadius: 12, marginBottom: 16 }} />
      <TouchableOpacity onPress={submit} style={{ backgroundColor: colors.gold, padding: 14, borderRadius: 12 }}>
        <Text style={{ textAlign: 'center', color: '#111', fontWeight: '700' }}>Receber OTP</Text>
      </TouchableOpacity>
    </View>
  );
}
