import { View, Text, SafeAreaView, ScrollView, Image, StyleSheet } from 'react-native'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../firebase'
import { Avatar } from '@rneui/themed'
import { TouchableOpacity } from 'react-native'
import { signOut } from 'firebase/auth'
import { Icon } from '@rneui/themed'
import { collection, getDocs } from 'firebase/firestore'



const HomeScreen = ({ navigation }) => {

    const [chats, setChats] = useState([]);

    const logOut = async() => {
        await signOut(auth)
        .then(()=>{
            navigation.replace("Login")
        })
        .catch((err)=>alert(err.message));
    }

    async function getChats () {
        const chatData = await getDocs(collection(db, "chats"));
        try {
            setChats(chatData.docs.map((doc)=>({
                id: doc.id,
                data: doc.data(),
            })))
        } catch (error) {
            alert(error.message);
        }
        return chatData;
    }
   
    
 useEffect(()=>{
    const unsubscribe = navigation.addListener('focus', () => {
        getChats();
    });
    return unsubscribe;
 },[navigation])
    
   
    

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "EzChat",
            headerTitleAlign: "center",
            headerStyle : { backgroundColor : "#0E8388" },
            headerTitleStyle : { color: "white"},
            headerTintColor : "black",
            headerLeft : () => 
                (
                    <View style={{ marginRight : 20}}>
                        <TouchableOpacity activeOpacity={0.5} onPress={logOut}>
                            <Avatar
                            source={{uri : auth?.currentUser?.photoURL}}
                            rounded
                            />
                        </TouchableOpacity>
                    </View>
                 ),
                 headerRight : () => (
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: "space-between",
                        width: 80,
                        margiinRight: 20,
                    }}>
                        <TouchableOpacity activeOpacity={0.5}>
                            <Icon type='feather' name='camera' size={24} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>navigation.navigate('AddChat')} activeOpacity={0.5}>
                            <Icon type='feather' name='edit' size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                 )
        });
    },[auth.currentUser])

    const enterChat = (id, chatName) => {
        navigation.navigate("Chat", {
            id, chatName
        });
    }

  return (
    <SafeAreaView>
        <ScrollView style={Styles.container}>
            {chats.map(({id, data : { chatName } })=>(
            <CustomListItem enterChat={enterChat} key={id} id={id} chatName={chatName} />
            ))}
        </ScrollView>
    </SafeAreaView>
  )
}

const Styles = StyleSheet.create({
    container : {
        height : "100%",
        backgroundColor: "#F0EEED",
        // padding : 10,
    }
})

export default HomeScreen
