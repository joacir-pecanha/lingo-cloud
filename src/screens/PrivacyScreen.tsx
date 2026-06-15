import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
};

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Política de Privacidade</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.lastUpdated}>Última atualização: 15 de Junho de 2026</Text>
        
        <Text style={styles.paragraph}>
          A sua privacidade é importante para nós. Esta Política de Privacidade explica como a LingoCloud coleta, usa e protege suas informações pessoais.
        </Text>

        <Text style={styles.sectionTitle}>1. Coleta de Dados</Text>
        <Text style={styles.paragraph}>
          Coletamos informações que você nos fornece diretamente, como nome, endereço de e-mail e dados de progresso nos cursos. Também podemos coletar dados de uso para melhorar a experiência do aplicativo.
        </Text>

        <Text style={styles.sectionTitle}>2. Uso das Informações</Text>
        <Text style={styles.paragraph}>
          Utilizamos as informações coletadas para fornecer, manter e melhorar nossos serviços, além de personalizar sua experiência de aprendizado e enviar comunicações importantes.
        </Text>

        <Text style={styles.sectionTitle}>3. Proteção e Segurança</Text>
        <Text style={styles.paragraph}>
          Implementamos medidas de segurança rígidas para proteger suas informações contra acesso, alteração, divulgação ou destruição não autorizada. Seus dados nunca são vendidos a terceiros.
        </Text>

        <Text style={styles.sectionTitle}>4. Seus Direitos</Text>
        <Text style={styles.paragraph}>
          Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento, diretamente através das configurações do aplicativo ou entrando em contato com nosso suporte.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  backBtn: {
    marginRight: 16,
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: C.white,
  },
  content: {
    padding: 24,
  },
  lastUpdated: {
    fontSize: 14,
    color: C.muted,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.white,
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    color: C.muted,
    lineHeight: 24,
    textAlign: 'justify',
  },
});
