import { View, Text } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Avatar, ListItem } from '@rneui/themed'
import { collection, onSnapshot, orderBy, query, doc } from 'firebase/firestore';
import { db } from '../firebase';

const CustomListItem = ({ id, chatName, enterChat}) => {

    const [chatMessages, setChatMessages] = useState([]);


    useEffect(()=>{
      const unsubscribe = onSnapshot(query(
        collection(db, "chats", id, "messages"),
        orderBy("timestamp", "desc")
      ), (snapshot) => setChatMessages(snapshot.docs.map((doc) => doc.data())));

      return unsubscribe;
    }, []);

    console.log(chatMessages);

  return (
    <ListItem key={id} onPress={()=> enterChat(id, chatName)} bottomDivider>
        <Avatar rounded source={{
            uri : chatMessages?.[0]?.photoURL
              || "https://www.nicepng.com/png/detail/933-9332131_profile-picture-default-png.png"
        }} />
        <ListItem.Content>
            <ListItem.Title style={{ fontWeight : 800}} >
                {chatName}
            </ListItem.Title>
            <ListItem.Subtitle
                numberOfLines={1}
                ellipsizeMode="tail"
            >
            {chatMessages?.[0]?.displayName} : {chatMessages?.[0]?.message}
            </ListItem.Subtitle>
        </ListItem.Content>
    </ListItem>
  )
}

export default CustomListItem