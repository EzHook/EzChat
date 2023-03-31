import { View, Text, StyleSheet } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Button, Icon, Input } from '@rneui/themed'
import { db } from '../firebase'
import { addDoc, collection } from 'firebase/firestore'


const AddChatScreen = ({ navigation }) => {

  const [chat , setChat] = useState('');

  const createChat = async() => {
    try {
      const newDoc = await addDoc(collection(db, "chats"), {
        chatName : chat
      });
      console.log("New Chat Created with ID :", newDoc.id );
      navigation.goBack();
    } catch (error) {
      alert(error.message);
    }
  }


  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitle : "Add new Chat",
      headerBackTitle : "Chats",
    })
  },[])

  return (
    <View 
    style={styles.container} 
    className="flex-1 items-center justify-center p-7  bg-white ">
        <Input
        value={chat}
        onChangeText={(text)=>setChat(text)}
        placeholder='Enter chat name'
        leftIcon={
          <Icon type='feather' name='message-circle' size={24} color="black" />
        }
        onSubmitEditing={createChat}
          />
          { chat ? <Button size="lg" onPress={createChat} title="Create new Chat" color="#0E8388" />
           : <Button disabled size="lg" onPress={createChat} title="Create new Chat" color="#0E8388" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    backgroundColor:"white",
    padding: 30,
    height : "100%"
  }
})

export default AddChatScreen