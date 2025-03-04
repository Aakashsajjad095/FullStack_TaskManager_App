import React, { useState, useCallback, useRef } from 'react';
import { 
  Modal, 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Pressable,
  Text
} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';
import Animated, { 
  FadeIn,
  FadeInUp,
  SlideInUp,
  FadeOut,
  SlideOutDown,
  runOnJS,
  withTiming,
  useAnimatedStyle,
  interpolate,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './Button';
import { TaskService } from '../services/api';
import { FormInput } from './FormInput';
import { useAppDispatch } from '@/store/hooks';
import { addTask } from '@/store/taskSlice';
import { TaskLoader } from './TaskLoader';

const { height } = Dimensions.get('window');
const INPUT_HEIGHT = 56;

interface AddTaskModalProps {
  isVisible: boolean;
  onClose: () => void;
}

type Priority = 'low' | 'medium' | 'high';

export function AddTaskModal({ isVisible, onClose }: AddTaskModalProps) {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState(moment());
  const [selectedate, setSelectedDate] = useState<string>(''); // Change type to string

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const titleInputRef = useRef<TextInput>(null);
  const descriptionInputRef = useRef<TextInput>(null);
  
  const scrollY = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    if (isVisible) {
      setModalVisible(true);
      translateY.value = withTiming(0);
    } else {
      translateY.value = withTiming(height, {}, () => {
        runOnJS(setModalVisible)(false);
      });
    }
  }, [isVisible]);

  const headerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, 50],
        [0, -20],
        'clamp'
      )
    }],
    opacity: interpolate(
      scrollY.value,
      [0, 30],
      [1, 0.8],
      'clamp'
    )
  }));

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: translateY.value
    }]
  }));

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    }
  });

  const handleInputFocus = useCallback((input: 'title' | 'description') => {
    if (errors[input]) {
      setErrors(prev => ({ ...prev, [input]: undefined }));
    }
  }, [errors]);

  const handleClose = () => {
    translateY.value = withTiming(height, {}, () => {
      runOnJS(onClose)();
    });
  };

  const handleDateSelect = (date: moment.Moment) => {
    setDueDate(date);
    const formattedDate = date.format('DD/MM/YYYY'); // Format to 'DD/MM/YYYY'
    setSelectedDate(formattedDate); // Set the formatted date string to state
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit() {
    console.log('dueDate',selectedate)
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await dispatch(addTask({ 
        title, 
        description,
        priority,
        dueDate: selectedate
      })).unwrap();
      
      // Don't reset form or close modal immediately
      // Let the loader animation complete first
    } catch (error) {
      console.error('Error creating task:', error);
      setIsLoading(false);
    }
  }

  const handleLoaderComplete = () => {
    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate(moment());
    setErrors({});
    setIsLoading(false);
    handleClose();
  };

  const PriorityButton = ({ value, current }: { value: Priority, current: Priority }) => (
    <Pressable
      style={[
        styles.priorityButton,
        value === current && styles.priorityButtonActive,
        value === 'high' && styles.highPriority,
        value === 'medium' && styles.mediumPriority,
        value === 'low' && styles.lowPriority,
        value === current && value === 'high' && styles.highPriorityActive,
        value === current && value === 'medium' && styles.mediumPriorityActive,
        value === current && value === 'low' && styles.lowPriorityActive,
      ]}
      onPress={() => setPriority(value)}
    >
      <Ionicons 
        name={value === current ? 'radio-button-on' : 'radio-button-off'} 
        size={16} 
        color={value === current ? getPriorityColor(value) : '#64748B'} 
        style={styles.priorityIcon}
      />
      <Text style={[
        styles.priorityText,
        value === current && styles.priorityTextActive,
        value === current && value === 'high' && styles.highPriorityTextActive,
        value === current && value === 'medium' && styles.mediumPriorityTextActive,
        value === current && value === 'low' && styles.lowPriorityTextActive,
      ]}>
        {value.charAt(0).toUpperCase() + value.slice(1)}
      </Text>
    </Pressable>
  );

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return '#DC2626';
      case 'medium':
        return '#D97706';
      case 'low':
        return '#475569';
    }
  };

  if (!modalVisible) return null;

  return (
    <Modal
      visible={true}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View 
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={styles.overlay}
      >
        {isLoading && (
          <TaskLoader 
            onAnimationComplete={handleLoaderComplete}
          />
        )}
        
        <Pressable style={styles.dismissArea} onPress={handleClose} />
        <Animated.View 
          style={[styles.container, containerStyle]}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.content}
          >
            <Animated.View style={[styles.header, headerStyle]}>
              <TouchableOpacity 
                onPress={handleClose} 
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
              <Animated.Text 
                entering={FadeIn.delay(300)}
                style={styles.headerTitle}
              >
                Create New Task
              </Animated.Text>
            </Animated.View>

            <Animated.ScrollView
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <Animated.View 
                entering={FadeInUp.delay(200).springify()}
              >
                <FormInput
                  ref={titleInputRef}
                  label="Task Title"
                  placeholder="What needs to be done?"
                  value={title}
                  onChangeText={setTitle}
                  autoFocus
                  error={errors.title}
                  onFocus={() => handleInputFocus('title')}
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    descriptionInputRef.current?.focus();
                  }}
                  blurOnSubmit={false}
                />
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(300).springify()}>
                <Text style={styles.label}>Priority</Text>
                <View style={styles.priorityContainer}>
                  <PriorityButton value="high" current={priority} />
                  <PriorityButton value="medium" current={priority} />
                  <PriorityButton value="low" current={priority} />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInUp.delay(400).springify()}>
                <Text style={styles.label}>Due Date</Text>
                <View style={styles.calendarContainer}>
                  <CalendarStrip
                    scrollable
                    style={styles.calendar}
                    calendarColor={'#fff'}
                    calendarHeaderStyle={styles.calendarHeader}
                    dateNumberStyle={styles.dateNumber}
                    dateNameStyle={styles.dateName}
                    highlightDateNumberStyle={styles.highlightDateNumber}
                    highlightDateNameStyle={styles.highlightDateName}
                    disabledDateNameStyle={styles.disabledDateName}
                    disabledDateNumberStyle={styles.disabledDateNumber}
                    iconContainer={{ flex: 0.1 }}
                    selectedDate={dueDate}
                    onDateSelected={handleDateSelect}
                    minDate={moment()}
                    maxDate={moment().add(1, 'years')}
                    highlightDateContainerStyle={styles.highlightDateContainer}
                    iconStyle={styles.calendarIcon}
                    useIsoWeekday={false}
                  />
                </View>
              </Animated.View>

              <Animated.View 
                entering={FadeInUp.delay(400).springify()}
              >
                <FormInput
                  ref={descriptionInputRef}
                  label="Task Description"
                  placeholder="Add details about this task..."
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  error={errors.description}
                  style={styles.textArea}
                  onFocus={() => handleInputFocus('description')}
                />
              </Animated.View>

              <Animated.View 
                entering={FadeInUp.delay(600).springify()}
                style={styles.buttonContainer}
              >
                <Button 
                  title="Create Task"
                  onPress={handleSubmit}
                  loading={isLoading}
                  style={styles.button}
                />
              </Animated.View>
            </Animated.ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: height * 0.9,
    maxHeight: height * 0.9,
    transform: [{ translateY: height }], // Start from bottom
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: Platform.OS === 'ios' ? 24 : 12,
  },
  button: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#007AFF',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  priorityButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityIcon: {
    marginRight: 4,
  },
  priorityButtonActive: {
    borderWidth: 1,
  },
  highPriority: {
    backgroundColor: '#FEF2F2',
  },
  mediumPriority: {
    backgroundColor: '#FFFBEB',
  },
  lowPriority: {
    backgroundColor: '#F8FAFC',
  },
  highPriorityActive: {
    backgroundColor: '#FEE2E2',
    borderColor: '#DC2626',
  },
  mediumPriorityActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
  },
  lowPriorityActive: {
    backgroundColor: '#F1F5F9',
    borderColor: '#475569',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  highPriorityTextActive: {
    color: '#DC2626',
  },
  mediumPriorityTextActive: {
    color: '#D97706',
  },
  lowPriorityTextActive: {
    color: '#475569',
  },
  calendarContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  calendar: {
    height: 100,
    paddingTop: 8,
    paddingBottom: 8,
  },
  calendarHeader: {
    color: '#1E293B',
    fontSize: 14,
    fontWeight: '600',
  },
  dateNumber: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '500',
  },
  dateName: {
    color: '#64748B',
    fontSize: 12,
  },
  highlightDateNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  highlightDateName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  highlightDateContainer: {
    backgroundColor: '#4B6BFB',
    borderRadius: 8,
  },
  disabledDateName: {
    color: '#CBD5E1',
  },
  disabledDateNumber: {
    color: '#CBD5E1',
  },
  calendarIcon: {
    tintColor: '#4B6BFB',
  },
}); 