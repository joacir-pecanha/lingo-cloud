import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthInput, PrimaryButton, InlineAlert, COLORS } from '../components/AuthUI';
import { useAuth } from '../context/AuthContext';

// ─── Validação ────────────────────────────────────────────────────────────────
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const { sendPasswordReset } = useAuth();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): boolean {
    setEmailError('');
    setError('');
    if (!email.trim()) {
      setEmailError('Informe seu email.');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError('Digite um email válido.');
      return false;
    }
    return true;
  }

  async function handleSend() {
    if (!validate()) return;
    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSent(true);
      setSuccessMsg(
        `Um link de redefinição foi enviado para\n${email.trim()}\nVerifique sua caixa de entrada.`
      );
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao enviar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Botão voltar */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.white} />
        </TouchableOpacity>

        {/* Ícone ilustrativo */}
        <View style={styles.iconCircle}>
          <Ionicons name="key-outline" size={36} color={COLORS.primary} />
        </View>

        {/* Cabeçalho */}
        <Text style={styles.title}>Esqueceu a senha?</Text>
        <Text style={styles.subtitle}>
          Digite o email cadastrado e enviaremos um link para você redefinir sua senha.
        </Text>

        {/* Feedback após envio */}
        {!!successMsg && <InlineAlert message={successMsg} type="success" />}
        {!!error && <InlineAlert message={error} type="error" />}

        {/* Formulário */}
        {!sent && (
          <>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={(t) => { setEmail(t); setEmailError(''); setError(''); }}
              placeholder="seu@email.com"
              keyboardType="email-address"
              iconName="mail-outline"
              error={emailError}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />

            <PrimaryButton
              label="Enviar link de redefinição"
              onPress={handleSend}
              loading={loading}
            />
          </>
        )}

        {/* Após envio, mostra botão de voltar ao login */}
        {sent && (
          <PrimaryButton
            label="Voltar para o Login"
            onPress={() => navigation.goBack()}
            variant="ghost"
          />
        )}

        {/* Link para tentar novamente */}
        {sent && (
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => { setSent(false); setSuccessMsg(''); setEmail(''); }}
          >
            <Text style={styles.retryText}>Não recebeu? Tentar com outro email</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primary + '1A',
    borderWidth: 1.5,
    borderColor: COLORS.primary + '44',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 32,
  },
  retryBtn: { alignItems: 'center', marginTop: 20 },
  retryText: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '600' },
});
