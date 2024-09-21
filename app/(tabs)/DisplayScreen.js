import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Text,
  ActivityIndicator,
  Image,
  BackHandler,
  Alert,
} from 'react-native';
import {Auth} from 'aws-amplify';
import {DataStore} from '@aws-amplify/datastore';
import {User, WaitlingList, Matches, ChatUsers} from '../../models';
import Card from '../../components/Card';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

const DisplayScreen = () => {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);
  const [skip, setSkip] = useState(false);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  useEffect(() => {
    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit', [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const getCurrentUser = async () => {
    try {
      const authUser = await Auth.currentAuthenticatedUser();
      const dbUsers = await DataStore.query(User, u =>
        u.sub('eq', authUser.attributes.sub),
      );
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
    }
  };
  useEffect(() => {
    getCurrentUser();
  }, []);
  const getDisplayUsers = async () => {
    try {
      const dbUsers = await DataStore.query(
        User,
        u => u.sub('ne', currentUser.sub).gender('ne', currentUser.gender),
        {sort: s => s.createdAt()},
      );
      if (!dbUsers || dbUsers.length === 0) {
        setLoading(false);
        return;
      }
      const idx = Math.floor(Math.random() * dbUsers.length);
      setIndex(idx);
      setUsers(dbUsers);
      setLoading(false);
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
    }
  };
  useEffect(() => {
    if (currentUser === null || currentUser.length === 0) return;
    getDisplayUsers();
  }, currentUser);
  const handleLike = async () => {
    setLike(true);
    setTimeout(() => {
      setLike(false);
    }, 200);
    try {
      const checkExistingMatch = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
            .and(u3 =>
              u3.user1('eq', currentUser.sub).user2('eq', users[index].sub),
            )
            .and(u4 =>
              u4.user1('eq', users[index].sub).user2('eq', currentUser.sub),
            ),
        ),
      );
      if (checkExistingMatch.length !== 0) {
        console.log('user alredy matched');
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    try {
      const checkRepeat = await DataStore.query(WaitlingList, u =>
        u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
      );
      if (checkRepeat.length !== 0) {
        console.log('user alredy liked');
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    try {
      const checkMatch = await DataStore.query(WaitlingList, u =>
        u.user1('eq', users[index].sub).user2('eq', currentUser.sub),
      );
      if (checkMatch.length === 0) {
        try {
          const newWait = new WaitlingList({
            user1: currentUser.sub,
            user2: users[index].sub,
          });
          await DataStore.save(newWait);
        } catch (error) {
          console.log(error.message)
          Alert.alert('Error');
          return;
        }
        console.log('no new matches');
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    console.log('This is a new matches');
    try {
      const newMatch = new Matches({
        user1: currentUser.sub,
        user2: users[index].sub,
      });
      await DataStore.save(newMatch);
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    try {
      await DataStore.delete(WaitlingList, u =>
        u.user1('eq', users[index].sub).user2('eq', currentUser.sub),
      );
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    setIndex((index + 1) % users.length);
  };
  const handleDislike = async () => {
    setDislike(true);
    setTimeout(() => {
      setDislike(false);
    }, 200);
    try {
      const checkExistingMatch = await DataStore.query(Matches, u1 =>
        u1.or(u2 =>
          u2
            .and(u3 =>
              u3.user1('eq', currentUser.sub).user2('eq', users[index].sub),
            )
            .and(u4 =>
              u4.user1('eq', users[index].sub).user2('eq', currentUser.sub),
            ),
        ),
      );
      if (checkExistingMatch.length !== 0) {
        console.log('user is matched , deleting it');
        try {
          await DataStore.delete(Matches, u1 =>
            u1.user2('eq', currentUser.sub).user1('eq', users[index].sub),
          );
        } catch (error) {
          console.log(error.message)
          Alert.alert('Error');
          return;
        }
        try {
          await DataStore.delete(Matches, u =>
            u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
          );
        } catch (error) {
          console.log(error.message)
          Alert.alert('Error');
          return;
        }
        console.log('creating new waiting');
        try {
          const newWait = new WaitlingList({
            user2: currentUser.sub,
            user1: users[index].sub,
          });
          await DataStore.save(newWait);
        } catch (error) {
          console.log(error.message)
          Alert.alert('Error');
          return;
        }
        setIndex((index + 1) % users.length);
        return;
      }
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    try {
      await DataStore.delete(WaitlingList, u =>
        u.user1('eq', currentUser.sub).user2('eq', users[index].sub),
      );
    } catch (error) {
          console.log(error.message)
      Alert.alert('Error');
      return;
    }
    setIndex((index + 1) % users.length);
  };
  const handleSkip = () => {
    setSkip(true);
    setTimeout(() => {
      setSkip(false);
    }, 200);
    setIndex((index + 1) % users.length);
  };
  const preLoad = () => {
    const URL = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${
      users[(index + 1) % users.length].image
    }`;
    return <Image source={{uri: URL}} style={styles.preload} />;
  };
  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  if (users === null || users.length === 0) {
    return (
      <View style={styles.nouserContainer}>
        <Text style={styles.nouser1}>😑</Text>
        <Text style={styles.nouser2}>No Users</Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.DisplayContainer}>
      <GestureRecognizer
        config={config}
        onSwipeRight={handleLike}
        onSwipeUp={handleLike}
        onSwipeLeft={handleDislike}
        onSwipeDown={handleDislike}>
        {!loading && (
          <Card
            user={users[index]}
            handleLike={handleLike}
            handleDislike={handleDislike}
          />
        )}
      </GestureRecognizer>
      {!loading && preLoad()}
      {like && (
        <Text style={[styles.result, {backgroundColor: '#4FCC94'}]}>Like</Text>
      )}
      {dislike && (
        <Text style={[styles.result, {backgroundColor: '#A65CD2'}]}>Nope</Text>
      )}
      {skip && (
        <Text style={[styles.result, {backgroundColor: '#F6BE00'}]}>Skip</Text>
      )}
      {!loading && users.length !== 0 && (
        <View style={styles.bottomNavigation}>
          <TouchableOpacity onPress={handleDislike}>
            <Entypo
              name="cross"
              size={40}
              color="#A65CD2"
              style={styles.button}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLike}>
            <AntDesign
              name="heart"
              size={40}
              color="#4FCC94"
              style={styles.button}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  preload: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: '-100%',
  },
  result: {
    position: 'absolute',
    fontSize: 30,
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 40,
    fontWeight: '500',
    color: 'white',
    top: 100,
    alignSelf: 'center',
    elevation: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    position: 'absolute',
    bottom: 20,
    height: 70,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
  },
  button1: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    paddingLeft: 12,
  },
  DisplayContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    paddingTop: 80,
  },
  Title1: {
    width: '100%',
    color: '#F76C6B',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    position: 'absolute',
    top: 10,
  },
  nouser1: {
    color: '#F76C6B',
    fontSize: 80,
    fontWeight: '800',
  },
  nouser2: {
    color: '#F76C6B',
    fontSize: 40,
    fontWeight: '800',
  },
  nouserContainer: {
    width: '100%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default DisplayScreen;
