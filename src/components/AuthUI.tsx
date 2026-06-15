import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// ─── Paleta compartilhada ─────────────────────────────────────────────────────
export const COLORS = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceAlt: '#16213E',
  border: '#252540',
  borderFocused: '#7C5CFC',
  primary: '#7C5CFC',
  primaryLight: '#9D7FFF',
  error: '#FF5C7A',
  success: '#4ADE80',
  white: '#FFFFFF',
  muted: '#8888AA',
  label: '#CCCCDD',
};

// ─── AuthInput ────────────────────────────────────────────────────────────────
interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
  isPassword?: boolean;
}

export function AuthInput({
  label,
  error,
  iconName,
  isPassword = false,
  style,
  ...rest
}: AuthInputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {iconName && (
          <Ionicons
            name={iconName}
            size={18}
            color={error ? COLORS.error : focused ? COLORS.primary : COLORS.muted}
            style={styles.icon}
          />
        )}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.muted}
            />
          </TouchableOpacity>
        )}
      </View>
      {!!error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={13} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

// ─── PrimaryButton ────────────────────────────────────────────────────────────
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
}

export function PrimaryButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps) {
  const isGhost = variant === 'ghost';
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isGhost ? styles.btnGhost : styles.btnPrimary,
        (disabled || loading) && styles.btnDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <Text style={[styles.btnText, isGhost && styles.btnTextGhost]}>
        {loading ? 'Aguarde...' : label}
      </Text>
    </TouchableOpacity>
  );
}

// ─── InlineAlert ──────────────────────────────────────────────────────────────
interface InlineAlertProps {
  message: string;
  type?: 'error' | 'success';
}

export function InlineAlert({ message, type = 'error' }: InlineAlertProps) {
  if (!message) return null;
  const color = type === 'error' ? COLORS.error : COLORS.success;
  const icon = type === 'error' ? 'alert-circle' : 'checkmark-circle';
  return (
    <View style={[styles.alert, { borderColor: color + '55', backgroundColor: color + '18' }]}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.alertText, { color }]}>{message}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Input
  wrapper: { marginBottom: 16 },
  label: { color: COLORS.label, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    height: 52,
  },
  inputFocused: { borderColor: COLORS.borderFocused },
  inputError: { borderColor: COLORS.error },
  icon: { marginRight: 10 },
  input: {
    flex: 1,
    color: COLORS.white,
    fontSize: 15,
    height: '100%',
  },
  errorRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
  errorText: { color: COLORS.error, fontSize: 12 },

  // Button
  btn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnGhost: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  btnDisabled: { opacity: 0.55 },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  btnTextGhost: { color: COLORS.muted },

  // Alert
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  alertText: { fontSize: 13, flex: 1, lineHeight: 18 },
});
