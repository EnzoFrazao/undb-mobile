import { View } from 'react-native';
import FormField from '../FormField';
import ActionButton from '../ActionButton';
import styles from './styles';

export default function SearchField({ label, value, onChangeText, placeholder }) {
  return <View style={styles.group}>
    <FormField label={label} value={value} onChangeText={onChangeText} placeholder={placeholder} autoCapitalize="none" returnKeyType="search" maxLength={120} />
    {value ? <ActionButton label="Limpar busca" onPress={() => onChangeText('')} secondary /> : null}
  </View>;
}
