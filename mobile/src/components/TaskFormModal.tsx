import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';
import { Categories, Task, TaskInput } from '../types';
import { colors, radius, spacing, typography } from '../theme';
import { categoriesService } from '../services/categorieService';
import CategoryFormModal from './CategoryFormModal';

interface Props {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (data: TaskInput) => void;
}

export default function TaskFormModal({ visible, task, onClose, onSave }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<Categories[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const loadCategories = useCallback(async (selectId?: number) => {
    try {
      setLoadingCategories(true);
      const data = await categoriesService.list();
      setCategories(data);
      if (selectId) {
        setSelectedCategoryId(selectId);
      }
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setSelectedCategoryId(task?.id_categories ?? null);
      loadCategories(task?.id_categories);
    }
  }, [visible, task, loadCategories]);

  const handleCategoryCreated = (newCategory: Categories) => {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === newCategory.id);
      return exists ? prev : [newCategory, ...prev];
    });
    setSelectedCategoryId(newCategory.id);
  };

  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert('Atenção', 'O título da tarefa é obrigatório');
      return;
    }

    if (!selectedCategoryId) {
      Alert.alert('Atenção', 'Selecione uma categoria para a tarefa');
      return;
    }

    onSave({
      title: trimmedTitle,
      description: description.trim() === '' ? null : description.trim(),
      id_categories: selectedCategoryId,
    });
  };

  const isSaveDisabled = title.trim() === '' || !selectedCategoryId;

  return (
    <>
      <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.overlay}
        >
          <Pressable style={styles.backdrop} onPress={onClose} />
          <View style={styles.sheet}>
            <View style={styles.handle} />

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.title}>{task ? 'Editar tarefa' : 'Nova tarefa'}</Text>

              <Text style={styles.label}>Título *</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Ex.: Comprar mantimentos"
                placeholderTextColor={colors.textSecondary}
                autoFocus={!task}
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

              <View style={styles.categoryHeaderRow}>
                <Text style={styles.label}>Categoria *</Text>
                <Pressable
                  style={styles.addCategoryBtn}
                  onPress={() => setCategoryModalVisible(true)}
                  hitSlop={8}
                >
                  <Ionicons name="add-circle-outline" size={16} color={colors.primary} />
                  <Text style={styles.addCategoryBtnText}>Nova categoria</Text>
                </Pressable>
              </View>

              <View style={styles.pickerWrapper}>
                <RNPickerSelect
                  value={selectedCategoryId}
                  onValueChange={(value) => setSelectedCategoryId(value)}
                  placeholder={{
                    label: loadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria...',
                    value: null,
                    color: colors.textSecondary,
                  }}
                  items={categories.map((cat) => ({
                    label: cat.title,
                    value: cat.id,
                    key: String(cat.id),
                  }))}
                  style={pickerSelectStyles}
                  useNativeAndroidPickerStyle={false}
                  Icon={() => (
                    <Ionicons
                      name="chevron-down"
                      size={20}
                      color={colors.textSecondary}
                      style={styles.pickerIcon}
                    />
                  )}
                />
              </View>

              <View style={styles.actions}>
                <Pressable style={[styles.button, styles.buttonCancel]} onPress={onClose}>
                  <Text style={styles.buttonCancelText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonSave, isSaveDisabled && styles.buttonDisabled]}
                  onPress={handleSave}
                  disabled={isSaveDisabled}
                >
                  <Text style={styles.buttonSaveText}>{task ? 'Salvar' : 'Adicionar'}</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <CategoryFormModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        onSuccess={handleCategoryCreated}
      />
    </>
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
    maxHeight: '90%',
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
  categoryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  addCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addCategoryBtnText: {
    fontSize: typography.small,
    fontWeight: '600',
    color: colors.primary,
  },
  pickerWrapper: {
    marginBottom: spacing.xl,
  },
  pickerIcon: {
    marginRight: spacing.md,
    marginTop: 14,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    paddingRight: 40,
  },
  inputAndroid: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    paddingRight: 40,
  },
  inputWeb: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.body,
    color: colors.text,
    paddingRight: 40,
  },
  iconContainer: {
    top: 0,
    right: 0,
  },
});