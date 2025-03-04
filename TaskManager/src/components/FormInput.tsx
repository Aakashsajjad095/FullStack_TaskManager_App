import React, { forwardRef } from 'react';
import { 
  StyleSheet, 
  TextInput, 
  View, 
  Text, 
  TextInputProps,
  ViewStyle,
} from 'react-native';
import Animated, { 
  FadeInDown,
  useAnimatedStyle,
  withSpring 
} from 'react-native-reanimated';

interface FormInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export const FormInput = forwardRef<TextInput, FormInputProps>(({ 
  label,
  error,
  containerStyle,
  style,
  ...props 
}, ref) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        ref={ref}
        style={[
          styles.input, 
          style,
          error ? styles.inputError : null
        ]}
        placeholderTextColor="#999"
        {...props}
      />
      {error && (
        <Animated.Text 
          entering={FadeInDown.springify()}
          style={styles.errorText}
        >
          {error}
        </Animated.Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 56,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
}); 