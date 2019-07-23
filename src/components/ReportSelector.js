
import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Button,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

styles = require('./../../css/global');



class ReportSelector extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      myLogouri:'http://sbx2.ngine.sbxretail.com/Images/logo_app_reportes.png',
    };

    this.logOut = this.logOut.bind(this);
    AsyncStorage.getItem("login_url")
    .then((value) => {
      myImageURL = value + '/Images/logo_app_reportes.png';
      this.setState({ myLogouri: myImageURL, });
    });

  }


  logOut() {
    /*AsyncStorage.removeItem("login_username");
    AsyncStorage.removeItem("login_url");
    */
    AsyncStorage.removeItem("login_token");
    AsyncStorage.removeItem("login_token_expires");
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <ImageBackground source={require('./../../images/Inicio.png')}
        style={styles.backgroundImage}
      >
        <View style={{ alignItems: 'center', paddingTop: 15, paddingBottom: 10,}} justifyContent="center">
          <Image source={require('./../../images/Oval.png')} />
          <Image source={{uri: this.state.myLogouri, cache:'reload' }} 
          style={{position:'absolute', top:50,width: 90, height: 90}}/>
        
        </View>

        <ScrollView style={{ backgroundColor: 'transparent' }}
                    contentContainerStyle={{alignSelf:'center'}}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('VentasPorTienda')} style={[styles.highlightbuttonframeMenu, { height: 50, }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5, alignItems: 'center' }}>
              <Image source={require('./../../images/Carrito.png')} />
              <Image style={{ marginLeft: 15 }} source={require('./../../images/Ventasportienda.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Mejores100Vendidos')} style={[styles.highlightbuttonframeMenu, { height: 50, }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5, alignItems: 'center' }}>
              <Image source={require('./../../images/notas.png')} />
              <Image style={{ marginLeft: 15 }} source={require('./../../images/Mejoresvendidos.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('KPI')} style={[styles.highlightbuttonframeMenu, { height: 50, }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5, alignItems: 'center' }}>
              <Image source={require('./../../images/Estrellita.png')} />
              <Image style={{ marginLeft: 24 }} source={require('./../../images/KPIportienda.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('VentasPorHora')} style={[styles.highlightbuttonframeMenu, { height: 50, }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5, alignItems: 'center' }}>
              <Image source={require('./../../images/reloj.png')} />
              <Image style={{ marginLeft: 19 }} source={require('./../../images/Ventasporhora.png')} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.logOut} style={[styles.highlightbuttonframeMenu, { height: 50, }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', padding: 5, alignItems: 'center' }}>
              <Image source={require('./../../images/candado.png')} />
              <Image style={{ marginLeft: 19 }} source={require('./../../images/Cerrarsesion.png')} />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <View style={{ alignItems: 'center' }}>
          <Image source={require('./../../images/Logovertical.png')} style={{ marginBottom: 10 }} />
        </View>
      </ImageBackground >
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

export default ReportSelector;
