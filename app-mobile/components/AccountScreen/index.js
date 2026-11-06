import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import { displayTime } from '../../services/dates';
import styles from './styles';

export default function AccountScreen({ activeUser, onGuide, logout, busy }) {
  return <View>
    <Text accessibilityRole="header" style={styles.title}>Minha conta</Text><Text style={styles.subtitle}>{activeUser.roleLabel}</Text><View style={styles.account}><Text accessibilityRole="header" style={styles.section}>{activeUser.name}</Text><Text style={styles.body}>{activeUser.email}</Text><Text style={styles.small}>Consentimento: {activeUser.consentAt ? displayTime(activeUser.consentAt) : 'Pendente'}</Text></View>
          <ActionButton label="Rever guia de uso" secondary onPress={onGuide} />
          <Text accessibilityRole="header" style={styles.section}>Perguntas frequentes</Text><Text style={styles.question}>Quem consegue ver as fotos?</Text><Text style={styles.body}>O dono da empresa e as pessoas vinculadas ao contrato.</Text><Text style={styles.question}>Posso alterar um relatório assinado?</Text><Text style={styles.body}>Não. A assinatura bloqueia a edição e mantém as versões anteriores disponíveis para consulta.</Text><Text style={styles.question}>Onde encontro os registros antigos?</Text><Text style={styles.body}>Abra uma obra e escolha a data no calendário. Os dias marcados têm relatórios.</Text><Text style={styles.question}>Não aparece nenhuma obra na minha conta.</Text><Text style={styles.body}>Peça ao dono da empresa para vincular seu e-mail ao contrato.</Text>
          <ActionButton label="Sair da conta" secondary busy={busy} onPress={logout} />

  </View>;
}
