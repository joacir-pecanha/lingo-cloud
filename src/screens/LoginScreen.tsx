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

// ─── Componente ───────────────────────────────────────────────────────────────
export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [globalError, setGlobalError] = useState('');
  const [loading, setLoading] = useState(false);

  // ── Validação local ────────────────────────────────────────────────────────
  function validate(): boolean {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    setGlobalError('');

    if (!email.trim()) {
      setEmailError('Informe seu email.');
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Email inválido.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Informe sua senha.');
      valid = false;
    }

    return valid;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleLogin() {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email.trim(), password);
      // O AuthContext atualiza isAuthenticated → RootNavigator redireciona automaticamente
    } catch (err: any) {
      setGlobalError(err?.message ?? 'Ocorreu um erro. Tente novamente.');
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
          <Text style={styles.brand}>lingo</Text>
          <Text style={styles.brandAccent}>cloud</Text>
          <Text style={styles.subtitle}>Entre na sua conta</Text>
        </View>

        {/* Alerta global de erro */}
        {!!globalError && <InlineAlert message={globalError} type="error" />}

        {/* Formulário */}
        <AuthInput
          label="Email"
          value={email}
          onChangeText={(t) => { setEmail(t); setGlobalError(''); setEmailError(''); }}
          placeholder="seu@email.com"
          keyboardType="email-address"
          iconName="mail-outline"
          error={emailError}
          returnKeyType="next"
        />

        <AuthInput
          label="Senha"
          value={password}
          onChangeText={(t) => { setPassword(t); setGlobalError(''); setPasswordError(''); }}
          placeholder="••••••••"
          isPassword
          iconName="lock-closed-outline"
          error={passwordError}
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        {/* Esqueci a senha */}
        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          <Text style={styles.forgotText}>Esqueci minha senha</Text>
        </TouchableOpacity>

        {/* Botão principal */}
        <PrimaryButton
          label="Entrar"
          onPress={handleLogin}
          loading={loading}
        />

        {/* Rodapé */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Não tem uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}>Cadastre-se</Text>
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
  header: { alignItems: 'center', marginBottom: 40 },
  brand: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.white,
    letterSpacing: -1,
    includeFontPadding: false,
  },
  brandAccent: {
    fontSize: 40,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: -1,
    marginTop: -8,
    includeFontPadding: false,
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 15,
    marginTop: 10,
    letterSpacing: 0.2,
  },
  forgotBtn: { alignSelf: 'flex-end', marginBottom: 20, marginTop: -4 },
  forgotText: { color: COLORS.primaryLight, fontSize: 13, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: { color: COLORS.muted, fontSize: 14 },
  footerLink: { color: COLORS.primaryLight, fontSize: 14, fontWeight: '700' },
});
