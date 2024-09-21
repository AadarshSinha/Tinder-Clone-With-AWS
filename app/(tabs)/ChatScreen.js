import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, Text, View,BackHandler,Alert} from 'react-native';
import {Auth, API} from 'aws-amplify';
import {DataStore} from '@aws-amplify/datastore';
import {User, WaitlingList, Matches, ChatUsers} from '../../models';
import DisplayMatches from '../../components/DisplayMatches';
import DisplayMessage from '../../components/DisplayMessage';
import Messanger from '../../components/Messanger';
import {onUpdateChatUsers,onCreateChatUsers} from '../../models/schema';

const ChatScreen = ({setScreen}) => {
  const [matches, setMatches] = useState([]);
  const [chats, setChats] = useState([]);
  const [userSub, setUserSub] = useState(null);
  const [loverSub, setLoverSub] = useState(null);
  const [isChatting, setIsChatting] = useState(false);

  useEffect(() => {
    const backAction = () => {
      setScreen("display")
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress",backAction);
    return () => backHandler.remove();
  }, []);
  const getMatchedUsers = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUserSub(authUser.attributes.sub);
      const dbUsers = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
            .user1('eq', authUser.attributes.sub)
            .user2('eq', authUser.attributes.sub),
        ),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setMatches(dbUsers);
    } catch (error) {
      console.log(error.message)
      Alert.alert("Error");
    }
  };
  const getChatUsers = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      setUserSub(authUser.attributes.sub);
      const dbUsers = await DataStore.query(
        ChatUsers,
        u1 =>
          u1.or(u2 =>
            u2
              .from('eq', authUser.attributes.sub)
              .to('eq', authUser.attributes.sub),
          ),
        {sort: s => s.updatedAt()},
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setChats(dbUsers);
    } catch (error) {
      console.log(error.message)
      Alert.alert("Error");
    }
  };
  useEffect(() => {
    try {
      const subscription = API.graphql({
        query: onUpdateChatUsers,
      }).subscribe({
        next: data => {
          const newMsg = data.value.data.onUpdateChatUsers;
          if (
            newMsg.from === userSub ||
            newMsg.to === userSub ||
            userSub === null
          ) {
            getChatUsers();
          }
        },
      });
      return () => subscription.unsubscribe();
    } catch (error) {
      console.log(error.message)
      Alert.alert("Error");
    }
  }, []);
  useEffect(() => {
    try {
      const subscription = API.graphql({
        query: onCreateChatUsers,
      }).subscribe({
        next: data => {
          const newMsg = data.value.data.onCreateChatUsers;
          if (
            newMsg.from === userSub ||
            newMsg.to === userSub ||
            userSub === null
          ) {
            getChatUsers();
          }
        },
      });
      return () => subscription.unsubscribe();
    } catch (error) {
      console.log(error.message)
      Alert.alert("Error");
    }
  }, []);
  useEffect(() => {
    getMatchedUsers();
    getChatUsers();
  }, []);
  useEffect(() => {
    if (loverSub == null) return;
    setIsChatting(true);
  }, loverSub);
  if (userSub === null) return;
  if (isChatting)
    return (
      <Messanger
        setIsChatting={setIsChatting}
        setLoverSub={setLoverSub}
        to={loverSub}
        from={userSub}
      />
    );
  return (
    <View style={styles.container}>
      <Text style={styles.head}>Your Matches</Text>
      <ScrollView horizontal={true} style={styles.scroll}>
        {matches.length != 0 &&
          matches.map(match => (
            <DisplayMatches
              sub={match.user1 === userSub ? match.user2 : match.user1}
              key={match.id}
              setLoverSub={setLoverSub}
            />
          ))}
      </ScrollView>
      {
        matches.length===0  &&
          <Text style={styles.nomatch}>If two users like💚  each other then they will be matched and can send messages</Text>
      }
      <Text style={styles.head}>Messages</Text>
      <ScrollView style={styles.message} horizontal={false}>
        {chats.length != 0 &&
          chats.map(match => (
            <DisplayMessage
              loverSub={match.from === userSub ? match.to : match.from}
              key={match.id}
              setLoverSub={setLoverSub}
              updated={match.updatedAt}
              lastMessage={match.message}
            />
          ))}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  nomatch:{
    color:'grey',
    marginLeft:20,
    fontSize:16,
    top:40,
    maxWidth:350,
    position:'absolute',
    // backgroundColor:'red',
    alignContent:'center',
    textAlign:'center',
    alignSelf:'center',
    height:80,
  },
  container: {
    width: '100%',
    height: '90%',
  },
  scroll: {
    width: '100%',
    marginTop: 10,
  },
  head: {
    color: '#F76C6B',
    fontSize: 25,
    marginLeft: 10,
    fontWeight: '800',
  },
  message: {
    width: '100%',
    height: '70%',
    marginTop: 10,
    flexDirection: 'column',
  },
});
export default ChatScreen;
