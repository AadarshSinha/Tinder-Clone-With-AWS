import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import SplashScreen from 'react-native-splash-screen'
import {Amplify, Hub, Auth } from 'aws-amplify';
import {DataStore} from '@aws-amplify/datastore';
//import awsconfig from './src/aws-exports';
import LoginPage from './(tabs)/LoginPage';
import HomeScreen from './(tabs)/HomeScreen';

Amplify.configure({
  //...awsconfig,
  Analytics: {
    disabled: true,
  },
});
const App = () => {
  const [loading, setLoading] = useState(true);
  const [curUser, setCurUser] = useState(null);
  const [sync,setSync]=useState(false)
  const checkUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: false,
      });
      setCurUser(authUser);
    } catch (e) {
      setCurUser(null);
    }
  };
  useEffect(()=>{SplashScreen.hide();},[])
  useEffect(() => {
    checkUser();
  }, []);
  useEffect(() => {
    const listener = (data:any) => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut'){
        checkUser();
        if(data.payload.event === 'signOut')setSync(true);
      }
    };
    Hub.listen('auth', listener);
    return () => Hub.remove('auth', listener);
  }, []);
  if (curUser === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaView style={style.home}>
      {curUser ? (
        <HomeScreen sync={sync} />
      ) : (
        <LoginPage setLoading={setLoading} />
      )}
    </SafeAreaView>
  );
};
const style = StyleSheet.create({
  home: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});
export default App;
