import React, {useState, useEffect} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  AsyncStorage
} from 'react-native';
import {Ionicons, MaterialIcons} from '@expo/vector-icons'

export default function App() {
  const [task, setTask] = useState([])
  const [newTask, setNewTask] = useState('')

  async function add(){
    const search = task.filter(task => task == newTask)

    if (newTask === '') {
      return ;
    }

    if (search.length > 0) {
      Alert.alert("Já existe uma tarefa com este nome")
      return ;
    }

    setTask([newTask, ...task])
    setNewTask('')
    Keyboard.dismiss()
  }

  async function remove(item){
    Alert.alert(
      "Deletar Tarefa?",
      "Tem certeza que deseja remover esta anotação",
      [
        {
          text:"Cancelar",
          onPress: () => {
            return
          },
          style: 'cancel'
        },
        {
          text:'Confirmar',
          onPress: () =>{
            setTask(task.filter(task => task !== item))
          }
        }
      ]
    )
  }

  useEffect(() => {
    async function saveTask(){
     await AsyncStorage.setItem("task", JSON.stringify(task))
      console.log("Get here", await AsyncStorage.getItem("task"))
    }
    saveTask()
  }, [task])
  
  useEffect(() => {
    async function loadTask(){
      const task = await AsyncStorage.getItem("task")
      if (task) {
        setTask(JSON.parse(task))
      }
    }
    loadTask()
  }, [])

  return (
    <>
    <KeyboardAvoidingView
      keyboardVerticalOffset={0}
      behavior="padding"
      style={{flex:1}}
      enabled={Platform.OS === 'ios'}
    >
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>App - Todo List test</Text>
      </View>
      <View style={styles.body}>
        <FlatList 
          style={styles.FlatList}
          data={task}
          keyExtractor={item => item.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity style={styles.itemButton} onPress={() => remove(item)}>
                <Ionicons size={20} name="ios-trash" color="#fff"/>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
      <View style={styles.form}>
        <TextInput 
          style={styles.Input} 
          placeholder="Digite uma tarefa ..."
          autoCorrect={true} 
          onChangeText={text => setNewTask(text)}
          value={newTask}
        />
        <TouchableOpacity style={styles.Button} onPress={add} >
          <Ionicons name="md-send" size={25} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e2e2e2',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginTop: 20
  },
  title:{
    fontSize:28,
    fontWeight:'bold'
  },
  body:{
    flex:1
  },
  form:{
    padding:0,
    height:60,
    justifyContent:'center',
    alignSelf: 'stretch',
    flexDirection:'row',
    paddingTop:13,
    borderTopWidth:1,
    borderColor: '#eee',
    backgroundColor: '#e5e5e5'
  },

  Input:{
    flex:1,
    height:40,
    backgroundColor:'#eee',
    borderRadius:8,
    paddingVertical:5,
    paddingHorizontal:10,
    borderColor:'#eee'
  },

  Button:{
    height:40,
    width:40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#069',
    borderRadius: 8,
    marginLeft:10
  },
  FlatList:{
    flex:1,
    marginTop:5,
  },
  item:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:10,
    paddingVertical:15,
    marginTop:8,
    marginBottom:8,
    backgroundColor:'#fff',
    borderRadius:8,
    alignItems: 'center'
  },
  itemText: {
    fontSize: 16,
    fontWeight:'bold',

  },
  itemButton:{
    width:35,
    height:35,
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor:'#dd1414',
    borderRadius:8,
  }
});
