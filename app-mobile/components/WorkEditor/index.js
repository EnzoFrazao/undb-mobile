import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import ActionButton from '../ActionButton';
import Choice from '../Choice';
import DateField from '../DateField';
import ErrorState from '../ErrorState';
import FormField from '../FormField';
import { useToast } from '../Toast';
import { localDate } from '../../services/dates';
import { parseDisplayDate, toDisplayDate } from '../../services/dateMask.cjs';
import { isDirty } from '../../services/dirty.cjs';
import { focusFirstError } from '../../services/formErrors';
import { useExitGuard } from '../../services/useExitGuard';
import { request } from '../../services/api';
import styles from './styles';

const workFields = [
  ['name', 'Nome da obra', 120], ['address', 'Endereço', 300], ['contract', 'Número do contrato', 80], ['startDate', 'Data de início', 10],
];
const operatorFields = [
  ['operatorName', 'name', 'Nome do responsável', 100],
  ['operatorEmail', 'email', 'E-mail do responsável', 254],
  ['operatorPassword', 'password', 'Senha inicial', 128],
];
const order = [...workFields.map(([key]) => key), ...operatorFields.map(([key]) => key)];
const emptyOperator = { name: '', email: '', password: '' };

export default function WorkEditor({ users, work, onSaved, onCancel, onDirtyChange, onBlockingChange, scrollRef }) {
  const initial = useRef({
    name: work?.name || '', address: work?.address || '', contract: work?.contract || '',
    startDate: toDisplayDate(work?.startDate || localDate()), clientIds: work?.clientIds || [], operatorIds: work?.operatorIds || [],
  });
  const { clientIds: initialClients, operatorIds: initialOperators, ...initialFields } = initial.current;
  const [fields, setFields] = useState(initialFields);
  const [clientIds, setClients] = useState(initialClients);
  const [operatorIds, setOperators] = useState(initialOperators);
  const [operator, setOperator] = useState(emptyOperator);
  const [showOperator, setShowOperator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newOperators, setNewOperators] = useState([]);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [operation, setOperation] = useState(null);
  const pending = useRef(false);
  const refs = useRef(Object.fromEntries(order.map((key) => [key, { current: null }]))).current;
  const toast = useToast();
  const allUsers = [...users, ...newOperators.filter((item) => !users.some((user) => user.id === item.id))];
  const changed = isDirty(initial.current, { ...fields, clientIds, operatorIds }) || isDirty(emptyOperator, operator);
  const message = newOperators.length ? 'As mudanças na obra serão descartadas. Os responsáveis criados continuarão cadastrados.'
    : changed ? 'As mudanças feitas neste formulário serão descartadas.' : '';
  useExitGuard(message, Boolean(operation), onDirtyChange, onBlockingChange);

  function toggle(setter, id, field) {
    setter((previous) => previous.includes(id) ? previous.filter((value) => value !== id) : [...previous, id]);
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  }
  function showErrors(next) {
    setErrors(next);
    focusFirstError(next, order, refs, scrollRef);
  }
  async function submit(kind, action) {
    if (pending.current) return;
    pending.current = true;
    setOperation(kind); setError('');
    try { await action(); }
    catch (err) {
      if (err.fields) showErrors(err.fields);
      setError(err.message);
    }
    finally { pending.current = false; setOperation(null); }
  }
  function addOperator() {
    const next = {};
    if (!operator.name.trim()) next.operatorName = 'Informe o nome do responsável.';
    if (!/^\S+@\S+\.\S+$/.test(operator.email.trim())) next.operatorEmail = 'Informe um e-mail válido.';
    if (operator.password.length < 6 || operator.password.length > 128) next.operatorPassword = 'Use de 6 a 128 caracteres.';
    showErrors(next);
    if (Object.keys(next).length) return;
    submit('operator', async () => {
      const { user } = await request('/operators', 'POST', operator);
      setNewOperators((items) => [...items, user]);
      setOperators((items) => [...items, user.id]);
      setShowOperator(false); setShowPassword(false); setOperator(emptyOperator);
      toast.show({ type: 'success', message: 'Responsável cadastrado e selecionado para esta obra.' });
    });
  }
  function save() {
    const startDate = work ? work.startDate : parseDisplayDate(fields.startDate);
    const next = {};
    if (!work) {
      if (fields.name.trim().length < 3) next.name = 'Informe pelo menos 3 caracteres.';
      if (!fields.address.trim()) next.address = 'Informe o endereço.';
      if (!fields.contract.trim()) next.contract = 'Informe o número do contrato.';
      if (!startDate) next.startDate = 'Informe uma data válida.';
    }
    if (!clientIds.length) next.clientIds = 'Selecione pelo menos um cliente.';
    if (!operatorIds.length) next.operatorIds = 'Selecione pelo menos um responsável.';
    showErrors(next);
    if (Object.keys(next).length) return;
    submit('work', async () => {
      const body = { ...fields, startDate, clientIds, operatorIds };
      await request(work ? `/works/${work.id}` : '/works', work ? 'PATCH' : 'POST', body);
      onSaved();
    });
  }

  function fieldProps(key, value, onChangeText, next) {
    return {
      inputRef: refs[key], value, editable: !operation, error: errors[key],
      onChangeText: (text) => {
        onChangeText(text);
        setErrors((previous) => ({ ...previous, [key]: undefined }));
      },
      ...(next ? { returnKeyType: 'next', submitBehavior: 'submit', onSubmitEditing: () => refs[next].current?.focus() } : {}),
    };
  }
  return <View>
    <Text style={styles.subtitle}>{work ? 'Atualize as pessoas com acesso ao contrato.' : 'Crie o contrato e vincule as pessoas que terão acesso.'}</Text>
    {!work ? <View>{workFields.map(([field, label, maxLength], index) => {
      const Input = field === 'startDate' ? DateField : FormField;
      return <Input key={field} label={label} maxLength={maxLength} autoCapitalize={field === 'name' ? 'words' : undefined}
        {...fieldProps(field, fields[field], (value) => setFields((previous) => ({ ...previous, [field]: value })), workFields[index + 1]?.[0])} />;
    })}</View> : null}
    <Text accessibilityRole="header" style={styles.section}>Clientes</Text>
    <Text style={styles.subtitle}>Somente as pessoas vinculadas poderão consultar esta obra.</Text>
    {allUsers.filter((item) => item.role === 'client').map((item) => <Choice key={item.id} label={item.name} detail={item.email}
      selected={clientIds.includes(item.id)} disabled={Boolean(operation)} onPress={() => toggle(setClients, item.id, 'clientIds')} />)}
    {errors.clientIds ? <Text style={styles.error} accessibilityRole="alert">{errors.clientIds}</Text> : null}
    <Text accessibilityRole="header" style={styles.section}>Responsáveis</Text>
    {allUsers.filter((item) => item.role === 'operator').map((item) => <Choice key={item.id} label={item.name} detail={item.email}
      selected={operatorIds.includes(item.id)} disabled={Boolean(operation)} onPress={() => toggle(setOperators, item.id, 'operatorIds')} />)}
    {errors.operatorIds ? <Text style={styles.error} accessibilityRole="alert">{errors.operatorIds}</Text> : null}
    {showOperator ? <View style={styles.operator}>
      <Text accessibilityRole="header" style={styles.section}>Novo responsável</Text>
      <Text style={styles.subtitle}>O cadastro é criado agora e continua ativo mesmo que você cancele a obra.</Text>
      {operatorFields.map(([key, field, label, maxLength], index) => <FormField key={key} label={label} maxLength={maxLength}
        {...fieldProps(key, operator[field], (value) => setOperator((previous) => ({ ...previous, [field]: value })), operatorFields[index + 1]?.[0])}
        autoCapitalize={field === 'name' ? 'words' : 'none'} autoCorrect={false}
        autoComplete={{ name: 'name', email: 'email', password: 'new-password' }[field]}
        keyboardType={field === 'email' ? 'email-address' : 'default'} secureTextEntry={field === 'password' && !showPassword}
        hint={field === 'password' ? 'De 6 a 128 caracteres. Compartilhe com o responsável.' : undefined} />)}
      <Choice label="Mostrar senha inicial" selected={showPassword} disabled={Boolean(operation)} onPress={() => setShowPassword(!showPassword)} />
      <ActionButton label="Criar responsável" busy={operation === 'operator'} busyLabel="Criando responsável…" disabled={Boolean(operation)} onPress={addOperator} />
      <ActionButton label="Fechar cadastro de responsável" secondary disabled={Boolean(operation)} onPress={() => { setShowOperator(false); setShowPassword(false); }} />
    </View> : <ActionButton label="Cadastrar responsável" secondary disabled={Boolean(operation)} onPress={() => setShowOperator(true)} />}
    {error ? <ErrorState message={error} /> : null}
    <View style={styles.actions}>
      <ActionButton testID="work-save" label={work ? 'Salvar vínculos' : 'Criar obra e contrato'} busy={operation === 'work'} busyLabel="Salvando obra…"
        disabled={Boolean(operation) || showOperator} onPress={save} />
      <ActionButton label="Cancelar" secondary disabled={Boolean(operation)} onPress={onCancel} />
    </View>
  </View>;
}
