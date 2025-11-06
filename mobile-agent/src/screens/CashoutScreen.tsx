import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AgentAPI } from '../services/api';
export default function CashoutScreen(){
  const [phone,setPhone]=useState(''); const [amount,setAmount]=useState('');
  const submit=async()=>{ try{ const idem=`CSO-${phone}-${amount}-${Date.now()}`; const r=await AgentAPI.cashout(phone,Number(amount),idem); Alert.alert('OK',`Levantamento: taxa ${r.fee.toFixed(2)} (owner ${r.split.owner.toFixed(2)} / agente ${r.split.agent.toFixed(2)})`); setPhone(''); setAmount(''); }catch(e:any){Alert.alert('Erro', e?.response?.data?.detail||e.message);} };
  return (<View style={{flex:1,padding:24,backgroundColor:'#0B0B0C'}}>
    <Text style={{color:'#EDEDED',fontSize:22,fontWeight:'800',marginBottom:12}}>Levantar</Text>
    <TextInput placeholder='Telemóvel do cliente' placeholderTextColor='#777' value={phone} onChangeText={setPhone} style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:12}}/>
    <TextInput placeholder='Valor (MZN)' placeholderTextColor='#777' value={amount} onChangeText={setAmount} keyboardType='decimal-pad' style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:16}}/>
    <TouchableOpacity onPress={submit} style={{backgroundColor:'#C6A667',padding:14,borderRadius:12}}><Text style={{textAlign:'center',fontWeight:'800'}}>Confirmar</Text></TouchableOpacity>
  </View>);
}
