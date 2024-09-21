import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import moment from 'moment';

const ChatMessage = ({item, from, to}) => {
  const isMyMessage = () => {
    return item.from === from.sub;
  };
  return (
    <>
      {isMyMessage() ? (

          <View style={styles.container1}>
            <Text style={styles.content1}>{item.message}</Text>
            <Text style={styles.time1}>{moment(item.createdAt).fromNow()}</Text>
          </View>
      ) : (
          <View style={styles.container2}>
            <Text style={styles.content2}>{item.message}</Text>
            <Text style={styles.time2}>{moment(item.createdAt).fromNow()}</Text>
          </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  container1: {
    backgroundColor: 'lightblue',
    maxWidth: '80%',
    marginBottom: 10,
    elevation: 5,
    borderRadius: 20,
    padding: 7,
    alignSelf:'flex-end',
    margin:10,
    minWidth:'22%',
    paddingBottom:30,
  },
  content1: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    alignSelf:'flex-end'
  },
  time1: {
    color: 'grey',
    fontSize: 8,
    bottom: 10,
    position: 'absolute',
    right: 10,
    marginTop: 10,
    // backgroundColor:'red',
  },
  container2: {
    backgroundColor: 'lightblue',
    maxWidth: '80%',
    marginBottom: 10,
    elevation: 5,
    borderRadius: 20,
    padding: 10,
    alignSelf:'flex-start',
    margin:10,
    minWidth:'22%',
    paddingBottom:30,
  },
  content2: {
    color: 'white',
    fontSize: 20,
    fontWeight: '500',
    alignSelf:'flex-start'
  },
  time2: {
    color: 'grey',
    fontSize: 8,
    bottom: 10,
    left:10,
    position: 'absolute',
    
    marginTop: 10,
    alignSelf:'flex-start',
    // backgroundColor:'red',
  },
});
export default ChatMessage;

// name2: {
  //   width:'100%',
  //   height:'100%',
  //   color: 'grey',
  //   fontSize: 15,
  //   fontWeight: '500',
  //   marginTop: 10,
  //   position:'absolute',
  //   top:0,
  //   left:0,
  //   overflow:'hidden',
  //   alignSelf:'flex-end',
  //   // backgroundColor:'green',
  // },
  // name1: {
  //   // width:'100%',
  //   height:'100%',
  //   color: 'grey',
  //   fontSize: 15,
  //   fontWeight: '500',
  //   marginTop: 10,
  //   position:'absolute',
  //   overflow:'hidden',
  //   alignSelf:'flex-end',
  //   right:10,
  // },