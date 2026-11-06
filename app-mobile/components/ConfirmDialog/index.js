import { useEffect, useRef } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import styles from './styles';

export default function ConfirmDialog({ visible, title, message, confirmLabel, cancelLabel = 'Continuar editando', onConfirm, onCancel }) {
  const cancel = useRef(null);
  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const previous = document.activeElement;
    const frame = requestAnimationFrame(() => cancel.current?.focus?.());
    return () => {
      cancelAnimationFrame(frame);
      if (previous?.isConnected) previous.focus();
    };
  }, [visible]);
  return <Modal transparent visible={Boolean(visible)} onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <Pressable accessible={false} tabIndex={-1} style={styles.backdrop} onPress={onCancel} />
      <View style={styles.dialog} accessibilityViewIsModal aria-modal={Platform.OS === 'web' ? true : undefined} accessibilityRole={Platform.OS === 'web' ? 'dialog' : undefined} accessibilityLabel={title}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <ActionButton buttonRef={cancel} label={cancelLabel} onPress={onCancel} />
        <ActionButton label={confirmLabel} secondary onPress={onConfirm} />
      </View>
    </View>
  </Modal>;
}
