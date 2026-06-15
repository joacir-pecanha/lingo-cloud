import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useGamification } from '../context/GamificationContext';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
  primary: '#7C5CFC',
  xp: '#FFD700',
  streak: '#FF5C7A',
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { xp, level, streak } = useGamification();

  return (
    <ScrollView 
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Estudante! 👋</Text>
        <Text style={styles.subtitle}>Continue sua jornada de aprendizado.</Text>
      </View>

      {/* Gamification Dashboard */}
      <View style={styles.statsContainer}>
        
        {/* Nível */}
        <View style={[styles.statCard, { borderColor: C.primary + '44', backgroundColor: C.primary + '11' }]}>
          <View style={[styles.iconBox, { backgroundColor: C.primary + '22' }]}>
            <Ionicons name="shield-checkmark" size={24} color={C.primary} />
          </View>
          <Text style={styles.statLabel}>Nível Atual</Text>
          <Text style={[styles.statValue, { color: C.primary }]}>{level}</Text>
        </View>

        <View style={styles.statsRow}>
          {/* XP */}
          <View style={[styles.statCard, styles.flexCard, { borderColor: C.xp + '44', backgroundColor: C.xp + '11' }]}>
            <View style={[styles.iconBox, { backgroundColor: C.xp + '22' }]}>
              <Ionicons name="star" size={24} color={C.xp} />
            </View>
            <Text style={styles.statLabel}>Total de XP</Text>
            <Text style={[styles.statValue, { color: C.xp }]}>{xp}</Text>
          </View>

          {/* Streak */}
          <View style={[styles.statCard, styles.flexCard, { borderColor: C.streak + '44', backgroundColor: C.streak + '11' }]}>
            <View style={[styles.iconBox, { backgroundColor: C.streak + '22' }]}>
              <Ionicons name="flame" size={24} color={C.streak} />
            </View>
            <Text style={styles.statLabel}>Ofensiva</Text>
            <Text style={[styles.statValue, { color: C.streak }]}>{streak} dias</Text>
          </View>
        </View>

      </View>

      {/* Placeholder de Atividades */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color={C.border} />
          <Text style={styles.emptyText}>Conclua lições na aba Cursos para ver seu progresso aqui.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20 },
  header: { marginBottom: 30 },
  greeting: {
    fontSize: 28,
    fontWeight: '900',
    color: C.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: C.muted,
    marginTop: 4,
  },

  statsContainer: { gap: 12, marginBottom: 32 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCard: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexCard: { flex: 1 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 13,
    color: C.white,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '900',
  },

  activitySection: { marginTop: 10 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.white,
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  emptyText: {
    color: C.muted,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
  },
});
