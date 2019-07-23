
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
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";

import ApiUtils from './../../utils/ApiUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';



const styles = require('./../../css/global');



class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      myURL: '',
      username: '',
      password: '',
      login_token: '',
      token_is_valid: false,
    };
    this.saveMyValuesNow = this.saveMyValuesNow.bind(this);
    this.removeLocalData = this.removeLocalData.bind(this);
    this.validateLoginData = this.validateLoginData.bind(this);
    this.updateLogo = this.updateLogo.bind(this);
  }


  componentWillMount() {
    let today = new Date();
    let tokenExpires = null;



    AsyncStorage.getItem("login_url")
      .then((value) => {
        this.setState({ myURL: value, });
        this.updateLogo();
      });
    AsyncStorage.getItem("login_username")
      .then((value) => {
        this.setState({ username: value, });
      });

    AsyncStorage.getItem("login_token_expires")
      .then((value) => {
        let today = new Date();
        if (!value) {
          console.log('No hay Fecha de expiracion');
        } else {
          let today = new Date();
          let expireDate = new Date(value);
          if (today < expireDate) {
            this.setState({ token_is_valid: true });
            this.props.navigation.navigate('ReportSelector');
          }
        }
      }).done;

  }

  validateLoginData() {
    if (this.state.myURL == null || this.state.myURL == "") {
      Alert.alert('URL es requerida');
      return false;
    }
    if (this.state.username == null || this.state.username == "") {
      Alert.alert('Usuario es requerido');
      return false;
    }
    if (this.state.password == null || this.state.password == "") {
      Alert.alert('Contraseña es requerida');
      return false;
    }
    return true;
  }

  saveMyValuesNow() {

    if (!this.validateLoginData()) {
      return;
    }
    let myResponse = '';
    AsyncStorage.setItem('login_url', this.state.myURL);
    AsyncStorage.setItem('login_username', this.state.username);
    const myGrant_Type = 'grant_type=password&username=' + this.state.username + '&password=' + this.state.password;
    const full_url = this.state.myURL + '/token';
    let myToken = '';
    fetch(full_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: myGrant_Type
      ,
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          let error = new Error(JSON.parse(response._bodyText).error_description);
          error.response = response;
          throw error;
        }

      })
      .then((responseData) => {
        if (responseData.access_token) {

          this.setState({
            login_token: responseData.access_token,
          });
          AsyncStorage.setItem('login_token', responseData.access_token, );
          AsyncStorage.setItem('login_token_expires', responseData[".expires"]);
          this.props.navigation.navigate('ReportSelector');
        }
      })
      .catch((e) => {
        //let rJson = JSON.stringify(e.response);
        Alert.alert('Error trying to connect to ' + full_url + ' = ' + e.message);
      });

  }

  removeLocalData() {
    AsyncStorage.removeItem("login_username");
    AsyncStorage.removeItem("login_url");
    AsyncStorage.removeItem("login_token");
    AsyncStorage.removeItem("login_token_expires");
    this.setState({
      myURL: '',
      username: '',
      password: '',
      login_token: '',
      token_is_valid: false,
      myLogouri:'http://sbx2.ngine.sbxretail.com/Images/logo_app_reportes.png',
    });
  }

  updateLogo(){
    myImageURL = this.state.myURL + '/Images/logo_app_reportes.png';
    this.setState({ myLogouri: myImageURL, });
  }

  render() {
    return (
      <ImageBackground source={require('./../../images/Inicio.png')}
        style={styles.backgroundImage}
      >
        <ScrollView style={{ flex: 1, backgroundColor: 'transparent', borderWidth: 1 }} >

          <View style={{ alignItems: 'center', paddingTop: 15, paddingBottom: 10, }} justifyContent="center">
            <Image source={require('./../../images/Oval.png')} />
            <Image source={{ uri: this.state.myLogouri, cache: 'reload' }}
              style={{ position: 'absolute', top: 50, width: 90, height: 90 }} />

          </View>
          <View style={[styles.container, { alignContent: 'space-between', backgroundColor: 'transparent', alignItems: 'center', paddingTop: 10, paddingBottom: 10 }]}>
            <View style={{ flex: 1, flexDirection: 'column', width: '100%', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', backgroundColor: 'white', width: 260, borderRadius: 50, justifyContent: 'space-between', alignItems: 'center' }}>
                <Image source={require('./../../images/Group.png')} style={{ marginRight: 3, marginLeft: 5 }} />
                <TextInput
                  alignSelf='flex-end'
                  style={[styles.textInput]}
                  placeholder={'URL'}
                  onChangeText={(myURL) => this.setState({ myURL })}
                  value={this.state.myURL}
                  autoCorrect={false}
                  onEndEditing={(myURL) => this.updateLogo()}
                
                />
              </View>
              <View style={{ flexDirection: 'row', backgroundColor: 'white', width: 260, borderRadius: 50, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Image source={require('./../../images/Mono.png')} style={{ marginRight: 3, marginLeft: 9 }} />
                <TextInput
                  style={[styles.textInput]}
                  placeholder={'Usuario'}
                  onChangeText={(username) => this.setState({ username })}
                  autoCorrect={false}
                  value={this.state.username}
                />
              </View>
              <View style={{ flexDirection: 'row', backgroundColor: 'white', width: 260, borderRadius: 50, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <Image source={require('./../../images/lock.png')} style={{ marginRight: 3, marginLeft: 9 }} />
                <TextInput
                  style={[styles.textInput, { marginBottom: 10 }]}
                  style={[styles.textInput, {}]}
                  placeholder={'Contrasena'}
                  onChangeText={(password) => this.setState({ password })}
                  value={this.state.password}
                  secureTextEntry={true}
                />
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%', paddingTop: 30 }}>
              <TouchableOpacity onPress={this.saveMyValuesNow} >
                <ImageBackground source={require('./../../images/Boton.png')} style={{
                  width: 250, height: 55,
                  justifyContent: 'center',
                  alignItems: 'center',
                }} >
                  <Image source={require('./../../images/Iniciarsesion.png')} />

                </ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ alignSelf: 'center', justifyContent: 'flex-end' }} >
            <Image source={require('./../../images/Logovertical.png')} style={{ marginBottom: 10 }} />
            <Image source={require('./../../images/Olvidastetucontra.png')} />
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      header:
      <View style={{ width: '100%', backgroundColor: 'transparent', alignContent: 'space-between', flexDirection: 'row', }}>
      </View>,
      headerLeft: null,
      headerRight: null,
    }
  }
}


export default Login;
