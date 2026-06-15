import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useGamification } from '../context/GamificationContext';
import { useCourseProgress } from '../context/CourseContext';
import { COURSES, getFlatLessons } from '../data/courses';

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
  success: '#4ADE80',
  error: '#FF5C7A',
};

const AVATARS = [
  'person',
  'happy',
  'rocket',
  'planet',
  'game-controller',
  'headset',
] as const;

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  
  // Contextos
  const { user, updateProfile, logout } = useAuth();
  const { xp, level, streak } = useGamification();
  const { lessonHistory, completedCount } = useCourseProgress();

  // Estados do Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || 'Estudante');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || 'person');

  // ─── Lógica Analítica ───────────────────────────────────────────────────────
  
  // Acurácia Global
  const totalQuestions = lessonHistory.reduce((acc, curr) => acc + curr.total, 0);
  const totalCorrect = lessonHistory.reduce((acc, curr) => acc + curr.score, 0);
  const globalAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Cursos ativos (que tem ao menos 1 lição concluída)
  const activeCourses = COURSES.map((course) => {
    const totalLessons = course.totalLessons;
    const completed = completedCount(course.id);
    const progress = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
    return { ...course, completed, progress };
  }).filter((c) => c.completed > 0);

  // ─── Lógica de Conquistas (Mock automático) ─────────────────────────────────
  const achievements = [
    {
      id: 'first_lesson',
      title: 'Primeiro Passo',
      desc: 'Concluiu sua primeira lição.',
      icon: 'footsteps' as any,
      unlocked: lessonHistory.length > 0,
    },
    {
      id: 'streak_3',
      title: 'Em Chamas',
      desc: 'Alcançou 3 dias de ofensiva.',
      icon: 'flame' as any,
      unlocked: streak >= 3,
    },
    {
      id: 'accuracy_master',
      title: 'Gênio',
      desc: 'Mais de 90% de acerto global (mínimo 5 lições).',
      icon: 'bulb' as any,
      unlocked: lessonHistory.length >= 5 && globalAccuracy >= 90,
    },
    {
      id: 'level_5',
      title: 'Dedicado',
      desc: 'Alcançou o Nível 5.',
      icon: 'shield-checkmark' as any,
      unlocked: level >= 5,
    },
  ];

  // ─── Handlers ───────────────────────────────────────────────────────────────
  function handleSaveProfile() {
    updateProfile(editName.trim() || 'Estudante', editAvatar);
    setIsModalVisible(false);
  }

  // ─── Renders ────────────────────────────────────────────────────────────────
  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Header do Perfil */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name={user?.avatar as any || 'person'} size={48} color={C.white} />
            </View>
            <TouchableOpacity style={styles.editBtn} onPress={() => setIsModalVisible(true)}>
              <Ionicons name="pencil" size={16} color={C.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.name || 'Estudante'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={16} color={C.primary} />
              <Text style={styles.badgeText}>Nível {level}</Text>
            </View>
            <View style={styles.badge}>
              <Ionicons name="star" size={16} color={C.xp} />
              <Text style={styles.badgeText}>{xp} XP</Text>
            </View>
          </View>
        </View>

        {/* Progresso Analítico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Análise de Progresso</Text>
          
          <View style={styles.accuracyCard}>
            <View style={styles.accLeft}>
              <Text style={styles.accLabel}>Taxa de Acerto Global</Text>
              <Text style={styles.accValue}>{globalAccuracy}%</Text>
              <Text style={styles.accSub}>{totalCorrect} acertos de {totalQuestions} perguntas</Text>
            </View>
            <View style={styles.accRight}>
              <Ionicons name="analytics" size={40} color={C.primary} />
            </View>
          </View>

          {activeCourses.length > 0 ? (
            activeCourses.map((c) => (
              <View key={c.id} style={styles.courseRow}>
                <View style={[styles.courseIcon, { backgroundColor: c.color + '22' }]}>
                  <Text style={styles.courseEmoji}>{c.emoji}</Text>
                </View>
                <View style={styles.courseInfo}>
                  <View style={styles.courseTitleRow}>
                    <Text style={styles.courseTitle}>{c.title}</Text>
                    <Text style={styles.coursePct}>{c.progress}%</Text>
                  </View>
                  <View style={styles.courseProgressBarBg}>
                    <View style={[styles.courseProgressBarFill, { width: `${c.progress}%`, backgroundColor: c.color }]} />
                  </View>
                  <Text style={styles.courseSub}>{c.completed} de {c.totalLessons} lições</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Nenhum curso iniciado ainda.</Text>
          )}
        </View>

        {/* Conquistas (Medalhas) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conquistas</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.achievementsScroll}>
            {achievements.map((ach) => (
              <View key={ach.id} style={[styles.achCard, !ach.unlocked && styles.achLocked]}>
                <View style={[styles.achIconWrap, { backgroundColor: ach.unlocked ? C.xp + '22' : C.border }]}>
                  <Ionicons name={ach.icon} size={28} color={ach.unlocked ? C.xp : C.muted} />
                </View>
                <Text style={styles.achTitle}>{ach.title}</Text>
                <Text style={styles.achDesc} numberOfLines={3}>{ach.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Histórico Recente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Histórico Recente</Text>
          {lessonHistory.length === 0 ? (
            <Text style={styles.emptyText}>Sem histórico de lições.</Text>
          ) : (
            // Mostra apenas as 5 mais recentes
            lessonHistory.slice(0, 5).map((history, idx) => {
              const course = COURSES.find((c) => c.id === history.courseId);
              const flatLessons = course ? getFlatLessons(course) : [];
              const lessonItem = flatLessons.find((fl) => fl.lesson.id === history.lessonId);
              const title = lessonItem ? lessonItem.lesson.title : history.lessonId;
              const dateObj = new Date(history.timestamp);
              const dateStr = `${dateObj.getDate()}/${dateObj.getMonth()+1} - ${dateObj.getHours()}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
              const pct = history.total > 0 ? (history.score / history.total) * 100 : 0;
              const isPerfect = pct === 100;

              return (
                <View key={idx} style={styles.historyRow}>
                  <View style={[styles.historyDot, { backgroundColor: isPerfect ? C.success : C.xp }]} />
                  <View style={styles.historyInfo}>
                    <Text style={styles.historyTitle}>{title}</Text>
                    <Text style={styles.historySub}>{course?.title} • {dateStr}</Text>
                  </View>
                  <View style={styles.historyScoreBox}>
                    <Text style={[styles.historyScoreText, { color: isPerfect ? C.success : C.white }]}>
                      {history.score}/{history.total}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
        
        {/* Sair */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Sair da Conta</Text>
          <Ionicons name="log-out-outline" size={20} color={C.error} />
        </TouchableOpacity>

      </ScrollView>

      {/* ─── Modal de Edição de Perfil ─── */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Perfil</Text>
            
            <Text style={styles.modalLabel}>Seu Nome</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Digite seu nome..."
              placeholderTextColor={C.muted}
            />

            <Text style={styles.modalLabel}>Escolha um Avatar</Text>
            <View style={styles.avatarGrid}>
              {AVATARS.map((iconName) => (
                <TouchableOpacity
                  key={iconName}
                  style={[styles.avatarOption, editAvatar === iconName && styles.avatarOptionSelected]}
                  onPress={() => setEditAvatar(iconName)}
                >
                  <Ionicons name={iconName} size={32} color={editAvatar === iconName ? C.white : C.muted} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveProfile}>
                <Text style={styles.modalSaveText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  content: { paddingHorizontal: 20 },
  
  // Header
  header: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: C.surface,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: C.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: C.bg,
  },
  userName: { fontSize: 24, fontWeight: '900', color: C.white, marginBottom: 4 },
  userEmail: { fontSize: 14, color: C.muted, marginBottom: 16 },
  badgesRow: { flexDirection: 'row', gap: 12 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: C.border,
  },
  badgeText: { color: C.white, fontWeight: '700', fontSize: 13 },

  // Seções
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: C.white, marginBottom: 16 },
  emptyText: { color: C.muted, fontSize: 14, fontStyle: 'italic' },

  // Acurácia
  accuracyCard: {
    flexDirection: 'row',
    backgroundColor: C.primary + '11',
    borderWidth: 1,
    borderColor: C.primary + '44',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  accLeft: { flex: 1 },
  accLabel: { color: C.white, fontSize: 14, fontWeight: '700', marginBottom: 4 },
  accValue: { color: C.primary, fontSize: 32, fontWeight: '900', marginBottom: 4 },
  accSub: { color: C.muted, fontSize: 12 },
  accRight: { paddingLeft: 16 },

  // Cursos em progresso
  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  courseIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  courseEmoji: { fontSize: 24 },
  courseInfo: { flex: 1 },
  courseTitleRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  courseTitle: { color: C.white, fontSize: 16, fontWeight: '700' },
  coursePct: { color: C.white, fontSize: 14, fontWeight: '800' },
  courseProgressBarBg: { height: 6, backgroundColor: C.border, borderRadius: 3, marginBottom: 6, overflow: 'hidden' },
  courseProgressBarFill: { height: '100%', borderRadius: 3 },
  courseSub: { color: C.muted, fontSize: 12 },

  // Conquistas
  achievementsScroll: { gap: 16, paddingRight: 20 },
  achCard: {
    width: 140,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  achLocked: { opacity: 0.5 },
  achIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  achTitle: { color: C.white, fontSize: 14, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  achDesc: { color: C.muted, fontSize: 12, textAlign: 'center', lineHeight: 16 },

  // Histórico
  historyRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border },
  historyDot: { width: 10, height: 10, borderRadius: 5, marginRight: 16 },
  historyInfo: { flex: 1 },
  historyTitle: { color: C.white, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  historySub: { color: C.muted, fontSize: 12 },
  historyScoreBox: { backgroundColor: C.surface, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: C.border },
  historyScoreText: { fontSize: 13, fontWeight: '800' },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 20,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.error + '44',
    backgroundColor: C.error + '11',
  },
  logoutText: { color: C.error, fontSize: 16, fontWeight: '700' },

  // Modal Edit
  modalOverlay: { flex: 1, backgroundColor: '#000000AA', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: C.surface, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: C.border },
  modalTitle: { fontSize: 20, fontWeight: '900', color: C.white, marginBottom: 24, textAlign: 'center' },
  modalLabel: { fontSize: 14, fontWeight: '700', color: C.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 },
  input: {
    backgroundColor: C.bg,
    color: C.white,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 24,
    fontSize: 16,
  },
  avatarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 32, justifyContent: 'space-between' },
  avatarOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: C.bg,
    borderWidth: 2,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarOptionSelected: { borderColor: C.primary, backgroundColor: C.primary + '22' },
  modalFooter: { flexDirection: 'row', gap: 12 },
  modalCancelBtn: { flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, borderWidth: 1, borderColor: C.border },
  modalCancelText: { color: C.muted, fontSize: 16, fontWeight: '700' },
  modalSaveBtn: { flex: 1, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary },
  modalSaveText: { color: C.white, fontSize: 16, fontWeight: '700' },
});
