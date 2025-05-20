/**
 * @format
 */

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
// index.js
import { ProductsApp } from './src/ProductsApp'; // ✅ CAMBIA ESTO

AppRegistry.registerComponent(appName, () => ProductsApp);
