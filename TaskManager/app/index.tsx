import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Text,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Task } from '@/types';
import { TaskService } from '@/services/api';
import { TaskItem } from '@/components/TaskItem';
import { TaskStats } from '@/components/TaskStats';
import { AddTaskModal } from '@/components/AddTaskModal';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  FadeIn,
  SlideInRight
} from 'react-native-reanimated';
import Logo from '@/assets/images/logo';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTasks, toggleTask, deleteTask } from '@/store/taskSlice';
import { DUMMY_TASKS } from '@/constants/dummyData';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

export default function TaskListScreen() {
  const dispatch = useAppDispatch();
  const { tasks, isLoading } = useAppSelector(state => state.tasks);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };
  console.log('tasks',tasks)

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  async function handleRefresh() {
    setIsRefreshing(true);
    await dispatch(fetchTasks());
    setIsRefreshing(false);
  }

  async function handleToggleComplete(taskId: string) {
    await dispatch(toggleTask(taskId));
  }

  async function handleDeleteTask(taskId: string) {
    await dispatch(deleteTask(taskId));
  }

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4B6BFB" />
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Ionicons name="list-outline" size={64} color="#E2E8F0" />
        <Text style={styles.emptyText}>No tasks yet</Text>
        <Text style={styles.subText}>
          Tap the + button to add your first task
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
<View style={styles.header}>
              <View style={styles.headerContent}>
                <View 
                  style={styles.headerRight}
                >
                  <Logo stroke="#fff" />
                </View>
                <View style={styles.headerTexts}>
                  <Text  
                    style={styles.headerTitle}
                  >
                    Task Master
                  </Text>
                  <Text 
                    style={styles.headerSubtitle}
                  >
                    Organize tasks • Boost productivity
                  </Text>
                </View>
              </View>
            </View>
      
      <View style={styles.content}>
        <TaskStats {...stats} />

        <View style={styles.filterContainer}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          <View style={styles.filters}>
            <Pressable
              style={[styles.filter, filter === 'all' && styles.activeFilter]}
              onPress={() => setFilter('all')}
            >
              <Text style={[
                styles.filterText,
                filter === 'all' && styles.activeFilterText
              ]}>
                All
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filter, filter === 'pending' && styles.activeFilter]}
              onPress={() => setFilter('pending')}
            >
              <Text style={[
                styles.filterText,
                filter === 'pending' && styles.activeFilterText
              ]}>
                Pending
              </Text>
            </Pressable>
            <Pressable
              style={[styles.filter, filter === 'completed' && styles.activeFilter]}
              onPress={() => setFilter('completed')}
            >
              <Text style={[
                styles.filterText,
                filter === 'completed' && styles.activeFilterText
              ]}>
                Completed
              </Text>
            </Pressable>
          </View>
        </View>

        <Animated.FlatList
          data={filteredTasks}
          renderItem={({ item, index }) => (
            <Animated.View
              entering={FadeInDown.delay(index * 100)}
            >
              <TaskItem
                task={item}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteTask}
              />
            </Animated.View>
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor="#4B6BFB"
            />
          }
        />
      </View>
      
      <AnimatedPressable 
        style={styles.fab}
        entering={FadeInRight}
        onPress={() => setIsModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </AnimatedPressable>

      <AddTaskModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onTaskAdded={() => dispatch(fetchTasks())}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: '#F8FAFC',
    // backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    width: '100%',
    paddingRight: 16,
    paddingLeft:16,
    marginTop:10,
    // backgroundColor: '#fff',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTexts: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    letterSpacing: 0.2,
    fontWeight: '500',
  },
  headerRight: {
    backgroundColor: '#4B6BFB',
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4B6BFB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filter: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
  },
  activeFilter: {
    backgroundColor: '#4B6BFB',
  },
  filterText: {
    fontSize: 14,
    color: '#64748B',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
  },
  subText: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4B6BFB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#4B6BFB',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
}); 