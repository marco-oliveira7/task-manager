import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Category, Task, TaskInput } from "../types";
import { categoryService } from "../services/categoryService";
import { colors, radius, spacing, typography } from "../theme";
interface Props {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
  onSave: (data: TaskInput) => void;
}
export default function TaskFormModal({
  visible,
  task,
  onClose,
  onSave,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  useEffect(() => {
    if (visible) {
      setTitle(task?.title ?? "");
      setDescription(task?.description ?? "");
      setCategoryId(task?.id_categories ?? null);
      setShowNewCategory(false);
      setNewCategoryName("");
      loadCategories();
    }
  }, [visible, task]);
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const data = await categoryService.list();
      setCategories(data);
    } catch (err) {
      console.warn("Erro ao carregar categorias:", err);
      Alert.alert("Erro", "Não foi possível carregar as categorias.");
    } finally {
      setLoadingCategories(false);
    }
  };
  const handleCreateCategory = async () => {
    const trimmedName = newCategoryName.trim();
    if (!trimmedName) {
      return;
    }
    try {
      setCreatingCategory(true);
      const created = await categoryService.create(trimmedName);
      setCategories((prev) => [...prev, created]);
      setCategoryId(created.id);
      setNewCategoryName("");
      setShowNewCategory(false);
    } catch (err) {
      Alert.alert(
        "Erro",
        err instanceof Error ? err.message : "Erro ao criar categoria.",
      );
    } finally {
      setCreatingCategory(false);
    }
  };
  const handleSave = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      Alert.alert("Atenção", "O título da tarefa é obrigatório.");
      return;
    }
    if (categoryId === null) {
      Alert.alert("Atenção", "Selecione uma categoria para a tarefa.");
      return;
    }
    onSave({
      title: trimmedTitle,
      description: description.trim() === "" ? null : description.trim(),
      id_categories: categoryId,
    });
  };
  const isSaveDisabled = title.trim() === "" || categoryId === null;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.overlay}
      >
        
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.sheet}>
          
          <View style={styles.handle} />
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            
            <Text style={styles.title}>
              
              {task ? "Editar tarefa" : "Nova tarefa"}
            </Text>
            <Text style={styles.label}> Título * </Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Comprar mantimentos"
              placeholderTextColor={colors.textSecondary}
              autoFocus={!task}
              returnKeyType="next"
            />
            <Text style={styles.label}> Descrição (opcional) </Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={description}
              onChangeText={setDescription}
              placeholder="Adicione mais detalhes..."
              placeholderTextColor={colors.textSecondary}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.categoryHeader}>
              
              <Text style={styles.label}> Categoria * </Text>
              {!showNewCategory && (
                <Pressable
                  style={styles.addCategoryLink}
                  onPress={() => setShowNewCategory(true)}
                >
                  
                  <Ionicons
                    name="add-circle-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text style={styles.addCategoryLinkText}>
                    
                    Nova categoria
                  </Text>
                </Pressable>
              )}
            </View>
            {showNewCategory && (
              <View style={styles.newCategoryContainer}>
                
                <TextInput
                  style={styles.newCategoryInput}
                  value={newCategoryName}
                  onChangeText={setNewCategoryName}
                  placeholder="Nome da nova categoria"
                  placeholderTextColor={colors.textSecondary}
                  autoFocus
                  editable={!creatingCategory}
                />
                <Pressable
                  style={[
                    styles.newCategoryButton,
                    styles.newCategoryButtonSave,
                    newCategoryName.trim() === "" && styles.buttonDisabled,
                  ]}
                  onPress={handleCreateCategory}
                  disabled={newCategoryName.trim() === "" || creatingCategory}
                >
                  
                  {creatingCategory ? (
                    <ActivityIndicator size="small" color={colors.white} />
                  ) : (
                    <Ionicons name="checkmark" size={18} color={colors.white} />
                  )}
                </Pressable>
                <Pressable
                  style={[
                    styles.newCategoryButton,
                    styles.newCategoryButtonCancel,
                  ]}
                  onPress={() => {
                    setShowNewCategory(false);
                    setNewCategoryName("");
                  }}
                  disabled={creatingCategory}
                >
                  
                  <Ionicons
                    name="close"
                    size={18}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            )}
            {loadingCategories ? (
              <View style={styles.categoriesLoading}>
                
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : categories.length === 0 ? (
              <View style={styles.emptyCategories}>
                
                <Text style={styles.emptyCategoriesText}>
                  
                  Nenhuma categoria cadastrada.
                </Text>
              </View>
            ) : (
              <View style={styles.chipsContainer}>
                
                {categories.map((cat) => {
                  const isSelected = categoryId === cat.id;
                  return (
                    <Pressable
                      key={cat.id}
                      style={[styles.chip, isSelected && styles.chipSelected]}
                      onPress={() => setCategoryId(cat.id)}
                    >
                      
                      <Ionicons
                        name="pricetag-outline"
                        size={14}
                        color={isSelected ? colors.white : colors.primary}
                        style={styles.chipIcon}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        
                        {cat.title}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
            <View style={styles.actions}>
              
              <Pressable
                style={[styles.button, styles.buttonCancel]}
                onPress={onClose}
              >
                
                <Text style={styles.buttonCancelText}> Cancelar </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonSave,
                  isSaveDisabled && styles.buttonDisabled,
                ]}
                onPress={handleSave}
                disabled={isSaveDisabled}
              >
                
                <Text style={styles.buttonSaveText}>
                  
                  {task ? "Salvar" : "Adicionar"}
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 18, 25, 0.45)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.lg + 4,
    borderTopRightRadius: radius.lg + 4,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
    maxHeight: "88%",
  },
  scrollContent: { paddingBottom: spacing.lg },
  handle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.border,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.subtitle,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: typography.small,
    fontWeight: "600",
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
  inputMultiline: { minHeight: 80 },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  addCategoryLink: { flexDirection: "row", alignItems: "center", gap: 4 },
  addCategoryLinkText: {
    fontSize: typography.small,
    fontWeight: "600",
    color: colors.primary,
  },
  newCategoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  newCategoryInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: typography.small,
    color: colors.text,
  },
  newCategoryButton: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  newCategoryButtonSave: { backgroundColor: colors.primary },
  newCategoryButtonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoriesLoading: { paddingVertical: spacing.md, alignItems: "center" },
  emptyCategories: { paddingVertical: spacing.md },
  emptyCategoriesText: {
    fontSize: typography.small,
    color: colors.textSecondary,
    textAlign: "center",
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipIcon: { marginRight: 4 },
  chipText: {
    fontSize: typography.small,
    color: colors.text,
    fontWeight: "500",
  },
  chipTextSelected: { color: colors.white, fontWeight: "700" },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.sm },
  button: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
  },
  buttonCancel: { backgroundColor: colors.background },
  buttonCancelText: {
    fontSize: typography.body,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  buttonSave: { backgroundColor: colors.primary },
  buttonSaveText: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.white,
  },
  buttonDisabled: { opacity: 0.5 },
});
