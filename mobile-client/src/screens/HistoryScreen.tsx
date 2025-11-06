import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { colors } from '../theme';
import { WalletAPI } from '../services/api';
export default function HistoryScreen() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { WalletAPI.history().then(r => setItems(r.items)); }, []);
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, padding: 16 }}>
      <FlatList data={items} keyExtractor={(i) => i.ref}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: colors.card, padding: 14, borderRadius: 12, marginBottom: 10 }}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{item.direction} · {Number(item.amount).toFixed(2)} MZN</Text>
            <Text style={{ color: colors.sub }}>{new Date(item.created_at).toLocaleString()}</Text>
            <Text style={{ color: colors.sub, fontSize: 12 }}>Ref: {item.ref}</Text>
          </View>
        )}
      />
    </View>
  );
}
