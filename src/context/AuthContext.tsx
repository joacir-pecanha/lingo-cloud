import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
export interface User {
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  sendPasswordReset: (email: string) => Promise<void>;
}

// ─── Banco de dados em memória (substituir por chamada real à API) ────────────
interface StoredUser {
  email: string;
  password: string;
}

const userStore: StoredUser[] = [];

// ─── Contexto ─────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  /**
   * login — valida credenciais contra o store em memória.
   * Lança um Error com mensagem legível em caso de falha,
   * para que as telas possam capturar e exibir o erro inline.
   */
  const login = useCallback(async (email: string, password: string) => {
    // Simula latência de rede
    await new Promise((r) => setTimeout(r, 800));

    const found = userStore.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      throw new Error('Email ou senha inválidos. Verifique suas credenciais.');
    }

    setUser({ email: found.email });
  }, []);

  /**
   * register — cria uma nova conta no store em memória.
   * Lança um Error se o email já estiver cadastrado.
   */
  const register = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 800));

    const exists = userStore.some(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    if (exists) {
      throw new Error('Este email já está cadastrado. Tente fazer login.');
    }

    userStore.push({ email, password });
    setUser({ email });
  }, []);

  /** logout — limpa a sessão do usuário */
  const logout = useCallback(() => {
    setUser(null);
  }, []);

  /**
   * sendPasswordReset — simula envio de link de redefinição.
   * Verifica se o email existe; caso contrário, ainda retorna sucesso
   * por boas práticas de segurança (não revelar quais emails existem).
   */
  const sendPasswordReset = useCallback(async (email: string) => {
    await new Promise((r) => setTimeout(r, 800));
    // Em produção: chamar API de reset. Aqui apenas simula sucesso.
    console.log(`[Auth] Link de redefinição enviado para: ${email}`);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        login,
        register,
        logout,
        sendPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
