import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Category } from '../types';
import { categoriesService } from '../services/categorieService';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSuccess: (newCategory: Category) => void;
}

export default function CategoryFormModal({ visible, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Atenção', 'Informe o nome da categoria');
      return;
    }

    try {
      setLoading(true);
      const created = await categoriesService.create({ title: trimmedTitle });
      setTitle('');
      onSuccess(created);
      onClose();
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível criar a categoria');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    setTitle('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={styles.dialog}>
          <Text style={styles.title}>Nova Categoria</Text>
          <Text style={styles.subtitle}>Crie uma nova categoria para suas tarefas</Text>

          <Text style={styles.label}>Nome da Categoria *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex.: Trabalho, Finanças, Saúde"
            placeholderTextColor={colors.textSecondary}
            autoFocus
            returnKeyType="done"
            onSubmitEditing={handleSave}
            editable={!loading}
          />

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.buttonCancel]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonSave, (!title.trim() || loading) && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={!title.trim() || loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Text style={styles.buttonSaveText}>Salvar Categoria</Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 18, 25, 0.55)',
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.small,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    marginBottom: spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  buttonCancel: {
    backgroundColor: colors.background,
  },
  buttonCancelText: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  buttonSave: {
    backgroundColor: colors.primary,
  },
  buttonSaveText: {
    fontSize: typography.body,
    fontWeight: '700',
    color: colors.white,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
