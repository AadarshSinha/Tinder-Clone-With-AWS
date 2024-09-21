import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Image, Text, Pressable,Alert} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches} from '../models';
import moment from 'moment';

const DisplayMessage = ({loverSub, setLoverSub, lastMessage, updated}) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUsers = async () => {
      try {
        const dbUsers = await DataStore.query(User, u1 =>
          u1.sub('eq', loverSub),
        );
        if (!dbUsers || dbUsers.length === 0) {
          return;
        }
        setCurrentUser(dbUsers[0]);
      } catch (error) {
      console.log(error.message)
        Alert.alert("Error");
      }
    };
    getCurrentUsers();
  }, []);
  const display = () => {
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${currentUser.image}`;
    return <Image source={{uri: url}} style={styles.image} />;
  };
  if (currentUser === null) return;
  return (
    <Pressable
      onPress={() => {
        setLoverSub(currentUser.sub);
      }}>
      <View style={styles.container}>
        {display()}
        <Text style={styles.text1}>{currentUser.name}</Text>
        <Text style={styles.text2}>{lastMessage}</Text>
        <Text style={styles.text3}>{moment(updated).fromNow()}</Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: '95%',
    height: 80,
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 10,
    overflow: 'hidden',
    backgroundColor: 'lightblue',
    borderRadius: 45,
    borderBottomEndRadius: 0,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    position: 'relative',
  },
  text1: {
    fontSize: 22,
    position: 'absolute',
    color: 'white',
    fontWeight: '800',
    left: 100,
    top: 10,
    fontFamily: 'Open Sans',
    width: '65%',
    overflow: 'hidden',
    height: 40,
    // backgroundColor:'red',
  },
  text2: {
    // backgroundColor:'red',
    width:'40%',
    height:20,
    position: 'absolute',
    top: 50,
    color: 'white',
    left: 100,
    overflow:'hidden',
  },
  text3: {
    position: 'absolute',
    top: 55,
    color: 'white',
    right: 10,
  },
});
export default DisplayMessage;
