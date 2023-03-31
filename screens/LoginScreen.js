import { View, Text, Image, StyleSheet, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Input } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth'

const LoginScreen = ({ navigation}) => {

    const navigations = useNavigation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

     function getUser () {
          onAuthStateChanged(auth, (authUser)=>{
            if(authUser) {
                navigation.replace("Home");
            }
        })
    }

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            getUser();
        });
    },[navigation])

    const logIn = async() => {
        await signInWithEmailAndPassword(auth, email, password)
        .catch(err => alert(err));
    }

  return (
    <KeyboardAvoidingView behavior='padding' className="flex-1 items-center justify-center p-10 bg-white">
            <StatusBar style='light' />
            <Image source={{
                uri : "https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/254000/134-512.png"
            }} className="h-40 w-40  " />
            <View style= {Styles.Input}>
                <Input placeholder='Enter Email' autoFocus type="email" value={email} onChangeText={(email)=>setEmail(email)} />
                <Input onSubmitEditing={logIn} placeholder='Enter Password' secureTextEntry type="password" value={password} onChangeText={(password)=>setPassword(password)} />
            </View>
            <Button onPress={logIn} buttonStyle={{backgroundColor:"#0E8388" }} containerStyle={Styles.Button} title="Login" />
            <Button containerStyle={Styles.Button} type="outline" onPress={()=>navigations.navigate('Register')} titleStyle={{ color : "#0E8388"}} title="Register" />
            {/* <Button containerStyle={Styles.Button} type="outline" onPress={()=>navigations.navigate('Home')} titleStyle={{ color : "#0E8388"}} title="Home (demo)" /> */}
            <View style={{ height : 100}} />
    </KeyboardAvoidingView>
  )
}
const Styles = StyleSheet.create({
    Button : {
        width: 200,
        marginTop: 10,
        
        color: "white"
    },
    Input : {
        width: 300
    }
});

export default LoginScreen