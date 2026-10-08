import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { localDate } from '../../services/dates';
import styles from './styles';

export default function Calendar({ reports, selectedDate, onSelectDate }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const first = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const day = index - first + 1;
    if (day < 1 || day > days) return <View key={index} style={styles.cell} />;
    const date = localDate(new Date(month.getFullYear(), month.getMonth(), day));
    const available = reports.some((report) => report.date === date);
    return <Pressable key={index} accessibilityRole="button" accessibilityLabel={`${day} de ${month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}${available ? ', com relatório' : ''}`} accessibilityState={{ selected: selectedDate === date }} onPress={() => onSelectDate(selectedDate === date ? '' : date)} style={[styles.cell, selectedDate === date && styles.selected]}><Text style={[styles.day, selectedDate === date && styles.selectedText]}>{day}</Text><View style={[styles.dot, available && styles.dotActive, selectedDate === date && available && styles.dotSelected]} /></Pressable>;
  });
  return <View style={styles.calendar}><View style={styles.heading}><Pressable accessibilityRole="button" accessibilityLabel="Mês anterior" onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} style={styles.arrow}><Text style={styles.arrowText}>‹</Text></Pressable><Text style={styles.month}>{month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text><Pressable accessibilityRole="button" accessibilityLabel="Próximo mês" onPress={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} style={styles.arrow}><Text style={styles.arrowText}>›</Text></Pressable></View><View style={styles.grid}>{['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((label, i) => <Text key={i} style={styles.weekday}>{label}</Text>)}{cells}</View><Text style={styles.legend}>● Dias com relatório. Toque para filtrar.</Text></View>;
}
