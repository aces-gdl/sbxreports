
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
} from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#9eb1c1"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  username: {
    fontSize: 12,
    textAlign: "left",
    margin: 10,
    width:250,
    borderColor:'black',
    borderWidth:1,
    backgroundColor:"white"
  },
  password: {
    fontSize: 12,
    textAlign: "left",
    margin: 10,
    width:250,
    borderWidth:1,
    backgroundColor:"white"
  },
  title:{
    fontSize:24,
    textAlign: "center",
    marginBottom:50,
    color:"blue",
  }

});
// Definicion del grid



// Definicion del grid


class SeguimientoModelos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  render(){
    return (
      <View style={styles.container}>
        <Text>Seguimiento de Modelos</Text>
      </View>
    );
 }
}

SeguimientoModelos.navigationOptions = {
  title: "Seguimiento de Modelos"
};
//AppRegistry.registerComponent('Login', () => Login);


export default SeguimientoModelos;
