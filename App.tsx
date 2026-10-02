import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

import * as SQLite from 'expo-sqlite';

interface Tarefa {
  id: number;
  nome: string;
}

export default function App() {

  const [banco, setBanco] = useState<SQLite.SQLiteDatabase | null>(null);
  const [tarefa, setTarefa] = useState<string>('');
  const [listaTarefa, setListaTarefa] = useState<Tarefa[]>([]);

  useEffect(() => {
    async function iniciarBanco() {
      const db = await SQLite.openDatabaseAsync('lostbank.db')

      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tarefas(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL
        );
        `)
      setBanco(db);
      atualizarLista(db);
    }
    iniciarBanco()
  }, []);

  async function atualizarLista(db: SQLite.SQLiteDatabase) {
    const resultado = await db.getAllAsync<Tarefa>
      ('SELECT * FROM tarefas')
    setListaTarefa(resultado);
  }

  async function adicionarTarefa() {
    if (tarefa.trim() === '' || !banco) return;
    await banco.runAsync('INSERT INTO tarefas(nome) VALUES(?)', [tarefa]);
    setTarefa('');
    atualizarLista(banco);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Gerenciador de tarefas!!</Text>
      <view style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="O que encontra-se a necessidade de ser fazido?"
          value={tarefa}
          onChangeText={setTarefa}
        />
        <TouchableOpacity style={styles.botao}
          onPress={adicionarTarefa}
        >
        </TouchableOpacity>
      </view>
      <FlatList
        data={listaTarefa}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardTarefa}>
            <Text style={styles.textoTarefa}>{item.nome}</Text>
          </View>
        )}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    elevation: 1,
  },
  botao: {
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    marginLeft: 10,
  },
  textoBotao: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardTarefa: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#4CAF50',
    elevation: 3,
  },
  textoTarefa: {
    fontSize: 18,
    color: '#333',
  }
})