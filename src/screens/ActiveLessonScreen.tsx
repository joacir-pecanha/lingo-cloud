import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getExercisesForLesson, Exercise } from '../data/exercises';
import { COURSES } from '../data/courses';
import { CoursesStackParamList } from '../navigation/CoursesNavigator';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
  primary: '#7C5CFC',
  success: '#4ADE80',
  error: '#FF5C7A',
};

const { width } = Dimensions.get('window');

type RouteProps = RouteProp<CoursesStackParamList, 'ActiveLesson'>;
type NavProp = NativeStackNavigationProp<CoursesStackParamList>;

export default function ActiveLessonScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteProps>();
  const { courseId, lessonId } = route.params;

  const course = COURSES.find((c) => c.id === courseId);
  const color = course?.color ?? C.primary;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Estado do feedback: null = sem feedback, true = correto, false = incorreto
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  // Animação para a barra de progresso
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Carregar exercícios da lição
    const loaded = getExercisesForLesson(lessonId);
    setExercises(loaded);
  }, [lessonId]);

  useEffect(() => {
    if (exercises.length > 0) {
      const ratio = (currentIndex) / exercises.length;
      Animated.timing(progressAnim, {
        toValue: ratio,
        duration: 300,
        useNativeDriver: false, // Animando 'width', não suporta native driver em todas as versões dependendo do setup, mas interpolando porcentagem funciona
      }).start();
    }
  }, [currentIndex, exercises.length]);

  if (exercises.length === 0) return null;

  const currentExercise = exercises[currentIndex];
  const isFeedbackVisible = isCorrect !== null;

  // ─── Ações ────────────────────────────────────────────────────────────────────
  function handleSelect(index: number) {
    if (isFeedbackVisible) return; // Não mudar resposta após verificar
    setSelectedOption(index);
  }

  function handleCheck() {
    if (selectedOption === null) return;
    
    const correct = selectedOption === currentExercise.correctOptionIndex;
    setIsCorrect(correct);
    if (correct) {
      setCorrectAnswers((prev) => prev + 1);
    }
  }

  function handleNext() {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      // Finalizou a lição
      navigation.replace('LessonCompleted', {
        courseId,
        lessonId,
        score: correctAnswers + (isCorrect ? 1 : 0), // Conta a última se acertou
        total: exercises.length,
        passed: (correctAnswers + (isCorrect ? 1 : 0)) / exercises.length >= 0.7, // 70% para passar
      });
    }
  }

  // ─── Renders ──────────────────────────────────────────────────────────────────
  return (
    <View style={[styles.root, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Header com barra de progresso e botão fechar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={28} color={C.muted} />
        </TouchableOpacity>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarFill,
              {
                backgroundColor: color,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })
              }
            ]}
          />
        </View>
      </View>

      {/* Conteúdo do exercício */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.questionLabel}>
          {currentExercise.type === 'multiple_choice' ? 'Escolha a opção correta' : 'Verdadeiro ou Falso'}
        </Text>
        <Text style={styles.questionText}>{currentExercise.question}</Text>

        <View style={styles.optionsContainer}>
          {currentExercise.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isSubmitted = isFeedbackVisible;
            const isActualCorrect = idx === currentExercise.correctOptionIndex;

            // Lógica de cores após submissão
            let optionStyle: any[] = [styles.optionCard];
            let textStyle: any[] = [styles.optionText];
            let circleColor = C.border;

            if (isSubmitted) {
              if (idx === selectedOption) {
                if (isActualCorrect) {
                  optionStyle.push(styles.optionCorrect);
                  textStyle.push(styles.textCorrect);
                  circleColor = C.success;
                } else {
                  optionStyle.push(styles.optionWrong);
                  textStyle.push(styles.textWrong);
                  circleColor = C.error;
                }
              } else if (isActualCorrect) {
                // Destacar a correta mesmo se não foi a escolhida
                optionStyle.push(styles.optionCorrect);
                textStyle.push(styles.textCorrect);
                circleColor = C.success;
              }
            } else if (isSelected) {
              optionStyle.push({ borderColor: color, backgroundColor: color + '15' } as any);
              textStyle.push({ color: color } as any);
              circleColor = color;
            }

            return (
              <TouchableOpacity
                key={idx}
                style={optionStyle}
                onPress={() => handleSelect(idx)}
                activeOpacity={0.8}
              >
                <View style={[styles.radioCircle, { borderColor: circleColor }]}>
                  {isSelected && !isSubmitted && <View style={[styles.radioInner, { backgroundColor: color }]} />}
                  {isSubmitted && isActualCorrect && <Ionicons name="checkmark" size={14} color={C.success} style={{marginLeft: -1, marginTop: -1}} />}
                  {isSubmitted && isSelected && !isActualCorrect && <Ionicons name="close" size={14} color={C.error} style={{marginLeft: -1, marginTop: -1}} />}
                </View>
                <Text style={textStyle}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Botão Inferior ou Modal de Feedback */}
      {!isFeedbackVisible ? (
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.checkButton, { backgroundColor: selectedOption !== null ? color : C.surface }]}
            disabled={selectedOption === null}
            onPress={handleCheck}
            activeOpacity={0.8}
          >
            <Text style={[styles.checkButtonText, { color: selectedOption !== null ? C.white : C.muted }]}>
              Verificar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={[styles.feedbackPanel, { backgroundColor: isCorrect ? C.success + '22' : C.error + '22' }]}>
          <View style={styles.feedbackHeader}>
            <Ionicons
              name={isCorrect ? "checkmark-circle" : "close-circle"}
              size={24}
              color={isCorrect ? C.success : C.error}
            />
            <Text style={[styles.feedbackTitle, { color: isCorrect ? C.success : C.error }]}>
              {isCorrect ? 'Excelente!' : 'Ops, não foi dessa vez.'}
            </Text>
          </View>
          
          <Text style={styles.feedbackExplanation}>{currentExercise.explanation}</Text>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: isCorrect ? C.success : C.error }]}
            onPress={handleNext}
            activeOpacity={0.8}
          >
            <Text style={styles.nextButtonText}>Continuar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    gap: 16,
  },
  closeBtn: { padding: 4, marginLeft: -8 },
  progressBarContainer: {
    flex: 1,
    height: 12,
    backgroundColor: C.surface,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },

  // Content
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  questionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '800',
    color: C.white,
    lineHeight: 32,
    marginBottom: 32,
  },

  // Options
  optionsContainer: { gap: 12 },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: C.surface,
    borderWidth: 2,
    borderColor: C.border,
    borderRadius: 16,
  },
  optionCorrect: {
    backgroundColor: C.success + '11',
    borderColor: C.success,
  },
  optionWrong: {
    backgroundColor: C.error + '11',
    borderColor: C.error,
  },
  optionText: {
    fontSize: 16,
    color: C.white,
    flex: 1,
    fontWeight: '600',
  },
  textCorrect: { color: C.success },
  textWrong: { color: C.error },

  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  // Footer / Check Button
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  checkButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkButtonText: {
    fontSize: 18,
    fontWeight: '800',
  },

  // Feedback Panel
  feedbackPanel: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  feedbackHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  feedbackExplanation: {
    fontSize: 15,
    color: C.white,
    lineHeight: 22,
    marginBottom: 20,
  },
  nextButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: C.white,
    fontSize: 18,
    fontWeight: '800',
  },
});
