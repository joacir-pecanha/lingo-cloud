import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CoursesScreen from '../screens/CoursesScreen';
import CourseTrailScreen from '../screens/CourseTrailScreen';

// ─── Tipos de rota ────────────────────────────────────────────────────────────
export type CoursesStackParamList = {
  CoursesList: undefined;
  CourseTrail: { courseId: string };
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
    </Stack.Navigator>
  );
}
