# 💰 Controle de Gastos — CheckPoint 5

Aplicativo mobile com **Firebase Authentication** e **Cloud Firestore** (CRUD completo), desenvolvido em **React Native (Expo)**.

**FIAP — Tecnologia em Desenvolvimento de Sistemas (2TDS) — Mobile Application Development — Prof. Fernando Pinéo**

## Integrantes

| Nome | RM |
|------|----|
| Mathaus Victor Souza Marcelino | RM 564146 |
| Luan Peixoto Marins Rocha | RM 562258 |
| Eduardo Novaes Mollo | RM 561515 |

## Tema do aplicativo

**Controle de gastos** — cada usuário cadastra, consulta, edita e exclui os seus próprios gastos.

## Descrição do projeto

O usuário cria uma conta, faz login e passa a gerenciar seus gastos pessoais. Cada gasto possui **descrição, valor, categoria, data e observação**. Os gastos são salvos no Cloud Firestore, dentro do documento do usuário autenticado, e cada usuário enxerga somente os seus registros (isolamento garantido também pelas regras do Firestore).

### Funcionalidades

- **Autenticação (Firebase Auth):** cadastro (nome, e-mail, senha e confirmação), login, logout, "Esqueci minha senha" e exclusão de conta (com confirmação).
- **Persistência da sessão (AsyncStorage):** o usuário continua logado após fechar e abrir o app. A senha nunca é armazenada.
- **CRUD no Firestore:** cadastrar, listar (tempo real), editar e excluir (com confirmação) gastos.
- **Perfil:** nome, e-mail, logout e excluir conta.
- **Segurança:** rotas autenticadas inacessíveis sem login e regras do Firestore por usuário.

### Telas

- Área não autenticada: Login, Cadastro, Esqueci minha senha
- Área autenticada: Home, Listagem dos registros, Cadastro de registro, Edição de registro, Perfil/Minha conta

## Tecnologias utilizadas

- React Native + Expo
- Firebase Authentication
- Cloud Firestore
- AsyncStorage (`@react-native-async-storage/async-storage`)
- React Navigation (stack + bottom tabs)

## Estrutura básica do Firestore

```
usuarios (coleção)
└── {uid do usuário}            -> nome, email, criadoEm
    └── registros (subcoleção)
        └── {id automático}     -> descricao, valor (number), categoria,
                                   data (DD/MM/AAAA), observacao,
                                   criadoEm, atualizadoEm
```

Regras de segurança (arquivo `firestore.rules`): cada usuário só lê e escreve em `usuarios/{seu uid}/...`.

## Estrutura do projeto

```
App.js
src/
├── config/        firebaseConfig.js (credenciais) e firebase.js (Auth + Firestore)
├── context/       AuthContext (sessão/AsyncStorage) e GastosContext (Firestore em tempo real)
├── services/      firestore.js (operações CRUD)
├── navigation/    RootNavigator.js (área autenticada x não autenticada)
├── screens/       telas do app
├── components/    Input, Button, Message, Screen
└── utils/         validações, formatação e tradução de erros
```

## Instruções para instalação

### 1. Configurar o Firebase

1. Acesse o [Console do Firebase](https://console.firebase.google.com) e crie um projeto.
2. **Authentication** → *Começar* → *Método de login* → habilite **E-mail/senha**.
3. **Firestore Database** → *Criar banco de dados* (modo produção) em qualquer região.
4. Firestore → aba **Regras** → cole o conteúdo de `firestore.rules` → **Publicar**.
5. *Configurações do projeto* → *Seus aplicativos* → adicione um app **Web (`</>`)** e copie o objeto `firebaseConfig`.
6. Cole os valores em `src/config/firebaseConfig.js`.

### 2. Instalar as dependências

Pré-requisitos: Node.js LTS e o app **Expo Go** no celular.

```bash
npm install
npx expo install --fix   # alinha as versões ao seu Expo Go, se necessário
```

## Instruções para execução

```bash
npx expo start
```

Escaneie o QR Code com o **Expo Go** (celular e computador na mesma rede). Se a rede bloquear a conexão, use `npx expo start --tunnel`.
Para limpar o cache: `npx expo start -c`.
