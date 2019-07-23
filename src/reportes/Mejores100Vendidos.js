import React, { Component } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Item,
  AsyncStorage,
  TouchableHighlight,
  Alert,
  Dimensions,
  Slider,
  Image,
} from 'react-native'

import {
  Cell,
  DataTable,
  Header,
  HeaderCell,
  Row,

} from 'react-native-data-table';
import Icon from 'react-native-vector-icons/Ionicons';


import { ListView } from 'realm/react-native';
import ApiUtils from './../../utils/ApiUtils'
import List from '../components/List.js';
import LinearGradient from 'react-native-linear-gradient';

const styles = require('./../../css/global');


const myPickerOptions = [
  { id: 0, key: 'today', label: 'Hoy' },
  { id: 1, key: 'yesterday', label: 'Ayer' },
  { id: 2, key: 'week_to_date', label: 'Semana Actual' },
  { id: 3, key: 'last_week', label: 'Semana Pasada' },
  { id: 4, key: 'month_to_date', label: 'Mes Actual' },
  { id: 5, key: 'last_month', label: 'Mes Pasado' },
  { id: 6, key: 'year_to_date', label: 'Año Actual' },
];
class Mejores100Vendidos extends React.Component {


  constructor(props) {

    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds,
      myData: {},
      login_url: '',
      login_token: '',
      loadingData: false,
      maxWidth: 600,
      menuVisible: false,
      selectedOption: myPickerOptions[0],
      topQty: 25,
    };

