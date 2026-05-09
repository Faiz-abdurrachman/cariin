// `react-native-gesture-handler` HARUS di-import di entry point sebelum
// modul lain — Drawer/Tab dari React Navigation bergantung pada side-effect
// registrasi gesture-handler-nya.
import 'react-native-gesture-handler';

import { registerRootComponent } from 'expo';

import App from './App';

registerRootComponent(App);
