import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { AgentAPI } from '../services/api';
import { useAgent } from '../store/useAgent';
export default function LoginScreen(){
  const [phone,setPhone]=useState(''); const [pin,setPin]=useState(''); const setToken=useAgent(s=>s.setToken);
  const submit=async()=>{ try{ const r=await AgentAPI.login(phone,pin); await setToken(r.token);}catch(e:any){Alert.alert('Erro', e?.response?.data?.detail||e.message);} };
  return (<View style={{flex:1,padding:24,backgroundColor:'#0B0B0C',justifyContent:'center'}}>
    <Text style={{color:'#EDEDED',fontSize:24,fontWeight:'800',marginBottom:16}}>Agente — Entrar</Text>
    <TextInput placeholder='Telemóvel' placeholderTextColor='#777' value={phone} onChangeText={setPhone} style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:12}}/>
    <TextInput placeholder='PIN' placeholderTextColor='#777' secureTextEntry value={pin} onChangeText={setPin} style={{backgroundColor:'#121214',color:'#EDEDED',padding:14,borderRadius:12,marginBottom:16}}/>
    <TouchableOpacity onPress={submit} style={{backgroundColor:'#C6A667',padding:14,borderRadius:12}}><Text style={{textAlign:'center',fontWeight:'800'}}>Entrar</Text></TouchableOpacity>
  </View>);
}
