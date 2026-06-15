import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

/**
 * RootNavigator — decide qual fluxo exibir com base no estado de autenticação.
 *
 * ┌────────────────────────────────────────────────┐
 * │  isAuthenticated === false  →  AuthNavigator   │
 * │  isAuthenticated === true   →  AppNavigator    │
 * └────────────────────────────────────────────────┘
 *
 * React Navigation lida automaticamente com a transição entre os dois
 * fluxos quando `isAuthenticated` muda, sem necessidade de reset manual.
 */
export function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