    this.renderRow = this.renderRow.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.loadData = this.loadData.bind(this);
    this.loadingAnimation = this.loadingAnimation.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.handleDimensionEvents = this.handleDimensionEvents.bind(this);
    this.onSort = this.onSort.bind(this);
    this.setTopQty = this.setTopQty.bind(this);
    AsyncStorage.getItem("login_url").then((value) => {
      this.setState({ login_url: value, });
    });
    AsyncStorage.getItem("login_token").then((value) => {
      this.setState({ login_token: value, });
    });

  }

  componentDidMount() {
    AsyncStorage.getItem("login_url").then((value) => {
      this.setState({ login_url: value, });
      AsyncStorage.getItem("login_token").then((value) => {
        this.setState({ login_token: value, });
        this.loadData(this.state.selectedOption);
      }).catch(function () {
        console.log("Promise Rejected");
      });

    }).catch(function () {
      console.log("Promise Rejected");
    });

  }


  componentWillMount() {
    Dimensions.addEventListener("change", this.handleDimensionEvents);
  }
  componentWillUnmount() {
    Dimensions.addEventListener("change", this.handleDimensionEvents);
  }

  handleDimensionEvents() {
    let dims = Dimensions.get('window');
    let maxWidth = 600 > dims.width ? 600 : dims.width;
    this.setState({
      maxWidth: maxWidth,
    });
  }



  loadData(option) {
    if (!option) {
      option = this.state.selectedOption;
    }

    if (!option) {
      this.setState({
        loadingData: false,
        menuVisible: false,
      });
      return;
    }

    this.setState({
      loadingData: true,
      menuVisible: false,
    });


    console.log('en loadData: ' + option);

    let full_url = this.state.login_url + '/api/reports/best_sellers/' + option.key;
    console.log('URL =' + full_url);
    fetch(full_url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + this.state.login_token,
        'Content-Type': 'application/json',
      },
    }).then(ApiUtils.checkStatus)
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.length) {
          if (responseData.length > this.state.topQty) {
            responseData.length = this.state.topQty;
          }
          this.setState({
            myData: responseData,
            dataSource: this.state.dataSource.cloneWithRows(responseData),
            loadingData: false,
            menuVisible: false,
            selectedOption: option,
          });
          console.log('Con Datos : ' + responseData);
        }
        else {
          this.setState({
            myData: responseData,
            dataSource: this.state.dataSource.cloneWithRows(responseData),
            loadingData: false,
            menuVisible: false,
            selectedOption: option,
          });
          console.log('Sin Datos : Vacio');
        }
        console.log(responseData);
      }).catch((e) => {
        console.log(e);
        let rJson = JSON.stringify(e.response);
        Alert.alert('Error', rJson);
        this.setState({ loadingData: false });
      });
  }

  formatMoney(number) {
    if (number === null) {
      number = 0;
    }
    return number.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
  }

  renderRow(record) {
    return (
      <Row style={styles.rows}>

        <Cell width={3}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'center' }]}>{record.ItemDescription.substring(0, 20)}</Text></Cell>
        <Cell width={2}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'right' }]}>{this.formatMoney(record.Sold)}</Text></Cell>
        <Cell width={1}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'right' }]}>{record.QuantitySold}</Text></Cell>
        <Cell width={1}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'center' }]}>{record.Margin === null ? 0 : record.Margin.toFixed(2)}</Text></Cell>
        <Cell width={1}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'right' }]}>{record.QuantityOnHand === null ? 0 : record.QuantityOnHand.toFixed(0)}</Text></Cell>
        <Cell width={1}>
          <Text
            adjustsFontSizeToFit
            numberOfLines={1}
            style={[styles.cell, { textAlign: 'right' }]}>{record.SellThru === null ? 0 : record.SellThru.toFixed(2)}</Text></Cell>
      </Row>
    );
  }





  sortJsonArrayByProperty(objArray, prop, direction) {
    if (arguments.length < 2) throw new Error("sortJsonArrayByProp requires 2 arguments");
    var direct = arguments.length > 2 ? arguments[2] : 1; //Default to ascending
    let newObjArray = [];
    newObjArray.push(objArray[0]);
    let itemAdded = false;

    for (let x = 1; x < objArray.length; x++) {
      let myValue = objArray[x][prop];
      itemAdded = false;
      if (objArray[x]['StoreNumber'] != 'Total') {
        for (let i = 0; i < newObjArray.length; i++) {
          if (newObjArray[i][prop] >= myValue) {
            newObjArray.splice(i, 0, objArray[x]);
            itemAdded = true;
            break;
          }
        }
        if (!itemAdded) {
          newObjArray.push(objArray[x])
        }
      }
    }
    if (direction) {
      return newObjArray;
    } else {
      return newObjArray.reverse();
    }
  }

  onSort(ColumnName) {
    let resultado = this.sortJsonArrayByProperty(this.state.myData, ColumnName, this.state.isAscending);
    let isAscending = !this.state.isAscending;
    this.setState({
      isAscending: isAscending,
      dataSource: this.state.dataSource.cloneWithRows(resultado),
      isSelected: ColumnName,
    })

  }

  setTopQty(qty) {
    this.loadData();
  }

  renderHeader() {
    return (
      <Header style={styles.header}>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 3 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={3}
            text="Producto"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'ItemDescription'}
            onPress={() => this.onSort('ItemDescription')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Vta($)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'Sold'}
            onPress={() => this.onSort('Sold')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="Vta(u)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'QuantitySold'}
            onPress={() => this.onSort('QuantitySold')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="Mrg%"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'Margin'}
            onPress={() => this.onSort('Margin')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="Exist"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'QuantityOnHand'}
            onPress={() => this.onSort('QuantityOnHand')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="% Vnd"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'SellThru'}
            onPress={() => this.onSort('SellThru')}
          />
        </LinearGradient>
      </Header>
    );
  }

  loadingAnimation() {
    return (
      <View style={[
        styles.container,
        {
          backgroundColor: 'white',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',

        }]}>
        <Text style={{ color: 'black', alignSelf: 'center' }}>Cargando...</Text>
        <Image source={require('./../../images/Logoazul.png')} style={{ alignSelf: 'center', marginTop:20 }} />
      </View>
    )
  }

  render() {
    if (this.state.loadingData) {
      return this.loadingAnimation();
    }

    return (

      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'stretch', backgroundColor: 'white' }}>
        <View style={{ width: '100%', backgroundColor: 'transparent', alignContent: 'space-between', flexDirection: 'row', paddingTop: 0 }}>
          <LinearGradient colors={['#22a3da', '#4758e8']} style={{ flex: 1, width: '100%', alignContent: 'space-between', flexDirection: 'row', height: 45, alignItems: 'flex-end' }} >
            <TouchableHighlight onPress={() => this.props.navigation.navigate('ReportSelector')} style={{ backgroundColor: 'transparent', flex: 1, }}>
              <Image style={{ marginLeft: 10, marginBottom: 5 }} source={require('./../../images/Menu.png')} />
            </TouchableHighlight>
            <View style={{ flex: 6, alignContent: 'center', alignItems: 'center', }}>
              <Text allowFontScaling={false} style={{ color: 'white', textAlign: 'center', fontSize: 15, marginBottom: 5 }}>Mejores Vendidos</Text>
            </View>
            <View style={{ backgroundColor: 'transparent', flex: 1 }} >
              <TouchableHighlight style={{ marginLeft: 5, marginRight: 20, alignItems: 'center', alignSelf: 'flex-end' }} onPress={() => { this.loadData(this.state.selectedOption) }}>
                <Image style={{ marginBottom: 5 }} source={require('./../../images/Refresh.png')} />
              </TouchableHighlight>
            </View>
          </LinearGradient>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'column', justifyContent: 'center', width: '100%', height: 30 }} >
          <TouchableHighlight onPress={() => { this.setState({ menuVisible: true }); }}>
            <Text
              allowFontScaling={false}
              style={{ color: "#1f97ee" }}> {this.state.selectedOption.label}</Text>
          </TouchableHighlight>
        </View>

        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
          directionalLockEnabled={false}
          horizontal={true} >
          <View style={{ flexDirection: 'column', backgroundColor: 'white' }}>
            <DataTable
              enableEmptySections={true}
              style={[styles.container, { width: this.state.maxWidth, backgroundColor: 'white' }]}
              listViewStyle={styles.listContainer}
              dataSource={this.state.dataSource}
              renderRow={this.renderRow}
              renderHeader={this.renderHeader}
            />
          </View>
        </ScrollView>
        <View style={{ alignContent: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 5 }}>
          <Image source={require('./../../images/Logoazul.png')} style={{ marginBottom: 10 }} />
        </View>

        <List onPress={this.loadData} visible={this.state.menuVisible} zIndex={99} title={'Seleccione Rango'} listOptions={myPickerOptions} />
      </View>
    );
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      header:
      <View style={{ width: '100%', backgroundColor: 'transparent', alignContent: 'space-between', flexDirection: 'row', paddingTop: 5, }}>
      </View>,
      headerLeft: null,
      headerRight: null,
    }
  }


}


export default Mejores100Vendidos;
