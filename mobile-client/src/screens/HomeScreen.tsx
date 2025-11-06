import React, { useEffect, useState } from 'react';
import { View, Text, RefreshControl, ScrollView } from 'react-native';
import { colors } from '../theme';
import { WalletAPI } from '../services/api';
export default function HomeScreen() {
  const [bal, setBal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const load = async () => {
    setLoading(true);
    try { const r = await WalletAPI.balance(); setBal(r.balance); } finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);
  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.bg }} refreshControl={<RefreshControl refreshing={loading} onRefresh={load} />}>
      <View style={{ padding: 24 }}>
        <Text style={{ color: colors.sub }}>Saldo</Text>
        <Text style={{ color: colors.text, fontSize: 36, fontWeight: '800', marginTop: 6 }}>{bal.toLocaleString(undefined, { style:'currency', currency:'MZN' })}</Text>
      </View>
    </ScrollView>
  );
}
