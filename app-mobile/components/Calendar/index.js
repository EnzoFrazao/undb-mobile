import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { localDate } from '../../services/dates';
import Icon from '../Icon';
import styles from './styles';

export default function Calendar({ reports, selectedDate, onSelectDate, picker = false }) {
  const [month, setMonth] = useState(() => {
    const initial = selectedDate ? new Date(`${selectedDate}T12:00:00`) : new Date();
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });
  const first = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const markedDates = new Set(reports.map((report) => report.date));
  const monthLabel = month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  const cells = Array.from({ length: Math.ceil((first + days) / 7) * 7 }, (_, index) => {
    const day = index - first + 1;
    if (day < 1 || day > days) return <View key={index} style={styles.cell} />;
    const date = localDate(new Date(month.getFullYear(), month.getMonth(), day));
    const available = markedDates.has(date);
    return <Pressable key={index} accessibilityRole="button" accessibilityLabel={`${day} de ${monthLabel}${available ? ', com relatório' : ''}`} accessibilityState={{ selected: selectedDate === date }} onPress={() => onSelectDate(!picker && selectedDate === date ? '' : date)} style={[styles.cell, selectedDate === date && styles.selected]}><Text style={[styles.day, selectedDate === date && styles.selectedText]}>{day}</Text><View style={[styles.dot, available && styles.dotActive, selectedDate === date && available && styles.dotSelected]} /></Pressable>;
  });
  return <View style={styles.calendar}><View style={styles.heading}><Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.arrow}><Icon name="back" active /></Pressable><Text style={styles.month}>{monthLabel[0].toUpperCase() + monthLabel.slice(1)}</Text><Pressable accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.arrow}><Icon name="next" active /></Pressable></View><View style={styles.grid}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((label, i) => <Text key={i} accessibilityLabel={['segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado', 'domingo'][i]} style={styles.weekday}>{label}</Text>)}{cells}</View>{!picker ? <Text style={styles.legend}>Dias com ponto têm relatório. Toque para filtrar.</Text> : null}</View>;
}
