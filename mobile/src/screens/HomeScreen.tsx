import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StatusBar as RNStatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { Task, TaskInput, FilterType } from '../types';
import { taskService } from '../services/taskService';
import { colors, radius, shadow, spacing, typography } from '../theme';
import TaskCard from '../components/TaskCard';
import FilterTabs from '../components/FilterTabs';
import TaskFormModal from '../components/TaskFormModal';
import EmptyState from '../components/EmptyState';

export default function HomeScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setError(null);
      const data = await taskService.list();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'pending':
        return tasks.filter((task) => !task.completed);
      case 'completed':
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const pendingCount = useMemo(() => tasks.filter((task) => !task.completed).length, [tasks]);

  const openCreate = () => {
    setEditingTask(null);
    setModalVisible(true);
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  const handleToggle = async (task: Task) => {
    const previous = tasks;
    const next = tasks.map((item) =>
      item.id === task.id ? { ...item, completed: !item.completed } : item
    );
    setTasks(next);

    try {
      const updated = await taskService.toggle(task.id, !task.completed);
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setTasks(previous);
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível atualizar a tarefa');
    }
  };

  const handleSave = async (data: TaskInput) => {
    try {
      if (editingTask) {
        const updated = await taskService.update(editingTask.id, data);
        setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      } else {
        const created = await taskService.create(data);
        setTasks((current) => [created, ...current]);
      }
      setModalVisible(false);
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível salvar a tarefa');
    }
  };

  const confirmDelete = (task: Task) => {
    Alert.alert('Excluir tarefa', `Deseja excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await taskService.remove(task.id);
            setTasks((current) => current.filter((item) => item.id !== task.id));
          } catch (err) {
            Alert.alert('Erro', err instanceof Error ? err.message : 'Não foi possível excluir');
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Task }) => (
    <TaskCard task={item} onToggle={handleToggle} onEdit={openEdit} onDelete={confirmDelete} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Minhas Tarefas</Text>
          <Text style={styles.headerSubtitle}>
            {pendingCount === 0
              ? 'Tudo em dia!'
              : `${pendingCount} ${pendingCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'}`}
          </Text>
        </View>
      </View>

      <FilterTabs active={filter} onChange={setFilter} />

      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : error ? (
          <View style={styles.center}>
            <Ionicons name="cloud-offline-outline" size={40} color={colors.textSecondary} />
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retryButton} onPress={loadTasks}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : filteredTasks.length === 0 ? (
          filter === 'all' ? (
            <EmptyState
              title="Nenhuma tarefa ainda"
              subtitle="Toque no botão + para criar sua primeira tarefa"
            />
          ) : (
            <EmptyState
              title={filter === 'pending' ? 'Nenhuma tarefa pendente' : 'Nenhuma tarefa concluída'}
              subtitle="As tarefas desse filtro aparecerão aqui"
            />
          )
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadTasks(); }} tintColor={colors.primary} />
            }
          />
        )}
      </View>

      <Pressable style={styles.fab} onPress={openCreate} accessibilityLabel="Criar nova tarefa">
        <Ionicons name="add" size={30} color={colors.white} />
      </Pressable>

      <TaskFormModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: RNStatusBar.currentHeight ?? 0,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: typography.title,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  listContainer: {
    flex: 1,
    marginTop: spacing.lg,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 96,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    gap: spacing.md,
  },
  errorText: {
    fontSize: typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  retryText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: typography.body,
  },
  fab: {
    position: 'absolute',
    right: spacing.xl,
    bottom: spacing.xxxl,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
});