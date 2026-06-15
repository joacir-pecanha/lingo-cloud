import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Course, getLessonGlobalIndex } from '../data/courses';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface LessonHistoryEntry {
  courseId: string;
  lessonId: string;
  score: number;
  total: number;
  timestamp: string;
}

interface CourseProgressState {
  /** IDs das lições concluídas, indexado por courseId */
  completedLessons: Record<string, Set<string>>;
  /** Histórico completo das lições */
  history: LessonHistoryEntry[];
}

interface CourseContextValue {
  /** Verifica se a lição `lessonId` no curso foi concluída */
  isLessonCompleted: (courseId: string, lessonId: string) => boolean;

  /**
   * Verifica se a lição está desbloqueada.
   * Uma lição é desbloqueada se:
   *   - É a primeira lição do curso (índice global 0), OU
   *   - A lição imediatamente anterior foi concluída.
   */
  isLessonUnlocked: (course: Course, lessonId: string) => boolean;

  /** Marca a lição como concluída e registra no histórico */
  completeLesson: (courseId: string, lessonId: string, score?: number, total?: number) => void;

  /** Quantidade de lições concluídas no curso */
  completedCount: (courseId: string) => number;

  /** Progresso de 0 a 1 (percentual) */
  progressRatio: (courseId: string, totalLessons: number) => number;

  /** Retorna o ID da primeira lição não concluída (lição atual) */
  currentLessonId: (course: Course) => string | null;

  /** Retorna o histórico de lições concluídas */
  lessonHistory: LessonHistoryEntry[];
}

// ─── Contexto ─────────────────────────────────────────────────────────────────
const CourseContext = createContext<CourseContextValue | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CourseProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CourseProgressState>({
    completedLessons: {},
    history: [],
  });

  const isLessonCompleted = useCallback(
    (courseId: string, lessonId: string): boolean =>
      state.completedLessons[courseId]?.has(lessonId) ?? false,
    [state]
  );

  const isLessonUnlocked = useCallback(
    (course: Course, lessonId: string): boolean => {
      const flatLessons = course.modules.flatMap((m) => m.lessons);
      const idx = flatLessons.findIndex((l) => l.id === lessonId);
      if (idx === 0) return true; // Primeira lição sempre desbloqueada
      const prevLesson = flatLessons[idx - 1];
      return isLessonCompleted(course.id, prevLesson.id);
    },
    [isLessonCompleted]
  );

  const completeLesson = useCallback((courseId: string, lessonId: string, score: number = 0, total: number = 0) => {
    setState((prev) => {
      const existing = new Set(prev.completedLessons[courseId] ?? []);
      existing.add(lessonId);
      
      const newHistoryEntry: LessonHistoryEntry = {
        courseId,
        lessonId,
        score,
        total,
        timestamp: new Date().toISOString(),
      };

      return {
        ...prev,
        completedLessons: {
          ...prev.completedLessons,
          [courseId]: existing,
        },
        history: [newHistoryEntry, ...prev.history],
      };
    });
  }, []);

  const completedCount = useCallback(
    (courseId: string): number =>
      state.completedLessons[courseId]?.size ?? 0,
    [state]
  );

  const progressRatio = useCallback(
    (courseId: string, totalLessons: number): number => {
      if (totalLessons === 0) return 0;
      return completedCount(courseId) / totalLessons;
    },
    [completedCount]
  );

  const currentLessonId = useCallback(
    (course: Course): string | null => {
      const flatLessons = course.modules.flatMap((m) => m.lessons);
      for (const lesson of flatLessons) {
        if (!isLessonCompleted(course.id, lesson.id)) return lesson.id;
      }
      return null; // curso concluído
    },
    [isLessonCompleted]
  );

  return (
    <CourseContext.Provider
      value={{
        isLessonCompleted,
        isLessonUnlocked,
        completeLesson,
        completedCount,
        progressRatio,
        currentLessonId,
        lessonHistory: state.history,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCourseProgress(): CourseContextValue {
  const ctx = useContext(CourseContext);
  if (!ctx) throw new Error('useCourseProgress deve ser usado dentro de <CourseProvider>');
  return ctx;
}
