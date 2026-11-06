import { useState } from 'react';
import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import styles from './styles';

const guides = {
  owner: ['Veja todos os contratos e as obras da empresa.', 'Vincule clientes e responsáveis a cada obra.', 'Abra Revisão para ver os RDOs pendentes. Após a assinatura, a edição fica bloqueada.'],
  operator: ['Abra a aba RDO e selecione uma obra atribuída a você.', 'Preencha o diário e anexe fotos da galeria ou câmera.', 'Envie o registro. O dono poderá revisar e assinar.'],
  client: ['Consulte somente as obras vinculadas à sua conta.', 'Use o calendário para encontrar registros por data.', 'Acompanhe atividades, fotos e assinaturas. Seu acesso é de consulta.'],
};

export default function GuideScreen({ activeUser, busy, finishGuide, onClose }) {
  const [consent, setConsent] = useState(false);
  return <View>
    <Text style={styles.caption}>Guia de acesso</Text><Text accessibilityRole="header" style={styles.title}>Olá, {activeUser.name}</Text><Text style={styles.subtitle}>O que você pode fazer como {activeUser.roleLabel.toLowerCase()}:</Text>
        {guides[activeUser.role].map((item, index) => <View key={item} style={styles.guideItem}><Text style={styles.guideNumber}>{index + 1}</Text><Text style={styles.guideText}>{item}</Text></View>)}
        <Text accessibilityRole="header" style={styles.section}>Privacidade e dados da obra</Text><Text style={styles.body}>Nome e e-mail identificam a autoria dos registros. Fotos e relatórios ficam disponíveis somente às pessoas vinculadas ao contrato e ao dono da empresa. Compartilhe imagens apenas com autorização das pessoas retratadas. Para solicitar correção ou exclusão de dados pessoais, entre em contato com o administrador da empresa; registros assinados seguem a política de retenção do contrato.</Text>
        {!activeUser.consentAt ? <Choice label="Concordo com o tratamento dos meus dados para acesso e identificação nos registros da obra." selected={consent} onPress={() => setConsent(!consent)} /> : null}
        <ActionButton label="Acessar minhas obras" busy={busy} disabled={!activeUser.consentAt && !consent} onPress={() => finishGuide(consent)} />

    {onClose ? <ActionButton label="Agora não" secondary disabled={busy} onPress={onClose} /> : null}
  </View>;
}
