import { useEffect, useRef } from 'react';
import { Animated, Platform, Text, View } from 'react-native';
import { useReducedMotion } from '../../services/useReducedMotion';
import styles, { pulseStyle } from './styles';

export default function Skeleton({ label = 'Carregando…' }) {
  const reduced = useReducedMotion();
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    opacity.setValue(1);
    if (reduced) return;
    const pulse = Animated.loop(Animated.sequence([0.5, 1].map((toValue) => Animated.timing(opacity, {
      toValue, duration: 900, useNativeDriver: Platform.OS !== 'web', isInteraction: false,
    }))));
    pulse.start();
    return () => pulse.stop();
  }, [opacity, reduced]);
  return <View style={styles.loading} accessibilityState={{ busy: true }}>
    <Animated.View accessible={false} style={[styles.mark, pulseStyle(opacity)]} />
    <Text accessibilityLiveRegion="polite" accessibilityRole="status" style={styles.label}>{label}</Text>
  </View>;
}
