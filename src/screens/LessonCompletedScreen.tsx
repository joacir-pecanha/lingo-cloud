import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CoursesStackParamList } from '../navigation/CoursesNavigator';
import { useCourseProgress } from '../context/CourseContext';
import { COURSES } from '../data/courses';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  white: '#FFFFFF',
  muted: '#8888AA',
  success: '#4ADE80',
  error: '#FF5C7A',
  primary: '#7C5CFC',
};

type RouteProps = RouteProp<CoursesStackParamList, 'LessonCompleted'>;
type NavProp = NativeStackNavigationProp<CoursesStackParamList>;

export default function LessonCompletedScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { courseId, lessonId, score, total, passed } = route.params;

  const { completeLesson } = useCourseProgress();
  const course = COURSES.find((c) => c.id === courseId);
  const color = course?.color ?? C.primary;

  useEffect(() => {
    // Se passou, marca como concluído no contexto
    if (passed) {
      completeLesson(courseId, lessonId);
    }
  }, [passed, courseId, lessonId, completeLesson]);

  const percentage = Math.round((score / total) * 100);

  function handleContinue() {
    // Retorna para a trilha
    navigation.popToTop(); // Volta para o Trail Screen ou lista
  }

  function handleRetry() {
    // Substitui esta tela pela lição novamente
    navigation.replace('ActiveLesson', { courseId, lessonId });
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.content}>
        
        {/* Ícone de status */}
        <View style={[styles.iconCircle, { backgroundColor: passed ? C.success + '22' : C.error + '22' }]}>
          <Ionicons
            name={passed ? 'trophy' : 'refresh'}
            size={80}
            color={passed ? C.success : C.error}
          />
        </View>

        {/* Título principal */}
        <Text style={[styles.title, { color: passed ? C.success : C.error }]}>
          {passed ? 'Lição Concluída!' : 'Quase lá!'}
        </Text>

        {/* Subtítulo explicando o resultado */}
        <Text style={styles.subtitle}>
          {passed
            ? 'Excelente trabalho! Você absorveu o conteúdo com sucesso e pode avançar para a próxima etapa.'
            : 'Parece que alguns conceitos ainda não ficaram claros. Revise o material e tente novamente.'}
        </Text>

        {/* Card de Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Seu resultado</Text>
          <Text style={[styles.scoreValue, { color: passed ? C.success : C.white }]}>
            {score} <Text style={styles.scoreTotal}>/ {total}</Text>
          </Text>
          <Text style={styles.scorePct}>{percentage}% de acertos</Text>
        </View>

      </View>

      {/* Botões de Ação */}
      <View style={styles.footer}>
        {passed ? (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: color }]}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>Continuar na Trilha</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: C.surface, borderWidth: 2, borderColor: C.error }]}
              onPress={handleRetry}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Voltar para a Trilha</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  
  scoreCard: {
    backgroundColor: C.surface,
    paddingVertical: 24,
    paddingHorizontal: 40,
    borderRadius: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFFFFF11',
  },
  scoreLabel: {
    fontSize: 14,
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: '900',
  },
  scoreTotal: {
    fontSize: 24,
    color: C.muted,
  },
  scorePct: {
    marginTop: 8,
    fontSize: 16,
    color: C.muted,
    fontWeight: '600',
  },

  footer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 18,
    fontWeight: '800',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: C.muted,
    fontSize: 16,
    fontWeight: '700',
  },
});
