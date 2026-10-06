import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Estrutura: usuarios/{uid}/registros/{registroId}
const registrosRef = (uid) => collection(db, 'usuarios', uid, 'registros');
const registroRef = (uid, id) => doc(db, 'usuarios', uid, 'registros', id);

export function salvarPerfil(uid, { nome, email }) {
  return setDoc(
    doc(db, 'usuarios', uid),
    { nome, email, criadoEm: serverTimestamp() },
    { merge: true }
  );
}

export function criarRegistro(uid, dados) {
  return addDoc(registrosRef(uid), {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
}

export function atualizarRegistro(uid, id, dados) {
  return updateDoc(registroRef(uid, id), {
    ...dados,
    atualizadoEm: serverTimestamp(),
  });
}

export function excluirRegistro(uid, id) {
  return deleteDoc(registroRef(uid, id));
}

// Leitura em tempo real dos registros do usuário autenticado
export function observarRegistros(uid, onData, onError) {
  return onSnapshot(
    registrosRef(uid),
    (snap) => onData(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  );
}

// Remove todos os dados do usuário (usado na exclusão da conta)
export async function excluirDadosUsuario(uid) {
  const snap = await getDocs(registrosRef(uid));
  const docs = snap.docs;
  for (let i = 0; i < docs.length; i += 400) {
    const batch = writeBatch(db);
    docs.slice(i, i + 400).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }
  await deleteDoc(doc(db, 'usuarios', uid));
}
