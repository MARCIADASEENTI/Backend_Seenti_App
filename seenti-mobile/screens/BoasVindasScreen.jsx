import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function BoasVindasScreen({ route }) {
  const { usuarioId } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Bem-vinda ao Projeto Seenti!</Text>
      <Text style={styles.subtitle}>Seu login foi realizado com sucesso.</Text>
      <Text style={styles.usuario}>Usuário ID: {usuarioId}</Text>

      <Button title="Avançar" onPress={() => alert('Próxima etapa em desenvolvimento.')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  usuario: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
});
