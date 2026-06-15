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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

import { AuthInput, PrimaryButton, InlineAlert, COLORS } from '../components/AuthUI';
import { useAuth } from '../context/AuthContext';
import { AuthStackParamList } from '../navigation/AuthNavigator';

// ─── Validação ────────────────────────────────────────────────────────────────
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function validatePassword(password: string) {
  // Mínimo 6 caracteres
  return password.length >= 6;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export default function RegisterScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Register'>>();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Validação local ────────────────────────────────────────────────────────
  function validate(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setGlobalError('');

    if (!email.trim()) {
      setEmailError('Informe seu email.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Digite um email válido.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Informe uma senha.');
      valid = false;
    } else if (!validatePassword(password)) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres.');
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Confirme sua senha.');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('As senhas não coincidem.');
      valid = false;
    }

    return valid;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      await register(email.trim(), password);
      // AuthContext atualiza isAuthenticated → RootNavigator redireciona automaticamente
    } catch (err: any) {
      setGlobalError(err?.message ?? 'Erro ao criar conta. Tente novamente.');
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
        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.subtitle}>
            Junte-se à maior plataforma de aprendizado
          </Text>
        </View>

        {/* Alerta global — ex: email já cadastrado */}
        {!!globalError && <InlineAlert message={globalError} type="error" />}

        {/* Formulário */}
        <AuthInput
          label="Email"
          value={email}
          onChangeText={(t) => { setEmail(t); setEmailError(''); setGlobalError(''); }}
          placeholder="seu@email.com"
          keyboardType="email-address"
          iconName="mail-outline"
          error={emailError}
          returnKeyType="next"
        />

        <AuthInput
          label="Senha"
          value={password}
          onChangeText={(t) => { setPassword(t); setPasswordError(''); }}
          placeholder="Mínimo 6 caracteres"
          isPassword
          iconName="lock-closed-outline"
          error={passwordError}
          returnKeyType="next"
        />

        <AuthInput
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={(t) => { setConfirmPassword(t); setConfirmError(''); }}
          placeholder="Repita a senha"
          isPassword
          iconName="shield-checkmark-outline"
          error={confirmError}
          returnKeyType="done"
          onSubmitEditing={handleRegister}
        />

        {/* Botão */}
        <PrimaryButton
          label="Criar conta"
          onPress={handleRegister}
          loading={loading}
        />

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Já tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.footerLink}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: COLORS.background },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  header: { marginBottom: 36 },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { color: COLORS.muted, fontSize: 14 },
  footerLink: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
});
