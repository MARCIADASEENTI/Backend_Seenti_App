import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://10.0.0.167:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }), // ✅ CORRIGIDO
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Sucesso', data.mensagem);
        navigation.navigate('BoasVindas', { usuarioId: data.usuario_id });
      } else {
        Alert.alert('Erro', data.erro || 'Falha no login');
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao conectar com o servidor.');
      console.error('Erro na requisição de login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Seenti</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    marginBottom: 32,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
});
