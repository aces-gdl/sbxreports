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
  Picker,
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
import LinearGradient from 'react-native-linear-gradient';
import { Pie } from 'react-native-pathjs-charts';

import { ListView } from 'realm/react-native';
import ApiUtils from './../../utils/ApiUtils';
import List from '../components/List.js';
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

class VentasPorTienda extends React.Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      textInputValue: 'Seleccione Periodo',
      myFilter: 'semP',
      myData: {},
      myPieData: [{ name: 0, salesAmount: 0 }],
      dataSource: ds,
      login_url: '',
      login_token: '',
      loadingData: false,
      maxWidth: 700,
      menuVisible: false,
      selectedOption: myPickerOptions[0],
    };


    this.renderRow = this.renderRow.bind(this);
    this.renderHeader = this.renderHeader.bind(this);
    this.loadData = this.loadData.bind(this);
    this.calculaSubTotales = this.calculaSubTotales.bind(this);
    this.loadingAnimation = this.loadingAnimation.bind(this);
    this.formatMoney = this.formatMoney.bind(this);
    this.handleDimensionEvents = this.handleDimensionEvents.bind(this);
    this.onSort = this.onSort.bind(this);
    this.loadPieData = this.loadPieData.bind(this);
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
  calculaSubTotales(recordSet) {
    let newJson = [];
    if (!recordSet.length) {
      return null;
    }
    let lastStore = recordSet[0].StoreNumber;

    let granTotal = {
      'StoreNumber': 'Total',
      'SalesAmount': 0,
      'SalesQuantity': 0,
      'Profit': 0,
      'Margin': 0,
      'AvgSalePerTransaction': 0,
      'UnitsPerTransaction': 0,
      'LastYearSales': 0,
      'StoreCounter': 0,
    };
    for (var i = 0; i < recordSet.length; i++) {

      granTotal.SalesAmount = granTotal.SalesAmount + recordSet[i].SalesAmount;
      granTotal.SalesQuantity = granTotal.SalesQuantity + recordSet[i].SalesQuantity;
      granTotal.Profit = granTotal.Profit + recordSet[i].Profit;
      granTotal.Margin = granTotal.Margin + recordSet[i].Margin;
      granTotal.AvgSalePerTransaction = granTotal.AvgSalePerTransaction + recordSet[i].AvgSalePerTransaction;
      granTotal.UnitsPerTransaction = granTotal.UnitsPerTransaction + recordSet[i].UnitsPerTransaction
      granTotal.LastYearSales = granTotal.LastYearSales + recordSet[i].LastYearSales;
    }
    recordSet.push(granTotal);

    console.log(recordSet);
    return recordSet;
  }


  loadPieData(responseData) {
    let nodo = {};
    let newJson = [];
    console.log(responseData);
    for (var i = 0; i < responseData.length; i++) {
      if (responseData[i].StoreNumber != 'Total') {
        nodo = {};
        nodo.name = responseData[i].StoreNumber;
        nodo.salesAmount = responseData[i].SalesAmount;
        newJson.push(nodo);
      }
    }
    console.log(newJson);
    newJson = this.sortJsonArrayByProperty(newJson, 'salesAmount', false)
    if (newJson.length > 10) {
      newJson.length = 10;
    }
    this.setState({
      myPieData: newJson,
    });
  }

  loadData(option) {
    if (!option) {
      option = this.state.selectedOption;
    }
    this.setState({ loadingData: true });
    let full_url = this.state.login_url + '/api/reports/sales_by_store/' + option.key;
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
          this.setState({
            myData: responseData,
            dataSource: this.state.dataSource.cloneWithRows(this.calculaSubTotales(responseData)),
          });
          this.loadPieData(responseData);
        } else {
          this.setState({
            myData: [],
            dataSource: this.state.dataSource.cloneWithRows(responseData),
          });
        }
        this.setState({
          menuVisible: false,
          loadingData: false,
          selectedOption: option,
        });
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
    if (record.StoreNumber === 'Total') {
      return (
        <Row style={styles.rows}>

          <Cell width={1}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'left', backgroundColor: 'transparent', color:'white' }]}>Tot:</Text></LinearGradient></Cell>
          <Cell width={2}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{this.formatMoney(record.SalesAmount)}</Text></LinearGradient></Cell>
          <Cell width={1}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{record.SalesQuantity}</Text></LinearGradient></Cell>
          <Cell width={2}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{this.formatMoney(record.Profit)}</Text></LinearGradient></Cell>
          <Cell width={1}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'center', backgroundColor: 'transparent', color:'white' }]}>{record.Margin === null ? 0 : record.Margin.toFixed(0)}</Text></LinearGradient></Cell>
          <Cell width={2}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{this.formatMoney(record.AvgSalePerTransaction)}</Text></LinearGradient></Cell>
          <Cell width={2}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{record.UnitsPerTransaction === null ? 0 : record.UnitsPerTransaction.toFixed(2)}</Text></LinearGradient></Cell>
          <Cell width={2}><LinearGradient colors={['#209bee', '#209bee']}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right', backgroundColor: 'transparent', color:'white' }]}>{this.formatMoney(record.LastYearSales)}</Text></LinearGradient></Cell>
        </Row>

      )
    }
    else { // regular Rows
      return (
        <Row style={styles.rows}>
          <Cell width={1}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'left' }]}>{record.StoreNumber}</Text></Cell>
          <Cell width={2}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{this.formatMoney(record.SalesAmount)}</Text></Cell>
          <Cell width={1}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{record.SalesQuantity}</Text></Cell>
          <Cell width={2}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{this.formatMoney(record.Profit)}</Text></Cell>
          <Cell width={1}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'center' }]}>{record.Margin === null ? 0 : record.Margin.toFixed(0)}</Text></Cell>
          <Cell width={2}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{this.formatMoney(record.AvgSalePerTransaction)}</Text></Cell>
          <Cell width={2}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{record.UnitsPerTransaction === null ? 0 : record.UnitsPerTransaction.toFixed(2)}</Text></Cell>
          <Cell width={2}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[styles.cell, { textAlign: 'right' }]}>{this.formatMoney(record.LastYearSales)}</Text></Cell>
        </Row>

      );
    }
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
      dataSource: this.state.dataSource.cloneWithRows(this.calculaSubTotales(resultado)),
      isSelected: ColumnName,
    })

  }

  //this.state.sortBy==='StoreNumber'
  renderHeader() {
    return (
      <Header style={styles.header}>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell

            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="Tda"
            isAscending={false}
            isSelected={false}
            onPress={() => this.onSort('StoreNumber')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Vta($)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'SalesAmount'}
            onPress={() => this.onSort('SalesAmount')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="Vta"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'SalesQuantity'}
            onPress={() => this.onSort('SalesQuantity')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Ut($)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'Profit'}
            onPress={() => this.onSort('Profit')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 1 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={1}
            text="%M"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'Margin'}
            onPress={() => this.onSort('Margin')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Tk Prm($)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'AvgSalePerTransaction'}
            onPress={() => this.onSort('AvgSalePerTransaction')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Tk Prm(U)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'UnitsPerTransaction'}
            onPress={() => this.onSort('UnitsPerTransaction')}
          />
        </LinearGradient>
        <LinearGradient colors={['#25b0d7', '#364fea']} style={{ flex: 2 }} >
          <HeaderCell
            style={styles.headerCell}
            textStyle={styles.headerCellText}
            width={2}
            text="Año P($)"
            isAscending={this.state.isAscending}
            isSelected={this.state.sortBy === 'LastYearSales'}
            onPress={() => this.onSort('LastYearSales')}
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

    let options = {
      margin: {
        top: 20,
        left: 20,
        right: 20,
        bottom: 20
      },
      width: 350,
      height: 300,
      color: 'white',
      r: 10,
      R: 150,
      legendPosition: 'topLeft',
      animate: {
        type: 'oneByOne',
        duration: 200,
        fillTransition: 3
      },
      label: {
        fontFamily: 'Arial',
        fontSize: 8,
        fontWeight: true,
        color: '#ECF0F1'
      }
    }

    return (

      <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'stretch', backgroundColor: 'white' }}>
        <View style={{ width: '100%', backgroundColor: 'transparent', alignContent: 'space-between', flexDirection: 'row', paddingTop: 0 }}>
          <LinearGradient colors={['#22a3da', '#4758e8']} style={{ flex: 1, width: '100%', alignContent: 'space-between', flexDirection: 'row', height: 45, alignItems: 'flex-end' }} >
            <TouchableHighlight onPress={() => this.props.navigation.navigate('ReportSelector')} style={{ backgroundColor: 'transparent', flex: 1, }}>
              <Image style={{ marginLeft: 10, marginBottom: 5 }} source={require('./../../images/Menu.png')} />
            </TouchableHighlight>
            <View style={{ flex: 6, alignContent: 'center', alignItems: 'center', }}>
              <Text allowFontScaling={false} style={{ color: 'white', textAlign: 'center', fontSize: 15, marginBottom: 5 }}>Ventas por tienda</Text>
            </View>
            <View style={{ backgroundColor: 'transparent', flex: 1 }} >
              <TouchableHighlight style={{ marginLeft: 5, marginRight: 20, alignItems: 'center', alignSelf: 'flex-end' }} onPress={() => { this.loadData(this.state.selectedOption) }}>
                <Image style={{ marginBottom: 5 }} source={require('./../../images/Refresh.png')} />
              </TouchableHighlight>
            </View>
          </LinearGradient>
        </View>
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center', width: '100%', height: 30 }} >
          <TouchableHighlight onPress={() => { this.setState({ menuVisible: true }); }}>
            <Text
              allowFontScaling={false}
              style={{ color: "#1f97ee" }}> {this.state.selectedOption.label}</Text>
          </TouchableHighlight>
        </View>
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }}
          directionalLockEnabled={false}
          horizontal={false} >

          <View style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: 'transparent' }}>

            <ScrollView
              directionalLockEnabled={true}
              horizontal={true} >
              <DataTable
                enableEmptySections={true}
                style={[styles.container, { width: this.state.maxWidth, backgroundColor: 'transparent' }]}
                dataSource={this.state.dataSource}
                renderRow={this.renderRow}
                renderHeader={this.renderHeader}
              />
            </ScrollView>
            <ScrollView
              directionalLockEnabled={true}
              horizontal={true} >
              <Pie data={this.state.myPieData}
                options={options}
                accessorKey="salesAmount"
                margin={{ top: 5, left: 5, right: 5, bottom: 5 }}
                color="#2980B9"
                r={0}
                R={120}
                legendPosition="topLeft"
                label={{
                  fontFamily: 'Arial',
                  fontSize: 8,
                  fontWeight: true,
                  color: '#ECF0F1'
                }}
              />
            </ScrollView>
          </View>
        </ScrollView>
        <View style={{ alignContent: 'center', justifyContent: 'center', flexDirection: 'row' }}>
          <Image source={require('./../../images/Logoazul.png')} style={{ marginBottom: 10 }} />
        </View>
        <List onPress={this.loadData} visible={this.state.menuVisible} zIndex={99} listOptions={myPickerOptions} />
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


export default VentasPorTienda;
