const mockUsers = [
  {
    email: 'dono@diariodeobra.com.br',
    password: '123456',
    name: 'Dono da empresa',
    role: 'owner',
    roleLabel: 'Dono/Empresa',
  },
  {
    email: 'responsavel@diariodeobra.com.br',
    password: '123456',
    name: 'Responsável pela obra',
    role: 'operator',
    roleLabel: 'Responsável',
  },
  {
    email: 'cliente@diariodeobra.com.br',
    password: '123456',
    name: 'Cliente da obra',
    role: 'client',
    roleLabel: 'Cliente',
  },
];

module.exports = { mockUsers };
