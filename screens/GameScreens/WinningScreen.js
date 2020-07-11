import React from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet } from 'react-native';
import Fire from '../../constants/Fire';
import { FormButton } from '../../components/Reusables';
import {IconButton} from 'react-native-paper'

export default class WinningScreen extends React.Component {
  render() {
    return(
      <SafeAreaView style={styles.winResults}>
        <IconButton
              style={{
                marginLeft: 'auto',
                position: 'absolute',
                top: 10,
                right: 0,
                zIndex: 1,
              }}
              icon="close-circle"
              size={36}
              color="orange"
              onPress={() => this.props.navigation.navigate("Welcome")}
            />
        <Text style={{fontSize: 50, color: 'white', textAlign: 'center'}}>WINNER!!!</Text>
        <View style={{backgroundColor: 'orange', height: 200, width: 200, borderRadius: 100, alignSelf: 'center', justifyContent: "center", alignItems: "center" }}>
          <Image
            style={styles.img}
            source={{uri: "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"}}
          />
          <Text style={{color: 'white'}}>DISPLAY NAME</Text>
        </View>
        <Text style={{fontSize: 20, color: 'white', textAlign: 'center', marginBottom: 10}}>PRIZED MEME: </Text>
        <View style={{alignItems: 'center', width: 300, alignSelf:'center'}}>
          <Image
            style={styles.memeimg}
            source={{uri: 'https://vignette.wikia.nocookie.net/starwars/images/d/d6/Yoda_SWSB.png/revision/latest?cb=20150206140125'}}
          />
        </View>
        <View style={styles.players}>
        <View style={{height: 140, width: 140, backgroundColor: "darkred", alignItems: 'center', borderRadius: 70, justifyContent: 'center'}}>
        <Image
        style={styles.img}
        source={{uri: "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"}}
        />
        <IconButton
        icon="account-plus"
        size={20}
        color="white"
        onPress={() => alert("Functionaility not available yet.")}
        />
        </View>
        <View style={{height: 140, width: 140, backgroundColor: "darkred", alignItems: 'center', borderRadius: 70, justifyContent: 'center'}}>
        <Image
        style={styles.img}
        source={{uri: "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg"}}
        />
        <IconButton
        icon="account-plus"
        size={20}
        color="white"
        onPress={() => alert("Functionaility not available yet.")}
        />
        </View>
      </View>
        <FormButton title={'game lobby'} style={{marginTop: 'auto'}} colorValue={'white'} modeValue={'contained'} onPress={()=> this.props.navigation.navigate("GameLobby")}/>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  winResults:{
    flex: 1,
    backgroundColor: 'gold'
  },
  memeimg:{
    width: 200,
    height: 200,
    borderWidth: 3,
    borderColor: 'orange',
  },
  img:{
    margin: 5,
    borderRadius: 100/2,
    borderWidth: 3,
    borderColor: 'darkred',
    width: 70,
    height:70
  },
  players:{
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center'
  },
});
