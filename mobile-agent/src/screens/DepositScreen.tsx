import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AgentAPI } from '../services/api';
export default function DepositScreen(){
  const [phone,setPhone]=useState(''); const [amount,setAmount]=useState('');
  const submit=async()=>{ try{ const idem=`DEP-${phone}-${amount}-${Date.now()}`; await AgentAPI.deposit(phone,Number(amount),idem); Alert.alert('OK','Depósito concluído'); setPhone(''); setAmount(''); }catch(e:any){Alert.alert('Erro', e?.response?.data?.detail||e.message);} };
  return (<View style={{flex:1,padding:24,backgroundColor:'#0B0B0C'}}>
    <Text style={{color:'#EDEDED',fontSize:22,fontWeight:'800',marginBottom:12}}>Depositar</Text>
    <TextInput placeholder='Telemóvel do cliente' placeholderTextColor='#777' value={phone} onChangeText={setPhone} style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:12}}/>
    <TextInput placeholder='Valor (MZN)' placeholderTextColor='#777' value={amount} onChangeText={setAmount} keyboardType='decimal-pad' style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:16}}/>
    <TouchableOpacity onPress={submit} style={{backgroundColor:'#C6A667',padding:14,borderRadius:12}}><Text style={{textAlign:'center',fontWeight:'800'}}>Confirmar</Text></TouchableOpacity>
  </View>);
}
