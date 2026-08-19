import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Task, TaskInput } from '../types';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (data: TaskInput) => void;
}

export default function TaskFormModal({ visible, task, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (visible) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
    }
  }, [visible, task]);

  const handleSave = () => {
    if (title.trim() === '') return;
    onSave({
      title: title.trim(),
      description: description.trim() === '' ? null : description.trim(),
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>{task ? 'Editar tarefa' : 'Nova tarefa'}</Text>

          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Ex.: Comprar mantimentos"
            placeholderTextColor={colors.textSecondary}
            autoFocus
            returnKeyType="next"
          />

          <Text style={styles.label}>Descrição (opcional)</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={description}
            onChangeText={setDescription}
            placeholder="Adicione mais detalhes..."
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.buttonCancel]} onPress={onClose}>
              <Text style={styles.buttonCancelText}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.buttonSave, title.trim() === '' && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={title.trim() === ''}
            >
              <Text style={styles.buttonSaveText}>{task ? 'Salvar' : 'Adicionar'}</Text>
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
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 18, 25, 0.45)',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xl,
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
    marginBottom: spacing.lg,
  },
  inputMultiline: {
    minHeight: 96,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
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