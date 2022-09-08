import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {Auth, DataStore, API} from 'aws-amplify';
import {User, WaitlingList, Matches, ChatUsers, ChatData,Block} from './models';
import ChatMessage from './ChatMessage';
import {onCreateChatData,onDeleteBlock,onCreateBlock} from './models/schema';

const Messanger = ({setIsChatting, setLoverSub, from, to}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [lover, setLover] = useState(null);
  const [msg, setMsg] = useState(null);
  const [chatContent, setChatContent] = useState([]);
  const [blockKiya, setBlockKiya] = useState(false);
  const [blockHua, setBlockHua] = useState(false);
  const [drop,setDrop]=useState(false)
  const checkBlock = async () => {
    const dbUsers = await DataStore.query(
      Block,
      u1 =>
        u1.or(u2 =>
          u2
            .and(u3 => u3.by('eq', from).to('eq', to))
            .and(u4 => u4.by('eq', to).to('eq', from)),
        )
    );
    // console.log('Messages = ', dbUsers);
    if (!dbUsers || dbUsers.length === 0) {
      setBlockHua(false);
      setBlockKiya(false);
      return;
    }
    if(dbUsers[0].by===from)setBlockKiya(true)
    else setBlockHua(true)
  };
  useEffect(()=>{
    checkBlock();
  },[])
  useEffect(() => {
    const checkBlockUpdate = API.graphql({
      query: onDeleteBlock,
    }).subscribe({
      next: data => {
        const newMsg = data.value.data.onDeleteBlock;
        console.log('newMsg = ', newMsg);
        checkBlock();
      },
    });
    return () => checkBlockUpdate.unsubscribe();
  }, []);
  useEffect(() => {
    const checkBlockUpdate = API.graphql({
      query: onCreateBlock,
    }).subscribe({
      next: data => {
        const newMsg = data.value.data.onCreateBlock;
        console.log('newMsg = ', newMsg);
        checkBlock();
      },
    });
    return () => checkBlockUpdate.unsubscribe();
  }, []);
  useEffect(() => {
    const getCurrentUsers = async () => {
      const dbUsers = await DataStore.query(User, u1 => u1.sub('eq', from));
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setCurrentUser(dbUsers[0]);
    };
    getCurrentUsers();
  }, []);
  useEffect(() => {
    const getLover = async () => {
      const dbUsers = await DataStore.query(User, u1 => u1.sub('eq', to));
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setLover(dbUsers[0]);
    };
    getLover();
  }, []);
  useEffect(() => {
    const subscription = API.graphql({
      query: onCreateChatData,
    }).subscribe({
      next: data => {
        const newMsg = data.value.data.onCreateChatData;
        if (
          !(
            // (newMsg.from === from && newMsg.to === to) ||
            (newMsg.from === to && newMsg.to === from)
            )
            ) {
              return;
            }
            console.log('newMsg = ', newMsg);
        setChatContent(chatContent => [newMsg, ...chatContent]);
      },
    });
    return () => subscription.unsubscribe();
  }, []);
  useEffect(() => {
    const getMessages = async () => {
      const dbUsers = await DataStore.query(
        ChatData,
        u1 =>
          u1.or(u2 =>
            u2
              .and(u3 => u3.from('eq', from).to('eq', to))
              .and(u4 => u4.from('eq', to).to('eq', from)),
          ),
        {sort: s => s.createdAt()},
      );
      // console.log('Messages = ', dbUsers);
      if (!dbUsers || dbUsers.length === 0) {
        return;
      }
      setChatContent(dbUsers);
    };
    getMessages();
  }, []);
  const updateData = async () => {
    if(chatContent.length==0){
      const temp = new ChatUsers({
          from:from,
          to:to,
          message:msg
        });
        await DataStore.save(temp);
        console.log("created new user")
      }
      else{
        const updateUser=await DataStore.query(ChatUsers, u1 =>
          u1.or(u2 =>
          u1.or(u2 => u2.and(u3=>u3.from('eq',from).to('eq',to)).and(u4=>u4.from('eq',to).to('eq',from))),
          ),
        );
        const updatedUser = User.copyOf(updateUser[0], updated => {
  
          updated.message=msg;
        });
        await DataStore.save(updatedUser);
        console.log("updated user")
  
      }
  }
  const display = () => {
    const url = `https://lpu549be2fd8f0f4ba1b6d780e258bd43bc71012-staging.s3.ap-south-1.amazonaws.com/public/${lover.image}`;
    return <Image source={{uri: url}} style={styles.image} />;
  };
  const handleBack = () => {
    setLoverSub(null);
    setIsChatting(false);
  };
  const handleSend = async () => {
    if (msg === null) return;
    console.log("hello")
    const newMsg={
      from,
      to,
      message:msg
    }
    setChatContent(chatContent => [newMsg, ...chatContent]);
    updateData()
    const currentMsg = new ChatData({
      from: from,
      to: to,
      message: msg,
    });
    await DataStore.save(currentMsg);
    setMsg('');
    console.log('Added new message');
  };
  const handleBlock = async () =>{
    setDrop(false)
    if(blockHua)return;
    if(blockKiya){
      await DataStore.delete(Block, u =>
        u.by('eq', from).to('eq', to),
        );
        Alert.alert("User unblocked successfully")
        console.log("unblocked the user")
        return
      }
      const newBlockuser = new Block({
        by:from,
        to:to,
      });
      await DataStore.save(newBlockuser);
      Alert.alert("User blocked successfully")
    console.log("blocked the user")


  }
  if (lover === null) return;
  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Pressable onPress={handleBack} style={styles.back}>
          <Ionicons name="chevron-back-outline" size={50} color="white" />
        </Pressable>
        {display()}
        <Text style={styles.namee}>{lover.name}</Text>
        <Pressable onPress={()=>setDrop(!drop)} style={styles.option}>
          <View style={styles.blockContainer}>

          <Fontisto name="more-v-a" size={30} color="white" />
          </View>
        </Pressable>
        {/* <View style={styles.optionContainer}> */}
        {drop &&<TouchableOpacity onPress={handleBlock} style={styles.optionContainer}>
        {blockKiya && <Text style={styles.block}>Unblock</Text>}
        {!blockHua && !blockKiya &&<Text style={styles.block}>Block</Text>}
        </TouchableOpacity>}
      </View>
      <FlatList
        data={chatContent}
        renderItem={({item}) => (
          <ChatMessage item={item} from={currentUser} to={lover} />
        )}
        inverted
        style={styles.content}
      />
      {(!blockHua && !blockKiya)? <View style={styles.bottom}>
        <TextInput
          style={styles.input}
          value={msg}
          onChangeText={setMsg}
          multiline
          numberOfLines={3}
          placeholder="Send message"
          placeholderTextColor="grey"
        />
        <Pressable onPress={handleSend}>
          <Ionicons name="send" size={50} color="white" />
          
        </Pressable>
      </View>:
      <View>
        <Text style={styles.warning}>You can not message this user</Text>
      </View>
      }
    </View>
  );
};
const styles = StyleSheet.create({
  optionContainer:{
    position:'relative',
    top:-20,
  },
  warning:{
    backgroundColor:'#F76C6B',
    color:'white',
    textAlign:'center',
    padding:10,
  },
  blockContainer:{
    width:30,
    textAlign:'center',
    alignItems:'center',
  },
  block:{
    backgroundColor:'orange',
    position:'absolute',
    right:0,
    color:'white',
    fontSize:20,
    padding:10,
    borderRadius:10,
    fontWeight:'500',
  },
  option:{
    right:25,
    position:'absolute',
  },
  content: {
    width: '100%',
    height: '100%',
    marginBottom: 80,
    marginTop: 1,
    backgroundColor:'white'
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'white',
  },
  navbar: {
    width: '100%',
    height: 100,
    backgroundColor: '#F76C6B',
    flexDirection: 'row',
    alignItems: 'center',
    // borderBottomEndRadius: 20,
    // borderBottomLeftRadius: 20,
    top: 0,
    // display: 'none',
  },
  back: {
    marginLeft: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 40,
    marginLeft: 10,
  },
  namee: {
    marginLeft: 20,
    fontSize: 30,
    fontWeight: '800',
    color: 'white',
    maxWidth:'50%',
    height:40,
    overflow:'hidden',
  },
  bottom: {
    width: '100%',
    height: 80,
    backgroundColor: '#F76C6B',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    justifyContent: 'space-evenly',
    // display: 'none',
    // backgroundColor:'grey'
  },
  input: {
    backgroundColor: 'white',
    width: '70%',
    height: 50,
    borderRadius: 30,
    paddingHorizontal: 10,
    color: 'black',
  },
});
export default Messanger;
