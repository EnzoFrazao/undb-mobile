import { useState } from 'react';
import { Modal, ScrollView, Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Calendar from '../Calendar';
import FormField from '../FormField';
import { maskDate, parseDisplayDate, toDisplayDate } from '../../services/dateMask.cjs';
import styles from './styles';

export default function DateField({ value, onChangeText, editable = true, hint = 'Use o formato dia/mês/ano.', ...props }) {
  const [open, setOpen] = useState(false);
  return <View>
    <FormField {...props} value={value} onChangeText={(text) => onChangeText(maskDate(text))} editable={editable}
      keyboardType="number-pad" inputMode="numeric" placeholder="dd/mm/aaaa" hint={hint} />
    {editable ? <View style={styles.action}><ActionButton label="Escolher no calendário" icon="calendar" secondary onPress={() => setOpen(true)} /></View> : null}
    <Modal transparent visible={open} onRequestClose={() => setOpen(false)}>
      <View style={styles.overlay}>
        <ScrollView keyboardShouldPersistTaps="handled" style={styles.scroll} contentContainerStyle={styles.dialog} accessibilityViewIsModal>
          <Text accessibilityRole="header" style={styles.title}>Escolher data</Text>
          <Calendar reports={[]} picker selectedDate={parseDisplayDate(value)} onSelectDate={(date) => {
            onChangeText(toDisplayDate(date));
            setOpen(false);
          }} />
          <ActionButton label="Fechar calendário" secondary onPress={() => setOpen(false)} />
        </ScrollView>
      </View>
    </Modal>
  </View>;
}
