import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { Avatar, Icon } from '@rneui/themed';
import { TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native';
import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';

const ChatScreen = ({ navigation, route }) => {
  
  const [message, setMessages] = useState([]);
  const {params:{id, chatName}} = useRoute();
  const [input, setInput] = useState("");


  useLayoutEffect(()=>{
    navigation.setOptions({
      headerTitleAlign: "left",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View style={{
          flexDirection: "row",
          alignItems: "center",
        }}>
          <Avatar rounded source={{
            uri : message[0]?.data.photoURL || "https://www.pngkit.com/png/detail/271-2713492_wikiversity-mooc-icon-discussion-discussion-icon-png.png"
          }} />
          <Text className="text-white ml-5 text-lg font-semibold">{chatName}</Text>
        </View>
      ),
      // headerLeft: () => (
      //   <TouchableOpacity>
      //     <Icon type='feather' name='corner-up-left' size={24} color="white" />
      //   </TouchableOpacity>
      // ),
      headerRight: () => (
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: 80,
          marginRight: 20,
          alignContent: "center",
        }}>
          <TouchableOpacity>
            <Icon type='feather' name='video' size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon type='feather' name='phone' size={24} color="white" />
          </TouchableOpacity>
        </View>
      )
    })
  },[navigation, message])

  const sendMessage = async() => {
    Keyboard.dismiss();

    const newMessage = await addDoc(collection(doc(db, 'chats', route.params.id), 'messages'), {
      timestamp : serverTimestamp(),
      message : input,
      displayName : auth.currentUser.displayName,
      email: auth.currentUser.email,
      photoURL: auth.currentUser.photoURL,
    });
    setInput("");
  }

  const messageQuery = query(
    collection(db, "chats", route.params.id, "messages"),
    orderBy("timestamp", "desc")
  );

  useLayoutEffect(()=>{
    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return unsubscribe;
  },[route])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#20262E"}}> 
      <StatusBar style='light'/>
      <KeyboardAvoidingView
      //  behavior={Platform.OS === "ios" ? "padding" : "height"} #434242
       keyboardVerticalOffset={90}
       style={styles.container}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <ScrollView contentContainerStyle={{ padding : 15 }}>
            { message.map(({ id, data })=>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                  <Avatar
                   size={30}
                   position="absolute"
                   rounded
                   containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    right : -5,
                   }}
                   source={{
                    uri : data.photoURL,
                  }} />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Avatar
                   size={30}
                   position="absolute"
                   rounded
                   containerStyle={{
                    position: "absolute",
                    bottom: -15,
                    left : -5,
                   }}
                   source={{
                    uri : data.photoURL,
                  }}
                   />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput onSubmitEditing={sendMessage} value={input} onChangeText={text => setInput(text)} style={styles.TextInput} placeholder='EzChat it here!' />
            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
              <Icon type='feather' name='send' color="#0E8388" size={24} />
            </TouchableOpacity>
          </View>
        </>
      </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default ChatScreen

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  reciever : {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth:"80%",
    position: "relative"
  },
  sender : {
    padding: 15,
    backgroundColor: "#0E8388",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth:"80%",
    position: "relative"
  },
  senderText : {
    color : "white",
    fontWeight: "500",
    marginLeft : 10,
    marginBottom: 15,
  },
  recieverText : {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  senderName: {
    left : 10,
    paddingRight: 10,
    fontSize : 10,
    color: "white",
  },
  footer : {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    padding: 15,
  },
  TextInput : {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "grey",
    borderRadius: 30,
  }
})