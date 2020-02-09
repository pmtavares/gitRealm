import React, { useState, useEffect } from 'react';
import { Keyboard, Text, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import GetRealm from '../../services/realm';

import Repository from '../../components/Repository';

import {
  Container, Title, Form, Input, Submit, List,
} from '../Main/style';

const Main = () => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    async function loadRepositories() {
      const realm = await getRealm();
      console.tron.log(realm.path);

      const data = realm.objects('Repository').sorted('stars', true);

      setRepositories(data);
    }

    loadRepositories();
  }, []);



  const saveRepository = async (repository) => {
    console.log(repository)
    const data = {
      id: repository.id,
      name: repository.name,
      fullName: repository.full_name,
      description: repository.description,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
    };

     try{
      const realm = GetRealm();
      
      realm.write(() => {
        realm.create('Repository', data, 'modified');
      });
      console.log("done")
    }
    catch(err)
    {
      console.log("Error here: "+err)
    }
  

    return data;
  }

  const handleAddRepository = async () => {
    console.log(`/repos/${input}`)
    try {
      const response = await api.get(`/repos`);
      console.log(response)
      
      await saveRepository(response.data[5]);
      Alert.alert("Saved")
      setInput('');
      setError(false);
      Keyboard.dismiss();
    } catch (err) {
      setError(true);
    }
  }

  const handleRefreshRepository = async (repository) => {
    console.log("handle")
    const response = await api.get(`/repos/${repository.fullName}`);
    

    const data = await saveRepository(response.data);

    setRepositories(repositories.map(repo => (repo.id === data.id ? data : repo)));
  }

  return (
    <Container>
      <Title>Repositórios</Title>

      <Form>
        <Input
          value={input}
          error={error}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Procurar repositório..."
        />
        <Submit onPress={() => handleAddRepository()}>
          <Text>Add</Text>
        </Submit>
      </Form>

      <List
        keyboardShouldPersistTaps="handled"
        data={repositories}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (          
          <Repository data={item} onRefresh={() => handleRefreshRepository(item)} />
          
        )}
      />
    </Container>
  );
}

export default Main;