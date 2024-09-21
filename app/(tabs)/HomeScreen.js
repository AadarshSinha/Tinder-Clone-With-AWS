import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  BackHandler,
} from 'react-native';
import DisplayScreen from './DisplayScreen';
import MatchScreen from './MatchScreen';
import ChatScreen from './ChatScreen';
import ProfileScreen from './ProfileScreen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {Auth} from 'aws-amplify';
import {Hub} from '@aws-amplify/core';
import {DataStore} from '@aws-amplify/datastore';
import {User} from '../../models/';

const HomeScreen = ({sync}) => {
  const [screen, setScreen] = useState('display');
  const [curUser, setCurUser] = useState(null);
  const [isSync, setIsSync] = useState(false);
  const [isNew, setIsNew] = useState(true);

  const defaultColor = '#b5b5b5';
  const activeColor = '#F76C6B';

  const getCurrentUser = async () => {
    // if(!isSync)return;
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      if ((isSync || sync) && dbUsers.length === 0) {
        setCurUser([]);
        setScreen('profile');
      }
      if (!dbUsers || dbUsers.length === 0) return;
      setIsNew(false);
      setCurUser(dbUsers);
    } catch (error) {
      console.log(error.message);
      Alert.alert('Error');
    }
  };
  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'modelSynced') {
        setIsSync(true);
        getCurrentUser();
      }
    };
    Hub.listen('datastore', listener);
    return () => Hub.remove('datastore', listener);
  }, []);

  if (curUser === null) {
    getCurrentUser();
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  const handleDisplay = () => {
    if (isNew) {
      Alert.alert('Update your profile');
      return;
    }
    setScreen('display');
  };
  const handleChat = () => {
    if (isNew) {
      Alert.alert('Update your profile');
      return;
    }
    setScreen('chat');
  };
  const handleMatch = () => {
    if (isNew) {
      Alert.alert('Update your profile');
      return;
    }
    setScreen('match');
  };
  return (
    <View style={styles.Homescreen}>
      <View style={styles.topNavigation}>
        <Pressable onPress={handleDisplay}>
          <Entypo
            name="home"
            size={35}
            color={screen === 'display' ? activeColor : defaultColor}
          />
        </Pressable>
        <Pressable onPress={handleMatch}>
          <AntDesign
            name="star"
            size={35}
            color={screen === 'match' ? activeColor : defaultColor}
          />
        </Pressable>
        <Pressable onPress={handleChat}>
          <AntDesign
            name="wechat"
            size={35}
            color={screen === 'chat' ? activeColor : defaultColor}
          />
        </Pressable>
        <Pressable
          onPress={() => {
            setScreen('profile');
          }}>
          <MaterialCommunityIcons
            name="account"
            size={35}
            color={screen === 'profile' ? activeColor : defaultColor}
          />
        </Pressable>
      </View>

      {screen === 'display' && <DisplayScreen />}
      {screen === 'match' && <MatchScreen setScreen={setScreen} />}
      {screen === 'chat' && <ChatScreen setScreen={setScreen} />}
      {screen === 'profile' && (
        <ProfileScreen setIsNew={setIsNew} setScreen={setScreen} isNew={isNew}/>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  Homescreen: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 80,
    padding: 20,
    backgroundColor: 'white',
  },
});

export default HomeScreen;
