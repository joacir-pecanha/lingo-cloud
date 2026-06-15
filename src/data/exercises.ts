// ─── Tipos ────────────────────────────────────────────────────────────────────
export type ExerciseType = 'multiple_choice' | 'true_false';

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  options: string[]; // Para T/F será ['Verdadeiro', 'Falso']
  correctOptionIndex: number;
  explanation: string;
}

// ─── Dados Simulados ──────────────────────────────────────────────────────────
// Chave: lessonId (ex: 'expo-m1-l1')
export const EXERCISES_DB: Record<string, Exercise[]> = {
  // Expo Módulo 1 - Lição 1
  'expo-m1-l1': [
    {
      id: 'q1',
      type: 'multiple_choice',
      question: 'O que é o Expo?',
      options: [
        'Um framework para criar aplicações nativas apenas para iOS.',
        'Um conjunto de ferramentas construídas em cima do React Native para facilitar o desenvolvimento.',
        'Uma linguagem de programação concorrente ao JavaScript.',
        'Um banco de dados NoSQL focado em mobile.',
      ],
      correctOptionIndex: 1,
      explanation: 'O Expo é um ecossistema (framework e plataforma) construído ao redor do React Native para acelerar e facilitar a criação de apps universais.',
    },
    {
      id: 'q2',
      type: 'true_false',
      question: 'O React Native permite que você escreva código JavaScript/TypeScript que é renderizado como views nativas.',
      options: ['Verdadeiro', 'Falso'],
      correctOptionIndex: 0,
      explanation: 'Verdadeiro. O React Native utiliza os componentes nativos do sistema operacional por baixo dos panos, o que garante performance e visual nativo.',
    },
  ],
  // AWS Módulo 1 - Lição 1
  'aws-m1-l1': [
    {
      id: 'q3',
      type: 'multiple_choice',
      question: 'O que define o conceito de "Cloud Computing"?',
      options: [
        'Ter servidores físicos no próprio escritório.',
        'O fornecimento de recursos de TI sob demanda via internet, com pagamento conforme o uso.',
        'Desenvolvimento de aplicações web modernas sem backend.',
        'Uma rede local de alta velocidade entre computadores.',
      ],
      correctOptionIndex: 1,
      explanation: 'Cloud Computing é a entrega sob demanda de poder computacional, banco de dados, armazenamento e outras funcionalidades de TI via internet com precificação pay-as-you-go.',
    },
  ],
};

// ─── Helper ───────────────────────────────────────────────────────────────────
export function getExercisesForLesson(lessonId: string): Exercise[] {
  // Retorna exercícios reais se existirem, ou gera mock genérico para lições vazias
  if (EXERCISES_DB[lessonId]) {
    return EXERCISES_DB[lessonId];
  }
  
  return [
    {
      id: `${lessonId}-mock1`,
      type: 'multiple_choice',
      question: `Exemplo de múltipla escolha para a lição ${lessonId}. Qual é a resposta certa?`,
      options: ['Opção Errada 1', 'Opção Certa', 'Opção Errada 2'],
      correctOptionIndex: 1,
      explanation: 'Esta é uma explicação de exemplo para um exercício gerado automaticamente.',
    },
    {
      id: `${lessonId}-mock2`,
      type: 'true_false',
      question: `Um exercício de Verdadeiro ou Falso gerado automaticamente para testes.`,
      options: ['Verdadeiro', 'Falso'],
      correctOptionIndex: 0,
      explanation: 'Sempre configuramos Verdadeiro como a opção certa nestes mocks.',
    }
  ];
}
