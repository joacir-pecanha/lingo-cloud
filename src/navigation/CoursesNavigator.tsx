import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CoursesScreen from '../screens/CoursesScreen';
import CourseTrailScreen from '../screens/CourseTrailScreen';

import ActiveLessonScreen from '../screens/ActiveLessonScreen';
import LessonCompletedScreen from '../screens/LessonCompletedScreen';

// ─── Tipos de rota ────────────────────────────────────────────────────────────
export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseTrail: { courseId: string };
  ActiveLesson: { courseId: string; lessonId: string };
  LessonCompleted: { courseId: string; lessonId: string; score: number; total: number; passed: boolean };
};

const Stack = createNativeStackNavigator<CoursesStackParamList>();

// ─── Navigator ────────────────────────────────────────────────────────────────
export function CoursesNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#0F0F1A' },
      }}
    >
      <Stack.Screen name="CoursesList" component={CoursesScreen} />
      <Stack.Screen name="CourseTrail" component={CourseTrailScreen} />
      <Stack.Screen name="ActiveLesson" component={ActiveLessonScreen} />
      <Stack.Screen name="LessonCompleted" component={LessonCompletedScreen} options={{ presentation: 'fullScreenModal' }} />
    </Stack.Navigator>
  );
}
