import React, { useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COURSES, Course, Lesson, Module } from '../data/courses';
import { useCourseProgress } from '../context/CourseContext';
import { CoursesStackParamList } from '../navigation/CoursesNavigator';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  surfaceAlt: '#16213E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
  success: '#4ADE80',
  locked: '#3A3A5C',
};

const LESSON_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  video: 'play-circle',
  quiz: 'help-circle',
  article: 'document-text',
  exercise: 'code-slash',
};

// ─── LessonNode ───────────────────────────────────────────────────────────────
type LessonStatus = 'completed' | 'current' | 'locked';

interface LessonNodeProps {
  lesson: Lesson;
  status: LessonStatus;
  courseColor: string;
  isLast: boolean;
  onPress: () => void;
}

function LessonNode({ lesson, status, courseColor, isLast, onPress }: LessonNodeProps) {
  const isCompleted = status === 'completed';
  const isCurrent = status === 'current';
  const isLocked = status === 'locked';

  const nodeColor = isCompleted ? C.success : isCurrent ? courseColor : C.locked;
  const textColor = isLocked ? C.muted : C.white;

  return (
    <View style={styles.lessonRow}>
      {/* Linha vertical conectora */}
      <View style={styles.connectorCol}>
        <TouchableOpacity
          style={[
            styles.node,
            { backgroundColor: nodeColor + (isLocked ? '33' : '22'), borderColor: nodeColor },
            isCurrent && styles.nodeCurrentBorder,
          ]}
          onPress={onPress}
          disabled={isLocked}
          activeOpacity={0.75}
        >
          {isCompleted && <Ionicons name="checkmark" size={20} color={C.success} />}
          {isCurrent && <Ionicons name={LESSON_ICON[lesson.type]} size={20} color={courseColor} />}
          {isLocked && <Ionicons name="lock-closed" size={16} color={C.muted} />}
        </TouchableOpacity>
        {!isLast && (
          <View
            style={[
              styles.connector,
              { backgroundColor: isCompleted ? C.success + '66' : C.border },
            ]}
          />
        )}
      </View>

      {/* Conteúdo da lição */}
      <TouchableOpacity
        style={[
          styles.lessonCard,
          isCurrent && { borderColor: courseColor + '66', backgroundColor: courseColor + '10' },
          isCompleted && { borderColor: C.success + '44' },
        ]}
        onPress={onPress}
        disabled={isLocked}
        activeOpacity={0.8}
      >
        {/* Badge "ATUAL" */}
        {isCurrent && (
          <View style={[styles.currentBadge, { backgroundColor: courseColor }]}>
            <Text style={styles.currentBadgeText}>ATUAL</Text>
          </View>
        )}

        <View style={styles.lessonCardTop}>
          <Text style={[styles.lessonTitle, { color: textColor }]} numberOfLines={1}>
            {lesson.title}
          </Text>
          {isCompleted && <Ionicons name="checkmark-circle" size={18} color={C.success} />}
          {isLocked && <Ionicons name="lock-closed-outline" size={16} color={C.muted} />}
        </View>

        <View style={styles.lessonCardMeta}>
          <View style={styles.typeBadge}>
            <Ionicons
              name={LESSON_ICON[lesson.type] + '-outline' as any}
              size={11}
              color={isLocked ? C.muted : courseColor}
            />
            <Text style={[styles.typeText, { color: isLocked ? C.muted : courseColor }]}>
              {lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}
            </Text>
          </View>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={11} color={C.muted} />
            <Text style={styles.durationText}>{lesson.duration}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

// ─── ModuleSection ────────────────────────────────────────────────────────────
interface ModuleSectionProps {
  module: Module;
  moduleIndex: number;
  course: Course;
  currentLessonId: string | null;
}

function ModuleSection({ module, moduleIndex, course, currentLessonId }: ModuleSectionProps) {
  const navigation = useNavigation<NativeStackNavigationProp<CoursesStackParamList>>();
  const { isLessonCompleted, isLessonUnlocked, completeLesson } = useCourseProgress();

  const allCompleted = module.lessons.every((l) => isLessonCompleted(course.id, l.id));
  const someCompleted = module.lessons.some((l) => isLessonCompleted(course.id, l.id));

  const moduleStatusColor = allCompleted ? C.success : someCompleted ? course.color : C.muted;

  function handleLessonPress(lesson: Lesson, status: LessonStatus) {
    if (status === 'locked') return;
    if (status === 'completed') {
      Alert.alert(
        lesson.title,
        'Você já concluiu esta lição! Deseja revisá-la?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Revisar', 
            onPress: () => navigation.navigate('ActiveLesson', { courseId: course.id, lessonId: lesson.id }) 
          },
        ]
      );
      return;
    }
    
    // Iniciar a lição
    navigation.navigate('ActiveLesson', { courseId: course.id, lessonId: lesson.id });
  }

  return (
    <View style={styles.moduleSection}>
      {/* Cabeçalho do módulo */}
      <View style={styles.moduleHeader}>
        <View style={[styles.moduleIndexBadge, { backgroundColor: moduleStatusColor + '22', borderColor: moduleStatusColor + '66' }]}>
          {allCompleted ? (
            <Ionicons name="checkmark" size={14} color={C.success} />
          ) : (
            <Text style={[styles.moduleIndexText, { color: moduleStatusColor }]}>{moduleIndex + 1}</Text>
          )}
        </View>
        <View style={styles.moduleTitleCol}>
          <Text style={styles.moduleLabel}>Módulo {moduleIndex + 1}</Text>
          <Text style={styles.moduleTitle}>{module.title}</Text>
        </View>
        <Text style={[styles.moduleProgress, { color: moduleStatusColor }]}>
          {module.lessons.filter((l) => isLessonCompleted(course.id, l.id)).length}/{module.lessons.length}
        </Text>
      </View>

      {/* Lições */}
      <View style={styles.lessonsContainer}>
        {module.lessons.map((lesson, lIdx) => {
          const completed = isLessonCompleted(course.id, lesson.id);
          const unlocked = isLessonUnlocked(course, lesson.id);
          const isCurrent = lesson.id === currentLessonId;

          const status: LessonStatus = completed
            ? 'completed'
            : isCurrent || unlocked
            ? 'current'
            : 'locked';

          return (
            <LessonNode
              key={lesson.id}
              lesson={lesson}
              status={status}
              courseColor={course.color}
              isLast={lIdx === module.lessons.length - 1}
              onPress={() => handleLessonPress(lesson, status)}
            />
          );
        })}
      </View>
    </View>
  );
}

