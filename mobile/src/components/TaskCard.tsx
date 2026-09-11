import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '../types';
import { colors, radius, shadow, spacing, typography } from '../theme';

interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const completed = task.completed;

  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <Pressable
        onPress={() => onToggle(task)}
        style={styles.checkbox}
        hitSlop={10}
        accessibilityLabel={completed ? 'Desmarcar como pendente' : 'Marcar como concluída'}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={26}
          color={completed ? colors.success : colors.border}
        />
      </Pressable>

      <View style={styles.content}>
        <Text style={[styles.title, completed && styles.titleCompleted]} numberOfLines={2}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        <View style={styles.metaRow}>
          {task.category_title ? (
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag-outline" size={11} color={colors.primary} />
              <Text style={styles.categoryBadgeText} numberOfLines={1}>
                {task.category_title}
              </Text>
            </View>
          ) : null}
          <Text style={styles.date}>{formatDate(task.created_at)}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => onEdit(task)} hitSlop={10} style={styles.actionButton}>
          <Ionicons name="create-outline" size={20} color={colors.textSecondary} />
        </Pressable>
        <Pressable onPress={() => onDelete(task)} hitSlop={10} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  cardCompleted: {
    opacity: 0.85,
  },
  checkbox: {
    marginTop: 2,
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    fontSize: typography.body,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  description: {
    fontSize: typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  categoryBadgeText: {
    fontSize: typography.caption,
    fontWeight: '600',
    color: colors.primary,
  },
  date: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  // styles above already include metaRow, categoryBadge and categoryBadgeText
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: 6,
  },
});
