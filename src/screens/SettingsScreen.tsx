import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  bg: '#0F0F1A',
  surface: '#1A1A2E',
  border: '#252540',
  white: '#FFFFFF',
  muted: '#8888AA',
  primary: '#7C5CFC',
  error: '#FF5C7A',
};

// ─── Componentes Auxiliares ───────────────────────────────────────────────────
function SectionHeader({ title }: { title: string }) {
  return <Text style={styles.sectionHeader}>{title}</Text>;
}

function SettingsItem({
  icon,
  title,
  subtitle,
  rightElement,
  onPress,
  isDestructive,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  isDestructive?: boolean;
}) {
  const content = (
    <>
      <View style={[styles.itemIcon, { backgroundColor: isDestructive ? C.error + '15' : C.primary + '15' }]}>
        <Ionicons name={icon as any} size={20} color={isDestructive ? C.error : C.primary} />
      </View>
      <View style={styles.itemTextContainer}>
        <Text style={[styles.itemTitle, isDestructive && { color: C.error }]}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.itemRight}>
        {rightElement ? rightElement : <Ionicons name="chevron-forward" size={20} color={C.muted} />}
      </View>
    </>
  );

  if (onPress || isDestructive) {
    return (
      <TouchableOpacity style={styles.itemContainer} onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return <View style={styles.itemContainer}>{content}</View>;
}

// ─── Tela Principal ───────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { user, sendPasswordReset, logout } = useAuth();

  // Estados locais para os toggles
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // Modal de exclusão
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  function handleResetPassword() {
    if (!user?.email) return;
    
    // Mostra um feedback nativo (ou no console para Web)
    sendPasswordReset(user.email).then(() => {
      if (Platform.OS === 'web') {
        window.alert(`Um link de redefinição foi enviado para ${user.email}`);
      } else {
        Alert.alert('Email Enviado', `Um link de redefinição foi enviado para ${user.email}`);
      }
    });
  }

  function handleDeleteAccount() {
    // Fecha o modal
    setDeleteModalVisible(false);
    // Realiza o logout e limpa a sessão (simulação de deleção)
    logout();
  }

  return (
    <View style={styles.root}>
      {/* Header Fixo */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerTitle}>Configurações</Text>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Preferências */}
        <SectionHeader title="Preferências" />
        <View style={styles.cardGroup}>
          <SettingsItem
            icon="notifications"
            title="Lembretes Diários"
            subtitle="Receba notificações para manter sua ofensiva"
            rightElement={
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={C.white}
              />
            }
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="moon"
            title="Modo Escuro"
            subtitle="Alternar tema visual"
            rightElement={
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: C.border, true: C.primary }}
                thumbColor={C.white}
              />
            }
          />
        </View>

        {/* Segurança da Conta */}
        <SectionHeader title="Segurança da Conta" />
        <View style={styles.cardGroup}>
          <SettingsItem
            icon="lock-closed"
            title="Redefinir Senha"
            subtitle="Enviaremos um link para o seu email"
            onPress={handleResetPassword}
          />
        </View>

        {/* Sobre e Suporte */}
        <SectionHeader title="Sobre o Aplicativo" />
        <View style={styles.cardGroup}>
          <SettingsItem
            icon="document-text"
            title="Termos de Serviço"
            onPress={() => console.log('Abrir Termos')}
          />
          <View style={styles.divider} />
          <SettingsItem
            icon="shield-checkmark"
            title="Política de Privacidade"
            onPress={() => console.log('Abrir Privacidade')}
          />
        </View>
        
        {/* Versão (discreta) */}
        <Text style={styles.versionText}>LingoCloud v1.0.0</Text>

        {/* Ação de Risco */}
        <SectionHeader title="Zona de Risco" />
        <View style={styles.cardGroup}>
          <SettingsItem
            icon="trash"
            title="Excluir Conta"
            subtitle="Esta ação é permanente e irreversível."
            isDestructive={true}
            onPress={() => setDeleteModalVisible(true)}
          />
        </View>

      </ScrollView>

      {/* ─── Modal de Confirmação de Exclusão ─── */}
      <Modal visible={isDeleteModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="warning" size={40} color={C.error} />
            </View>
            <Text style={styles.modalTitle}>Excluir Conta?</Text>
            <Text style={styles.modalText}>
              Você está prestes a excluir permanentemente sua conta, todo o seu XP, e seu histórico de aprendizado. Esta ação não pode ser desfeita.
            </Text>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeleteModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={handleDeleteAccount}
                activeOpacity={0.8}
              >
                <Text style={styles.modalDeleteText}>Sim, excluir</Text>
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
  
  // Header
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.bg,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: C.white,
    letterSpacing: -0.5,
  },

  content: {
    padding: 20,
  },

  // Section
  sectionHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 16,
  },

  // Card Group
  cardGroup: {
    backgroundColor: C.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginLeft: 56, // Alinhado com o texto
  },

  // Item
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
  },
  itemSubtitle: {
    fontSize: 13,
    color: C.muted,
    marginTop: 2,
    marginRight: 8,
  },
  itemRight: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  // Versão
  versionText: {
    textAlign: 'center',
    color: C.muted,
    fontSize: 13,
    marginTop: 16,
    marginBottom: 16,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.error + '44',
  },
  modalIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.error + '22',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: C.white,
    marginBottom: 12,
  },
  modalText: {
    fontSize: 15,
    color: C.muted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  modalCancelText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '700',
  },
  modalDeleteBtn: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: C.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalDeleteText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '800',
  },
});
