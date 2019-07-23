import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  LinearGradient,
  ImageBackground,
} from 'react-native'

import Icon from 'react-native-vector-icons/Ionicons';


class List extends Component {


  constructor(props) {
    
        super(props);
        this.closeModal = this.closeModal.bind(this);
  }    

  closeModal(){
     this.props.visible = false;
  }
  render() {
    if (this.props.visible) {
      return (
        <Modal
          animationType={'slide'}
          supportedOrientations={['portrait', 'landscape']}
          transparent={true}
          onRequestClose={this.closeModal}
        >
          <View style={{
            flexDirection: 'column',
            flex:1,
            backgroundColor: 'transparent',
            alignSelf:'center',
            justifyContent:'center',
            padding:20,
          }}>
            <ImageBackground source={require('./../../images/Inicio.png')}
                  style={{ 
                  alignSelf:'center',}}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={{ color: 'grey', fontSize: 20, alignSelf: 'center', padding:20, }} >Seleccione periodo</Text>
            {
              this.props.listOptions.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={{ backgroundColor: 'transparent', alignSelf: 'center', }}
                  onPress={() => this.props.onPress(item)}>
                  <View style={{ flexDirection: 'row', padding: 5 }}>
                    <Text
                      allowFontScaling={false}
                      style={{ color: 'white', alignSelf: 'center', fontSize: 20, }}>
                      {item.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            }
            <TouchableOpacity
              style={{ backgroundColor: 'transparent', 
                        alignSelf: 'center',  
                        margin: 10 }}
              onPress={() => this.props.onPress()}>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 5 }}>
                <Text
                  allowFontScaling={false}
                  style={{ color: 'red', fontSize: 20, alignSelf: 'center' }} >Cancelar</Text>
              
              </View>
            </TouchableOpacity>
            </ImageBackground>
           
          </View>

        </Modal>
      )
    } else {
      return null;
    }
  }
}
export default List

