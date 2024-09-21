import React, {useState} from 'react';
import {Feedback} from '../models';
import {Auth, DataStore, Storage} from 'aws-amplify';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const FeedbackForm = ({setIsFeedback}) => {
  const [type, setType] = useState('BUG');
  const [msg, setMsg] = useState('');
  const submit = async () => {
    if(msg===null || msg==='')return
    try {
      const authUser = await Auth.currentAuthenticatedUser();
    const newFeed = new Feedback({
        type:type,
        message:msg,
        sub:authUser.attributes.sub,
      });
      await DataStore.save(newFeed);
      
      Alert.alert("Thank you for your feedback")
      setIsFeedback(false);
    } catch (error) {
      Alert.alert("Error")
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.textt}>Message Type</Text>
        <Picker
          label="Gender"
          style={styles.gender}
          selectedValue={type}
          onValueChange={itemValue => setType(itemValue)}>
          <Picker.Item label="Report a bug" value="BUG" />
          <Picker.Item label="Feedback" value="FEEDBACK" />
          <Picker.Item label="New Features" value="FEATURE" />
        </Picker>
        <Text style={styles.textt}>Context</Text>
        <TextInput
          style={styles.bio}
          value={msg}
          onChangeText={setMsg}
          multiline
          numberOfLines={10}
          placeholder="Type here . . ."
          placeholderTextColor="grey"
        />
        <View style={styles.profileFooter}>
          <TouchableOpacity style={styles.button} onPress={submit}>
            <Text style={styles.text}>Submit</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileFooter}>
          <TouchableOpacity style={styles.button} onPress={()=>setIsFeedback(false)}>
            <Text style={styles.text}>Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  profileFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  button: {
    width: 140,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 30,
    elevation: 3,
    backgroundColor: '#F76C6B',
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  bio: {
    width: '92%',
    padding: 10,
    height: '40%',
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 20,
    elevation: 10,
  },
  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'red',
    alignItems: 'center',
  },
  gender: {
    width: '92%',
    padding: 10,
    height: 50,
    marginTop: 10,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: '#b5b5b5',
    color: 'black',
    fontSize: 20,
    elevation: 10,
  },
  textt: {
    width: '92%',
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F76C6B',
  },
});
export default FeedbackForm;
