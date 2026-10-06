import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { observarRegistros } from '../services/firestore';
import { traduzirErro } from '../utils/authErrors';
import { chaveData } from '../utils/format';

const GastosContext = createContext(null);

export function GastosProvider({ children }) {
  const { user } = useAuth();
  const [gastos, setGastos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const uid = user?.uid;

  useEffect(() => {
    if (!uid) {
      setGastos([]);
      return undefined;
    }
    setLoading(true);
    const unsubscribe = observarRegistros(
      uid,
      (lista) => {
        lista.sort((a, b) => chaveData(b.data) - chaveData(a.data));
        setGastos(lista);
        setErro(null);
        setLoading(false);
      },
      (e) => {
        setErro(traduzirErro(e));
        setLoading(false);
      }
    );
    return unsubscribe;
  }, [uid]);

  return (
    <GastosContext.Provider value={{ gastos, loading, erro }}>{children}</GastosContext.Provider>
  );
}

export const useGastos = () => useContext(GastosContext);
