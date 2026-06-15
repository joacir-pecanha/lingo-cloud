import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COURSES, Course } from '../data/courses';
import { useCourseProgress } from '../context/CourseContext';
import { CoursesStackParamList } from '../navigation/CoursesNavigator';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
  label: '#CCCCDD',
};

const LESSON_TYPE_ICON: Record<string, React.ComponentProps<typeof Ionicons>['name']> = {
  video: 'play-circle-outline',
  quiz: 'help-circle-outline',
  article: 'document-text-outline',
  exercise: 'code-slash-outline',
};

const { width } = Dimensions.get('window');

// ─── CourseCard ───────────────────────────────────────────────────────────────
interface CourseCardProps {
  course: Course;
  onPress: () => void;
}

function CourseCard({ course, onPress }: CourseCardProps) {
  const { completedCount, progressRatio } = useCourseProgress();
  const done = completedCount(course.id);
  const ratio = progressRatio(course.id, course.totalLessons);
  const pct = Math.round(ratio * 100);

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: course.color + '44' }]}
      onPress={onPress}
      activeOpacity={0.88}
    >
      {/* Fundo decorativo */}
      <View style={[styles.cardGlow, { backgroundColor: course.color + '18' }]} />

      {/* Cabeçalho do card */}
      <View style={styles.cardHeader}>
        <View style={[styles.emojiCircle, { backgroundColor: course.color + '22', borderColor: course.color + '55' }]}>
          <Text style={styles.emoji}>{course.emoji}</Text>
        </View>
        <View style={styles.levelBadge}>
          <Text style={[styles.levelText, { color: course.color }]}>{course.level}</Text>
        </View>
      </View>

      {/* Título e subtítulo */}
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardSubtitle}>{course.subtitle}</Text>

      {/* Descrição */}
      <Text style={styles.cardDesc} numberOfLines={2}>{course.description}</Text>

      {/* Metadados */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="book-outline" size={13} color={C.muted} />
          <Text style={styles.metaText}>{course.totalLessons} lições</Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <Ionicons name="time-outline" size={13} color={C.muted} />
          <Text style={styles.metaText}>{course.estimatedHours}h estimadas</Text>
        </View>
        <View style={styles.metaDot} />
        <View style={styles.metaItem}>
          <Ionicons name="layers-outline" size={13} color={C.muted} />
          <Text style={styles.metaText}>{course.modules.length} módulos</Text>
        </View>
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressSection}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>
            {done === 0 ? 'Não iniciado' : done === course.totalLessons ? '✓ Concluído' : `${done}/${course.totalLessons} lições`}
          </Text>
          <Text style={[styles.progressPct, { color: done === 0 ? C.muted : course.color }]}>{pct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${pct}%` as any, backgroundColor: course.color },
            ]}
          />
        </View>
      </View>

      {/* CTA */}
      <TouchableOpacity
        style={[styles.cta, { backgroundColor: course.color }]}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <Text style={styles.ctaText}>
          {done === 0 ? 'Começar trilha' : done === course.totalLessons ? 'Revisar trilha' : 'Continuar trilha'}
        </Text>
        <Ionicons name="arrow-forward" size={16} color="#fff" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

// ─── CoursesScreen ────────────────────────────────────────────────────────────
export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<CoursesStackParamList>>();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Cabeçalho */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>Cursos</Text>
        <Text style={styles.pageSubtitle}>Escolha uma trilha e comece a aprender</Text>
      </View>

      {/* Cards */}
      {COURSES.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onPress={() => navigation.navigate('CourseTrail', { courseId: course.id })}
        />
      ))}
    </ScrollView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20 },

  pageHeader: { marginBottom: 28 },
  pageTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: C.white,
    letterSpacing: -0.5,
  },
  pageSubtitle: { color: C.muted, fontSize: 14, marginTop: 4 },

  // Card
  card: {
    backgroundColor: C.surface,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 26 },
  levelBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF10',
  },
  levelText: { fontSize: 11, fontWeight: '700' },

  cardTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.white,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#9D7FFF',
    fontWeight: '600',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 13,
    color: C.muted,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Meta
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: C.muted },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: C.border, marginHorizontal: 8 },

  // Progress
  progressSection: { marginBottom: 16 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressLabel: { fontSize: 12, color: C.muted },
  progressPct: { fontSize: 12, fontWeight: '700' },
  progressTrack: {
    height: 6,
    backgroundColor: '#FFFFFF15',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: 6, borderRadius: 3 },

  // CTA
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 12,
  },
  ctaText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
