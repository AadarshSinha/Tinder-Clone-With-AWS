import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Image, Pressable,Alert} from 'react-native';
import {Auth, DataStore} from 'aws-amplify';
import {User, WaitlingList, Matches} from '../models';
const DisplayMatches = ({sub, setLoverSub}) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const getCurrentUsers = async () => {
      try {
        const dbUsers = await DataStore.query(User, u1 => u1.sub('eq', sub));
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
        <Text style={styles.name}>
          <Text>{currentUser.name}</Text>
        </Text>
      </View>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 140,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: 'black',
    marginTop: 5,
    fontSize: 20,
    fontStyle: 'bold',
  },
});
export default DisplayMatches;