// ─── CourseTrailScreen ────────────────────────────────────────────────────────
type RouteProps = RouteProp<CoursesStackParamList, 'CourseTrail'>;

export default function CourseTrailScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();

  const course = COURSES.find((c) => c.id === route.params.courseId);
  const { completedCount, progressRatio, currentLessonId } = useCourseProgress();

  if (!course) return null;

  const done = completedCount(course.id);
  const ratio = progressRatio(course.id, course.totalLessons);
  const pct = Math.round(ratio * 100);
  const curLesson = currentLessonId(course);
  const isFinished = done === course.totalLessons;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.white} />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={[styles.headerEmoji, { backgroundColor: course.color + '22', borderColor: course.color + '44' }]}>
            <Text style={{ fontSize: 22 }}>{course.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{course.title}</Text>
            <Text style={styles.headerSub}>{course.subtitle}</Text>
          </View>
        </View>

        {/* Barra de progresso no header */}
        <View style={styles.headerProgress}>
          <View style={styles.headerProgressLabelRow}>
            <Text style={styles.headerProgressLabel}>
              {isFinished ? '🎉 Curso concluído!' : `${done} de ${course.totalLessons} lições`}
            </Text>
            <Text style={[styles.headerProgressPct, { color: course.color }]}>{pct}%</Text>
          </View>
          <View style={styles.headerProgressTrack}>
            <View style={[styles.headerProgressFill, { width: `${pct}%` as any, backgroundColor: course.color }]} />
          </View>
        </View>
      </View>

      {/* ── Trilha ── */}
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {course.modules.map((mod, mIdx) => (
          <ModuleSection
            key={mod.id}
            module={mod}
            moduleIndex={mIdx}
            course={course}
            currentLessonId={curLesson}
          />
        ))}
      </ScrollView>
    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  // Header
  header: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  backBtn: { paddingVertical: 12, alignSelf: 'flex-start' },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  headerEmoji: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '900', color: C.white, letterSpacing: -0.3 },
  headerSub: { fontSize: 12, color: C.muted, marginTop: 1 },
  headerProgress: { gap: 6 },
  headerProgressLabelRow: { flexDirection: 'row', justifyContent: 'space-between' },
  headerProgressLabel: { fontSize: 12, color: C.muted },
  headerProgressPct: { fontSize: 12, fontWeight: '700' },
  headerProgressTrack: { height: 6, backgroundColor: '#FFFFFF12', borderRadius: 3, overflow: 'hidden' },
  headerProgressFill: { height: 6, borderRadius: 3 },

  // Scroll
  scrollArea: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24 },

  // Módulo
  moduleSection: { marginBottom: 32 },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    backgroundColor: C.surfaceAlt,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  moduleIndexBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleIndexText: { fontSize: 14, fontWeight: '800' },
  moduleTitleCol: { flex: 1 },
  moduleLabel: { fontSize: 10, color: C.muted, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  moduleTitle: { fontSize: 15, fontWeight: '800', color: C.white, marginTop: 1 },
  moduleProgress: { fontSize: 13, fontWeight: '700' },

  // Lições
  lessonsContainer: { paddingLeft: 8 },
  lessonRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 2 },

  // Nó
  connectorCol: { alignItems: 'center', width: 44 },
  node: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeCurrentBorder: { borderStyle: 'solid' },
  connector: { width: 2, flex: 1, minHeight: 12, marginVertical: 2 },

  // Card da lição
  lessonCard: {
    flex: 1,
    backgroundColor: C.surface,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    padding: 12,
    marginBottom: 10,
    overflow: 'hidden',
  },
  currentBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  currentBadgeText: { fontSize: 9, fontWeight: '900', color: '#fff', letterSpacing: 1 },
  lessonCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 6,
  },
  lessonTitle: { fontSize: 14, fontWeight: '700', flex: 1 },
  lessonCardMeta: { flexDirection: 'row', gap: 8 },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#FFFFFF0A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  typeText: { fontSize: 11, fontWeight: '600' },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  durationText: { fontSize: 11, color: C.muted },
});
