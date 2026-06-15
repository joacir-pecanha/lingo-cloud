// ─── Tipos ────────────────────────────────────────────────────────────────────
export type LessonType = 'video' | 'quiz' | 'article' | 'exercise';

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: LessonType;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;       // cor primária do card
  colorAlt: string;   // cor secundária do gradiente
  emoji: string;
  totalLessons: number;
  estimatedHours: number;
  level: 'Iniciante' | 'Intermediário' | 'Avançado';
  modules: Module[];
}

// ─── Dados ────────────────────────────────────────────────────────────────────
export const COURSES: Course[] = [
  {
    id: 'expo',
    title: 'Expo',
    subtitle: 'React Native do zero ao avançado',
    description:
      'Aprenda a criar aplicativos mobile profissionais com Expo e React Native, do ambiente de desenvolvimento até o deploy nas lojas.',
    color: '#7C5CFC',
    colorAlt: '#4F3ACC',
    emoji: '📱',
    totalLessons: 16,
    estimatedHours: 12,
    level: 'Iniciante',
    modules: [
      {
        id: 'expo-m1',
        title: 'Fundamentos',
        lessons: [
          { id: 'expo-m1-l1', title: 'Introdução ao Expo', duration: '12 min', type: 'video' },
          { id: 'expo-m1-l2', title: 'Configurando o ambiente', duration: '18 min', type: 'article' },
          { id: 'expo-m1-l3', title: 'Seu primeiro app', duration: '20 min', type: 'exercise' },
          { id: 'expo-m1-l4', title: 'Quiz: Fundamentos', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'expo-m2',
        title: 'Componentes Essenciais',
        lessons: [
          { id: 'expo-m2-l1', title: 'View, Text e StyleSheet', duration: '15 min', type: 'video' },
          { id: 'expo-m2-l2', title: 'TouchableOpacity e Pressable', duration: '10 min', type: 'video' },
          { id: 'expo-m2-l3', title: 'FlatList e ScrollView', duration: '22 min', type: 'exercise' },
          { id: 'expo-m2-l4', title: 'Quiz: Componentes', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'expo-m3',
        title: 'Navegação',
        lessons: [
          { id: 'expo-m3-l1', title: 'React Navigation setup', duration: '14 min', type: 'article' },
          { id: 'expo-m3-l2', title: 'Stack Navigator', duration: '20 min', type: 'exercise' },
          { id: 'expo-m3-l3', title: 'Tab Navigator', duration: '18 min', type: 'exercise' },
          { id: 'expo-m3-l4', title: 'Quiz: Navegação', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'expo-m4',
        title: 'APIs Nativas',
        lessons: [
          { id: 'expo-m4-l1', title: 'Câmera e Galeria', duration: '25 min', type: 'video' },
          { id: 'expo-m4-l2', title: 'Localização GPS', duration: '20 min', type: 'exercise' },
          { id: 'expo-m4-l3', title: 'Notificações Push', duration: '30 min', type: 'article' },
          { id: 'expo-m4-l4', title: 'Quiz: APIs Nativas', duration: '5 min', type: 'quiz' },
        ],
      },
    ],
  },
  {
    id: 'aws',
    title: 'AWS Nuvem',
    subtitle: 'Cloud Computing com Amazon Web Services',
    description:
      'Domine os principais serviços AWS e prepare-se para a certificação AWS Cloud Practitioner com projetos práticos.',
    color: '#FF9500',
    colorAlt: '#CC6A00',
    emoji: '☁️',
    totalLessons: 16,
    estimatedHours: 15,
    level: 'Iniciante',
    modules: [
      {
        id: 'aws-m1',
        title: 'Cloud Fundamentals',
        lessons: [
          { id: 'aws-m1-l1', title: 'O que é Cloud Computing?', duration: '10 min', type: 'video' },
          { id: 'aws-m1-l2', title: 'Modelos: IaaS, PaaS, SaaS', duration: '15 min', type: 'article' },
          { id: 'aws-m1-l3', title: 'Regiões e Zonas de Disponibilidade', duration: '12 min', type: 'video' },
          { id: 'aws-m1-l4', title: 'Quiz: Cloud Fundamentals', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'aws-m2',
        title: 'Computação',
        lessons: [
          { id: 'aws-m2-l1', title: 'Amazon EC2', duration: '28 min', type: 'exercise' },
          { id: 'aws-m2-l2', title: 'AWS Lambda (Serverless)', duration: '20 min', type: 'video' },
          { id: 'aws-m2-l3', title: 'Elastic Beanstalk', duration: '18 min', type: 'article' },
          { id: 'aws-m2-l4', title: 'Quiz: Computação', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'aws-m3',
        title: 'Armazenamento',
        lessons: [
          { id: 'aws-m3-l1', title: 'Amazon S3', duration: '22 min', type: 'exercise' },
          { id: 'aws-m3-l2', title: 'EBS e EFS', duration: '16 min', type: 'video' },
          { id: 'aws-m3-l3', title: 'AWS Glacier', duration: '12 min', type: 'article' },
          { id: 'aws-m3-l4', title: 'Quiz: Armazenamento', duration: '5 min', type: 'quiz' },
        ],
      },
      {
        id: 'aws-m4',
        title: 'Banco de Dados',
        lessons: [
          { id: 'aws-m4-l1', title: 'Amazon RDS', duration: '24 min', type: 'exercise' },
          { id: 'aws-m4-l2', title: 'DynamoDB (NoSQL)', duration: '20 min', type: 'video' },
          { id: 'aws-m4-l3', title: 'ElastiCache', duration: '14 min', type: 'article' },
          { id: 'aws-m4-l4', title: 'Quiz: Banco de Dados', duration: '5 min', type: 'quiz' },
        ],
      },
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Retorna a lista plana de lições de um curso, em ordem */
export function getFlatLessons(course: Course): { moduleIndex: number; lesson: Lesson }[] {
  const flat: { moduleIndex: number; lesson: Lesson }[] = [];
  course.modules.forEach((mod, mIdx) => {
    mod.lessons.forEach((lesson) => {
      flat.push({ moduleIndex: mIdx, lesson });
    });
  });
  return flat;
}

/** Retorna o índice global (0-based) de uma lição na lista plana */
export function getLessonGlobalIndex(course: Course, lessonId: string): number {
  return getFlatLessons(course).findIndex((e) => e.lesson.id === lessonId);
}
