import { useState } from 'react';
import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import FormField from '../FormField';
import Choice from '../Choice';
import { localDate } from '../../services/dates';
import { request } from '../../services/api';
import styles from './styles';

export default function WorkEditor({ users, work, onSaved, onCancel }) {
  const [fields, setFields] = useState({ name: work?.name || '', address: work?.address || '', contract: work?.contract || '', startDate: work?.startDate || localDate() });
  const [clientIds, setClients] = useState(work?.clientIds || []);
  const [operatorIds, setOperators] = useState(work?.operatorIds || []);
  const [operator, setOperator] = useState({ name: '', email: '', password: '' });
  const [showOperator, setShowOperator] = useState(false);
  const [newOperators, setNewOperators] = useState([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [operatorBusy, setOperatorBusy] = useState(false);
  const allUsers = [...users, ...newOperators.filter((u) => !users.some((v) => u.id === v.id))];
  function toggle(setter, id) { setter((previous) => previous.includes(id) ? previous.filter((v) => v !== id) : [...previous, id]); }
  async function addOperator() {
    setOperatorBusy(true); setError('');
    try {
      const { user } = await request('/operators', 'POST', operator);
      setNewOperators((previous) => [...previous, user]); setOperators((previous) => [...previous, user.id]); setShowOperator(false); setOperator({ name: '', email: '', password: '' });
    } catch (e) { setError(e.message); }
    finally { setOperatorBusy(false); }
  }
  async function save() {
    setBusy(true); setError('');
    try {
      await request(work ? `/works/${work.id}` : '/works', work ? 'PATCH' : 'POST', { ...fields, clientIds, operatorIds });
      await onSaved();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }
  return <View><Text style={styles.title}>{work ? 'Pessoas da obra' : 'Cadastrar obra'}</Text><Text style={styles.subtitle}>{work ? work.name : 'Crie o contrato e vincule as pessoas que terão acesso.'}</Text>
    {!work ? <View>{[['name', 'Nome da obra'], ['address', 'Endereço'], ['contract', 'Número do contrato'], ['startDate', 'Data de início (AAAA-MM-DD)']].map(([field, label]) => <FormField key={field} label={label} value={fields[field]} onChangeText={(value) => setFields((previous) => ({ ...previous, [field]: value }))} />)}</View> : null}
    <Text style={styles.section}>Clientes</Text><Text style={styles.subtitle}>Somente as pessoas vinculadas poderão consultar esta obra.</Text>
    {allUsers.filter((u) => u.role === 'client').map((u) => <Choice key={u.id} label={u.name} detail={u.email} selected={clientIds.includes(u.id)} onPress={() => toggle(setClients, u.id)} />)}
    <Text style={styles.section}>Responsáveis</Text>{allUsers.filter((u) => u.role === 'operator').map((u) => <Choice key={u.id} label={u.name} detail={u.email} selected={operatorIds.includes(u.id)} onPress={() => toggle(setOperators, u.id)} />)}
    {showOperator ? <View style={styles.operator}><Text style={styles.section}>Novo responsável</Text><FormField label="Nome do responsável" value={operator.name} onChangeText={(name) => setOperator((p) => ({ ...p, name }))} /><FormField label="E-mail do responsável" value={operator.email} autoCapitalize="none" keyboardType="email-address" onChangeText={(email) => setOperator((p) => ({ ...p, email }))} /><FormField label="Senha inicial" value={operator.password} secureTextEntry onChangeText={(password) => setOperator((p) => ({ ...p, password }))} hint="Mínimo de 6 caracteres. Compartilhe com o responsável." /><ActionButton label="Criar responsável" busy={operatorBusy} onPress={addOperator} /><ActionButton label="Fechar cadastro de responsável" secondary disabled={operatorBusy} onPress={() => setShowOperator(false)} /></View> : <ActionButton label="Cadastrar responsável" secondary onPress={() => setShowOperator(true)} />}
    {error ? <Text style={styles.error} accessibilityRole="alert">{error}</Text> : null}
    <View style={styles.actions}><ActionButton label={work ? 'Salvar vínculos' : 'Criar obra e contrato'} busy={busy} disabled={operatorBusy} onPress={save} /><ActionButton label="Cancelar" secondary disabled={busy || operatorBusy} onPress={onCancel} /></View>
  </View>;
}
