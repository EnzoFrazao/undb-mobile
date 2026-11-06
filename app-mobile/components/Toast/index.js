import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Platform, Pressable, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useReducedMotion } from '../../services/useReducedMotion';
import styles, { toastPosition } from './styles';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const opacity = useRef(new Animated.Value(1)).current;
  const motion = useReducedMotion();
  const { bottom } = useSafeAreaInsets();
  const hide = useCallback(() => {
    clearTimeout(timer.current);
    opacity.stopAnimation();
    if (motion) { setToast(null); return; }
    Animated.timing(opacity, { toValue: 0, duration: 120, useNativeDriver: Platform.OS !== 'web' }).start(({ finished }) => {
      if (finished) setToast(null);
    });
  }, [motion, opacity]);
  const show = useCallback(({ duration = 4000, ...item }) => {
    clearTimeout(timer.current);
    opacity.stopAnimation();
    opacity.setValue(motion ? 1 : 0.85);
    setToast(item);
    if (!motion) Animated.timing(opacity, { toValue: 1, duration: 160, useNativeDriver: Platform.OS !== 'web' }).start();
    if (Platform.OS === 'ios') AccessibilityInfo.announceForAccessibility(item.message);
    timer.current = setTimeout(hide, duration);
  }, [hide, motion, opacity]);
  useEffect(() => () => {
    clearTimeout(timer.current);
    opacity.stopAnimation();
  }, [opacity]);
  const value = useMemo(() => ({ show }), [show]);
  return <ToastContext.Provider value={value}>
    {children}
    {toast ? <Animated.View style={[styles.toast, styles[toast.type], toastPosition(bottom, motion ? 1 : opacity)]}>
      <Text accessibilityLiveRegion="polite" accessibilityRole="alert" style={styles.message}>{toast.message}</Text>
      {toast.action ? <Pressable accessibilityRole="button" style={styles.button} onPress={() => { hide(); toast.action.onPress(); }}><Text style={styles.link}>{toast.action.label}</Text></Pressable> : null}
      <Pressable accessibilityRole="button" accessibilityLabel="Fechar mensagem" style={styles.button} onPress={hide}><Text style={styles.link}>Fechar</Text></Pressable>
    </Animated.View> : null}
  </ToastContext.Provider>;
}
