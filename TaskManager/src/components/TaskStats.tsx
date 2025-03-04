import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskStatsProps {
  total: number;
  completed: number;
  pending: number;
}

export function TaskStats({ total, completed, pending }: TaskStatsProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.stat, styles.totalStat]}>
        <Ionicons name="list" size={16} color="#fff" />
        <Text style={styles.statText}>{total} Total</Text>
      </View>

      <View style={[styles.stat, styles.completedStat]}>
        <Ionicons name="checkmark-circle" size={16} color="#fff" />
        <Text style={styles.statText}>{completed} Done</Text>
      </View>

      <View style={[styles.stat, styles.pendingStat]}>
        <Ionicons name="time" size={16} color="#fff" />
        <Text style={styles.statText}>{pending} Pending</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  totalStat: {
    backgroundColor: '#4B6BFB',
  },
  completedStat: {
    backgroundColor: '#22C55E',
  },
  pendingStat: {
    backgroundColor: '#FB923C',
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
}); 