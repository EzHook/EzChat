import { View, Text, KeyboardAvoidingView, StyleSheet } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Button, Input } from '@rneui/themed'
import { useNavigation } from '@react-navigation/native'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateCurrentUser, updateProfile } from 'firebase/auth'


const RegisterScreen = () => {

    const navigation = useNavigation();

    useLayoutEffect(()=>{
        navigation.setOptions({
            headerBackTitle : "Login"
        })
    },[navigation])

    const [name, setName] = useState("");
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imageUrl, setImageUrl] = useState("");
    const register = async() => {
         await createUserWithEmailAndPassword(auth, email, password)
         .then(async(newUser)=>{
            const user = newUser.user;
             await updateProfile(auth.currentUser, {
                displayName: name,
                photoURL: imageUrl || "https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png"
            });
         })
         .catch((err)=>alert(err.message));
    };

  return (
    <KeyboardAvoidingView className="flex-1 items-center justify-center p-10 bg-white" behavior='padding'>
        <StatusBar style='light'/>
        <Text h3 className="mb-10 text-lg font-semibold">Create an Account</Text>
        <View style={Styles.Input}>
            <Input placeholder='Full Name' autoFocus type="name" value={name} onChangeText={(text)=>setName(text)}/>
            <Input placeholder='Email' type="email" value={email} onChangeText={(email)=>setEmail(email)}/>
            <Input placeholder='Password' secureTextEntry type="password" value={password} onChangeText={(password)=>setPassword(password)}/>
            <Input onSubmitEditing={register} placeholder='Profile picture URL (Optional)' type="image" value={imageUrl} onChangeText={(image)=>setImageUrl(image)}/>
        </View>
        <Button containerStyle={Styles.Button} raised buttonStyle={{backgroundColor:"#0E8388" }} onPress={register} title="Register" />
        <View style={{ height : 20}} />
    </KeyboardAvoidingView>
  )
}

const Styles = StyleSheet.create({
    Button : {
        width: 200,
        marginTop: 10,
    },
    Input : {
        width: 300
    }
})

export default RegisterScreen