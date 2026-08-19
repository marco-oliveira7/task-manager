import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FilterType } from '../types';
import { colors, radius, spacing, typography } from '../theme';

interface Props {
  active: FilterType;
  onChange: (filter: FilterType) => void;
}

const FILTERS: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendentes' },
  { key: 'completed', label: 'Concluídas' },
];

export default function FilterTabs({ active, onChange }: Props) {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = filter.key === active;
        return (
          <Pressable
            key={filter.key}
            onPress={() => onChange(filter.key)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.label, isActive && styles.labelActive]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.border,
    borderRadius: radius.full,
    padding: 4,
    marginHorizontal: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.card,
    ...({
      shadowColor: '#1F2430',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    } as object),
  },
  label: {
    fontSize: typography.small,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.primary,
  },
});
