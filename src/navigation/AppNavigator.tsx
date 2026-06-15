import React, { useCallback } from 'react';
import { Alert, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CoursesScreen from '../screens/CoursesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import LoginScreen from '../screens/LoginScreen';

// ─── Paleta de cores ──────────────────────────────────────────────────────────
const COLORS = {
  background: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  active: '#7C5CFC',
  inactive: '#4A4A6A',
  logout: '#FF5C7A',
  white: '#FFFFFF',
};

// ─── Tipos de rota ────────────────────────────────────────────────────────────
export type RootTabParamList = {
  Home: undefined;
  Perfil: undefined;
  Cursos: undefined;
  Configurações: undefined;
  Sair: undefined;
};

// ─── Tela de Logout — futuramente limpará token e redirecionará ───────────────
/**
 * LogoutScreen é renderizada apenas para satisfazer o Tab.Screen.
 * A navegação de saída real é feita no `tabPress` listener abaixo,
 * evitando que o usuário seja levado para uma tela em branco.
 */
function LogoutPlaceholder() {
  return null;
}

const Tab = createBottomTabNavigator<RootTabParamList>();

// ─── Mapeamento de ícones ─────────────────────────────────────────────────────
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<keyof RootTabParamList, { focused: IoniconName; default: IoniconName }> = {
  Home: { focused: 'home', default: 'home-outline' },
  Perfil: { focused: 'person', default: 'person-outline' },
  Cursos: { focused: 'book', default: 'book-outline' },
  Configurações: { focused: 'settings', default: 'settings-outline' },
  Sair: { focused: 'log-out', default: 'log-out-outline' },
};

// ─── Componente principal ─────────────────────────────────────────────────────
export function AppNavigator() {
  const insets = useSafeAreaInsets();

  /**
   * handleLogout — futuramente:
   *  1. Limpar o token de sessão (AsyncStorage / SecureStore)
   *  2. Resetar o estado de autenticação
   *  3. navigation.reset({ index: 0, routes: [{ name: 'Login' }] })
   */
  const handleLogout = useCallback(() => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: () => {
            // TODO: limpar token e redirecionar para Login
            console.log('[Auth] Sessão encerrada — redirecionar para Login');
          },
        },
      ],
      { cancelable: true }
    );
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: route.name === 'Sair' ? COLORS.logout : COLORS.active,
        tabBarInactiveTintColor: route.name === 'Sair' ? COLORS.logout + '99' : COLORS.inactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.3,
          marginTop: -2,
        },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name as keyof RootTabParamList];
          const iconName = focused ? icons.focused : icons.default;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
      <Tab.Screen name="Cursos" component={CoursesScreen} />
      <Tab.Screen name="Configurações" component={SettingsScreen} />

      {/* ── Aba Sair — interceptada via tabPress ─────────────────────────── */}
      <Tab.Screen
        name="Sair"
        component={LogoutPlaceholder}
        listeners={{
          tabPress: (e) => {
            // Impede a navegação padrão para a tela vazia
            e.preventDefault();
            handleLogout();
          },
        }}
      />
    </Tab.Navigator>
  );
}
