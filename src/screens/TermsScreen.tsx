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

export default function TermsScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={C.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Termos de Serviço</Text>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>
        <Text style={styles.lastUpdated}>Última atualização: 15 de Junho de 2026</Text>
        
        <Text style={styles.paragraph}>
          Bem-vindo ao LingoCloud. Ao acessar e usar nosso aplicativo, você concorda em cumprir e se vincular aos seguintes termos e condições de uso.
        </Text>

        <Text style={styles.sectionTitle}>1. Aceitação dos Termos</Text>
        <Text style={styles.paragraph}>
          O uso deste aplicativo constitui a sua aceitação destes Termos de Serviço. Se você não concorda com qualquer parte destes termos, não utilize nosso aplicativo.
        </Text>

        <Text style={styles.sectionTitle}>2. Uso do Serviço</Text>
        <Text style={styles.paragraph}>
          Você concorda em usar o serviço apenas para fins legais e de forma que não infrinja os direitos de, restrinja ou iniba o uso e usufruto do serviço por qualquer terceiro.
        </Text>

        <Text style={styles.sectionTitle}>3. Modificações</Text>
        <Text style={styles.paragraph}>
          A LingoCloud reserva-se o direito de alterar ou modificar estes termos a qualquer momento, sem aviso prévio. O uso contínuo do aplicativo após tais alterações constituirá sua aceitação dos novos termos.
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
