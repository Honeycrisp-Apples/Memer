import React from 'react';
import {
  SafeAreaView,
  Text,
  Button,
  View,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import Fire from '../constants/Fire';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase';
import { useCollection, useDocument } from 'react-firebase-hooks/firestore';
// import functions from 'firebase-functions';
import { Card } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import { FormButton } from '../components/Reusables';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Memes from './Memes';
import axios from 'axios';

// type Props = {
//   navigation: { navigate: (arg0: string) => void, state: {params: {username? : string}} },
//   username?: string
// }
// interface AState {
//   user: any,
//   ready: boolean
// }
const { width } = Dimensions.get('window');
const height = width * 0.8;

export default function Welcome(props) {
  // state = {
  //   // user: this.props.navigation.state.params.username
  //   user: Fire.shared.getUser(),
  //   ready: false
  // }
  // componentDidMount(){
  //   this.setState({
  //     user: Fire.shared.getUser()
  //   })
  // }
  // componentWillUpdate(){
  //   this.setState({ready:true})
  // }

  const data = [
    {
      title: 'Best Caption',
      link: 'GameLobby',
      image:
        'https://tedideas.files.wordpress.com/2015/03/science_of_laughter_sophie_scott_ted.jpg?w=1200',
    },
    {
      title: 'Ultimate Memer',
      link: '',
      image:
        'https://vignette.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png/revision/latest?cb=20150206140125',
    },
    {
      title: 'More Game Modes Coming Soon',
      link: '',
      image:
        'https://tedideas.files.wordpress.com/2015/03/science_of_laughter_sophie_scott_ted.jpg?w=1200',
    },
  ];

  const _renderItem = ({ item, index }) => {
    return (
      // <View style={styles.slide}>
      //     <Text style={styles.title}>{ item.title }</Text>
      // </View>
      <Card
        style={styles.card}
        onPress={() => {
          if (item.link) return props.navigation.navigate(item.link);
        }}
      >
        <ImageBackground
          style={styles.image}
          source={{ uri: item.image }}
          imageStyle={{ opacity: 0.5, borderRadius: 3 }}
        >
          <Text style={{ fontSize: 30, textAlign: 'center', color: 'white' }}>
            {(item.title || 'Hi there').toUpperCase()}
          </Text>
        </ImageBackground>
      </Card>
    );
  };

  const getout = () => {
    Fire.shared.logout();
    // props.navigation.navigate('Login');
    // this.props.navigation.navigate("TabOneNavigator")
    // console.log(this.state.user)
    console.log('logged out. Did navigation happen?');
  };

  // const [game, gameLoading, gameError] = useDocument(
  //   firebase.firestore().collection('game').doc('PReC4ht5CcZFvI3cYEnP'),
  //   {
  //     snapshotListenOptions: { includeMetadataChanges: true },
  //   }
  // );

  // const [userData, userLoading, userError] = useDocument(
  //   firebase.firestore().collection('users').doc(`${Fire.shared.getUID()}`)
  // );

  const goToGame = (thing) => {
    props.navigation.navigate('Game', { theGame: thing });
  };

  // console.log('game', game.data());

  //visit game Id later
  const makeNewGame = (newUser, newInput) => {
    firebase
      .firestore()
      .collection('game')
      .doc()
      .set(
        {
          users: [newUser],
          currentMeme: '',
          endMode: false,
          gameId: '',
          gameMode: 'regular',
          gotUsers: false,
          inputs: [newInput],
          numUsers: 1,
          playing: false,
          roundMemes: [],
          winningMeme: '',
          timeStamp: Fire.shared.getTime(),
        },
        { merge: true }
      )
      .then(() => {
        firebase
          .firestore()
          .collection('game')
          .orderBy('timeStamp', 'desc')
          .limit(1)
          .get()
          .then((query) => {
            let thing2 = query.docs[0];
            const shuffle = (arr) => arr.sort(() => 0.5 - Math.random());
            axios.get('https://api.imgflip.com/get_memes').then((memeData) => {
              let shuffledMemes = shuffle(memeData.data.data.memes);
              thing2.ref
                .update({
                  gameId: thing2.ref.id,
                  // roundOneMeme: shuffledMemes[0].url,
                  // roundTwoMeme: shuffledMemes[1].url,
                  // roundThreeMeme: shuffledMemes[2].url,
                  roundMemes: [
                    shuffledMemes[0].url,
                    shuffledMemes[1].url,
                    shuffledMemes[2].url,
                  ],
                  winningMeme: shuffledMemes[3].url,
                })
                .catch((error) => console.log(error));
            });

            return thing2;
            // goToGame(thing2);
          })
          .then((thing2) => {
            goToGame(thing2);
            console.log('thing2', thing2);
          });
      });
    // console.log('hit me');
    // const goPlease = functions.firestore
    //   .document('game/{gameId}')
    //   .onCreate((snap, context) => goToGame(snap));
    // goPlease();
    // console.log('thing2 docs', thing2.docs[0].data());
    // .then((thing2) => console.log('thing2', thing2));
    // console.log('thing2', thing2);
    // return thing2;
    // add a timestamp to each game object, query the database ordering by the timestamp for the last child
    // ref.orderByChild('timestamp').limitToLast(1).on('child_added',function(snapshot) {
    // console.log('new record', snapshot.val());
    // });
  };
  const addUserToGame = () => {
    firebase
      .firestore()
      .collection('game')
      .where('numUsers', '<', 3)
      .orderBy('numUsers')
      .limit(1)
      .get()
      .then((query) => {
        const newUser = { userId: Fire.shared.getUID(), wins: 0, wonMemes: [] };
        const newInput = { caption: '', userId: Fire.shared.getUID(), vote: 0 };
        if (query.docs.length) {
          const thing = query.docs[0];
          console.log('query', query.docs);
          let curVal = thing.data().numUsers;
          let curUsers = thing.data().users;
          let curInputs = thing.data().inputs;
          const numOfPlayers = curVal + 1;
          thing.ref.update({
            numUsers: numOfPlayers,
            users: [...curUsers, newUser],
            inputs: [...curInputs, newInput],
          });
          goToGame(thing);
        } else {
          makeNewGame(newUser, newInput);
        }
      })
      .catch((err) => {
        return console.log(err, "Couldn't find it");
      });

    // goToGame();
  };

  // render(){
  const [user, loading, error] = useAuthState(firebase.auth());
  if (loading) {
    return <Text>I'm loading</Text>;
  }
  if (error) {
    return <Text>You Messed Up!!</Text>;
  }
  if (user) {
    return (
      <SafeAreaView style={styles.welcome}>
        <TouchableOpacity
          style={styles.mainUser}
          onPress={() => props.navigation.navigate('UserPages')}
        >
          {/* needs user object in database image url and points */}
          <Image
            style={styles.userimg}
            source={{
              uri:
                'https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg',
            }}
          />
          <Text style={{ fontSize: 20, marginLeft: 5 }}>
            {user.displayName.toUpperCase()}
          </Text>
          <Text style={{ fontSize: 10, marginLeft: 'auto', marginRight: 10 }}>
            MEMER POINTS:
          </Text>
        </TouchableOpacity>
        {/* <Text>{`Hello there, ${user.displayName}`}</Text> */}
        {/* <View
          style={styles.scrollContainer}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
          >
            <Card style={styles.card}>
              <Text>Hi there</Text>
            </Card>
            <Card style={styles.card}>
              <Text>Hi there</Text>
            </Card>
            <Card style={styles.card}>
              <Text>Hi there</Text>
            </Card>
          </ScrollView>
        </View> */}
        <Carousel
          // ref={(c) => { this._carousel = c; }}
          data={data}
          renderItem={_renderItem}
          sliderWidth={width}
          itemWidth={width - 100}
        />
        <FormButton
          title={'create a room'}
          colorValue={'orange'}
          modeValue={'contained'}
          onPress={() => alert('Functionality not available yet.')}
        />
        <FormButton
          title={'logout'}
          colorValue={'white'}
          modeValue={'contained'}
          onPress={() => getout()}
        />
        <Button title={'Join Game'} onPress={() => addUserToGame()}></Button>
        {/* <Button title={'LOGOUT'} onPress={() => getout()}></Button> */}
        {/* <Button
          title={'To User'}
          onPress={() => props.navigation.navigate('UserPages')}
        ></Button>
        <Button title={'To Game'} onPress={() => addUserToGame()}></Button>

        ></Button> */}
        {/* <Button
          title={'To Game'}
          onPress={() => props.navigation.navigate('GameLobby')}
        ></Button> */}
      </SafeAreaView>
    );
  }
  return <Text>Umm... how?</Text>;
  // }
}
const styles = StyleSheet.create({
  welcome: {
    flex: 1,
    backgroundColor: 'darkred',
  },
  scrollContainer: {
    height,
  },
  card: {
    backgroundColor: 'black',
    width: width - 100,
    height: height,
    // marginLeft: 25,
    // marginRight: 25
    // backgroundColor: 'blue',
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
  },
  mainUser: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  userimg: {
    borderRadius: 50 / 2,
    borderWidth: 3,
    borderColor: 'darkred',
    width: 50,
    height: 50,
  },
  image: {
    borderRadius: 5,
    width: width - 100,
    height: height,
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    // backgroundColor: "rgba(255,0,0,0.3)"
    // opacity: 0.7
  },
});
