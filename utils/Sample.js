
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  AsyncStorage,
  Alert,
  TouchableHighlight,
} from "react-native";



class Sample extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        visible:false,
    };
  }

  render(){
    return (
      <View style={{flex:1, borderwidth:1, backgroundColor:'black', alignItems:'center', justifyContent:'center'}}>
          <Text style={{color:'white'}}> Hola ... </Text>
      </View>
    );
 }
}


export default Sample;
