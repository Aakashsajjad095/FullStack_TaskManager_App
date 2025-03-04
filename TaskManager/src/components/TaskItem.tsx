import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types';
import moment from 'moment';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const handleToggle = React.useCallback(() => {
    onToggleComplete(task.id);
  }, [task.id, onToggleComplete]);

  return (
    <View style={[
      styles.container,
      task.completed ? styles.completedContainer : null
    ]}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        {task.completed ? (
          <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
        ) : (
          <Ionicons name="ellipse-outline" size={24} color="#94A3B8" />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[
          styles.title,
          task.completed && styles.completedText
        ]}>
          {task.title}
        </Text>
        {task.description ? (
          <Text style={styles.description}>{task.description}</Text>
        ) : null}
        
        <View style={styles.meta}>
          <View style={[
            styles.priority,
            task.priority === 'high' && styles.highPriority,
            task.priority === 'medium' && styles.mediumPriority,
          ]}>
            <Text style={styles.priorityText}>
              {task.priority || 'Low'}
            </Text>
          </View>

          <View style={styles.date}>
            <Ionicons name="calendar-outline" size={14} color="#64748B" />
            <Text style={styles.dateText}>
            <Text style={styles.dateText}>
            <Text style={styles.dateText}>
  {task.dueDate
    ? moment(task.dueDate, 'DD/MM/YYYY').format('MMM D, YYYY')
    : "No due date"}
</Text>
    </Text>
</Text>
          </View>

          {task.completed && (
            <View style={styles.status}>
              <Text style={styles.statusText}>Completed</Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
      >
        <Ionicons name="trash-outline" size={20} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  completedContainer: {
    backgroundColor: '#F8FAFC',
    borderStyle: 'dashed',
  },
  checkbox: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priority: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
  },
  highPriority: {
    backgroundColor: '#FEE2E2',
  },
  mediumPriority: {
    backgroundColor: '#FEF3C7',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    textTransform: 'capitalize',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#64748B',
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#DCFCE7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#22C55E',
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
    marginTop: -4,
  },
}); 