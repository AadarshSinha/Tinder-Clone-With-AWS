import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  TouchableNativeFeedback,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Auth, Storage} from 'aws-amplify';
import {DataStore} from '@aws-amplify/datastore';
import {User, Feedback} from '../../models/';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import moment from 'moment';
import FeedbackForm from '../../components/FeedbackForm';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Card from '../../components/Card';

const ProfileScreen = ({setIsNew, setScreen,isNew}) => {
  const [Name, setName] = useState('');
  const [Age, setAge] = useState('');
  const [Bio, setBio] = useState('');
  const [Gender, setGender] = useState('FEMALE');
  const [Uri, setUri] = useState('');
  const [user, setUser] = useState(null);
  const [isPick, setIsPick] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [isFeedback, setIsFeedback] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if(isNew) BackHandler.exitApp()
      else {
        setScreen('display');
      }
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const authUser = await Auth.currentAuthenticatedUser();

        const dbUsers = await DataStore.query(User, u =>
          u.sub('eq', authUser.attributes.sub),
        );
        if (!dbUsers || dbUsers.length === 0) {
          console.log('This is a new user');
          setUser([]);
          return;
        }
        console.log('This is a old user');
        const dbUser = dbUsers[0];
        setUser(dbUser);
        setName(dbUser.name);
        setBio(dbUser.bio);
        setGender(dbUser.gender);
        setAge(dbUser.age);
        setUri(dbUser.image);
      } catch (error) {
        Alert.alert('Error');
      }
    };
    getCurrentUser();
  }, []);
  const check = () => {
    if (Name === '') return false;
    if (Age === '') return false;
    if (Uri === '') return false;
    if (Bio === '') return false;
    if (Gender === '') return false;
    return true;
  };

  const uploadImage = async () => {
    try {
      const response = await fetch(Uri);
      const Blob = await response.blob();
      console.log(Blob);
      const urlParts = Uri.split('.');
      const extension = urlParts[urlParts.length - 1];
      const unique = moment();
      const authUser = await Auth.currentAuthenticatedUser();
      const key = `${authUser.attributes.sub}/${unique}.${extension}`;
      await Storage.put(key, Blob);
      console.log('user added to s3 successfully');
      return key;
    } catch (e) {
      console.log(e);
      Alert.alert(e.message);
    }
  };
  const AddImage = () => {
    launchImageLibrary(
      {mediaType: 'mixed', quality: 0.25},
      ({didCancel, errorCode, errorMessage, assets}) => {
        if (didCancel || errorCode) {
          console.warn('canceled or error');
          console.log(errorMessage);
          return;
        }
        setUri(assets[0].uri);
        setIsPick(true);
        console.log('picked image = ' + assets[0].uri);
      },
    );
  };
  const Submit = async () => {
    console.log('clicked submit');
    if (!check()) {
      if (Uri === '') {
        Alert.alert('Add a Profile Photo');
        return;
      }
      console.log('Enter all details');
      Alert.alert('Enter all details');
      return;
    }
    setIsUpdating(true);
    console.log('Current User');
    console.log(user);
    let newImage = Uri;
    if (isPick) {
      try {
        newImage = await uploadImage();
      } catch (error) {
        console.log(error);
        Alert.alert('Error');
      }
      // DataStore.clear()
    }
    console.log('newImage = ' + newImage);
    if (user.length === 0) {
      console.log('Adding new user data');
      try {
        const authUser = await Auth.currentAuthenticatedUser();
        const newUser = new User({
          sub: authUser.attributes.sub,
          name: Name,
          bio: Bio,
          gender: Gender,
          age: Age,
          image: newImage,
        });
        await DataStore.save(newUser);
        setUser(newUser);
        setIsNew(false);
        Alert.alert('Updated Successfully');
        setIsUpdating(false);
        console.log('User added successful');
      } catch (error) {
        console.log(error);
        Alert.alert('Error');
      }
      return;
    }
    console.log('updating user data');
    try {
      const updatedUser = User.copyOf(user, updated => {
        updated.name = Name;
        updated.bio = Bio;
        updated.gender = Gender;
        updated.age = Age;
        updated.image = newImage;
      });
      await DataStore.save(updatedUser);
    } catch (error) {
      console.log(error);
      Alert.alert('Error');
      return;
    }
    Alert.alert('Updated Successfully');
    setIsUpdating(false);
    console.log('update successful');
  };
  const logOut = async () => {
    // await DataStore.clear();
    Auth.signOut();
  };
  const showImage = () => {
    if (Uri === '') {
      return (
        <View className="w-72 h-72 items-center justify-center bg-white rounded-full mt-10">
          <FontAwesome name="user" size={300} color="grey" />
        </View>
      );
    }
    if (isPick) {
      return <Image source={{uri: Uri}} className="w-72 h-72 rounded-full mt-10" />;
    }
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${Uri}`;
    return <Image source={{uri: url}} className="w-72 h-72 rounded-full mt-10" />;
  };

  if (zoom) {
    return (
      <>
        <Card user={user} />
        <MaterialCommunityIcons
          name="card-text"
          size={35}
          color="grey"
          className="absolute right-8 top-24 bg-white rounded-lg p-1"
          onPress={() => setZoom(!zoom)}
        />
      </>
    );
  }

  if (isFeedback) {
    return <FeedbackForm setIsFeedback={setIsFeedback} />;
  }

  if (user === null) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <ScrollView className="bg-white w-full h-full">
      <View className="items-center w-full h-full">
        <Text className="text-lg mt-5 font-bold">Profile Photo</Text>
        <MaterialCommunityIcons
          name="card-text"
          size={35}
          color="grey"
          className="absolute right-8 top-4 p-1"
          onPress={() => setZoom(!zoom)}
        />
        <SkeletonPlaceholder>
          <View className="w-72 h-72 rounded-full"></View>
        </SkeletonPlaceholder>
        {showImage()}
        <Pressable onPress={AddImage}>
          <Ionicons name="add-circle" size={35} color="#F76C6B" className="mt-5" />
        </Pressable>
        <Text className="text-lg mt-5 font-bold">Name</Text>
        <TextInput
          className="w-11/12 p-2 h-16 mt-2 bg-gray-400 text-black text-2xl font-bold rounded-lg shadow-lg"
          value={Name}
          onChangeText={setName}
        />
        <Text className="text-lg mt-5 font-bold">Age</Text>
        <TextInput
          className="w-11/12 p-2 h-12 mt-2 bg-gray-400 text-black text-xl rounded-lg shadow-lg"
          value={Age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <Text className="text-lg mt-5 font-bold">Gender</Text>
        <Picker
          label="Gender"
          className="w-11/12 p-2 h-12 mt-2 bg-gray-400 text-black text-xl rounded-lg shadow-lg"
          selectedValue={Gender}
          onValueChange={itemValue => setGender(itemValue)}>
          <Picker.Item label="Female" value="FEMALE" />
          <Picker.Item label="Male" value="MALE" />
        </Picker>
        <Text className="text-lg mt-5 font-bold">Bio</Text>
        <TextInput
          className="w-11/12 p-2 h-24 mt-2 bg-gray-400 text-black text-xl rounded-lg shadow-lg"
          value={Bio}
          onChangeText={setBio}
          multiline
        />
        <Pressable
          onPress={Submit}
          disabled={isUpdating}
          className="w-11/12 mt-5 bg-[#F76C6B] p-3 rounded-lg">
          {isUpdating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-xl font-bold text-center">Update</Text>
          )}
        </Pressable>
        <Pressable
          onPress={logOut}
          className="w-11/12 mt-5 bg-gray-500 p-3 rounded-lg">
          <Text className="text-white text-xl font-bold text-center">Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};


export default ProfileScreen;
