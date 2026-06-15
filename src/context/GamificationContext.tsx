import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActivityDate: string | null; // ISO string YYYY-MM-DD
}

interface GamificationContextValue extends GamificationState {
  addXP: (amount: number) => void;
}

// ─── Constantes ───────────────────────────────────────────────────────────────
const XP_PER_LEVEL = 100;

// ─── Contexto ─────────────────────────────────────────────────────────────────
const GamificationContext = createContext<GamificationContextValue | undefined>(undefined);

// ─── Helper ───────────────────────────────────────────────────────────────────
function getTodayString() {
  const date = new Date();
  // Formato YYYY-MM-DD
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>({
    xp: 0,
    level: 1,
    streak: 0,
    lastActivityDate: null,
  });

  const addXP = useCallback((amount: number) => {
    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;
      
      const today = getTodayString();
      let newStreak = prev.streak;
      let newLastActivityDate = prev.lastActivityDate;

      if (prev.lastActivityDate !== today) {
        if (prev.lastActivityDate) {
          // Checar se foi ontem
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayString = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

          if (prev.lastActivityDate === yesterdayString) {
            newStreak += 1;
          } else {
            // Faltou um ou mais dias, reseta o streak
            newStreak = 1;
          }
        } else {
          // Primeira atividade
          newStreak = 1;
        }
        newLastActivityDate = today;
      }

      return {
        xp: newXp,
        level: newLevel,
        streak: newStreak,
        lastActivityDate: newLastActivityDate,
      };
    });
  }, []);

  return (
    <GamificationContext.Provider value={{ ...state, addXP }}>
      {children}
    </GamificationContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useGamification(): GamificationContextValue {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error('useGamification deve ser usado dentro de <GamificationProvider>');
  return ctx;
}
