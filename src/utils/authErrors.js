const MENSAGENS = {
  'auth/invalid-credential': 'E-mail ou senha inválidos.',
  'auth/wrong-password': 'E-mail ou senha inválidos.',
  'auth/user-not-found': 'E-mail ou senha inválidos.',
  'auth/invalid-email': 'Formato de e-mail inválido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/network-request-failed': 'Sem conexão. Verifique sua internet e tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um pouco e tente novamente.',
  'auth/requires-recent-login': 'Por segurança, saia e entre novamente na conta para continuar.',
  'auth/invalid-api-key': 'Chave de API do Firebase inválida. Verifique src/config/firebaseConfig.js.',
  'auth/operation-not-allowed': 'Login por e-mail/senha não está habilitado no Firebase.',
  'permission-denied': 'Sem permissão para acessar os dados. Verifique as regras do Firestore.',
  unavailable: 'Serviço indisponível. Verifique sua conexão e tente novamente.',
};

export function traduzirErro(error) {
  return MENSAGENS[error?.code] || 'Ocorreu um erro inesperado. Tente novamente.';
}
