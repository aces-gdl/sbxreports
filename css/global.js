'use strict'

import {
  StyleSheet,
} from 'react-native';



module.exports = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    borderColor: "rgb(175,175,175)",
    backgroundColor: "transparent",

  },
  header: {
    marginTop: 5,
    backgroundColor: '#5E5E5E',
    height: 20,
  },
  headerCell: {
    borderWidth: 0.5,
    borderColor: "rgb(175,175,175)",
    alignContent: "center",
  },
  headerCellText: {
    color: "white",
    fontSize: 12,
    textAlign: "center",
    width: "90%",
    backgroundColor: "transparent",
  },
  rows: {

  },
  center: {
    textAlign: "center",
  },
  left: {
    textAlign: "left",
  },
  right: {
    textAlign: "right",
  },
  cell: {
    fontSize: 12,
    borderWidth: 0.3,
    backgroundColor: "rgb(231,233,232)",
    color: "rgb(52,52,52)",
  },
  texttotal: {
    backgroundColor: "#F9610B",
  },
  menu: {
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#9eb1c1",
    padding: 10,
    marginBottom: 2,
    marginTop: 2,
    marginLeft: 5,
    marginRight: 5,
    borderRadius: 4,
  },
  highlightbuttonframeMenu: {
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: 5,
    width: '90%',
    height: 50,
    backgroundColor: "transparent"
  },
  highlightbuttonframe: {
    alignContent: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    width: '60%',
    height: 35,
    borderRadius: 6,
    backgroundColor: "transparent"
  },
  highlightbuttonframeOrange: {
    marginBottom: 5,
    width: '90%',
    borderRadius: 6,
    backgroundColor: "transparent"
  },
  highlightbuttontext: {
    marginLeft: 5,
    marginRight: 5,
    padding: 5,
    fontSize: 14,
  },
  textInput: {
    fontSize: 12,
    textAlign: "left",
    width: 210,
    backgroundColor: "transparent",
    height: 40,
    color: "rgb(35,175,243)",

  },
  listViewStyle: {

  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  imageStyle: {
    width: 750,
    height: 750,
  },

});
