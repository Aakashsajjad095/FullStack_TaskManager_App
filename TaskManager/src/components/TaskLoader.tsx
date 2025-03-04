import React from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedProps,
  withRepeat,
  withTiming,
  useSharedValue,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeOut,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import Svg, { Path, Circle, G, Defs, LinearGradient, Stop, Filter, FeDropShadow } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface TaskLoaderProps {
  size?: number;
  color?: string;
  onAnimationComplete?: () => void;
}

export function TaskLoader({ 
  size = 120, 
  color = '#4B6BFB',
  onAnimationComplete 
}: TaskLoaderProps) {
  const checkmarkProgress = useSharedValue(0);
  const circleProgress = useSharedValue(0);
  const clipboardProgress = useSharedValue(0);
  const lineProgress = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const rotation = useSharedValue(0);
  const sparkleOpacity = useSharedValue(0);
  const fadeOut = useSharedValue(1);

  React.useEffect(() => {
    const animate = () => {
      // Reset values
      scale.value = 0.8;
      checkmarkProgress.value = 0;
      circleProgress.value = 0;
      clipboardProgress.value = 0;
      lineProgress.value = 0;
      sparkleOpacity.value = 0;
      fadeOut.value = 1;

      // Start animation sequence
      scale.value = withSpring(1, {
        damping: 12,
        stiffness: 120,
      });

      rotation.value = withRepeat(
        withTiming(360, { 
          duration: 8000,
          easing: Easing.linear,
        }),
        -1,
        false
      );

      // Clipboard draws in
      clipboardProgress.value = withTiming(1, { 
        duration: 600,
        easing: Easing.bezier(0.4, 0, 0.2, 1)
      });

      // Circle progress with bounce
      circleProgress.value = withDelay(300, withSpring(1, {
        damping: 8,
        stiffness: 100,
      }));

      // Staggered line animation
      lineProgress.value = withDelay(600, withSequence(
        withTiming(1, { duration: 400 }),
        withDelay(100, withTiming(1, { duration: 400 })),
        withDelay(200, withTiming(1, { duration: 400 }))
      ));

      // Checkmark with sparkle effect
      checkmarkProgress.value = withDelay(1000, withSpring(1, {
        damping: 6,
        stiffness: 120,
      }));

      // Sparkle animation
      sparkleOpacity.value = withDelay(1200, withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      ));

      // Fade out animation after completion
      fadeOut.value = withDelay(2000, withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.ease)
      }, (finished) => {
        if (finished && onAnimationComplete) {
          runOnJS(onAnimationComplete)();
        }
      }));
    };

    animate();
  }, []);

  const containerStyle = useAnimatedProps(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: fadeOut.value,
  }));

  const clipboardAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 200 * (1 - clipboardProgress.value),
  }));

  const circleAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 283 * (1 - circleProgress.value),
  }));

  const checkmarkAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 50 * (1 - checkmarkProgress.value),
    opacity: checkmarkProgress.value,
  }));

  const lineAnimatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 100 * (1 - lineProgress.value),
  }));

  return (
    <Animated.View 
      style={[
        styles.container,
        { opacity: fadeOut }
      ]}
    >
      <Animated.View style={containerStyle}>
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="taskGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.2" />
              <Stop offset="1" stopColor={color} stopOpacity="0.1" />
            </LinearGradient>
            <Filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <FeDropShadow dx="1" dy="1" stdDeviation="2" floodColor={color} floodOpacity="0.3"/>
            </Filter>
          </Defs>

          {/* Animated background pattern */}
          <G opacity="0.1">
            {[...Array(4)].map((_, i) => (
              <Path
                key={i}
                d={`M ${50 + 25 * Math.cos(i * Math.PI/2)} ${50 + 25 * Math.sin(i * Math.PI/2)} l 10 0`}
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                transform={`rotate(${i * 90}, 50, 50)`}
              />
            ))}
          </G>

          {/* Main circle */}
          <Circle
            cx="50"
            cy="50"
            r="40"
            fill="url(#taskGradient)"
            filter="url(#shadow)"
          />

          {/* Task list background */}
          <AnimatedPath
            d="M35 30 h30 a3 3 0 0 1 3 3 v34 a3 3 0 0 1 -3 3 h-30 a3 3 0 0 1 -3 -3 v-34 a3 3 0 0 1 3 -3"
            fill="#fff"
            stroke={color}
            strokeWidth="2"
            strokeDasharray="200"
            animatedProps={clipboardAnimatedProps}
          />

          {/* Task lines with stagger */}
          <AnimatedPath
            d="M38 40 h24 M38 50 h24 M38 60 h24"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="80"
            animatedProps={lineAnimatedProps}
          />

          {/* Checkmark with glow */}
          <AnimatedPath
            d="M42 50 L48 56 L58 42"
            stroke="#22C55E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="50"
            animatedProps={checkmarkAnimatedProps}
            filter="url(#shadow)"
          />
        </Svg>
      </Animated.View>

      <AnimatedText 
        entering={FadeIn.delay(800).springify()}
        style={[styles.text, { color, opacity: fadeOut }]}
      >
        Creating Task...
      </AnimatedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.97)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
}); 