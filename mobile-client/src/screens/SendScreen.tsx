import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { colors } from '../theme';
import { WalletAPI } from '../services/api';
export default function SendScreen() {
  const [to, setTo] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async () => {
    try {
      setBusy(true);
      const idem = `${to}-${amount}-${Date.now()}`;
      await WalletAPI.send(to, Number(amount), idem);
      Alert.alert('Sucesso', 'Transferência concluída');
      setTo(''); setAmount('');
    } catch (e: any) {
      Alert.alert('Erro', e?.response?.data?.detail || e.message);
    } finally { setBusy(false); }
  };
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 12 }}>Enviar dinheiro</Text>
      <Text style={{ color: colors.sub, marginBottom: 8 }}>Para (telemóvel)</Text>
      <TextInput value={to} onChangeText={setTo} placeholder="84xxxxxxx" placeholderTextColor="#777"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 14, borderRadius: 12, marginBottom: 12 }} />
      <Text style={{ color: colors.sub, marginBottom: 8 }}>Valor (MZN)</Text>
      <TextInput value={amount} onChangeText={setAmount} keyboardType="decimal-pad" placeholder="0" placeholderTextColor="#777"
        style={{ backgroundColor: colors.card, color: colors.text, padding: 14, borderRadius: 12, marginBottom: 16 }} />
      <TouchableOpacity disabled={busy} onPress={submit} style={{ backgroundColor: colors.gold, padding: 14, borderRadius: 12, opacity: busy?0.7:1 }}>
        <Text style={{ textAlign: 'center', color: '#111', fontWeight: '700' }}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}
