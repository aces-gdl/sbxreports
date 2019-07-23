import React from 'react';
import {
  AppRegistry,
  Text,
  View,
  Button,
  Component
} from 'react-native';

import { StackNavigator }   from 'react-navigation';

import ReportSelector       from './src/components/ReportSelector';
import Login                from './src/components/Login';
import VentasPorTienda      from './src/reportes/VentasPorTienda';
import Mejores100Vendidos   from './src/reportes/Mejores100Vendidos';
import KPI                  from './src/reportes/KPI';
import VentasPorHora        from './src/reportes/VentasPorHora';


const sbxreports = StackNavigator({
  Login:              { screen: Login,                title: "Login" },
  ReportSelector:     { screen:  ReportSelector,      title: "Reportes Disponibles" },
  VentasPorTienda:    { screen:  VentasPorTienda,     title: "Ventas por Tienda" },
  Mejores100Vendidos: { screen:  Mejores100Vendidos,  title: "Mejores 100 Vendidos" },
  VentasPorHora:      { screen:  VentasPorHora,       title: "Ventas por Hora" },
  KPI:                { screen:  KPI,                 title: "KPI" },
});

AppRegistry.registerComponent('sbxreports', () => sbxreports);
