import { S3Image } from 'aws-amplify-react-native/dist/Storage';
import React, { useState } from 'react'
import { View, Image, StyleSheet, Text } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export default function Card({ user }) {
  const [bio,setBio] =useState(false)
  const diasplayImage = () => {
    return <Image source={{uri: `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${user.image}`}} style={styles.photo} />; 
  } 
  return (
    
    <View style={styles.CardContainer}>
       {diasplayImage()}
      <View style={styles.textContainer}>
        <View style={styles.textRow}>
          <Text style={styles.abc}>
          <Text style={[styles.textPrimary, styles.textShadow]}>{user.name}</Text>
          </Text>
          <Text style={[styles.textSecondary, styles.textShadow]}>  {user.age}  </Text>
          <FontAwesome5 name="info-circle" size={20} color="white" onPress={()=>{setBio(!bio)}}></FontAwesome5>
        </View>
        {bio && <View style={styles.BioRow}>
        <Text style={[styles.textSecondary, styles.textShadow]}>{user.bio}</Text>
        </View>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  abc:{
    maxWidth:'90%'
  },
  CardContainer:{
    // backgroundColor:'red',
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
  },
  photo: {
    height: '98%',
    width:'94%',
    backgroundColor:"white",
    resizeMode: 'cover',
    borderRadius: 20,
  },
  textContainer: {
    position: 'absolute',
    bottom: 100,
    left: '5%',
    maxWidth:'90%',
    paddingBottom:15,
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  BioRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textPrimary: {
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  textSecondary: {
    color: 'white',
    fontSize: 25,
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.80)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
})